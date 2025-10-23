# Backend Overview

## CBAM Classifier Endpoint

The FastAPI application exposes a private endpoint at `POST /internal/classify` which triggers shipment classification and links emission defaults. The handler pulls the shipment from Postgres, calls `packages.emissions_linker.classify_and_link`, and returns the resulting metadata.

The classifier relies on database views and tables defined in `ops/migrations/`.

## Environment configuration

Copy `.env.example` and `managed.env.example` to their real counterparts before starting the service. The backend loads `managed.env` first, followed by `.env`, so values that must remain under secret management (database credentials, API keys, webhook secrets) should live in `managed.env` while developer friendly defaults can stay inside `.env`.

After populating the files, run the built-in validator to confirm every required variable passes the Joi schema in `src/config.js`:

```bash
npm install
npm test
```

When running integration tests or the FastAPI app locally you will also need Postgres and Redis available. The unit tests rely on mocks and do not hit live services when the configuration validator succeeds.
