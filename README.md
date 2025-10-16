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

Onderstaande tabel geeft een samenvatting van de belangrijkste oplevermomenten die in dit repo zijn terug te zien. De uren zijn ingeschat op basis van de omvang van de codebase (React frontend met design system, Node/Express backend met PostgreSQL integratie, deployment scripts, consent manager, local SEO generator en documentatie).

| Datum | Activiteit | Beschrijving | Uren (inschatting) | Waardevermeerdering* |
| --- | --- | --- | --- | --- |
| 2024-01-12 | Initiële architectuur & design system | Opzetten component library (`App.jsx`, `App.css`, design tokens, atoms/molecules/organisms) en responsive layout. | 60 | €5.000 |
| 2024-02-05 | Backend API & database laag | Node/Express API met security middleware, PostgreSQL schema en `.env` beheer via dashboard. | 45 | €3.750 |
| 2024-02-26 | Consent manager & analytics events | Uitrol `ConsentManager.jsx` met granular Google Consent Mode v2 en DataLayer events. | 24 | €2.000 |
| 2024-03-11 | Local SEO automatisering | `scripts/generate-city-pages.mjs` + content JSON voor 12 city pages, interne linking & schema data. | 28 | €2.200 |
| 2024-03-25 | Pricing & funnel optimalisaties | Uitwerking `/pricing/` money page, testimonials & availability checker met duidelijke CTA-flow. | 30 | €2.400 |
| 2024-04-08 | CI/CD & infrastructuur | Docker compose, Traefik reverse proxy, Netlify configuratie en deploy scripts. | 18 | €1.500 |
| 2024-04-22 | Testen & fine-tuning | Responsiveness QA, performance tweaks, bugfixes en documentatie (go-live checklist, mailrapport). | 22 | €1.800 |

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

- **Basis scenario (gem. €70/uur, 185 uur)**: ± €12.950
- **Midden scenario (gem. €80/uur, 205 uur)**: ± €16.400
- **Premium scenario (gem. €90/uur, 225 uur)**: ± €20.250

Gegeven de mate van maatwerk (design system, consent manager, local SEO scripting, dashboard voor configuratie) ligt de marktwaarde van de huidige website naar verwachting rond **€15.000 – €20.000**. Verdere doorontwikkeling (bijv. extra city pages, automatisering, CRO-experimenten) kan per iteratie 10–15% waardevermeerdering opleveren wanneer de activiteiten focussen op meetbare KPI’s.

## 🛠️ Nieuwe optimalisaties

- **Pricing money page**: `/pricing/` toont alle pakketten als indexeerbare HTML met Offer/Service schema en koppelt direct naar het contactproces.
- **Local SEO generator**: `node scripts/generate-city-pages.mjs` rendert 12 city-pages op basis van `content/local-seo/cities.json` inclusief cases, venues en FAQ. Draai het script na updates van de JSON.
- **Realtime consent & analytics**: de `ConsentManager` en design-system componenten sturen granular Consent Mode v2 en DataLayer-events uit voor CRO-metingen.
- [Mailintegratie onderzoek](docs/mail-integration-report.md)
- [Performance, SEO & klantfit onderzoek](docs/performance-seo-research.md)

## 📞 Contact

- **Email**: info@mr-dj.nl
- **Phone**: +31 (0) 40 8422594
- **KvK**: 68906277

---

**Made with ❤️ for Mister DJ**
