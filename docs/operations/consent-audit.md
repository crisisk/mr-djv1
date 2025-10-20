# Consent Compliance Audit Runbook

## Purpose
This runbook consolidates the GDPR/AVG checks, retention rules, and DPIA coordination steps that govern the cookie consent experience. The implementation in [`ConsentManager.jsx`](../../ConsentManager.jsx) is the technical source of truth for banner behavior, consent state persistence, and downstream event dispatching.

## Required GDPR/AVG checks
- **Lawful basis confirmation.** Verify that only functional cookies are active by default and that statistics/marketing categories remain disabled until visitors opt in. Confirm banner copy explains the legal basis and withdrawal rights as rendered in `ConsentManager.jsx`.
- **Prior consent enforcement.** Ensure no analytics or marketing tags fire before opt-in. Validate GA4/gtag `consent` updates originate from the context provider and that the `dataLayer` fallback contains only consent metadata, not PII.
- **User control and revocation.** Confirm the “Cookie settings” control is present post-dismissal and reopens the preferences interface, enabling edits at any time.
- **Record of consent.** Export localStorage entries for `mr-dj-consent-preferences` plus data-layer consent events at least once per audit window to demonstrate evidence of consent state.

## Retention policies
- **Consent preference store.** The `mr-dj-consent-preferences` localStorage item persists the latest choice with an ISO `updatedAt` timestamp. Retain automated exports of this key for **13 months** to align with common EU supervisory guidance.
- **Banner logging.** Keep banner impression and action logs (accept, decline, save) in analytics warehouses for **26 months** so historical consent trends remain available for DPIA updates.
- **Access controls.** Restrict consent log exports to the privacy, data, and analytics owners via role-based access in the analytics warehouse and automation tooling.

## DPIA touchpoints
- **Quarterly review.** Prior to each quarterly compliance audit, revisit the DPIA to document any new tracking vendors or categories enabled in `ConsentManager.jsx`.
- **Change management.** Trigger a DPIA addendum when adding new marketing/analytics scripts or expanding storage beyond the categories defined in the code. Capture approvals in the privacy team’s ticketing queue.
- **Incident response.** If consent storage fails (e.g., localStorage unavailable), file a privacy incident report and document interim mitigations (manual consent capture, tag suppression) within 24 hours.

## Consent data storage & observability
- **Client storage.** Consent selections live in `window.localStorage` under `mr-dj-consent-preferences` with the boolean categories and `updatedAt` timestamp.
- **Tagging stack.** Granted states propagate first through `window.gtag('consent', 'update', ...)`; when gtag is unavailable, a `dataLayer` event named `consent_update` is pushed with granted/denied values for advertising and analytics storage categories.
- **Analytics exports.** Downstream ETL jobs must pull GA4 consent signals (`consent_update` event parameters) into the analytics warehouse nightly so legal can reconcile opt-in rates.
- **Automation hand-off.** n8n and similar workflow platforms should use the analytics export as their system of record, not client storage, to avoid duplicating personal data.

## 24-hour log freshness KPI
- **Definition.** Consent events ingested into the analytics warehouse must be no older than 24 hours from the time the visitor sets or updates their preferences.
- **Monitoring.** Schedule a daily freshness query that compares the `updatedAt` timestamp from exports against warehouse ingestion time; trigger PagerDuty alerts if freshness exceeds 24 hours.
- **Operational steps to stay green.**
  1. Run the consent export automation (see n8n workflow) at 02:00 UTC daily.
  2. Validate success in the automation dashboard before 04:00 UTC and rerun flows on failure.
  3. Reconcile record counts with GA4 event tables during the 09:00 UTC stand-up; log discrepancies >2% for follow-up.
  4. Archive signed-off freshness reports in the privacy team’s shared drive by 12:00 UTC.

## Audit deliverables checklist
- ✅ Export of localStorage consent snapshots for the audit period
- ✅ GA4/n8n export confirming 24-hour freshness SLA
- ✅ DPIA update (or confirmation no changes since last review)
- ✅ Evidence of consent banner text and configuration matching production release

## Points of contact
- **Privacy owner:** Maria de Vries (privacy@mrdj.nl)
- **Data engineering:** Jonas Patel
- **Marketing ops:** Lina Chen
- **Automation steward:** Aiko Tanaka
