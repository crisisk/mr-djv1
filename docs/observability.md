# Observability Metrics Enhancements

## Request Tagging

The `/api/metrics/queues` endpoint now tags each upstream service call with the
following attributes:

- **service** – Logical name of the dependency that was invoked (for example,
  `rentguy` or `sevensa`).
- **latencyMs** – Duration of the request measured in milliseconds. Latencies
  are captured using `process.hrtime.bigint()` to provide millisecond precision.

These tags are forwarded to the observability service so that the metrics layer
can bucket request performance per downstream dependency.

## Aggregated Request Metrics

`observabilityService` aggregates latency measurements by their tag set. For
each unique combination of tags the service stores:

- **count** – Total number of calls observed for the tag.
- **averageLatencyMs** – Rolling average latency for the tag.
- **minLatencyMs / maxLatencyMs** – Fastest and slowest latencies seen for the
  tag.

The aggregated snapshot is exposed through
`observabilityService.getRequestMetricsSummary()` and appended to the
`/api/metrics/queues` response under `requestMetrics`.

Use these metrics to identify slow downstream dependencies and to compare
performance across services.
