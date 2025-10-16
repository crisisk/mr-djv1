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


## 🔐 Configuratie dashboard

- **URL**: https://staging.sevensa.nl/dashboard
- **Authenticatie**: Basic Auth met `CONFIG_DASHBOARD_USER` en `CONFIG_DASHBOARD_PASS`
- **Staging login**: `admin` / `sevensa` (pas deze waarden aan voor productie)
- **Functionaliteit**: beheer alle vereiste `.env` variabelen, schrijf veilig naar `managed.env` en push direct naar de draaiende applicatie
  - Tab **Applicatie instellingen**: core API, database en rate-limit configuratie
  - Tab **E-mailintegratie**: vul provider (`MAIL_PROVIDER`), API key (`MAIL_API_KEY`), afzender (`MAIL_FROM_ADDRESS` / `MAIL_REPLY_TO`) en template ID's (`MAIL_TEMPLATES_CONTACT`, `MAIL_TEMPLATES_BOOKING`) in voor volledige mailfunctionaliteit
  - Tab **RentGuy integratie**: vul `RENTGUY_API_BASE_URL`, `RENTGUY_API_KEY`, optioneel `RENTGUY_WORKSPACE_ID` en een custom timeout (`RENTGUY_TIMEOUT_MS`) om leads/boekingen realtime te synchroniseren. Gebruik de geïntegreerde statuskaart om de queue in te zien en via **Queue flushen** vastgelopen syncs opnieuw te proberen.
  - Volg de [go-live checklist](docs/go-live-checklist.md) voor een stap-voor-stap instructie

## 📚 Volledige documentatie

Zie de uitgebreide README voor:
- Architectuur details
- Lokale ontwikkeling
- API endpoints
- Database schema
- Maintenance commands
- UAT rapport en go-live checklist

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
| 2025-10-18 | Interne city content automatisering & waardegroei-plan | `backend/src/services/cityContentAutomationService.js`, `scripts/automation/run-city-content-workflow.js`, `docs/value-acceleration-plan.md` | Maandelijkse keyword ingest + LLM-template generatie zonder n8n, automatische JSON/HTML build en roadmap naar €25k–€30k waardering. | 36 | €3.150 |

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

Met de uitgebreide automatisering, configuratie-dashboard, RentGuy-koppeling en CRO-personalisatie beweegt de website nu richting een marktwaarde van **€23.000 – €28.000**, waarbij het waarde-accelleratieplan duidelijke stappen naar de **€25.000 – €30.000** bandbreedte definieert. Elke nieuwe automatiseringsrun voegt bovendien schaalbare content toe waardoor SEO-traffic en conversies stijgen.

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
