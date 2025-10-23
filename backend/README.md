# Mister DJ Backend API

This service exposes the API and partner integrations that power the Mr. DJ marketing site. It is a Node.js/Express application with background queues for RentGuy and Sevensa automations.

## Prerequisites

- Node.js 18+
- npm 10+
- Access to Postgres and Redis instances
- Production secrets stored in the central secret manager (mirrored to `managed.env` during deployment)

## Environment configuration

1. Copy the provided samples and tailor them for the environment:

   ```bash
   cd backend
   cp .env.sample .env
   cp managed.env.sample managed.env
   ```

2. Update both files with the credentials that apply to your environment. The samples list every variable that is validated by `src/config.js` so the application can boot without tripping the Joi schema.
3. When running in production, populate the real secrets through the platform secret store and ensure the CI pipeline writes the decrypted values to `managed.env` before starting the server.

## Installing dependencies

```bash
npm install
```

## Running the API locally

```bash
npm run dev
```

The service boots on `http://localhost:3000` by default. Configure `VITE_API_BASE_URL` in the frontend to point to the same origin when testing locally.

## Testing

The backend uses Jest for its unit and integration coverage.

```bash
npm test
```

To execute a single suite:

```bash
npm test -- availability
```

## Key integrations

- **RentGuy** – proxy and queue used for bookings, leads, and personalization sync.
- **Sevensa** – webhook submissions for availability checks, contact requests, and feedback flows.
- **Consent telemetry** – endpoints surface analytics-friendly events so GTM/GA4 can reflect customer intent without leaking personal data.

Ensure the associated environment variables are configured before enabling each integration flag; otherwise, the durable queues will fall back to safe queuing behaviour until the credentials are available.
