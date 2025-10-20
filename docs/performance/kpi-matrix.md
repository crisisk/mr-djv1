# KPI Matrix – Mister DJ Platform

Deze KPI-matrix biedt een eenduidig referentiepunt voor engineering, product en operations. Gebruik de tabel als bron voor dashboards, alerts en kwartaalreviews. Alle drempels zijn afgestemd op de huidige schaal van Mister DJ en worden minimaal ieder kwartaal geëvalueerd.

| KPI | Beschrijving | Formule | Doelwaarde | Alert drempels | Owner(s) | Bron(nen) |
| --- | --- | --- | --- | --- | --- | --- |
| Lead → boeking conversie | Meet of marketing- en salesfunnels leads omzetten naar betaalde boekingen. | `(betalende boekingen ÷ gekwalificeerde leads) × 100%` (rolling 30 dagen) | ≥ 32 % | Waarschuwing < 28 %; Kritiek < 24 % | Product (Leonie van Dam) & Sales Ops (Rico Jansen) | CRM dashboard (RentGuy) + `bookingService` event stream |
| Gem. reactietijd op nieuwe lead | Bewaakt hoe snel het salesteam opvolgt; cruciaal voor conversie. | `gemiddelde(tijd_eerste_contact – timestamp_lead_ingang)` | ≤ 2 uur (09:00–21:00 CET) | Waarschuwing > 3 uur; Kritiek > 6 uur | Sales Ops (Rico Jansen) | RentGuy lead feed + n8n SLA tracker |
| Website beschikbaarheid | Beschrijft uptime van de publieke site en API. | `100% – (downtime_minuten ÷ totale_minuten) × 100%` (rolling 30 dagen) | ≥ 99.9 % | Waarschuwing < 99.5 %; Kritiek < 99.0 % | Engineering (Nadia Willems) | UptimeRobot + `/health` monitor |
| Queue backlog (RentGuy sync) | Houdt in de gaten of sync-jobs opstapelen. | `max(queue_backlog)` per uur | ≤ 25 jobs | Waarschuwing > 40; Kritiek > 60 | Engineering (Nadia Willems) | `/metrics/queues` endpoint (Grafana) |
| Retry-age p95 (RentGuy sync) | Meet de wachttijd voordat mislukte jobs opnieuw geprobeerd worden. | `p95(retry_age_ms)` per uur | ≤ 300000 ms (5 min) | Waarschuwing > 600000 ms; Kritiek > 900000 ms | Engineering (Nadia Willems) | `/metrics/queues` endpoint |
| Netto omzet per boeking | Controleert of pricing & upsells effectief blijven. | `totaal_omzet ÷ betalende_boekingen` | ≥ €1.850 | Waarschuwing < €1.700; Kritiek < €1.500 | Product (Leonie van Dam) & Finance (Hugo Smit) | Boekhoudexport + CRM |
| NPS (na event) | Beoordeelt klanttevredenheid direct na het event. | `(% promoters – % detractors)` per maand | ≥ 60 | Waarschuwing < 50; Kritiek < 35 | Product (Leonie van Dam) | Post-event survey (Typeform) |
| Net promoter response rate | Meet of voldoende klanten de NPS-survey invullen. | `(ingevulde surveys ÷ verstuurde surveys) × 100%` | ≥ 45 % | Waarschuwing < 35 %; Kritiek < 25 % | Product Ops (Jesse Koster) | Typeform + Mailgun log |
| Cashflow runway | Houdt controle op liquide middelen vs. uitgaven. | `(beschikbaar kasgeld ÷ gemiddelde maandlasten)` in maanden | ≥ 6 maanden | Waarschuwing < 4; Kritiek < 3 | Finance (Hugo Smit) | Financieel dashboard |
| SLA tickets resolutie (P1) | Zorgt dat kritieke incidenten tijdig worden opgelost. | `gemiddelde oplostijd P1 tickets` (rolling 90 dagen) | ≤ 4 uur | Waarschuwing > 6 uur; Kritiek > 12 uur | Engineering (Incident commander rota) | Incident board (Linear) |

## Governance & werkwijze

1. **Maandelijkse review** – Engineering en Product bespreken KPI’s in de gecombineerde operations sync; afwijkingen <span title="Critical alert threshold">onder de kritieke drempel</span> triggeren een hotfix- of runbookactie.
2. **Alerting** – Configureer Slack/Teams webhooks volgens het [Observability playbook](../operations/observability_playbook.md) met de hierboven genoemde grenswaarden.
3. **Wijzigingsbeheer** – Elke update aan doelen of drempels vereist akkoord van Engineering (Nadia), Product (Leonie) en Finance (Hugo) en wordt vastgelegd in `docs/performance/kpi-matrix.md` via PR.
4. **Dashboards** – Grafana (technische KPI’s) en HubSpot/RentGuy dashboards (commerciële KPI’s) gebruiken deze matrix als bron. Operations controleert de volledigheid tijdens de vrijdag-check-in.

> 💡 **Tip**: combineer deze matrix met `docs/performance.md` voor historische context en lopende optimalisaties.
