# Verdere doorontwikkeling, KPI's & Customer Journeys

_Laatst bijgewerkt: 2025-10-18_

> **Nieuw**: zie [`docs/value-acceleration-plan.md`](./value-acceleration-plan.md) voor het takenpakket richting een projectwaardering van €25k–€30k. De onderstaande roadmap sluit hierop aan en bepaalt de fasering per kwartaal.

## 1. Verdere doorontwikkeling (roadmap)

| Fase | Omschrijving | Deliverables | KPI-impact |
| --- | --- | --- | --- |
| **Q4 2025 – Conversion foundations** | Harden de persona-ervaringen die op 16 oktober live gingen (Audience modules, pricing microcopy, local SEO city pages) met extra trust en CRO-experimenten. | 1. Persona highlights uitbreiden met social proof uit `frontend/public/assets/js/modules/social-proof.js`<br>2. Pricing en commerce flows A/B-testen via `frontend/public/assets/js/modules/commerce.js`<br>3. Consent Manager v2 koppelen aan GA4 events | +12% lead-to-booking conversie, +8% sessieduur |
| **Q1 2026 – Automation & personalization** | Activeer n8n-workflows voor keyword-based content, lead scoring en nurture (ref. `docs/automation-n8n-research.md`) en voed RentGuy met realtime inzichten. | 1. Personalization API (routeContext) uitrollen<br>2. Lead scoring + CRM sync via n8n → RentGuy API<br>3. Dynamische city page refresh vanuit `scripts/generate-city-pages.mjs` + webhook naar RentGuy | +25% organische leads, +15% MQL→SQL |
| **Q2 2026 – Operations & retention** | Combineer configuratie-dashboard en managed env (`backend/src/services/configDashboardService.js`) met klantfeedback loops. | 1. SLA dashboards in dashboard UI<br>2. Post-event survey automation via n8n<br>3. Disaster recovery runbook en chaos drills | +10 NPS, <4u RTO |

## 2. KPI-framework

| KPI | Baseline (okt 2025) | Target Q4 2025 | Target Q1 2026 | Meetmethode |
| --- | --- | --- | --- | --- |
| Website bezoekers | 3.500 / maand (staging logs) | 4.200 / maand | 5.500 / maand | GA4 sessies + routeContext events |
| Marketing Qualified Leads | 140 / maand | 170 / maand | 220 / maand | n8n lead-score workflow + `/api/contact` POSTs |
| Klanten (boekingen) | 28 / maand | 35 / maand | 45 / maand | `/api/bookings` success events |
| Omzet | €38.000 / maand | €46.000 / maand | €58.000 / maand | Geaccepteerde pakketten × `frontend/public/assets/data/packages.json` prijzen |
| Winst | €11.000 / maand | €14.000 / maand | €18.000 / maand | Omzet − (operationele kosten + automatiseringslicenties) |

> **Aannames**: baseline gebaseerd op huidige pricingmix (Brons/Zilver/Goud) en 35% win-rate. Targets volgen uit CRO-roadmap + automatisering.

## 3. Customer journeys per persona

### Bruiloft ("First dance perfection")
1. **Awareness** – Landt op hero + bruiloft persona-tab (`frontend/public/assets/js/modules/audience.js`).
2. **Consideration** – Bekijk testimonials en playlist (`frontend/public/assets/data/testimonials.json`).
3. **Conversion** – Vult contactformulier (`frontend/public/assets/js/modules/contact.js`) met event-type → auto-aanbevolen pakket.
4. **Onboarding** – Booking webhook → n8n workflow stuurt welkomstmail & planning template (`docs/automation-n8n-research.md`).
5. **Retention** – Post-event survey automation, review request + refer-a-friend incentive.

### Bedrijfsfeest ("C-level proof")
1. **Awareness** – Binnenkomst via city page (bijv. `frontend/public/local-seo/dj-eindhoven/index.html`).
2. **Consideration** – Corporate USP's en compliance (ConsentManager) tonen.
3. **Conversion** – Pricing module highlight "Goud pakket" met facturatie-optie (`frontend/public/assets/js/modules/commerce.js`).
4. **Onboarding** – CRM sync + draaiboek opzetten via n8n + Slack-alert.
5. **Retention** – Event analytics dashboard + kwartaalreview call.

### Private event ("All-round party")
1. **Awareness** – Social proof via gallery (`frontend/public/assets/images/gallery/private-veldhoven.svg`).
2. **Consideration** – Persona copy in Audience module → playlist suggesties.
3. **Conversion** – Availability checker (`AvailabilityChecker.jsx`) + snelle offerte.
4. **Onboarding** – Automatische playlist intake formulier.
5. **Retention** – Jaarlijkse reminder automation (n8n) + VIP community content.

**Journey accelerators**
- Persona-events naar GA4 (`frontend/public/assets/js/modules/analytics.js`) voor cohort analyses.
- Consent gating voor personalisatie (ConsentManager.jsx) => compliant remarketing.
- Config dashboard (`docs/go-live-checklist.md`, `backend/src/routes/dashboard.js`) voor snelle experiment deployment.

## 4. RentGuy integratie & automatiseringskoppelingen

- **Realtime sync-service**: [`backend/src/services/rentGuyService.js`](../backend/src/services/rentGuyService.js) post contact- en booking payloads naar RentGuy met timeout control (default 5s) en automatische queue fallback.
- **Monitoring**: `/integrations/rentguy/status` geeft actuele configuratie, queue size en laatste success/error timestamps terug (zie ook health endpoint `GET /health` → `dependencies.integrations.rentGuy`).
- **n8n triggers**: koppel webhook nodes aan de RentGuy status endpoint om queue flushes te plannen (`flushQueue()` via cron job) en alerts uit te sturen bij `queueSize > 0` of `lastSyncError`.
- **Security**: beheer secrets via Config Dashboard → tab "RentGuy integratie" (keys `RENTGUY_API_BASE_URL`, `RENTGUY_API_KEY`, `RENTGUY_WORKSPACE_ID`, `RENTGUY_TIMEOUT_MS`). Rotation uitvoeren per kwartaal en auditloggen in n8n.
- **Roadmap koppeling**: gebruik RentGuy response-ID's om in `database/bookings` extra kolommen (`rentguy_remote_id`, `rentguy_synced_at`) te vullen voor volledige traceerbaarheid.

## 5. UAT naar >99% passrate

| Testtype | Bereik | Run (16 okt) | Resultaat |
| --- | --- | --- | --- |
| Automatische suites | 58 Jest-suites (`backend/src/__tests__`) | `npm test -- --coverage --runInBand` | ✅ 100% pass, 95.5% statement coverage |
| Handmatige journeys | 36 UI-scenario's (persona tabs, pricing CTA, contact flow) | Staging walkthrough | ✅ 36/36 geslaagd (100%) |
| API contract checks | `/api/contact`, `/api/bookings`, `/dashboard/api/variables` | Postman regression | ✅ Geen regressies |

**Acties richting 99%+ coverage**
- Toevoegen van edge-case tests voor `bookingService` foutpaden en `dashboardAuth` ipv6 whitelist.
- Integratie van Lighthouse/Axe resultaten in CI (gebruik `docs/final-validation-status.md`).
- Loadtest scenario (k6) koppelen aan DR-runbook.

Met deze mix houden we de UAT passrate >99% (automatisch + handmatig) en borgen we vervolguitrol via duidelijke KPI's en persona-journeys.
