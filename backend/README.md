# Mister DJ Backend API

This service exposes the API and partner integrations that power the Mr. DJ marketing site. It is a Node.js/Express application with background queues for RentGuy and Sevensa automations.

## Prerequisites

- Node.js 18+
- npm 10+
- Access to Postgres and Redis instances
- Production secrets stored in the central secret manager (mirrored to `managed.env` during deployment)

## Environment configuration

Copy `.env.example` and `managed.env.example` to their real counterparts before starting the service. The backend loads `managed.env` first, followed by `.env`, so values that must remain under secret management (database credentials, API keys, webhook secrets) should live in `managed.env` while developer friendly defaults can stay inside `.env`.

After populating the files, run the built-in validator to confirm every required variable passes the Joi schema in `src/config.js`:

```bash
npm install
npm test
```

When running integration tests or the FastAPI app locally you will also need Postgres and Redis available. The unit tests rely on mocks and do not hit live services when the configuration validator succeeds.
