# Setup & Operatie

1. **Dependencies**
   - Node.js >= 20, Python >= 3.11.
   - Redis 7 lokaal (`brew install redis`).
   - FFmpeg + ImageMagick voor media pipelines.

2. **Directory structuur**
```
/opt/ai-content/
  agents/            # runtime code (zie deze repo)
  input/             # sitemap, analytics, briefs
  output/
    text/
    images/
    video/
  logs/              # JSONL audit + agent logs
  prompts/           # gedeelde prompt templates
```

3. **Environment**
Plaats `.env` in `/opt/ai-content/` met minimaal:
```
OPENROUTER_API_KEY=...
REPLICATE_API_TOKEN=...
VIDEO_API_KEY=...
GA4_KEYFILE=/opt/ga/credentials.json
REDIS_URL=redis://127.0.0.1:6379/5
```

4. **Starten**
```
# Redis
redis-server --daemonize yes

# Agents (voorbeeld)
NODE_ENV=production node agents/audit/index.js
pnpm --filter visuals-agent start
poetry run uvicorn video_agent.app:app --host 0.0.0.0 --port 4015
```

5. **Monitoring**
- Gebruik TelemetryAgent dashboards (Grafana op `http://localhost:4020`).
- Logs roteren dagelijks via `logrotate` config in `config/logrotate.conf` (nog te creëren).

6. **Security**
- Secrets uitsluitend via Vault-agent of `.env` met 600 permissies.
- Alle uitgaande AI-calls gelogd (`logs/llm/*.jsonl`).
- Human review required voordat PublisherAgent live publiceert (Slack notification met diff).
