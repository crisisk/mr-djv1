# Continuous Integration Pipeline

The repository includes a GitHub Actions workflow defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). The pipeline runs on every push to the `main` branch and on all pull requests. It executes two independent jobs:

- **Backend Tests and Lint** – installs backend dependencies, optionally runs the backend linter, and executes the Jest test suite.
- **Frontend Tests and Lint** – installs frontend dependencies, runs ESLint, and executes the frontend `npm test` script.

## Required Environment Variables

The CI workflow injects a small set of environment variables so that configuration helpers and integration clients have predictable defaults during automated runs. Update the values in the workflow file if different defaults are required.

| Variable | Applied job(s) | Purpose | Example value |
| --- | --- | --- | --- |
| `CI` | Backend, Frontend | Ensures tooling (npm, Jest, etc.) run in continuous integration mode. | `true` |
| `DATABASE_URL` | Backend | Allows the database helper to initialise without throwing when a connection string is required. | `postgres://example.com/mrdj` |
| `REDIS_URL` | Backend | Provides a placeholder Redis connection string for queue helpers. | `redis://localhost:6379` |
| `RENTGUY_API_BASE_URL` | Backend | Supplies a stub endpoint so RentGuy integration logic can initialise. | `https://api.example.com` |
| `RENTGUY_API_KEY` | Backend | Dummy credential for RentGuy integration tests. | `test-api-key` |
| `RENTGUY_WORKSPACE_ID` | Backend | Dummy workspace identifier required by the RentGuy client. | `workspace-1` |

> **Note:** The frontend job only needs `CI=true`. Additional environment variables can be added directly inside the `frontend` job if future scripts require them.
