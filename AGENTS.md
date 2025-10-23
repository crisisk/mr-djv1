# Openstaande taken tot volledig frontend-backend ready and prepared for full integration with RentGuy

- [x] Configureer en voeg Cypress toe als devDependency zodat `npm run test:e2e` lokaal en in CI kan draaien.
- [x] Richt een testomgeving in of mock-services voor RentGuy API-calls om end-to-end integratie te valideren zonder productieafhankelijkheden.
- [ ] Werk frontend data-fetching logica bij om RentGuy endpoints en authenticatie te gebruiken, inclusief foutafhandeling en loading states.
- [ ] Implementeer backend proxy- of middleware-laag voor veilige communicatie met RentGuy, inclusief geheimbeheer en configuratie via omgevingsvariabelen.
- [ ] Maak uitgebreide documentatie voor integratiestappen, configuratie en testscenario's, zodat teams de koppeling kunnen uitrollen.
- [ ] Automatiseer prestatie- en regressietesten (k6) met gecontaineriseerde tooling of CI-scripts zodat `npm run test:perf` reproduceerbaar wordt.

## Launch blockers (Oktober 2025 review)
- [ ] Provision backend runtime secrets (`backend/.env` + `backend/managed.env`) zodat de strikte validatie in `backend/src/config.js` niet faalt en RentGuy/Sevensa/N8N automatiseringen veilig kunnen draaien.
- [ ] Vervang de placeholder Complianz configuratie (`data-site-id="YOUR_SITE_ID"`) en stel echte Facebook Pixel/GTM variabelen in de root `index.html` build in.
- [ ] Vervang de placeholder Sevensa account- en formulier-ID's in `AvailabilityChecker.jsx` of koppel dit component definitief aan de backend lead flow.
- [ ] Doorloop de pending staging-validaties (console errors, GA4 DebugView, GTM/GA4 ID-verificatie) zoals beschreven in `STAGING-VALIDATION-STATUS.md` en documenteer de resultaten.

## Backlog uit TODO.md (synchroniseren)
### Prioriteit 1 - Kritieke configuratie
- [ ] T1.1: Google Tag Manager ID configureren (vervang alle `GTM-PLACEHOLDER` vermeldingen en redeploy).
- [ ] T1.2: Complianz cookie consent site ID invullen of alternatief implementeren.

### Prioriteit 2 - Belangrijke features
- [ ] T2.1: Backend API volledig integreren met de frontend (healthcheck + booking/contact endpoints).
- [ ] T2.2: Branding & logo update voor favicon en headers.
- [ ] T2.3: Contactformulier functioneel maken inclusief validatie, e-mailnotificaties en tracking.
- [ ] T2.4: Schema.org structured data verifiëren en uitbreiden naar alle city pagina's.
- [ ] T2.5: Testimonials data centraliseren via API/CMS met fallback en testdekking.

### Prioriteit 3 - Nice to have
- [ ] T3.1: Testimonials carousel implementeren volgens brand guidelines.
- [ ] T3.2: Klantlogo's voor social proof toevoegen.
- [ ] T3.3: "Over ons" sectie realiseren binnen DjSaxLanding.
- [ ] T3.4: A/B testing configuratie afronden inclusief tracking en documentatie.
- [ ] T3.5: Performance optimalisaties uitvoeren (Lighthouse doelen <2s FCP, >90 score).
- [ ] T3.6: Social media integratie met echte URL's en metadata afronden.

### Technisch onderhoud
- [ ] T4.1: Git repository opschonen (stashes, docker-compose/nginx wijzigingen, .gitignore updates, tag `v1.0-react-spa`).
