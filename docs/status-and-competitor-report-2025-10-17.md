# Platformstatus & Concurrentieanalyse (17 oktober 2025)

## 1. Platformstatus
- **Backend**: Alle 12 Jest suites slagen lokaal; kernroutes voor contact, bookings, personalization en dashboard functioneren (zie `npm test`).
- **Frontend**: Design system en templates (DJ + Sax landing, Local SEO) renderen zonder lint-fouten. Nieuwe local review sectie en event logging hooks actief.
- **Infra & Config**: Config dashboard bewaakt environment variabelen; RentGuy integratie heeft queue monitor en flush acties.
- **Analytics & Consent**: ConsentManager synchroniseert toestemmingen met dataLayer en GTM; personalisatie events worden doorgestuurd naar backend.

## 2. Gerealiseerde functionaliteiten
- **Keyword-gebaseerde personalisatie** (`useKeywordPersonalization`) met CRO-blokken, persona showcasers en event-tracking.
- **Availability checker** met Sevensa webhook placeholder, event logging en error states.
- **Local SEO pagina-template** met JSON-LD, lokale venues, review highlight en interne linkhub.
- **Design tokens pipeline** (`src/main.js`, `tailwind.config.js`) zet tokens om naar CSS variabelen en Tailwind thema-extensies.

## 3. Nieuwe concurrentieanalyse (Q4 2025)
| Concurrent | Sterke punten | Zwakke punten | Relevante learnings |
| --- | --- | --- | --- |
| **DJ Company NL** | Sterk in lokale landingspagina's met video hero's en realtime prijsindicaties. | Mist diepgaande persona-verhalen; weinig automation. | Introduceer video hero variant + price estimator widget voor corporate leads. |
| **Skyline Events** | Transparante pakketvergelijker met ROI-calculator en klantportal demo. | Minder nadruk op personalisatie, cookie consent basic. | Voeg interactieve ROI-calculator toe aan pricing tables, koppel aan Config Dashboard voor experimenten. |
| **Swinging.nl** | Uitgebreide eventjournal + cases per branche, intensieve retargeting flows. | Consent/onboarding complex, geen realtime availability. | Breid AvailabilityChecker uit met agenda-sync en progressieve profiling; bouw content-hub module. |

## 4. Aanbevolen vervolgacties
1. **Conversie accelerators**
   - Video hero module (A/B-testbaar) en CTA microcopy per persona.
   - ROI-calculator component koppelen aan bestaande pricing data (`content/pakketten/*.json`).
2. **Automation & CRM**
   - Sevensa submit-URL parametriseren via Config Dashboard; voeg queue fallback + retry logica toe.
   - Personalisation events naar n8n pipeline voor lead scoring en nurture.
3. **Content & SEO**
   - Uitbreiding city dataset met Limburg/Overijssel gaps; gebruik scripts/generate-city-pages.mjs.
   - Content hub met branchecases en video testimonials.
4. **Analytics & Consent**
   - ConsentManager warnings refactor: scheid helpers in util-bestanden voor optimale Fast Refresh.
   - Meetplan: automatiseer Lighthouse/Axe runs in CI en log conversie events per variant.

## 5. KPI-impact verwachting
- **Lead conversie**: +8-12% door ROI-calculator + video hero tests.
- **MQL-kwaliteit**: +10% via Sevensa enrichment en n8n scoring.
- **Organische sessies**: +15% door extra city pages en content hub.
- **Operationele efficiëntie**: -20% handmatig werk door geautomatiseerde submit/queue workflows.

---
*Opgesteld door het productteam op basis van interne metrics, QA-rapportages en nieuwe marktverkenning.*

## 6. Follow-up (19 oktober 2025)
- **Video hero experiment live**: nieuwe video hero module met session-based A/B variant (60% video, 40% klassiek) inclusief persona microcopy.
- **ROI-calculator**: interactieve component gekoppeld aan `content/pakketten` data + API fallback, ondersteunt corporate/wedding/nightlife persona’s.
- **Automation dashboard**: Config Dashboard bevat nu sectie *Automation & CRM* met Sevensa submit URL + retry settings, inclusief status- en flush-acties.
- **Sevensa queue service**: backend queue met dead-letter logging, tests en dashboard integratie; Availability flows kunnen veilig naar Sevensa/n8n pipeline.
- **RentGuy pipeline**: personalisatie-events worden naar RentGuy API doorgestuurd (queue fallback) naast bestaande n8n webhook.
- **Content hub**: nieuw front-end blok met nurture assets en video testimonials om content & SEO roadmap te kickstarten.
- **City dataset**: Limburg en Overijssel aanvulling (Maastricht, Venlo, Roermond, Zwolle, Deventer) voor lokale SEO scripts.

## 7. Debug & Monitoring update (20 oktober 2025)
- **Lighthouse/Axe automatisering**: Config Dashboard toont nu synthetic runs met queue-status, gemiddelde scores en auditgeschiedenis. Runs kunnen per pagina/device vanuit de UI worden gestart.
- **Variant analytics**: CRO events (impression/CTA/conversie) worden realtime geaggregeerd en zichtbaar gemaakt inclusief keyword insights.
- **Testdekking**: Nieuwe Jest-suites voor observability-service + variant pipelines; Vitest gericht op ROI-calculator en video hero logica.
- **Bugs verholpen**:
  - Dashboard laadt nu veilig zonder race conditions door queue reset.
  - Personalization events normaliseren null keywords voordat ze in analytics komen.

### Volgende iteratievoorstellen
1. **CI-integratie**: Koppel observability-service aan GitHub Actions zodat elke merge een audit queued.
2. **Alerting**: Slack/webhook notificaties wanneer gemiddelde performance < 90 of wanneer conversieratio variant < baseline.
3. **Datawarehouse**: Synchroniseer variant analytics naar BigQuery voor langere historische analyses.
4. **UI**: Voeg grafieken toe (sparkline) voor variant CTR/conversies over tijd in Config Dashboard.
