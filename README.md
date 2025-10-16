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
- [Mailintegratie onderzoek](docs/mail-integration-report.md)
- [Performance, SEO & klantfit onderzoek](docs/performance-seo-research.md)

## 📞 Contact

- **Email**: info@mr-dj.nl
- **Phone**: +31 (0) 40 8422594
- **KvK**: 68906277

---

**Made with ❤️ for Mister DJ**
