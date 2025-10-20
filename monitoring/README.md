# Monitoring Stack

This directory contains the Prometheus + Grafana stack definitions for infrastructure observability.

## Components

- **Prometheus** – scrapes metrics from nginx, Node.js backend, PostgreSQL, and Redis exporters.
- **Grafana** – provides pre-built dashboards and alerting (initial admin user `admin/changeme`).
- **nginx-exporter** – scrapes the frontend nginx status endpoint at `/nginx_status` (enable `stub_status` in nginx.conf).
- **node-exporter** – exposes host/system metrics for the Docker host.
- **postgres-exporter** – reports PostgreSQL statistics using the app credentials.
- **redis-exporter** – emits Redis cache metrics.

## Usage

```bash
docker network create web   # if not already created
docker compose -f docker-compose.yml -f monitoring/docker-compose.monitoring.yml up -d prometheus grafana
```

## Requirements

1. The frontend nginx container must expose `stub_status` at `/nginx_status`.
2. The backend must expose Prometheus metrics on port **9464** at `/metrics`.
3. Postgres and Redis credentials should match those defined in `docker-compose.yml`.

## Grafana Provisioning

- Dashboards are loaded from `grafana/dashboards/`.
- Datasources are configured via `grafana/provisioning/datasources/datasource.yml`.
- Update dashboard JSON files and bump the `version` field to trigger refresh.

## Alerting

Configure Grafana alert rules once the stack is running:

1. Create a contact point for Slack (`#mr-dj-alerts`).
2. Add an email contact point for `ops-alerts@mr-dj.com`.
3. Import or create alert rules targeting the Prometheus datasource (e.g., API latency p95 > 1.5s for 5m).

Document custom alert rules in `docs/monitoring/alert-rules.md`.
