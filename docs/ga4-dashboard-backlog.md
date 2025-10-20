# GA4 Dashboard Backlog

## Existing Reporting Assets

The GA4 configuration manual defines the following assets that are already available once the property setup is complete:

- **Audience Segments** – Converted Users, Form Submitters, Phone Clickers, Pricing Package Interest, and High Intent Users for remarketing and deeper analysis. 【F:GA4-CONFIG-COMPLETED.md†L530-L604】
- **Custom Explorations** – Conversions by Variant, Package Performance Analysis, Conversion Funnel Analysis, and Event Type Performance. 【F:GA4-CONFIG-COMPLETED.md†L608-L685】
- **Standard Report Collection** – Core lifecycle reports (Acquisition, Engagement, Events, Conversions, Pages & Screens) plus a dedicated "Conversion Tracking" collection in the GA4 Library. 【F:GA4-CONFIG-COMPLETED.md†L715-L748】
- **Operational Monitoring** – Manual review cadence via Realtime, DebugView, and scheduled insight checks. 【F:GA4-CONFIG-COMPLETED.md†L688-L712】

## Additional Reporting Needs

1. **Marketing Source Effectiveness** – Attribute conversions and package interest by traffic channel, campaign, and referral source to guide media spend.
2. **Lead Quality & Sales Handoff** – Track downstream lead stages (e.g., qualified, booked) to understand conversion value beyond initial GA4 events.
3. **Pricing & Revenue Impact** – Blend GA4 conversion data with package price metadata to estimate revenue, average order value, and package mix trends.
4. **Content Engagement Diagnostics** – Monitor high-impact pages (e.g., pricing, availability, testimonials) for engagement depth, exit rates, and scroll completion.
5. **Consent & Compliance Monitoring** – Ensure consent mode signals and cookie banner interactions are tracked for regulatory reporting.
6. **Automation for Alerting** – Replace manual checklists with automated anomaly alerts for conversion drops or tag failures (email/Slack integration).
7. **Executive Overview Dashboard** – Provide a single Looker Studio (or GA4 summary) dashboard tailored for leadership with KPIs, trends, and targets.

## Backlog for Dashboard & Automation Setup

| Priority | Task | Description | Dependencies | Owner |
| --- | --- | --- | --- | --- |
| P0 | Channel & Campaign Performance Dashboard | Build a GA4 Exploration or Looker Studio report combining acquisition metrics with conversion-type breakdowns to identify top-performing sources. | Ensure UTM conventions documented; GA4 acquisition reports enabled. | Analytics |
| P0 | Conversion Health Alert Automation | Implement automated alerts (Looker Studio, GA4 Insights, or third-party) for sharp drops in key conversions vs 7-day average. | GA4 conversions firing reliably; access to alerting tool or webhook. | Analytics |
| P1 | Revenue & Package Mix Dashboard | Join GA4 conversion events with package_price to calculate estimated revenue, AOV, and package mix trends; surface in dashboard. | package_price parameter populated; data export or BigQuery connection. | Analytics + Finance |
| P1 | Lead Quality Pipeline Reporting | Integrate CRM/booking data with GA4 conversions to track lead progression and closing rate by conversion type and variant. | Data sharing agreement; CRM export/API; identity resolution rules. | Analytics + Sales |
| P1 | Consent Compliance Monitor | Create dashboard or scheduled report highlighting consent banner interactions, consent mode statuses, and impact on data collection. | Consent events captured in GTM/GA4; access to consent logs if external. | Analytics + Legal |
| P2 | Content Engagement Deep Dive | Develop exploration focused on key landing pages with metrics for scroll depth, outbound clicks, and conversions to inform UX tests. | Enhanced Measurement configured for scrolls/outbound clicks. | Analytics + UX |
| P2 | Executive KPI Overview | Design a high-level dashboard summarizing sessions, conversions, revenue proxy, and top channels for leadership updates. | Completion of upstream dashboards; stakeholder KPI alignment. | Analytics |
| P3 | Automated Reporting Distribution | Schedule weekly email or Slack summaries of dashboard insights using Looker Studio or Apps Script automation. | Core dashboards published; stakeholder list defined. | Analytics Ops |
| P3 | Data Quality Watchlist | Implement automated checks (e.g., via BigQuery scheduled queries) to flag missing parameters, spikes in (not set), or tag outages. | BigQuery export enabled; baseline metrics defined. | Analytics Engineering |

### Next Steps

1. Confirm data availability for marketing source, pricing, and consent parameters within GA4 event payloads.
2. Prioritize P0 tasks for delivery in the next sprint; align owners and timelines.
3. Outline technical approach (GA4 Exploration vs Looker Studio vs BigQuery) for each dashboard before development.
4. Establish documentation and runbooks once dashboards or automations launch to transition into ongoing monitoring.

