# RentGuy Automation & CRM Playbook

Dit document beschrijft hoe de nieuwe HubSpot submit-queue en RentGuy personalisatie events geïntegreerd worden in de Mister DJ stack.

## 1. Configuratie via Config Dashboard

1. Log in op `/dashboard` met de bestaande credentials.
2. Navigeer naar de nieuwe sectie **Automation & CRM**.
3. Vul de volgende variabelen in:
   - `HUBSPOT_SUBMIT_URL`: complete HubSpot endpoint inclusief portal ID en form GUID (bijv. `https://api.hsforms.com/submissions/v3/integration/submit/XXXX/FORMID`).
   - `HUBSPOT_QUEUE_RETRY_DELAY_MS`: standaard 15000 ms, verlaag naar 5000 ms voor agressievere retries tijdens QA.
   - `HUBSPOT_QUEUE_MAX_ATTEMPTS`: aantal verzendpogingen voordat een lead naar de dead letter queue verhuist (standaard 5).
4. Opslaan → dashboard toont realtime statuskaarten voor RentGuy en HubSpot.

## 2. HubSpot submit queue

- Nieuwe service `hubspotService` verzorgt retry-queue + dead letters.
- Queue wordt automatisch verwerkt en kan via dashboard/API geflusht worden.
- Integratiestatus beschikbaar via:
  - REST: `GET /integrations/hubspot/status`
  - Dashboard kaart “HubSpot submit & queue status”.

## 3. Personalisation events → RentGuy

- Alle personalization events (`/personalization/events`) pushen nu via `rentGuyService.syncPersonalizationEvent` naar RentGuy (queue fallback indien niet geconfigureerd).
- n8n webhook blijft parallel actief; automation triggered flag reflecteert succesvolle delivery naar minimaal één bestemming.

## 4. Front-end hooks

- Video hero + ROI-calculator zorgen voor CRO-prestaties en loggen events met variant ID’s.
- ROI-calculator gebruikt `/packages` endpoint (nu gevoed vanuit `content/pakketten/*.json`).
- Content hub component bevat assets die via RentGuy automation naar prospects verstuurd kunnen worden.

## 5. Integratie checklist voor rentguy.nl

1. Zet API credentials voor RentGuy in Config Dashboard (sectie RentGuy).
2. Plaats HubSpot submit URL in de nieuwe Automation-sectie.
3. Test een lead via `/dashboard/api/integrations/hubspot/flush` (verwacht queued zonder configuratie → configureer → flush levert delivered).
4. Controleer personalisatie events in RentGuy via `personalization-events` resource (queue flush beschikbaar via dashboard).
5. Activeer nurture flow in HubSpot/n8n met dezelfde endpoints voor scoring.

Door deze stappen is mr-dj.rentguy.nl klaar om leads automatisch te routeren, scoringsdata terug te sturen en queue failures inzichtelijk te maken.
