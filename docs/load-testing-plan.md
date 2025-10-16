# Load Testing Plan – 1000 Concurrents

Gebruik dit plan voor FINAL8. Het k6-script staat in `scripts/load-test/k6-bookings.js`.

## Voorbereiding
1. Installeer k6: `brew install k6` of `choco install k6`.
2. Zorg voor een aparte staging-omgeving met representatieve data.
3. Zet RentGuy integratie in sandbox-modus en controleer queue.

## Uitvoering
```bash
BASE_URL=https://staging.sevensa.nl k6 run scripts/load-test/k6-bookings.js
```
- Observeer tijdens de run `docker stats` op de VPS.
- Monitor Postgres (`SELECT * FROM pg_stat_activity;`) voor locks/timeouts.

## Acceptatiecriteria
- 95p latency < 750ms.
- Foutpercentage < 1%.
- RentGuy queue blijft < 10 na test (flush via dashboard indien nodig).

## Rapportage
| Datum | Omgeving | 95p (ms) | Error rate | Queue na test | Notities |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Voeg k6-output (JSON of HTML) toe aan `docs/test-reports/`.
