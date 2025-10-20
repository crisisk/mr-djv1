# Mister DJ Website Go-Live Checklist

Deze checklist beschrijft **alle stappen** om de Mister DJ website productieklaar te maken en live te zetten. Doorloop de fases in volgorde en vink iedere stap af.

## 1. Voorbereiding
- [ ] Controleer dat je op de laatste `main` branch zit: `git pull origin main`
- [ ] Vul een productie `.env` bestand in gebaseerd op [`backend/.env.example`](../backend/.env.example) en plaats dit als `backend/.env` **alleen lokaal of op de server**
- [ ] Controleer dat alle DNS-records naar de nieuwe infrastructuur kunnen wijzen (`staging.sevensa.nl` of het definitieve domein)
- [ ] Zorg dat je toegang hebt tot de VPS (`ssh root@147.93.57.40`) en het Netlify-account

## 2. Lokale validatie
- [ ] Installeer backend dependencies: `cd backend && npm ci`
- [ ] Draai de volledige test-suite: `npm test -- --runInBand`
- [ ] Start de services lokaal via Docker voor een rooktest: `docker compose up --build`
- [ ] Controleer handmatig of de frontend via `http://localhost` de API (`/api/*`) kan bereiken
- [ ] Stop de containers: `docker compose down`

## 3. Database voorbereiden
- [ ] Verbind met de VPS en zorg dat Docker draait: `systemctl status docker`
- [ ] Maak (indien nodig) de externe `web`-network aan: `docker network create web`
- [ ] Controleer of de Postgres container draait: `docker ps | grep mr-dj-postgres`
- [ ] Voer de database migraties uit (idempotent): `docker compose run --rm mr-dj-backend npm run migrate`

## 4. Configuratie dashboard (staging.sevensa.nl/dashboard)
- [ ] Zet de `CONFIG_DASHBOARD_*` variabelen in `.env` zodat het dashboard geactiveerd wordt
- [ ] Navigeer naar `https://staging.sevensa.nl/dashboard` en log in met de ingestelde Basic Auth inloggegevens
- [ ] Vul alle verplichte variabelen (database, Redis, service naam, rate limit etc.) in en sla op
- [ ] Open de tab **RentGuy integratie**, vul `RENTGUY_API_BASE_URL`, `RENTGUY_API_KEY`, `RENTGUY_WORKSPACE_ID` en controleer dat de statusindicator "API geconfigureerd" toont
- [ ] Controleer in de RentGuy statuskaart dat de queue-grootte `0` is en gebruik eventueel **Queue flushen** om wachtrij-items te verwerken
- [ ] Vul (indien gebruikt) `N8N_PERSONALIZATION_WEBHOOK_URL` in zodat CRO-events naar n8n worden doorgestuurd en herlaad het dashboard
- [ ] Open `/api/health` en verifieer dat `dependencies.integrations.personalization.automationWebhookConfigured` `true` is wanneer de webhook actief moet zijn
- [ ] Controleer dat de status-indicatoren groen kleuren en de `managed.env` op de server is bijgewerkt (`docker exec mr-dj-backend cat /app/managed.env`)
- [ ] Herlaad de health endpoint (`/api/health`) en verifieer dat de database status `connected: true` toont

## 5. Backend en frontend deployen
- [ ] Maak het deploy-script uitvoerbaar: `chmod +x deploy.sh`
- [ ] Voer `./deploy.sh` uit vanaf de repository-root
- [ ] Volg de scriptoutput om te bevestigen dat de containers opnieuw worden opgebouwd en starten zonder fouten (het script voert automatisch `npm run migrate` uit binnen `mr-dj-backend`)

## 6. Netlify (statische hosting / CMS)
- [ ] Meld je aan bij Netlify en importeer de GitHub-repository (zie [`NETLIFY_DEPLOYMENT.md`](../NETLIFY_DEPLOYMENT.md))
- [ ] Controleer dat de build command `npm ci --prefix frontend && npm run build --prefix frontend` is en de publish map `frontend/dist`
- [ ] Bevestig dat de caching-paden (`frontend/.npm` en `frontend/node_modules`) in `netlify.toml` blijven staan voor snellere builds
- [ ] Koppel het gewenste (sub)domein aan Netlify en wacht op SSL-activatie

## 7. Post-deployment validatie
- [ ] Controleer de health-endpoint: `curl -s https://staging.sevensa.nl/api/health | jq`
- [ ] Voer een test-booking en contactformulier in en verifieer dat de responses `success: true` bevatten
- [ ] Controleer via `docker compose logs` dat er geen fouten in de backend verschijnen
- [ ] Draai `docker compose ps` om te bevestigen dat alle containers `Up` zijn
- [ ] Bezoek de live site en valideer de belangrijkste pagina-secties (hero, pakketten, reviews, contactformulier)

## 8. Monitoring & nazorg
- [ ] Schakel Traefik/Let’s Encrypt monitoring notificaties in
- [ ] Activeer (optioneel) Netlify Analytics en stel alerts in voor CDN-fouten
- [ ] Plan periodieke back-ups van de Postgres database (`pg_dump` + offsite opslag)

## 9. Laatste debug & UAT
- [ ] Draai de volledige test-suite met coverage rapportage: `cd backend && npm test -- --coverage --runInBand`
- [ ] Controleer dat de totale testcoverage minimaal 95% is (zie `backend/coverage/lcov-report/index.html` of de CLI-output)
- [ ] Documenteer eventuele openstaande bevindingen en bevestig dat alle blokkades verholpen zijn voor de launch

Wanneer iedere checkbox is afgevinkt is de site klaar voor productiegebruik. Bewaar deze checklist bij de release-notes zodat toekomstige deploys dezelfde kwaliteit behouden.
