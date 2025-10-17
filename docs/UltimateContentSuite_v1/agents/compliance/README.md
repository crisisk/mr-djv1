# ComplianceAgent

- **Service**: Python (FastAPI) op `localhost:4016`.
- **Checks**:
  - SEO: meta, schema, keyword density.
  - Brand/legal: verboden claims, tone-of-voice.
  - Accessibility: axe-core, WCAG kleurencontrast, ondertiteling.
- **Output**: `logs/compliance_<slug>.json` + status events naar `publisher.queue`.
- **Escalaties**: Slack webhook + human-in-the-loop notificatie voor Chris.
