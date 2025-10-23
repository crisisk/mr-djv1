# RentGuy Mock Server for Local & CI Testing

The RentGuy mock server reproduces the minimum set of endpoints that the Mister DJ backend uses when synchronising leads, bookings and personalisation events. It removes the dependency on the real RentGuy infrastructure so that end-to-end flows can be validated locally, in CI, and during demos.

## Features

- Enforces the same Bearer token and optional `X-RentGuy-Workspace` header that production expects.
- Captures received payloads so that tests can assert on booking/lead delivery.
- Exposes `/status` and `/deliveries` endpoints to inspect the in-memory queue.
- Supports failure simulations through the `X-RentGuy-Simulate` header (`rate-limit`, `server-error`, `auth-error`).

## Getting Started

1. Copy the sample environment configuration and adjust it for your machine:

   ```bash
   cd backend
   cp .env.example .env
   cp managed.env.example managed.env
   ```

2. Start the mock service in a separate terminal:

   ```bash
   npm run rentguy:mock
   ```

   By default the server listens on `http://127.0.0.1:5050`. Override the host/port through `RENTGUY_MOCK_HOST` and `RENTGUY_MOCK_PORT`.

3. Run the backend (or Cypress tests) with the same API key and workspace ID configured in `.env`.

## Validating the Integration

- **Smoke test** – send a booking payload:

  ```bash
  curl -i \
    -H "Authorization: Bearer mock-api-key" \
    -H "X-RentGuy-Workspace: workspace-1" \
    -H "Content-Type: application/json" \
    -d '{"id":"demo","status":"pending"}' \
    http://127.0.0.1:5050/bookings
  ```

- **Inspect deliveries** – request `GET /deliveries` with the same headers to view all stored messages.
- **Simulate incidents** – add `X-RentGuy-Simulate: rate-limit` to force a `429` response and confirm retry behaviour.

## Continuous Integration

The mock server runs entirely in-memory and does not require a database. In CI pipelines it can be launched as a background process before executing the backend or Cypress suites:

```bash
RENTGUY_MOCK_API_KEY=ci-mock-key npm run rentguy:mock &
MOCK_PID=$!
# execute tests that rely on RentGuy endpoints
npm test
kill $MOCK_PID
```

For deterministic assertions you can poll `GET /status` to ensure the expected number of deliveries have been processed.

## Maintenance Notes

- Update `backend/.env.example` and `backend/managed.env.example` whenever new RentGuy-related environment variables are introduced.
- Keep the simulation modes in sync with the failure cases covered inside `backend/src/services/rentGuyService.js`.
- The mock stores data in memory only. Restart the process to reset the state or call `POST /reset`.
