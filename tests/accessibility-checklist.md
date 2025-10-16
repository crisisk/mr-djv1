# WCAG 2.1 AA Audit Checklist

Gebruik deze lijst voor FINAL5. Combineer met Axe DevTools of `npx @axe-core/cli`.

## Tools
- Axe DevTools (browser extension) of `npx @axe-core/cli https://staging.sevensa.nl`
- Screen reader: VoiceOver (macOS) / NVDA (Windows)
- Keyboard-only testing

## Controlestappen
| # | Onderdeel | Beschrijving | Status | Notities |
| --- | --- | --- | --- | --- |
| 1 | Semantische headings | Controleer H1–H3 structuur op alle pagina's |  |  |
| 2 | Alternative text | Afbeeldingen bevatten betekenisvolle `alt` |  |  |
| 3 | Focus states | Tab volgorde logisch, zichtbare focus ring |  |  |
| 4 | Form labels | `label` gekoppeld, aria-describedby voor errors |  |  |
| 5 | Contrast | Gebruik `npx @axe-core/cli` of contrast checker |  |  |
| 6 | Keyboard traps | Geen traps in modals (ConsentManager) |  |  |
| 7 | ARIA live regio's | Toast/feedback componenten hebben `aria-live` |  |  |
| 8 | Media alternatives | Video heeft tekstuele context, autoplay zonder geluid |  |  |
| 9 | Dynamic content | RentGuy statuskaart is bereikbaar met toetsenbord |  |  |
| 10 | Screen reader | Lees homepage + pricing met VoiceOver |  |  |

## Rapportage
| Datum | Audit tool | Issues gevonden | Oplossing | Ticket |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
