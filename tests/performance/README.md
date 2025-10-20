# k6 Performance Profiles

This directory stores k6 load-test scripts used in CI and scheduled runs.

## Baseline Profile (`baseline.js`)

- Exercises the public API health endpoint and the homepage concurrently.
- Thresholds:
  - `http_req_duration`: p95 < 800 ms
  - `http_req_failed`: failure rate < 1%
- Custom trend `frontend_time_to_first_byte` for tracking homepage TTFB.

## Running Locally

```bash
npm install --global k6
k6 run tests/performance/baseline.js
```

Set the following environment variables to target non-production environments:

- `BASE_URL` – overrides `https://mr-dj.sevensa.nl`
- `API_URL` – overrides `https://mr-dj.sevensa.nl/api/health`

Example:

```bash
BASE_URL=https://staging.mr-dj.sevensa.nl \
API_URL=https://staging.mr-dj.sevensa.nl/api/health \
k6 run tests/performance/baseline.js
```

## CI Integration

The GitHub Actions workflow `.github/workflows/performance.yml` runs the baseline profile weekly and on manual dispatch. Test results are uploaded as artifacts and summarized in the workflow logs.
