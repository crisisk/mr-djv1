# Commit Task Plan for RentGuy Integration & Launch Readiness

Deze planning werkt alle openstaande taken uit de projectchecklists uit tot een reeks concrete commits.
Elke commit heeft een duidelijk doel, deliverables en afhankelijkheden zodat de reeks in 10-30 commits voltooid kan worden.

## Overzicht
- **Totaal commits**: 18
- **Fasen**: Testvoorzieningen ➜ Backend integratie ➜ Frontend updates ➜ Automatisering & prestaties ➜ Documentatie & QA
- **Bronnen**: `AGENTS.md`, `TODO.md`, integratie- en validatierapporten in de repository

## Commitreeks

| # | Scope | Doel & Deliverables | Afhankelijkheden |
|---|-------|---------------------|-------------------|
| 1 | Opset / QA | Voeg RentGuy API mockservices en `.env.example` placeholders toe voor lokale integratie-tests. Documenteer start/stop scripts. | Geen |
| 2 | QA Scripts | Implementeer `npm run test:e2e:mock` met Cypress configuratie voor mockomgeving. Voeg CI-workflow of scriptupdate toe. | Commit 1 |
| 3 | Backend Config | Provision backend secrets templates (`backend/.env`, `backend/managed.env`) met secure variabelen en documenteer gebruik. | Commit 1 |
| 4 | Backend Middleware | Bouw proxy/middleware in `backend/src` voor RentGuy API met authenticatie, retry/logging en testdekking. | Commit 3 |
| 5 | Backend Tests | Automatiseer backend integratietests (Jest/Supertest) voor nieuwe proxy endpoints en healthchecks. | Commit 4 |
| 6 | Frontend Data Layer | Update frontend API client (React) om proxy endpoints te gebruiken inclusief error/loading states. | Commits 4-5 |
| 7 | Frontend Forms | Koppel contact- en bookingformulieren aan backend API, inclusief validatie en tracking events. | Commit 6 |
| 8 | Availability Checker | Vervang placeholder Sevensa IDs in `AvailabilityChecker.jsx` en verbind met backend lead flow. | Commit 6 |
| 9 | Testimonials API | Centraliseer testimonials via nieuw `/api/testimonials` endpoint met fallback in frontend en tests. | Commits 4-6 |
|10 | Schema & SEO | Breid Schema.org data uit naar city pagina's, update OG/Twitter meta en valideer. | Commit 6 |
|11 | Branding Assets | Update favicon, headers en overige branding-assets met officieel logo en verzorg build output. | Geen harde afhankelijkheid |
|12 | Consent & GTM | Configureer Complianz site ID en vervang alle `GTM-PLACEHOLDER` waarden, inclusief documentatie van tracking configuratie. | Commit 11 (build assets) |
|13 | Performance | Implementeer performance-optimalisaties (lazy loading, preconnects, Lighthouse scripts) en voeg `npm run test:perf` k6 setup toe. | Commits 6, 11 |
|14 | Testimonials Carousel | Voeg carouselfunctionaliteit toe met toegankelijke controls en integratie met API-data. | Commits 6, 9 |
|15 | Social Proof & Over Ons | Implementeer klantlogo sectie, werk "Over ons" sectie uit en zorg voor responsive layout. | Commits 11, 14 |
|16 | Monitoring & Alerts | Voeg infrastructuur scripts/config toe voor uptime monitoring, Sentry/LogRocket en documenteer onboarding. | Commits 3-4 |
|17 | Repository Opschoning | Ruim Git repo op: verwijder oude stashes/artefacten, actualiseer `.gitignore`, voeg `v1.0-react-spa` tagdocumentatie toe. | Geen |
|18 | Documentatie & Launch QA | Update README, integratiegidsen en staging-validatieverslag; verzamel testresultaten (GA4 DebugView, console). | Alle voorgaande commits |

## Extra Notities per Fase

1. **Testvoorzieningen (Commits 1-2)**
   - Mockservices moeten RentGuy endpoints simuleren met sample responses voor verschillende scenario's (success, auth failure, rate limit).
   - Cypress configuratie moet switchen tussen productie/staging en mock via env flags.

2. **Backend Integratie (Commits 3-5)**
   - Secrets-template moet duidelijke placeholders en rotatie-instructies bevatten.
   - Middleware moet gebruikmaken van omgevingsvariabelen voor API keys en gebruikslogs schrijven voor monitoring commit 16.

3. **Frontend Integratie & UX (Commits 6-15)**
   - Introduceer een centrale API client of React Query setup voor consistente loading/error states.
   - Zorg dat alle formulieren tracking-events naar GTM sturen zodra commit 12 gereed is.
   - Performance optimalisaties moeten Lighthouse rapport bundelen (json/html) in `monitoring/` map.

4. **Automatisering & Monitoring (Commits 13 & 16)**
   - `npm run test:perf` draait k6 scripts met Docker; documenteer resourcevereisten.
   - Monitoring commit moet inclusief alert escalation matrix in documentatie zijn.

5. **Documentatie & Launch QA (Commit 18)**
   - Werk `STAGING-VALIDATION-STATUS.md` bij met resultaten uit nieuwe test run.
   - Voeg nieuwe sectie "RentGuy Integratie Checklist" toe aan README of aparte gids.

Deze commitplanning zorgt ervoor dat alle blockers uit `AGENTS.md` en `TODO.md` worden aangepakt binnen een beheersbare reeks commits.
