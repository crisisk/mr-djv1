# RankerAgent

- **Service**: Node.js (Express) API op `localhost:4013`.
- **Doel**: Scoret varianten op keyword coverage, heading-structuur, readability en schema.
- **Methodes**:
  - TF-IDF + intent tags (uit brief).
  - Schema validator (microdata/JSON-LD) + MDX diffing.
  - Merge prompt voor synthese indien scoreverschil < 5%.
- **Output**: `output/text/final_<slug>.html` + scorecard in `logs/ranker/<slug>.json`.
