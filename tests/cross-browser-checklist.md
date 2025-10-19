# Cross-browser testscript (Chrome · Safari · Firefox)

Deze checklist dekt de gevraagde FINAL1-scope. Gebruik het sjabloon als logboek – vul datum, tester en bevindingen in en voeg screenshots toe.

## Metadata
- **URL**: https://staging.sevensa.nl
- **Te testen pagina's**: Home, Pricing, City page (bijv. `/locaties/eindhoven`), Dashboard login
- **Browsers**: Chrome (latest), Safari (latest macOS/iOS), Firefox (latest)
- **Viewport combinaties**: 1920×1080, 1440×900, 1024×768, 390×844 (mobile)

## Testscenario's
| # | Scenario | Verwacht resultaat | Chrome | Safari | Firefox |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero laadt met achtergrondvideo & CTA | Video autoplay muted, CTA scrollt naar pricing |  |  |  |
| 2 | Pricing CTA leidt naar contactformulier | Klik op "Plan kennismaking" opent formulier met vooringevulde pakket-ID |  |  |  |
| 3 | Consent Manager toont en slaat keuze op | Modal verschijnt 1x, "Accepteren" en "Aanpassen" zetten juiste `dataLayer` event |  |  |  |
| 4 | Contactformulier validatie | Onvolledige velden tonen inline foutmeldingen, submit disabled tot valid |  |  |  |
| 5 | Booking flow (pakket selectie + submit) | POST `/api/bookings` → 200, bevestigingscopy zichtbaar |  |  |  |
| 6 | Dashboard login | Basic Auth prompt, na correcte login laadt configuratietabs |  |  |  |
| 7 | RentGuy statuskaart | Queue size zichtbaar, knoppen werken zonder errors |  |  |  |
| 8 | Scroll & animaties | Intersection-animaties spelen soepel zonder jitter |  |  |  |
| 9 | Footer links & mailto | Links openen correct, mailto start client |  |  |  |
| 10 | Error state `/pricing?package=unknown` | Toont nette fallback copy, geen console errors |  |  |  |

### Logging
Gebruik onderstaande tabel om bevindingen vast te leggen.

| Datum | Tester | Browser | Scenario | Resultaat | Notities |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

> **Tip:** Koppel dit document aan de release-notes; voeg screenshots toe in dezelfde map (`tests/screenshots/`).
