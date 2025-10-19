# WriterEnsembleAgent

- **Service**: Python FastAPI (uvicorn) op `localhost:4012` met async workers.
- **Taken**:
  - Batch prompts naar OpenRouter modellen (`gpt-4.1`, `claude-3.5-sonnet`, `qwen2.5-72b-instruct`, `deepseek-r1`).
  - Combineert antwoorden + metadata (`model`, `latency`, `cost_estimate`).
  - Slaat varianten op onder `/output/text/<slug>_<model>.json`.
- **Observability**: Traces naar `logs/writer/*.jsonl`, metrics via Prometheus endpoint `/metrics`.
