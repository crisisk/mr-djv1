# TelemetryAgent

- **Service**: Python (FastAPI) op `localhost:4018` met scheduler (Celery beat).
- **Bronnen**:
  - GA4 (events, conversies) via `GA4_KEYFILE`.
  - GSC (CTR, positie).
  - HubSpot/RentGuy API voor lead status.
- **Taken**:
  - Schrijf KPI snapshots naar SQLite (`database/telemetry.db`).
  - Detecteer dalende content → push nieuw audit-job naar `audit.queue`.
  - Publiceer rapportages in dashboard (`docs/telemetry/*.md`).
