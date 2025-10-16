# VisualsAgent

- **Service**: Python (FastAPI) op `localhost:4014` met GPU-acceleratie.
- **Engines**: FLUX of lokaal diffusers-model; fallback naar Replicate API (`REPLICATE_API_TOKEN`).
- **Pipeline**:
  1. Prompt genereren vanuit brief (`prompts/visuals.md`).
  2. Render → optimaliseer (ImageMagick) → export `output/images/<slug>_hero.webp` (+ `@2x`).
  3. Schrijf metadata (`prompt`, `seed`, `model`) naar `logs/visuals/<slug>.json`.
