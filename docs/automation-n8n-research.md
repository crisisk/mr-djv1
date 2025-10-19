# Automatiseringsonderzoek voor Mister DJ (Website + n8n op VPS)

_Laatst bijgewerkt: 2025-10-15_

## 1. Context & uitgangssituatie
- **Stack**: React frontend met statische rendering + city pages generator (`scripts/generate-city-pages.mjs`) en content JSON (`content/local-seo/cities.json`). Backend is Node/Express met pakketten-, contact- en booking-endpoints (`backend/src/routes`). Deployment draait in Docker met Traefik, Redis en PostgreSQL (`DEPLOYMENT_SUCCESS.md`).
- **Configuratie-dashboard**: beheert secrets/ENV via managed env (`README.md`, Config Dashboard sectie). Biedt haakje voor API keys (bijv. SEO tools, LLM-providers).
- **Data**: Lokale SEO content, testimonials, pricingpagina en mailonderzoek beschikbaar als brondata voor automations (`docs/performance-seo-research.md`, `docs/mail-integration-report.md`).
- **Doel**: Automatisch content uitbreiden, personalisatie op basis van herkomst, lead nurturing en operationele efficiency via n8n (draait op interne VPS).

## 2. Systeemintegraties & n8n-verbindingen
| Component | Integratiepunt | Benodigde connector in n8n | Notities |
| --- | --- | --- | --- |
| Website frontend | Netlify / statische build output | **GitHub Trigger** (webhook) + **Netlify deploy hook** | Trigger regeneratie van statische assets na content push of API-signaal. |
| Backend API | `/api/contact`, `/api/bookings` | **HTTP Request**, **Webhook** | Ontvangt leads; n8n kan POST payload naar CRM en terugkoppelen via webhook voor personalisatie. |
| Database | PostgreSQL (`mrdj_db`) | **Postgres** node | Voor lead enrichment, storing automation logs, city page metadata. |
| Redis cache | Session / rate-limit | **Redis** node | Opslaan van feature flags en A/B-personalisatie states. |
| Config dashboard | Managed `.env` | **n8n Credentials store** | Synchroniseer secrets vanuit dashboard naar n8n via API of secure file copy. |
| Analytics | Google Analytics 4 / Consent Mode | **Google Analytics**, **BigQuery** | Export route/UTM data voor personalisatie trigger. |
| Content bronnen | Keyword tools (Ahrefs/SEMrush), OpenAI/Anthropic, Airtable | **HTTP**, **OpenAI**, **Anthropic**, **Airtable** nodes | Keyword scraping, AI copy generatie, workflow management. |

## 3. Automatiseringskansen
### 3.1 Auto-content generatie op basis van keyword analyse
**Use-case**: Maandelijks nieuwe city pages/blogs op basis van zoekvolumes en gap-analyses.

**Workflow (n8n)**
1. **Scheduler Trigger** (maandelijks) → haalt keywordset op via **HTTP node** naar SEO API (bijv. Ahrefs). Resultaat bevat zoekvolume, KD, SERP features.
2. **Data Cleaning Function** node: filtert keywords op regio Noord-Brabant + entertainment thema's.
3. **Lookup**: Postgres node checkt bestaande slugs in `local_seo_pages` (mirror van `content/local-seo/cities.json`).
4. **LLM Content Generator**: OpenAI/Anthropic node genereert city intro, cases en FAQ's op basis van prompt gevuld met keyword-data en bestaande tone-of-voice (uit `content/local-seo/cities.json`).
5. **Quality Gate**: Custom JS node controleert lengte, verboden claims, GDPR compliance. Flagged content gaat naar Airtable review board voor marketingteam.
6. **GitHub Integration**: Als content "approved" → **GitHub** node creëert branch + PR met bijgewerkte JSON en gegenereerde statische HTML via `scripts/generate-city-pages.mjs`. Activeer workflow: n8n commit → Netlify build via webhook.
7. **Notification**: Slack/Email node stuurt samenvatting + preview links.

**Randvoorwaarden**
- API keys voor SEO tool & LLM in dashboard/n8n credentials.
- Unit tests uitbreiden zodat `generate-city-pages.mjs` foutmeldingen logt bij ongeldige data.

**Waardevermeerdering**
- Structurele uitbreiding van organische landingspagina's → hogere long-tail traffic en lokale autoriteit.
- Besparing op copywriting uren (estimatie 4-6 uur per pagina).

### 3.2 Dynamische content op basis van binnenkomst (route/UTM)
**Use-case**: Personaliseer hero, CTA's en testimonials afhankelijk van UTM source, campagne of locatie.

**Workflow (n8n + website)**
1. Frontend laadt `routeContext` script (uitbreiding op `main.js`) dat UTM/source detecteert en een `personalization` API call doet.
2. **n8n Webhook** ontvangt context (source, medium, geolocatie IP via edge function) → verrijkt met CRM data (Postgres) en Redis feature flags.
3. n8n besluit logica:
   - Campagne = `wedding_*` → return bruiloft-testimonials + pricing-highlight.
   - Campagne = `corporate_*` → return corporate cases en CTA "Plan site visit".
   - Referral = partner (bijv. eventbureau) → return co-branded message.
4. Response bevat JSON met content key's die frontend selectief rendert (hero headline, proof points, recommended package ID).
5. Workflow logt outcome + performance metrics in Postgres tabel `personalization_events`.
6. **Feedback loop**: Wekelijkse Cron → n8n haalt conversiedata op (Google Analytics API) en evalueert variant performance. Output naar Looker Studio/Metabase.

**Randvoorwaarden**
- Light-weight personalization API (Edge Function op Netlify of backend route) die caching ondersteunt.
- Consent Manager (`ConsentManager.jsx`) moet marketing cookies toestaan voor GA/UTM tracking voordat call gebeurt.
- Redis feature flag schema voor A/B experimenten.

**Waardevermeerdering**
- Hogere conversie door relevante bewijsvoering (+5-12% verwacht bij gepersonaliseerde testimonials).

### 3.3 Lead enrichment & routing
**Use-case**: Elke nieuwe lead automatisch verrijken, segmenteren en opvolgen.

**Workflow**
1. Backend `/api/contact` → n8n Webhook (mirror) ontvangt payload (naam, eventtype, datum) via Event Bus (RabbitMQ/Redis pub-sub).
2. **Enrichment**: Clearbit/Clay via HTTP node voor bedrijfsinfo bij B2B leads.
3. **Scoring**: Function node berekent score (budget indicatie, leadbron, eventdatum).
4. **Routing**:
   - Hoge score → Slack alert + Sevensa/ActiveCampaign create deal.
   - Lage score → Stuur nurture-sequence in MailerLite (SMTP API) met gepersonaliseerde content (gebaseerd op eventtype).
5. **Dashboard sync**: Update `managed.env` of Postgres config met lead statuses voor weergave in configuratie-dashboard (extra widget).
6. **Reporting**: Dagelijks 08:00 rapport in Notion/Google Sheets met leads, status, opvolging.

**Randvoorwaarden**
- Uitbreiding backend met webhook publish (bijv. Node EventEmitter → Redis stream).
- DPA check voor externe enrichment tools.

**Waardevermeerdering**
- Snellere follow-up, minder gemiste leads, betere segmentatie.

### 3.4 Content performance feedback loop
**Use-case**: Combineer analytics, CRM en Netlify deploy data voor continue optimalisatie.

**Workflow**
1. **Netlify Build Hook** → n8n HTTP Trigger met build metadata (commit, branch, actor).
2. **GA4 Data API**: Haal page performance op voor gewijzigde pagina's.
3. **Postgres logging**: Schrijf record `deploy_metrics` (commit hash, nieuwe pages, top metrics).
4. **Alerting**: Als bounce rate >40% voor nieuwe city page → open Jira ticket via n8n.
5. **LLM Suggestion**: Genereer verbeteradvies (copy, CTA) en post naar Slack/Notion.

**Randvoorwaarden**
- Toegang tot GA4 property + service account.
- Post-deploy script die lijst van gewijzigde routes meegeeft (via Git diff CLI node).

### 3.5 Event operations automation
**Use-case**: Koppel boekingsbevestigingen aan draaiboek en planning.

**Workflow**
1. Booking confirmed (backend) → n8n create Trello/Asana task met checklist (apparatuur, crew, logistiek).
2. Sync met Google Calendar (DJ, crew) + automatische reminder 72 uur vooraf.
3. Documentgenerator (PDF) via **HTML to PDF** node maakt draaiboek, uploadt naar shared drive.
4. Post-event follow-up: 24u later → stuur review request + gather NPS in Postgres.

**Randvoorwaarden**
- API keys voor Trello/Asana/Google Workspace.
- Duidelijke crew resource database in Postgres/Airtable.

## 4. Implementatie-roadmap
| Fase | Focus | Deliverables | Dependencies |
| --- | --- | --- | --- |
| **Sprint 1 (2 weken)** | n8n setup & credentials | VPN/IP-whitelisting, secrets sync, basis pipelines (GitHub, Postgres) | VPS access, dashboard API | 
| **Sprint 2 (2 weken)** | Auto-content MVP | Keyword fetch + AI generaties + GitHub PR flow, review board | SEO API, OpenAI key |
| **Sprint 3 (2 weken)** | Personalisation API | Webhook endpoint, Redis flags, frontend adapter, measurement plan | Consent compliance |
| **Sprint 4 (2 weken)** | Lead enrichment & routing | CRM connectors, scoring rules, Slack alerts, dashboards | CRM credentials |
| **Sprint 5 (2 weken)** | Ops automations | Calendar/Trello sync, PDF generator, review workflows | Crew data model |
| **Doorlopend** | Analytics feedback loop | Deploy metrics DB, GA4 dashboards, improvement prompts | GA4 service account |

## 5. Beveiliging & governance
- Gebruik **n8n self-hosted** achter VPN/Basic Auth; configureer role-based access.
- Secrets beheren via configuratie-dashboard → periodic sync naar n8n environment vars; encrypt rest-at-rest (n8n credential store).
- Logging & auditing: schrijf elke automation-run naar Postgres + forward naar ELK/Graylog.
- Versiebeheer workflows: exporteer n8n flows als JSON en commit in `automation/workflows` map.
- Privacy: pseudonimiseer persoonsgegevens in logs, voldoe aan AVG. Zorg dat AI prompts geen PII bevatten zonder toestemming.

## 6. KPI's & meetplan
| Automation | KPI | Meting | Target |
| --- | --- | --- | --- |
| Auto-content generatie | # nieuwe city pages per maand, organische sessies | GA4 landing page report, GSC clicks | +4 pagina's / maand, +20% clicks kwartaal | 
| Dynamische content | Conversie uplift, engagement | A/B experiments (Redis flags), GA4 funnel | +8% lead conversie | 
| Lead enrichment | Reactietijd sales, lead score coverage | CRM deal timestamps, Slack alerts | <2 uur gemiddelde reactie | 
| Ops automation | No-show incidents, taak completion | Trello/Asana board analytics | 0 gemiste draaiboeken | 
| Feedback loop | Deploy -> actie ratio | #suggesties vs #geïmplementeerd | >60% suggesties doorgevoerd |

## 7. Risico's & mitigerende maatregelen
- **Data kwaliteit**: AI-generaties kunnen inconsistent zijn → voeg menselijke reviewstap toe voor publicatie.
- **API limieten**: SEO tools/LLM hebben rate limits → schedule batching en backoff policies in n8n.
- **Security**: Webhooks toegankelijk vanaf internet → valideer HMAC, gebruik IP-allowlists.
- **Vendor lock-in**: Bewaar prompts en workflow configuraties in Git zodat migratie mogelijk blijft.
- **Compliance**: Controleer cookie consent voordat personalisatie data geladen wordt (koppeling met `ConsentManager.jsx`).

## 8. Quick wins & prioriteiten
1. **Lead enrichment + Slack alerts** (laagste complexiteit, directe omzetimpact).
2. **Auto content pipeline** (reeds bestaande scripts → minimale dev effort, hoge SEO-waarde).
3. **Personalisation API** (vergt frontend aanpassing maar biedt merkbaar conversie-effect).
4. **Deploy feedback loop** (goed voor continue verbetering en alignment met marketing/sales).
5. **Ops automation** (waardevol voor schaalbaarheid, maar afhankelijk van resource database).

## 9. Volgende stappen
- Beslis welke SEO tool + LLM provider budgettair geschikt is en voeg keys toe in configuratie-dashboard.
- Reserveer capaciteit in development backlog voor frontend personalisatie adapter en backend webhook endpoints.
- Zet n8n staging omgeving op om workflows te testen voordat productiecredentials gekoppeld worden.
- Maak alignment met marketing/sales over reviewproces AI-content en SLA's op leadopvolging.

