# Observability Dashboard Setup

This directory contains the shared Grafana dashboard configuration used to monitor the Mister DJ backend services.

## Prerequisites

- Grafana instance with access to the Prometheus data source that scrapes the Mister DJ backend metrics.
- Permission to create dashboards within the target Grafana organization/folder.

## Importing the Dashboard

1. Sign in to Grafana and navigate to **Dashboards → New → Import**.
2. Click **Upload JSON file** and select [`grafana.json`](./grafana.json) from this directory.
3. When prompted:
   - Choose the destination folder (for example, `Mister DJ / Backend`).
   - Map the **Prometheus** data source field to the Prometheus instance that holds the backend metrics.
4. Click **Import** to create the dashboard.

The dashboard is titled **"Backend Service Metrics"** and includes CPU, memory, request throughput, latency, and error indicators for the backend workload.

## Keeping the Dashboard in Sync

When changes are made to the dashboard in Grafana:

1. Export the updated dashboard JSON from Grafana using the **Share → Export** menu.
2. Replace the contents of [`grafana.json`](./grafana.json) with the new export.
3. Commit the changes to version control to make the update available to the wider team.
