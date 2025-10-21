# Openstaande taken tot volledig frontend-backend ready and prepared for full integration with RentGuy

- [x] Configureer en voeg Cypress toe als devDependency zodat `npm run test:e2e` lokaal en in CI kan draaien.
- [ ] Richt een testomgeving in of mock-services voor RentGuy API-calls om end-to-end integratie te valideren zonder productie afhankelijkheden.
- [ ] Werk frontend data-fetching logica bij om RentGuy endpoints en authenticatie te gebruiken, inclusief foutafhandeling en loading states.
- [ ] Implementeer backend proxy- of middleware-laag voor veilige communicatie met RentGuy, inclusief geheimbeheer en configuratie via omgevingsvariabelen.
- [ ] Maak uitgebreide documentatie voor integratiestappen, configuratie en testscenario's, zodat teams de koppeling kunnen uitrollen.
- [ ] Automatiseer prestatie- en regressietesten (k6) met gecontaineriseerde tooling of CI-scripts zodat `npm run test:perf` reproduceerbaar wordt.
