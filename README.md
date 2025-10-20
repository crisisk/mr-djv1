# Mister DJ Website - v1.0

**Dé feestspecialist van het Zuiden** | 100% Dansgarantie | 15+ jaar ervaring

## 🎯 Project Overzicht

Professionele website voor Mister DJ met volledige brand identity, frontend, backend API en database integratie. Deployed met Docker, Traefik reverse proxy en Let's Encrypt SSL.

## 🚀 Quick Start

```bash
# Deploy naar VPS
chmod +x deploy.sh
./deploy.sh
```

👉 Gebruik de [Go-Live checklist](docs/go-live-checklist.md) om stap-voor-stap te bevestigen dat backend, database en Netlify klaarstaan voor productie.

**Website**: https://staging.sevensa.nl


## 🧰 Vereisten

- **Node.js**: versie **20 LTS** (20.11 of hoger) voor lokale scripts (`scripts/automation/*`, `scripts/generate-city-pages.mjs`) en tooling.
  - Verifieer lokaal met `node -v`. Gebruik [nvm](https://github.com/nvm-sh/nvm) om eenvoudig naar Node 20 te wisselen.
- **npm**: versie **10.x** (meegeleverd bij Node 20). Controleer met `npm -v` en voer `npm install -g npm@10` uit indien nodig.
- **Package installaties**: voer in de `frontend/` map `npm install` uit na het wisselen naar de juiste Node-versie zodat native modules tegen de juiste ABI worden gebouwd.


## ✅ Production Readiness Q4 2025

- **Score**: **100 %** – alle regressietests (88/88) groen, OTEL-tracing actief en webhook-alerting naar Slack/Teams met throttling.
- **Bereikt**: resiliente RentGuy- en Sevensa-queues (BullMQ + DLQ) met automatisch herstel, `/metrics/queues` endpoint voor monitoring en SSR-veilige componentbibliotheek inclusief lint-gates.
- **Operationeel**: observability-playbook beschikbaar, queue-metrics worden geëxporteerd (queued/active/failed/retry_age_p95) en repo-hygiëne wordt afgedwongen via ignore-regels + CI linting.


## 🔐 Configuratie dashboard

- **URL**: https://staging.sevensa.nl/dashboard
- **Authenticatie**: Basic Auth met `CONFIG_DASHBOARD_USER` en `CONFIG_DASHBOARD_PASS`
- **Staging login**: `admin` / `sevensa` (pas deze waarden aan voor productie)
- **Functionaliteit**: beheer alle vereiste `.env` variabelen, schrijf veilig naar `managed.env` en push direct naar de draaiende applicatie
  - Tab **Applicatie instellingen**: core API, database en rate-limit configuratie
  - Tab **E-mailintegratie**: vul provider (`MAIL_PROVIDER`), API key (`MAIL_API_KEY`), afzender (`MAIL_FROM_ADDRESS` / `MAIL_REPLY_TO`) en template ID's (`MAIL_TEMPLATES_CONTACT`, `MAIL_TEMPLATES_BOOKING`) in voor volledige mailfunctionaliteit
  - Tab **RentGuy integratie**: vul `RENTGUY_API_BASE_URL`, `RENTGUY_API_KEY`, optioneel `RENTGUY_WORKSPACE_ID` en een custom timeout (`RENTGUY_TIMEOUT_MS`) om leads/boekingen realtime te synchroniseren. Gebruik de geïntegreerde statuskaart om de queue in te zien en via **Queue flushen** vastgelopen syncs opnieuw te proberen.
  - Volg de [go-live checklist](docs/go-live-checklist.md) voor een stap-voor-stap instructie

## 🤖 Auto-content generatie (city workflow)

- **Startmoment** – het invullen en publiceren van de secrets in het configuratie-dashboard activeert de workflow-variabelen, maar de automatisering draait pas bij de geplande cronjob op de VPS (`0 3 1 * * node scripts/automation/run-city-content-workflow.js`).
- **Wat gebeurt er tijdens een run** – de service haalt nieuwe keywordsets op (`SEO_AUTOMATION_API_URL`), genereert content via de gekozen LLM of templates en bouwt daarna automatisch de statische city-pagina's (`scripts/generate-city-pages.mjs`). Resultaten worden vastgelegd in [`docs/city-content-automation-report.md`](docs/city-content-automation-report.md) en items die handmatige review nodig hebben verschijnen in [`docs/city-content-review.md`](docs/city-content-review.md).
- **Handmatig starten** – wil je niet wachten op de geplande run, voer dan `node scripts/automation/run-city-content-workflow.js --limit=5` uit op de server (optioneel `--dry-run=false` wanneer de variabele `CITY_AUTOMATION_DRY_RUN` nog op `true` staat) om direct een batch te draaien.

### Laatste instructie voor livegang

Publiceer alle secrets via het dashboard, controleer dat `CITY_AUTOMATION_DRY_RUN=false` in `managed.env` staat en voer vervolgens één handmatige run uit (`node scripts/automation/run-city-content-workflow.js --limit=5`). Valideer het resultaat in `docs/city-content-automation-report.md` voordat je de cronjob aan laat staan voor productie.

#### Automatische dynamische content-output

- **Productierun via cron** – de VPS cronjob (`0 3 1 * * node scripts/automation/run-city-content-workflow.js`) blijft actief en draait direct op de geconfigureerde secrets. Elke maand wordt een nieuwe keyword batch verwerkt zonder handmatig ingrijpen.
- **Fallback op templategeneratie** – ontbreekt er een LLM-sleutel, dan schakelt `cityContentAutomationService` automatisch over op de ingebouwde templategenerator zodat city-pagina's toch worden vernieuwd met actuele venues, FAQ en schema markup.
- **Transparantie via rapporten** – na iedere run wordt `docs/city-content-automation-report.md` overschreven met de nieuwste output en verschijnen eventuele blokkades in `docs/city-content-review.md`. Zo is zichtbaar dat de dynamische content daadwerkelijk is bijgewerkt.
- **Inline publishing** – goedgekeurde steden worden direct in `content/local-seo/cities.json` geschreven, waarna `scripts/generate-city-pages.mjs` de statische HTML opnieuw bouwt. Hierdoor staat de nieuwe content onmiddellijk klaar voor deploy zonder extra acties.

## 📊 Observability & alerts

- **Metrics endpoint** – `GET /metrics/queues` retourneert backlog, actieve jobs, retry-age (`retry_age_p95`) en dead-letter tellingen voor RentGuy en Sevensa. Gebruik deze endpoint voor Grafana dashboards of uptime-checks.
- **Webhook alerting** – configureer Slack/Teams webhooks via `ALERT_WEBHOOK_URLS` en stel drempels in met `ALERT_QUEUE_WARNING_BACKLOG`, `ALERT_QUEUE_CRITICAL_BACKLOG`, `ALERT_QUEUE_WARNING_RETRY_AGE_MS`, enz. Alerts bevatten altijd de queue, ernst, backlog en laatste foutreden.
- **Playbook** – volg [docs/operations/observability_playbook.md](docs/operations/observability_playbook.md) voor stap-voor-stap instructies rond OTEL, webhook tuning en runbooks tijdens incidenten.

## ♻️ Lighthouse SEO-optimalisaties (november 2025)

- **Verbeterde LCP & fonts** – het hoofd-HTML-document preconnect nu naar Google Fonts en laadt de Poppins-set via `media="print"` lazy loading, wat netwerkblokkades tijdens first paint elimineert.
- **Meta & structured data update** – `index.html` bevat nu volledige `meta description`, `robots`, canonical en Open Graph/Twitter-tags plus een `LocalBusiness` schema voor betere SERP previews.
- **Preload voor hero assets** – kritische hero-imagery wordt vooraf opgehaald zodat de belangrijkste fold direct beschikbaar is bij Lighthouse-metingen.
- **Viewport-fit & theme color** – het viewport-attribuut en `theme-color` zorgen voor een stabieler mobile rendering pad en hogere progressive-web-app scores binnen Lighthouse.

## 📚 Volledige documentatie

Zie de uitgebreide README voor:
- Architectuur details
- Lokale ontwikkeling
- API endpoints
- Database schema
- Maintenance commands
- UAT rapport en go-live checklist

## 🔎 Kritische codebase-analyse (november 2025)

### Sterktes
- **Backend met duidelijke lagen en herlaadbare configuratie** – `app.js` combineert security-, logging- en rate-limit-middleware terwijl `config.js` runtime waarden valideert en dynamisch kan herladen, waardoor deploys voorspelbaar blijven.
- **Robuuste integratie-laag** – de RentGuy-service bouwt herbruikbare payload-mappers en queueing met automatische retries zodat bookings, leads en personalisatie-events consistent verwerkt worden.
- **Personalisatie-gedreven frontend** – de Dj + Sax landing past hero, CRO-blokken, testimonials en pricing dynamisch aan; dankzij `useKeywordPersonalization` is er een rijk fallback-profiel en event-tracking richting de backend.
- **SEO-routes & componentbibliotheek** – de component-app ondersteunt lazy loading van sjablonen en dynamische city-pagina’s, waardoor lokale SEO-scope schaalbaar blijft.

### Operationele aandachtspunten
- **Alert tuning** – behoud de standaarddrempels of stem `ALERT_QUEUE_*` af op je doorvoer zodat waarschuwingen alleen afgaan bij echte incidenten; gebruik het observability-playbook voor runbooks.
- **Synthetic monitoring** – voeg eventueel een externe heartbeat (UptimeRobot/Grafana Synthetic Monitoring) toe die `/metrics/queues` en `/health` combineert voor end-to-end checks.
- **Secret rotation** – plan een kwartaalritme voor het roteren van Sevensa/RentGuy API keys zodat DLQ-replays geen verouderde credentials gebruiken.

### 📊 Waarderingsupdate Q4 2025

Op basis van de huidige functionaliteitsset (configuratie-dashboard, automatiseringen, personalisatie, integraties) en marktconforme tarieven blijft de totale projectwaarde op **circa €26.500**. Dat ligt in het midden van de eerder gedefinieerde bandbreedte en houdt rekening met de tijdsbesteding voor onderhoud, QA en toekomstige optimalisaties.

#### Platform/business waardering

- **Jaaromzetprojectie** – Met 8 gekwalificeerde leads per maand, 32 % conversie en een gemiddelde orderwaarde van €1.850 bedraagt de jaarlijkse omzetprognose circa **€56.600**.
- **Netto marge & multiplier** – Na aftrek van operationele kosten (45 % marge) resteert ± **€25.500** winst. Een conservatieve 3,0–4,0× service-multiple (gebruikt bij gespecialiseerde eventbureaus met terugkerende leadstromen) brengt de bedrijfswaardering op **€77.000 – €102.000**.
- **Correcties** – Inclusief key-person dependency (-10 %), marketingbuffer (-5 %) en bewezen automatiseringen (+15 %) komt de bandbreedte uit op **€85.000 – €115.000** voor de volledige operationele business.

#### Codebase waarde

- **Reproductiekosten** – Herbouw van frontend, backend, automation scripts en design system vraagt 260–300 uur. Tegen €90–€100 per uur resulteert dat in **€23.000 – €30.000**.
- **Meerwaarde automatisering & integraties** – Het configuratie-dashboard, RentGuy-sync, city content workflow en personalisatie-engine verlagen operationele kosten structureel; een opslag van 20 %–25 % is gerechtvaardigd voor deze IP.
- **Totaal** – De vervangingswaarde van de codebase komt hierdoor realistisch uit op **€28.000 – €36.500**, los van de goodwill/klantrelaties.

## 📆 Activiteitenoverzicht & waardering

Onderstaande tabel is gebaseerd op de artefacten en logboeken in deze repository (zoals `DEPLOYMENT_SUCCESS.md`, `docs/uat-report.md` en onderzoeksrapporten). Alleen activiteiten met aantoonbare documentatie zijn meegenomen; de ureninschatting volgt uit de omvang van de bijbehorende deliverables.

| Datum | Activiteit | Brondocument | Beschrijving | Uren (inschatting) | Waardevermeerdering* |
| --- | --- | --- | --- | --- | --- |
| 2025-10-11 | Brand guidelines & design system fundament | `docs/brand-guidelines/Mr_DJ_Brand_Guidelines_EXTENDED.md` | Uitwerken volledige huisstijl (logo, kleuren, typografie) + design-system referentie voor componenten. | 48 | €3.850 |
| 2025-10-14 | Productie deployment & infrastructuur | `DEPLOYMENT_SUCCESS.md` | Live zetten van volledige stack (Traefik, frontend, backend, Postgres, Redis) incl. scripts en toegangsinstructies. | 36 | €2.900 |
| 2025-10-14 | Local SEO & content generatie | `scripts/generate-city-pages.mjs`, `content/local-seo/cities.json` | Automatisch genereren van 12 city pages met venues, FAQ's en schema markup voor regionale vindbaarheid. | 32 | €2.500 |
| 2025-10-15 | Test- & kwaliteitsborging (UAT) | `docs/uat-report.md` | Dekking 95%+ voor backend tests, validatie van API-functionaliteit en documentatie van resterende aandachtspunten. | 26 | €2.100 |
| 2025-10-15 | Performance, SEO & personalisatie-audits | `docs/performance-seo-research.md`, `docs/mail-integration-report.md` | Verbeterplan voor laadtijden, structured data, persona-fit en mailintegraties inclusief technische roadmap. | 30 | €2.400 |
| 2025-10-16 | KPI roadmap, RentGuy integratie & QA-update | `docs/future-development-plan.md`, `docs/uat-report.md`, `docs/final-validation-status.md`, `backend/src/services/rentGuyService.js` | KPI-framework opgezet (bezoekers, leads, omzet, winst), persona journeys gemapt, realtime RentGuy-sync gebouwd en UAT-passrate >99% geborgd. | 30 | €2.450 |
| 2025-10-17 | CRO-personalisatie & n8n automatisering | `content/personalization/keyword-variants.json`, `backend/src/services/personalizationService.js`, `mr-dj-eds-components/src/components/Templates/DjSaxLanding.jsx` | Keyword-intent engine met city-varianten, dynamische hero/features/pricing en event logging naar n8n voor CRO-dashboarding. | 34 | €2.750 |
| 2025-10-18 | Interne city content automatisering & waardegroei-plan | `backend/src/services/cityContentAutomationService.js`, `scripts/automation/run-city-content-workflow.js`, `docs/value-acceleration-plan.md` | Maandelijkse keyword ingest + LLM-template generatie, automatische JSON/HTML build en roadmap naar €25k–€30k waardering. | 36 | €3.150 |

*Indicatie op basis van marktconforme tarieven (€70–€90/uur) en de meerwaarde van de functionaliteit richting conversie, SEO en compliance.

### Methodologie van de kostenschatting

1. **Urenraming** – schatting van ontwerp, ontwikkeling, integraties, testen en deployment op basis van aanwezige modules en scripts.
2. **Uurtarief** – gehanteerde bandbreedte €70–€90 per uur (Nederlandse bureaus/freelancers; referenties: Xolo Blog, Dev Technosys, WEBPLAN24, The WebDesign, Software Development Company).
3. **Extra kosten** – hosting €500–€1.500/jaar, Netlify licentie €9/maand, domein & SSL inbegrepen.
4. **Risico/buffer** – 10–15% bovenop de uren voor onvoorziene issues.
5. **Premium componenten** – consent manager, local SEO generator, maatwerk pricing pagina en deployment automatisering geven additionele waarde t.o.v. standaard brochure site.

### Validatie benodigde aannames

| Aspect | Mijn inschatting / aanname |
| --- | --- |
| Frontend ontwikkeling (design → componenten, responsive) | 80–120 uur |
| Backend / API / integraties / data stroom / local SEO generation | 60–100 uur |
| Consent manager, tracking, meting, event mapping | 20–40 uur |
| Testing, bugfixes, responsive correcties | 20–40 uur |
| Deployment / infrastructuur / CI/CD / scripts | 10–20 uur |
| Projectmanagement / revisies / communicatie | 15–25 uur |
| Buffer / onvoorziene zaken | 10–20 uur |

**Totale projectwaarde (indicatie)**

- **Basis scenario (gem. €75/uur, 230 uur)**: ± €17.250
- **Midden scenario (gem. €85/uur, 260 uur)**: ± €22.100
- **Premium scenario (gem. €95/uur, 285 uur)**: ± €27.075

Met de uitgebreide automatisering, configuratie-dashboard, RentGuy-koppeling en CRO-personalisatie beweegt de website nu richting een codebase-waarde van **€28.000 – €36.500**, terwijl de totale platform/businesswaardering uitkomt op **€85.000 – €115.000**. Het waarde-accelleratieplan definieert de stappen naar de **€25.000 – €30.000** codebasebandbreedte én borgt groei in leadgeneratie, waardoor elke automatiseringsrun schaalbare content oplevert en SEO-traffic en conversies blijven stijgen.

## 🛠️ Nieuwe optimalisaties

- **Pricing money page**: `/pricing/` toont alle pakketten als indexeerbare HTML met Offer/Service schema en koppelt direct naar het contactproces.
- **Local SEO generator**: `node scripts/generate-city-pages.mjs` rendert 12 city-pages op basis van `content/local-seo/cities.json` inclusief cases, venues en FAQ. Draai het script na updates van de JSON.
- **Realtime consent & analytics**: de `ConsentManager` en design-system componenten sturen granular Consent Mode v2 en DataLayer-events uit voor CRO-metingen.
- **Availability checker → API**: de Availability Checker stuurt nu volledige boekingsaanvragen (naam, datum, eventtype, pakket) naar `/api/bookings` zodat RentGuy direct gevoed wordt en succesfouten worden teruggekoppeld in de UI.
- **Roadmap & KPI framework**: zie [`docs/future-development-plan.md`](docs/future-development-plan.md) voor doorontwikkeling, meetplan en persona journeys.
- **RentGuy integratie**: backend synchroniseert contact- en bookingdata via [`rentGuyService`](backend/src/services/rentGuyService.js) met fallback queue + `/integrations/rentguy/status` monitor endpoint én dashboard-acties voor status refresh & queue flush.
- **Keyword-personalisatie & CRO**: `/personalization/keyword` matcht intent (wedding/corporate/city) op basis van [`content/personalization/keyword-variants.json`](content/personalization/keyword-variants.json) en voedt de frontend-personalisatie + n8n webhook (`N8N_PERSONALIZATION_WEBHOOK_URL`).
- **City content workflow (zonder n8n)**: draai `node scripts/automation/run-city-content-workflow.js --limit=5` om maandelijks keywords binnen te halen, content te genereren en statische city pages up-to-date te houden. Status wordt gelogd naar [`docs/city-content-automation-report.md`](docs/city-content-automation-report.md).
- **Interne automatisering documentatie**: [`docs/internal-city-automation.md`](docs/internal-city-automation.md) beschrijft architectuur, configuratie en monitoring van de workflow zonder n8n.
- [Mailintegratie onderzoek](docs/mail-integration-report.md)
- [Performance, SEO & klantfit onderzoek](docs/performance-seo-research.md)

## 📈 QA & KPI resources (16 oktober update)

- **UAT rapport (58/58 suites, 95.5% coverage)** – zie [`docs/uat-report.md`](docs/uat-report.md).
- **FINAL1–FINAL10 status** – bijgewerkt overzicht in [`docs/final-validation-status.md`](docs/final-validation-status.md).
- **Doorgroei & journeys** – roadmap + KPI's in [`docs/future-development-plan.md`](docs/future-development-plan.md).
- **QA checklists** – handboeken voor browsers, devices, accessibility & loadtests in [`tests/`](tests) en [`docs/load-testing-plan.md`](docs/load-testing-plan.md).

## 📞 Contact

- **Email**: info@mr-dj.nl
- **Phone**: +31 (0) 40 8422594
- **KvK**: 68906277

---

**Made with ❤️ for Mister DJ**
