# Instagram Reels feed & WhatsApp messaging runbook

Deze handleiding biedt marketing- en operations-teams een overzicht van de
belangrijkste stromen rond de nieuwe Instagram Reels feed en de WhatsApp/BSP
berichtenservices. Gebruik dit document als naslag tijdens campagnes of bij het
wijzigen van templates en toegangstokens.

## 1. Instagram Reels feed

### API-overzicht

- **Endpoint:** `GET /integrations/instagram/reels`
- **Parameters:**
  - `limit` – aantal reels per pagina (standaard 6, maximaal 25).
  - `after` – cursor voor volgende pagina. Gebruik de `paging.nextCursor` uit
    het vorige antwoord.
- **Response:**
  ```json
  {
    "reels": [
      {
        "id": "123",
        "videoUrl": "https://...",
        "posterUrl": "https://...",
        "audioTitle": "Main Stage",
        "likes": 42,
        "views": 1500,
        "description": "Aftermovie",
        "permalink": "https://instagram.com/..."
      }
    ],
    "paging": {
      "nextCursor": "QVFIUj...",
      "hasMore": true
    }
  }
  ```

### Authenticatie & configuratie

1. Maak in Meta Business Manager een systeemgebruiker aan met toegang tot het
   juiste Instagram Business-account.
2. Bewaar de **Instagram Business ID** en **Permanent Access Token** als
   omgevingsvariabelen:
   - `META_IG_BUSINESS_ID`
   - `META_IG_ACCESS_TOKEN`
3. Optioneel: stel `META_GRAPH_API_BASE_URL`, `META_IG_REELS_CACHE_TTL`
   (seconden) of `META_IG_REQUEST_TIMEOUT_MS` in om caching en time-outs aan te
   passen.
4. De backend cachet responses standaard 5 minuten voor prestaties. Gebruik de
   Netlify/CI secrets store om waarden veilig te beheren.

### Operationele tips

- **Publish cadence:** plan minstens één reel per week zodat de feed gevuld
  blijft; oudere reels blijven via paginatie bereikbaar.
- **Fallbacks:** als de API tijdelijk geen data heeft, toont de front-end een
  lege status. Publiceer een nieuwe reel of controleer het access token.
- **Monitoring:** het backend logt HTTP-fouten en time-outs onder het label
  `InstagramService`. Controleer de applicatielogs bij performance issues.

## 2. WhatsApp/BSP messaging

### API-endpoints

| Doel                                | Methode | Pad                                              |
| ----------------------------------- | ------- | ------------------------------------------------ |
| Boekingsbevestiging versturen       | POST    | `/integrations/whatsapp/booking-confirmation`    |
| Vrij tekstbericht naar klant sturen | POST    | `/integrations/whatsapp/custom-message`          |

### Request-voorbeeld

```http
POST /integrations/whatsapp/booking-confirmation
X-Integration-Signature: t=1700000000,v1=...
Content-Type: application/json

{
  "phoneNumber": "+31612345678",
  "bookingDetails": {
    "eventDate": "2024-12-24 21:00",
    "location": "De Pier, Scheveningen"
  }
}
```

### Authenticatie

- Elke aanvraag moet een `X-Integration-Signature` header bevatten. De waarde is
  een HMAC-SHA256 signatuur over het ruwe JSON-body (`timestamp.payload`) met een
  gedeeld geheim.
- Configureer de geheimen als kommagescheiden lijst in
  `WHATSAPP_INTEGRATION_SECRETS` zodat meerdere BSP's parallel kunnen
  authenticeren.
- Bij foutieve of ontbrekende signatures antwoordt de API met `401`.

### Meta credentials

Zorg dat onderstaande variabelen in de secret store aanwezig zijn en **niet** in
code of deployment logs terechtkomen:

- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_APP_SECRET`
- Optioneel: `WHATSAPP_API_BASE_URL`, `WHATSAPP_REQUEST_TIMEOUT_MS`,
  `WHATSAPP_BOOKING_TEMPLATE`, `WHATSAPP_DEFAULT_LANGUAGE`

### Templatebeheer

1. Templates worden beheerd in Meta Business Manager. Publiceer updates via
   BSP-procedures en wacht op goedkeuring.
2. Noteer de template-naam en taalcode. Standaard gebruikt de service
   `mr_dj_booking_confirmation` en taal `en_US`.
3. Voor dynamische velden (datum, locatie) gebruikt de service de volgorde van
   parameters zoals geconfigureerd in het template-body.

### Operationele checks

- **Rate limits:** plan bulkberichten via wachtrijen; de service logt
  time-outs en non-200 responses onder `WhatsApp API responded...`.
- **Herstel na fout:** wanneer de API `503` retourneert, controleer of de
  environment secrets nog geldig zijn en of Meta geen outage meldt.
- **Auditing:** sla message-id's uit het API-antwoord op in je CRM voor traceer-
  en verwijderverzoeken.

## 3. Incident response

1. **Feed werkt niet:**
   - Controleer backend logs voor `instagram_not_configured` of `instagram_timeout`.
   - Vernieuw tokens in Meta en update de secret store.
2. **WhatsApp berichten falen:**
   - Verifieer de HMAC signature met het gedeelde geheim.
   - Valideer of het access token niet verlopen is; draai indien nodig het
     token in Meta Business Manager.
   - Gebruik het response body om foutcodes van Meta te analyseren.
3. **Noodstop:** verwijder tijdelijk alle secrets (`WHATSAPP_ACCESS_TOKEN`,
   `WHATSAPP_INTEGRATION_SECRETS`) om alle uitgaande berichten te blokkeren.

Bewaar wijzigingen in deze runbook in het marketing knowledge centre en deel
wijzigingen via het #marketing-ops Slack kanaal.
