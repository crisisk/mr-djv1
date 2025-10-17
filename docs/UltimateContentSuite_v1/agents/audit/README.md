# ContentAuditAgent

- **Service**: Node.js (Fastify) job runner op `localhost:4010`.
- **Taken**:
  1. Parse `input/pages.json` en sitemap endpoints.
  2. Haal GA4/GSC data op via service-account (`GA4_KEYFILE`).
  3. Bereken contentgaten (lage CTR, ontbrekende schema, dunne content) en schrijf `input/gaps.json`.
- **Queue**: Luistert op Redis kanaal `audit.jobs`. Output events gepushed naar `brief.queue`.
- **Artifacts**: detailrapporten per URL in `/opt/ai-content/logs/audit/*.json`.
