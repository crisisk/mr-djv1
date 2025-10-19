# VideoAgent

- **Service**: Node.js (NestJS) op `localhost:4015`.
- **Workflow**:
  1. Script genereren uit brief via `prompts/video_script.md`.
  2. Storyboard (6–10 scènes) + shotlist.
  3. Visuals ophalen bij VisualsAgent of genereren via FLUX frames.
  4. Voice-over via TTS (NL) met `VIDEO_API_KEY`.
  5. Render compositie (ffmpeg) → export `output/video/<slug>_hero.mp4` + captions.
- **Queues**: `video.jobs`, `video.render`. Fallback mechanisme met retries en dead-letter.
