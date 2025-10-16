# Performance Audit Plan (Lighthouse ≥ 90)

Gebruik deze instructie om FINAL3 af te ronden.

## Tools
- Chrome DevTools Lighthouse (Desktop + Mobile)
- Alternatief: `npx lighthouse --config-path scripts/performance/lighthouse.config.cjs`

## Voorbereiding
1. `npm install --global lighthouse`
2. Zorg dat staging draait en geen andere tests lopen.
3. Activeer throttling profiel `Fast 3G` en CPU 4× slowdown.

## Checklist
| Stap | Actie | Resultaat |
| --- | --- | --- |
| 1 | Run Lighthouse Desktop op `/` | Score ≥ 90 op Performance, Accessibility, Best Practices, SEO |
| 2 | Run Lighthouse Mobile op `/` | Scores ≥ 90 |
| 3 | Run Lighthouse Desktop op `/pricing/` | Score ≥ 90 |
| 4 | Run Lighthouse Mobile op `/locaties/eindhoven` | Score ≥ 90 |
| 5 | Exporteer rapporten (HTML) | Opslaan in `docs/test-reports/lighthouse-<datum>.html` |
| 6 | Check CLS filmstrip | Geen layout shift > 0.1 |
| 7 | Controleer Opportunities | Documenteer verbeteringen in backlog |

## Rapportage
Gebruik `docs/test-reports/performance-summary.md` om resultaten samen te vatten.
