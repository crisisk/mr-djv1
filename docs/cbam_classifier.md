# CBAM Classifier Integration

This document describes the data structures and background jobs that support the CBAM (Carbon Border Adjustment Mechanism) workflow.

## Database additions

- Canonical views `v_taric_nomenclature`, `v_taric_measures`, and `v_hs_codes` normalise TARIC and HS sources.
- Table `bti_rulings` stores Binding Tariff Information with precedence ordering.
- Helper function `is_valid_on` ensures date range checks remain consistent across all queries.
- Materialised view `mv_hs_taric_today` caches the currently valid HS→TARIC mapping. A daily refresh job is available in `ops/jobs/refresh_mv_hs_taric_today.sql`.
- `cbam_report_drafts` now stores HS/TARIC metadata alongside emission intensity snapshots.
- `shipment_classifications` preserves the historical classification decisions for auditing.

## Python packages

`packages/classifier` contains:

- `types.py` with the Pydantic models `ClassificationContext` and `ClassificationResult`.
- `resolver.py` which orchestrates precedence between rulings, TARIC measures, and HS fallbacks.
- `repo.py` with reusable SQL helpers to query rulings, TARIC candidates, emission defaults, and to persist snapshots.
- `rules.py` defining precedence helpers and ambiguity handling.

`packages/emissions_linker` provides `classify_and_link` which calls the classifier, retrieves emission defaults, and keeps `cbam_report_drafts` in sync.

## API endpoint

`POST /internal/classify` triggers reclassification and returns the latest HS/TARIC decision together with the emission intensity source. It reuses the shared classifier and linker modules so it stays aligned with the ETL workflow.

## Testing

Unit tests covering the resolver precedence rules live in `backend/tests/test_classifier_resolver.py`. Run `pytest` from the `backend/` directory to execute them.
