# Pingdom & Uptime Robot Configuration

This document captures the agreed monitoring checks, alert thresholds, and notification routing for external availability monitoring.

## Monitoring Targets

| Service | URL | Type |
|---------|-----|------|
| Public marketing site | https://mr-dj.sevensa.nl | HTTPS | 
| API health endpoint | https://mr-dj.sevensa.nl/api/health | HTTPS |
| Status page heartbeat | https://status.mr-dj.sevensa.nl/heartbeat | HTTPS |

## Alert Thresholds

The following thresholds are shared between Pingdom and Uptime Robot to keep parity between providers:

- **Downtime detection:** trigger an alert after **2 consecutive failures** with a 1-minute polling interval.
- **Response time SLA:** alert when the average response time over the last 5 minutes exceeds **2000 ms**.
- **Content validation:** ensure the string `OK` is present in the response body for `/api/health`.
- **SSL expiry warning:** notify when certificates have **30 days or fewer** remaining.

## Escalation & Notifications

Both platforms send alerts to the same destinations:

1. **Primary:** Slack channel `#mr-dj-alerts` using the webhook `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`.
2. **Secondary:** Email distribution list `ops-alerts@mr-dj.com` (immediate delivery).
3. **Tertiary:** SMS to the on-call rotation via Pingdom's contact routing (Uptime Robot relies on Slack/email).

## Pingdom Setup Steps

1. Create three checks (site, API, status heartbeat) with the endpoints above.
2. Set the "Alert when down" condition to **2 consecutive failures**.
3. Enable response time alerts with a 2000 ms threshold and 5-minute evaluation period.
4. Configure the Slack channel as a webhook integration and assign it to all checks.
5. Add the `ops-alerts@mr-dj.com` contact as a primary recipient.
6. For the API check, add the response content rule `OK`.
7. Enable SSL certificate expiration alerts at 30 days for all HTTPS checks.

## Uptime Robot Setup Steps

1. Add the same three monitors as **HTTPS monitors** with the same URLs.
2. Set the monitoring interval to **1 minute** and the alert trigger to **2 consecutive failures**.
3. Enable **Advanced Alert Contacts**: Slack webhook and `ops-alerts@mr-dj.com`.
4. Add a keyword monitoring rule for the `/api/health` endpoint to confirm the presence of `OK`.
5. Configure maintenance windows (Sundays 02:00–03:00 UTC) to suppress alerts during planned downtime.

## Ongoing Maintenance

- Verify webhook delivery quarterly.
- Rotate Slack webhooks when team membership changes.
- Update the escalation list whenever the on-call roster is updated.
- Document any monitor additions/removals in the change log (`docs/monitoring/CHANGELOG.md`).
