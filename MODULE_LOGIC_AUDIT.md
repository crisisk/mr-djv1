# Module Logic Audit

Deze audit inventariseert de gegenereerde modules in `mr-dj-eds-components` die nog geen uitvoerbare logica bevatten. De bevindingen zijn gegroepeerd in batches zodat de resterende implementatie gefaseerd kan worden opgepakt.

## Overzicht

| Batch | Module | Probleem | Status |
| --- | --- | --- | --- |
| 1 | `mr-dj-eds-components/src/components/src/components/App.jsx` | Bestond enkel uit ruwe import-instructies zonder renderende component. | ✅ Uitgewerkt |
| 1 | `mr-dj-eds-components/src/components/src/App.jsx` | Beschreef mondeling hoe Hotjar moest worden toegevoegd maar bevatte geen uitvoerbare wrapper. | ✅ Uitgewerkt |
| 1 | `mr-dj-eds-components/src/components/Layout.jsx or App.jsx` | Alleen commentaar met instructie om WhatsApp-chat te plaatsen. | ✅ Uitgewerkt |
| 1 | `mr-dj-eds-components/src/components/In your App.jsx` | Enkel een codeblok met advies over BookingNotification. | ✅ Uitgewerkt |
| 1 | `mr-dj-eds-components/src/components/layouts/MainLayout.jsx` | Layout had geen export of JSX-structuur. | ✅ Uitgewerkt |
| 2 | `mr-dj-eds-components/src/components/src/pages/index.jsx` | Plaatste los component in bestand zonder export of page-structuur. | ⚪ Te doen |
| 2 | `mr-dj-eds-components/src/components/pages/transformations.jsx` | Page-template zonder export waardoor hij onbruikbaar is. | ⚪ Te doen |

## Batch details

### Batch 1 – App-integratie scaffolds (✅ voltooid)
In deze batch zijn alle instructieve fragmenten rondom de app-shell omgezet naar echte React-componenten:

- `GeneratedAppShell` assembleert header, footer, sticky CTA, WhatsApp-chat en realtime bookings binnen één samenhangende layout.
- `AppWithHeatmap` levert een configureerbare wrapper voor Hotjar-tracking met optionele fallback.
- `LayoutWithLiveSupport` en `AppWithBookingNotifications` maken het eenvoudig om overlays conditioneel te activeren.
- `MainLayout` verzorgt de gedeelde chroming met transparantie-optie voor de header.

### Batch 2 – Pagina-templates (⚪ gepland)
Bevat de resterende pagina-bestanden die nog uitgewerkt moeten worden tot volwaardige React-pagina's. Deze batch is nog niet opgepakt.

