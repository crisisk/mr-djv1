# Backend Overview

## CBAM Classifier Endpoint

The FastAPI application exposes a private endpoint at `POST /internal/classify` which triggers shipment classification and links emission defaults. The handler pulls the shipment from Postgres, calls `packages.emissions_linker.classify_and_link`, and returns the resulting metadata.

The classifier relies on database views and tables defined in `ops/migrations/`.

## Running tests

```bash
cd backend
pytest
```

Ensure a Postgres instance is available when exercising the classifier end-to-end. The unit tests mock the database layer and do not require a live connection.
