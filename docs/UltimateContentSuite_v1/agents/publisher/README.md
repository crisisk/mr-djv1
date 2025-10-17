# PublisherAgent

- **Service**: Node.js (Express) op `localhost:4017`.
- **Functies**:
  - Combineer tekst/beeld/video tot publiceerbaar pakket.
  - CMS integraties: WordPress REST (`/wp-json/wp/v2/posts`) of Git commit (via `simple-git`).
  - Sitemap update + CDN cache invalidatie.
- **Fallback**: Plaatst content in `output/pending/*.json` met Slack alert indien publicatie faalt.
