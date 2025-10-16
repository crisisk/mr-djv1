# Ultimate Content Suite v1 (Interne Agentic Architectuur)

Deze map vertegenwoordigt de lokale implementatie van de agentic content-suite onder `/opt/ai-content/UltimateContentSuite_v1/`. De suite draait volledig intern en orkestreert contentproductie, QA en publicatie zonder externe workflowtools zoals n8n.

## Overzicht
- **Runtime**: Node.js services per agent (Express/Fastify) met Redis-queue (BullMQ) of Python FastAPI varianten waar dat beter past.
- **Message bus**: Lokale Redis instantie op `redis://127.0.0.1:6379/5` gebruikt voor event dispatch, retries en observability.
- **Persist**: Content en media via `/opt/ai-content/output`, audit- en agentsessies gelogd in `/opt/ai-content/logs`.
- **Secrets**: Ingeladen via `.env` of Vault-agent (zie `docs/setup.md`). Geen hardcoded API-keys.

## Agents
| Agent | Doel | IO-directory |
| --- | --- | --- |
| ContentAuditAgent | Crawlt sitemap, verzamelt GA4/GSC data en bepaalt content gaps. | `agents/audit/` |
| BriefingAgent | Zet gaps om naar gestructureerde contentbriefs per URL. | `agents/brief/` |
| WriterEnsembleAgent | Parallelle LLM-aanroepen via OpenRouter + lokale modellen. | `agents/writer/` |
| RankerAgent | Combineert/scoret varianten op SEO/CRO metrics. | `agents/ranker/` |
| VisualsAgent | Genereert hero visuals/icons via FLUX of lokaal model. | `agents/visuals/` |
| VideoAgent | Produceert korte explainers met script, TTS en compositing. | `agents/video/` |
| ComplianceAgent | SEO-, brand-, legal- en accessibility-controles. | `agents/compliance/` |
| PublisherAgent | Publiceert naar CMS API of Git commit. | `agents/publisher/` |
| TelemetryAgent | Monitort CTR, dwell time, rankings en start verbeterloops. | `agents/telemetry/` |

## Orchestratie
De flowdefinitie staat in `config/graph.yaml` en kan worden ingeladen in LangGraph of elk ander lokale orchestrator-framework. De agents communiceren via JSON payloads op de Redis queue en publiceren status updates naar `telemetry`.

## Prompts & Templates
Herbruikbare prompt-sjablonen, systeemberichten en instructies staan in `prompts/`. Elke agent heeft verwijzingen naar de relevante promptbestanden.

Meer implementatie-instructies in `docs/setup.md`.
