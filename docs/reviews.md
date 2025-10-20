# Review Moderation Workflow

Deze workflow zorgt ervoor dat nieuw ingezonden reviews veilig en gecontroleerd gepubliceerd worden.

## Statussen
- **pending** – Review is ontvangen en wacht op menselijke moderatie.
- **approved** – Review is nagekeken en zichtbaar op de website.
- **rejected** – Review is afgekeurd (wordt niet getoond en blijft in het archief).

## Backend
1. `backend/src/services/reviewService.js` verrijkt elke review met `moderationState`.
2. Geaccordeerde reviews blijven via `/api/reviews` beschikbaar voor de frontend.
3. Pending of rejected reviews worden pas zichtbaar nadat de status naar `approved` is gezet.
4. Wis de cache met `resetCache()` wanneer je statusupdates hebt verwerkt, zodat de wijzigingen direct live staan.

## Frontend
1. `frontend/public/assets/js/modules/commerce.js` toont een badge "In afwachting van moderatie" voor reviews die nog `pending` zijn.
2. De badge verschijnt automatisch zodra de API een review terugstuurt met `moderationState !== 'approved'`.
3. Styling wordt dynamisch toegevoegd; er zijn geen handmatige CSS-updates nodig.

## Modereren
1. Controleer wekelijks op nieuwe binnengekomen reviews in het CMS of dashboard.
2. Valideer taalgebruik, privacy-gevoelige data en feitelijke juistheid.
3. Pas de status in de database of het beheersysteem aan naar `approved` of `rejected`.
4. Herlaad de cache en controleer of de badge correct verdwijnt op de live-site.

## Communicatie
- Verstuur een bevestiging naar de inzender wanneer een review is goedgekeurd.
- Houd pending reviews maximaal 5 werkdagen in de wachtrij.
- Documenteer afgewezen reviews met reden zodat het supportteam kan opvolgen.
