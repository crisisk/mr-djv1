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
- [ ] Voer de initiële SQL uit als deze nog niet gedraaid is: `docker exec -i mr-dj-postgres psql -U mrdj_user -d mrdj_db < database/init.sql`

## 4. Backend en frontend deployen
- [ ] Maak het deploy-script uitvoerbaar: `chmod +x deploy.sh`
- [ ] Voer `./deploy.sh` uit vanaf de repository-root
- [ ] Volg de scriptoutput om te bevestigen dat de containers opnieuw worden opgebouwd en starten zonder fouten

## 5. Netlify (statische hosting / CMS)
- [ ] Meld je aan bij Netlify en importeer de GitHub-repository (zie [`NETLIFY_DEPLOYMENT.md`](../NETLIFY_DEPLOYMENT.md))
- [ ] Controleer dat de build command `echo 'Building Mr. DJ website...' && ls -la frontend/public` is en de publish map `frontend/public`
- [ ] Activeer Netlify Identity en Git Gateway en nodig de beheerders uit
- [ ] Koppel het gewenste (sub)domein aan Netlify en wacht op SSL-activatie

## 6. Post-deployment validatie
- [ ] Controleer de health-endpoint: `curl -s https://staging.sevensa.nl/api/health | jq`
- [ ] Voer een test-booking en contactformulier in en verifieer dat de responses `success: true` bevatten
- [ ] Controleer via `docker compose logs` dat er geen fouten in de backend verschijnen
- [ ] Draai `docker compose ps` om te bevestigen dat alle containers `Up` zijn
- [ ] Bezoek de live site en valideer de belangrijkste pagina-secties (hero, pakketten, reviews, contactformulier)

## 7. Monitoring & nazorg
- [ ] Schakel Traefik/Let’s Encrypt monitoring notificaties in
- [ ] Activeer (optioneel) Netlify Analytics en stel alerts in voor CDN-fouten
- [ ] Plan periodieke back-ups van de Postgres database (`pg_dump` + offsite opslag)

Wanneer iedere checkbox is afgevinkt is de site klaar voor productiegebruik. Bewaar deze checklist bij de release-notes zodat toekomstige deploys dezelfde kwaliteit behouden.
