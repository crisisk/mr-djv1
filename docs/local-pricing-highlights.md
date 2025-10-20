# Lokale pricing-highlights koppelen aan pakketten

De pricingtabellen tonen nu lokale verkoopargumenten zodra een specifieke stad actief is op de pagina.
Deze highlightteksten komen rechtstreeks uit `local_seo_data.js` en sluiten aan op de drie pakketten:

- **Brons** → nadruk op laagdrempelige locaties (eerste twee venues in de lijst).
- **Zilver** → gebruikt de lokale USP als vertrouwde, meest gekozen optie.
- **Goud** → benadrukt premium locaties (laatste venues in de lijst).

## Nieuwe steden toevoegen
1. Voeg een nieuw item toe aan `baseLocalSeoData` in `local_seo_data.js` met `city`, `slug`, `localUSP` en `localVenues` (plaats de meest toegankelijke venues vooraan en de premium locaties achteraan).
2. Laat het veld `pricingHighlights` weg om automatisch gegenereerde highlights te krijgen, of vul zelf een object in met de sleutels `brons`, `zilver` en `goud` voor volledige controle.
3. Publiceer de stadspagina met `<PricingTables citySlug="<slug>" />` of geef een `localSeo` object mee; de component zoekt de juiste highlight op basis van de slug.

## HTML-variant updaten
De statische `organisms_pricing.html` bevat voor elke kaart een `<div class="local-highlight" data-package="…" data-city="…">`.
Een simpel script kan `data-active="true"` zetten zodra de bezoeker een stad kiest, zodat dezelfde copy zichtbaar wordt in pure HTML/CSS-varianten.
