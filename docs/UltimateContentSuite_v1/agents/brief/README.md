# BriefingAgent

- **Service**: Node.js worker (BullMQ) op `localhost:4011`.
- **Input**: `input/gaps.json`.
- **Output**: `input/brief_<slug>.json` + dispatch op `writer.queue`.
- **Functionaliteit**:
  - Template prompts ophalen uit `prompts/briefing.md`.
  - Segmentatie per persona/regio.
  - SLA: <2 minuten per batch van 10 URL's.
