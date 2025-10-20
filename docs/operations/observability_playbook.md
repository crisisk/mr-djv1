# Observability & Alerting Playbook

Deze playbook beschrijft hoe de nieuwe queue-metrics, OTEL-telemetrie en webhook-alerting worden beheerd voor een productieklare Mister DJ stack.

## 0. Feature flags beheren

Beheer de runtime toggles via de **Feature flags** tab in het configuratiedashboard. De waarden worden opgeslagen in `managed.env`
en kunnen indien nodig worden geforceerd met `FLAG_*` omgevingsvariabelen.

- `FLAG_PERSONALIZATION` – schakelt de personalisatie-API’s en webhook endpoints in.
- `FLAG_RENTGUY_INTEGRATION` – activeert queueverwerking richting de RentGuy CRM.
- `FLAG_SEVENSA_INTEGRATION` – schakelt de Sevensa submit queue en export endpoints in.
- `FLAG_TELEMETRY` – maakt OTEL-tracing en metrics mogelijk zolang de overige OTEL variabelen geconfigureerd zijn.

## 1. Telemetrie-bootstrap

1. Stel de volgende variabelen in via het configuratiedashboard of de `managed.env` store:
   - `FLAG_TELEMETRY=on`
   - `OTEL_ENABLED=true`
   - `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://otel-gateway.example.com/v1/traces`
   - `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=https://otel-gateway.example.com/v1/metrics`
2. Herstart de backend service. Tijdens bootstrapping schrijft `lib/telemetry` naar de OTEL endpoint en instrumenteert HTTP, queue workers en database drivers automatisch.
3. Verifieer in Grafana/Tempo dat service- en queue traces binnenkomen met de velden `service.name=mr-dj-backend` en `deployment.environment` gelijk aan de actieve omgeving.

## 2. Webhook alerts (Slack/Teams)

1. Voeg één of meerdere webhook URL’s toe in `ALERT_WEBHOOK_URLS` (komma-gescheiden). Ondersteund zijn o.a. Slack, Discord, MS Teams en generieke JSON webhooks.
2. Optioneel: pas drempelwaardes aan via
   - `ALERT_QUEUE_WARNING_BACKLOG` / `ALERT_QUEUE_CRITICAL_BACKLOG`
   - `ALERT_QUEUE_WARNING_RETRY_AGE_MS` / `ALERT_QUEUE_CRITICAL_RETRY_AGE_MS`
   - `ALERT_QUEUE_DEAD_LETTER_WARNING`
   - `ALERT_THROTTLE_MS` voor rate limiting (standaard 2 minuten)
3. Een alert bevat altijd `queue`, `severity`, backlog en retry-age beschrijvingen. Dead-letter alerts worden maximaal eens per throttle window verstuurd om spam te voorkomen.

## 3. Dashboards en metrics endpoints

- **API endpoint**: `GET /metrics/queues` geeft de actuele status van RentGuy- en Sevensa-queues terug met backlog, actieve jobs, retry-age en dead-letter tellingen. Gebruik dit endpoint voor Grafana JSON data-sources of health-checks.
- **Dashboard kaart**: het configuratiedashboard toont dezelfde data en refresht na elke handmatige flush.
- **Grafana**: Combineer OTEL metrics (queue depth, job latency) met webhook events voor correlatie tijdens incidenten.

## 4. Severity & response model

| Severity | Verwachte reactie | Acknowledge tijdlijn | Escalatie & DR-rollen |
| --- | --- | --- | --- |
| **Warning** | First responder verifieert of het een vals-positief is en start mitigatie met beperkte impact. | Binnen 5 minuten door de primaire on-call engineer. | Escaleer naar **Ops Engineer** (standaard on-call Slack groep `#oncall-ops`). DR-plan blijft standby; meld Incident Commander alleen indien impact zich uitbreidt. |
| **Critical** | Activeer mitigatie direct, schakel services om of beperk verkeer. | Binnen 2 minuten door de primaire on-call. Binnen 10 minuten moet een Incident Commander aangewezen zijn. | Informeer **Incident Commander (DR lead)** en **Communications Lead** via `#dr-war-room` en bel-scenario in de DR-call tree. Start formele DR-bridge wanneer SLO-violatie > 10 min dreigt. |

**Escalatie contacten**

- **Incident Commander (DR Lead):** bereikbaar via `+31-20-555-0100`, Slack handle `@ic-oncall`. Back-up: `@ic-backup`.
- **Operations Engineer rota:** beheer via PagerDuty service *mr-dj-prod*. Slack notificaties landen in `#oncall-ops`.
- **Communications Lead:** gebruik `@comms-duty` voor externe updates en statuspagina.
- **Product Owner:** `@po-duty` wordt door de Incident Commander betrokken bij klant-impact > 30 minuten.

## 5. On-call tooling & DR activatie

1. **Slack routing:**
   - Alerts sturen standaard naar `#alerts-queues`. Voeg in `ALERT_WEBHOOK_URLS` het Slack webhook kanaal toe voor escalatie `#dr-war-room` voor critical alerts door `ALERT_SEVERITY_ROUTE=critical:#dr-war-room` in de backend configuratie.
   - Gebruik Slack workflow *Create DR Bridge* om automatisch een huddle, notitie-document en incident channel aan te maken.
2. **Ticketcreatie:**
   - Critical alerts moeten automatisch een ticket openen in Jira project **OPS** via de webhook-integratie `ALERT_JIRA_ENDPOINT`. Warning alerts creëren alleen een ticket indien na 15 minuten nog actief.
   - Vermeld in tickets: queue naam, alert payload, eerste responder, verwachte resolutietijd.
3. **DR-plan triggeren:**
   - Activeer het DR-plan wanneer een critical alert > 10 minuten aanhoudt, wanneer meerdere queues simultaan falen, of wanneer OTEL-blindheid de root-cause analyse blokkeert.
   - Incident Commander valideert dat het DR-runbook `docs/disaster_recovery/activation.md` wordt gevolgd en stelt communicatiecadans (minimaal elke 15 minuten update) in.

## 6. Runbooks

| Incident | Symptoom | Actie |
| --- | --- | --- |
| **Backlog Warning** | Slack melding `queue thresholds exceeded` (severity `warning`) | Controleer secrets / upstream API. Gebruik `/dashboard` → *Queue flushen* voor gefaalde jobs. |
| **Backlog Critical** | Severity `critical` of `retry_age` meldingen | Schakel `QUEUE_REDIS_ENABLED=false` feature flag terug om tijdelijk naar in-memory fallback te gaan. Controleer Redis status en herstart workers. |
| **Dead-letter Alert** | Slack melding `Job moved to dead-letter queue` | Gebruik `POST /integrations/<queue>/deadletter/replay` (of dashboard actie) om jobs terug te zetten na fix. |
| **OTEL stil** | Geen nieuwe traces binnen 5 min | Controleer netwerk ACLs en `OTEL_ENABLED`. Herstart backend en valideer logs `Telemetry initialized`. |

## 7. Post-alert checklist

1. Verzamel relevante logs (queue worker, backend API, Redis) en upload naar het incident dossier (`/share/incidents/<incident-id>`).
2. Documenteer tijdlijn, beslissingen en resterende risico’s in het incident notitie-template (Notion pagina *Ops Incident Log*).
3. Bevestig dat alerts zijn genormaliseerd (geen nieuwe events gedurende minimaal 10 minuten) en dat tickets naar *Resolved* worden gezet met eindoorzaak.
4. Werk de statuspagina en klantencommunicatie bij met de slotupdate.
5. Incident Commander declareert *resolved* nadat alle acties geverifieerd zijn en de post-mortem datum is ingepland.

## 8. Validatie checklist

- [ ] Redis cluster bereikbaar (`redis-cli -u $REDIS_URL ping`).
- [ ] `npm test` en `pnpm lint` (mr-dj-eds-components) draaien clean.
- [ ] `/metrics/queues` geeft backlog < kritieke drempels.
- [ ] Handmatige chaos test: kill backend process, service herstart en queue hervat jobs zonder verlies.
- [ ] Slack/Teams ontvangt testmelding via `curl -XPOST $ALERT_WEBHOOK_URL -d '{"type":"smoke","message":"alert-test"}'`.

Met deze stappen is de observability-keten volledig operationeel en dragen queue alerts en OTEL-tracing bij aan de 100% production readiness status.
