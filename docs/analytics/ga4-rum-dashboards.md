# GA4 Real User Monitoring (RUM) Dashboards

This guide documents how to enable GA4-based RUM dashboards with custom dimensions for **Page Group** and **Region**, providing visibility into performance across critical user journeys.

## 1. Enable Enhanced Measurement

1. In GA4, navigate to **Admin → Data Streams → Web → Enhanced Measurement**.
2. Ensure **Page views**, **Scrolls**, **Outbound clicks**, and **Site search** are enabled to enrich RUM context.

## 2. Define Custom Dimensions

Create the following event-scoped custom dimensions under **Admin → Custom Definitions**:

| Name | Event Parameter | Description |
|------|-----------------|-------------|
| Page Group | `page_group` | Logical grouping of pages (e.g., Home, Pricing, Contact). |
| Region | `region` | Geographic region derived from user selection or GeoIP fallback. |

Publish the changes so they become available for Explorations and the API.

## 3. Populate Parameters in GTM

1. Open the existing GA4 configuration tag in Google Tag Manager.
2. Add the following user-defined variables:
   - **JS Variable – Page Group**: `window.mrdj.pageGroup || 'unknown'`
   - **JS Variable – Region**: `window.mrdj.region || {{GeoIP Country}}`
3. Extend the GA4 event tags (page_view, custom engagement events) to include the parameters:

```json
{
  "page_group": {{JS - Page Group}},
  "region": {{JS - Region}}
}
```

4. Publish the GTM container and verify the parameters appear in GA4 DebugView.

## 4. BigQuery Export (Optional but Recommended)

- Enable **BigQuery linking** to store raw GA4 events in the `analytics_mrdj` dataset.
- Schedule a daily query to aggregate Core Web Vitals by `page_group` and `region` for long-term trend analysis.

## 5. Looker Studio RUM Dashboard

1. Create a new report using the GA4 data source.
2. Add the following key charts:
   - Scorecard: **Average LCP**, filtered by `page_group`.
   - Time series: **CLS over time** grouped by `region`.
   - Table: **Page group vs. Avg. TTFB**, sorted descending.
   - Heatmap: **Device category vs. Page group** showing `avg_session_duration`.
3. Apply dashboard filters for `page_group`, `region`, and `deviceCategory`.
4. Share with the `mr-dj-analytics@mr-dj.com` group with edit access.

## 6. GA4 Explorations Template

- Create an Exploration titled **"RUM – Page Group vs Region"**.
- Segments: `page_group = Home`, `page_group = Pricing`, `region = EU`, `region = NA`.
- Dimensions: `page_group`, `region`, `deviceCategory`.
- Metrics: `average_session_duration`, `average_engagement_time`, `event_count`.
- Save the Exploration and pin it to the "Key Reports" collection.

## 7. Alerting

Configure custom insights under **Reports → Insights & Recommendations**:

- Alert when **Avg. LCP > 2.5 s** for any page group in the last 24 hours.
- Alert when **Avg. CLS > 0.25** for EU users.
- Deliver email notifications to `analytics-alerts@mr-dj.com` and Slack `#mr-dj-alerts` via Google Chat integration.

## 8. QA Checklist

- [ ] Parameters populate in GA4 DebugView.
- [ ] Custom dimensions show data in standard reports.
- [ ] Looker Studio dashboard refreshes within 4 hours of GTM publish.
- [ ] Alerts fire by adjusting filters in DebugView.

Document the dashboard URL and access settings in `docs/analytics/README.md` once live.
