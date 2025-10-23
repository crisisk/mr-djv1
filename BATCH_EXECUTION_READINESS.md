# Mr. DJ Launch Readiness – Batch Execution Plan

## Overview
This plan translates the outstanding launch-blocking tasks into three concrete execution batches. Each batch lists the exact deliverables, ownership, prerequisites, and exit criteria required to achieve 100% production readiness for Mr. DJ.

### Batch Definitions
| Batch | Focus | Goal |
| --- | --- | --- |
| **Batch A – Platform Foundation** | Secrets, configuration, analytics baseline | Restore a fully validated baseline that unblocks integration work.
| **Batch B – Experience Integration** | Frontend ↔ backend flows, external partners | Deliver customer journeys backed by working APIs and consent tracking.
| **Batch C – Launch & Monitoring** | Final QA, performance, deployment | Ship to production with monitoring, documentation, and incident response coverage.

## Batch A – Platform Foundation
**Objective:** Unblock all guarded code paths by provisioning secrets, analytics identifiers, and consent tooling.

- **Secrets Provisioning**
  - [ ] Populate `backend/.env` and `backend/managed.env` with production-ready values for:
    - [ ] `DATABASE_URL`, `REDIS_URL`, and required Postgres/Redis credentials.
    - [ ] RentGuy integration (`RENTGUY_API_BASE_URL`, `RENTGUY_API_KEY`, `RENTGUY_WORKSPACE_ID`).
    - [ ] Sevensa automation (`SEVENSA_SUBMIT_URL`).
    - [ ] N8N & SEO automation (`N8N_PERSONALIZATION_WEBHOOK_URL`, `SEO_AUTOMATION_*`).
  - [ ] Validate with `npm --prefix backend test` and ensure `backend/src/config.js` passes Joi validation without throwing errors.

- **Consent & Analytics IDs**
  - [ ] Replace placeholder Complianz site ID by sourcing the production value and injecting it through build-time env (`VITE_COMPLIANZ_SITE_ID`).
  - [ ] Confirm GTM container `GTM-NST23HJX` and GA4 measurement ID `G-TXJLD3H2C8` are wired in `index.html` and surfaced through the consent manager.
  - [ ] Provide the verified Facebook Pixel ID via `VITE_FACEBOOK_PIXEL_ID` so the React consent flow can gate injection.

- **Deliverables**
  - [ ] Updated env files stored in the secure secret manager and mirrored locally as encrypted artifacts.
  - [ ] Screenshot or CLI evidence showing the backend booting with validation enabled.
  - [ ] PR updates to `PRODUCTION_READY_REPORT.md` reflecting Batch A completion criteria.

- **Exit Criteria**
  - `npm run lint` and `npm run test` succeed for both frontend and backend.
  - Manual smoke test of consent banner verifies GTM/GA4 are suppressed until marketing consent is granted.
  - Documentation updated with the new provisioning steps and credential owners.

## Batch B – Experience Integration
**Objective:** Wire customer-facing flows to live services with reliable error handling and analytics visibility.

- **Frontend Data Fetching**
  - [ ] Update React query hooks and loaders to call RentGuy-backed endpoints exposed by the backend proxy.
  - [ ] Add optimistic UI plus retry/fallback logic for `/bookings`, `/contact`, and pricing data.
  - [ ] Extend Cypress smoke tests to cover happy-path booking, contact, and availability scenarios.

- **Sevensa Flow & Availability Checker**
  - [ ] Replace placeholder Sevensa IDs in `AvailabilityChecker.jsx` with backend-driven configuration.
  - [ ] Route submissions through the backend so queueing and dedupe logic run server-side.
  - [ ] Emit GA4 conversion events (`availability_conversion`) after successful submission.

- **Content & Branding**
  - [ ] Ensure favicon, hero logo, and testimonials use the centralized asset pipeline.
  - [ ] Synchronize testimonials/testimonial APIs so the carousel has both CMS and hardcoded fallback data.

- **Exit Criteria**
  - [ ] Playwright/Cypress regression suite green in CI.
  - [ ] RentGuy proxy logs confirm authenticated calls with no 4xx/5xx responses during tests.
  - [ ] Accessibility scan reports ≤5 issues of WCAG Level A severity (or equivalent "minor" severity as defined by the chosen accessibility tool) on key templates.

## Batch C – Launch & Monitoring
**Objective:** Final validation, deployment, and observability for the public launch.

- **Performance & Accessibility**
  - [ ] Achieve Lighthouse ≥90 for Performance, Accessibility, Best Practices, and SEO on staging.
  - [ ] Run pa11y or axe automated audits; document any residual issues and mitigations.

- **Monitoring & Alerting**
  - [ ] Configure uptime monitoring (UptimeRobot/Pingdom) for marketing site and API.
  - [ ] Enable application logging sinks (Sentry/LogRocket) with DSNs stored in secret manager.
  - [ ] Document runbooks for Sevensa/RentGuy incident response, including alert thresholds.

- **Deployment**
  - [ ] Execute `./deploy.sh` to release to production domain `https://www.mr-dj.nl`.
  - [ ] Complete staging validation checklist (console errors, GA4 DebugView, GTM Preview) and capture evidence.
  - [ ] Obtain product/QA sign-off and archive deployment notes in `DEPLOYMENT_SUCCESS.md`.

- **Exit Criteria**
  - [ ] Production monitoring dashboards show healthy status 24h post-launch.
  - [ ] GA4 DebugView confirms real visitor traffic flowing into property `G-TXJLD3H2C8`.
  - [ ] Final Production Readiness Report marked ✅ Ready with reference links to evidence.

## Cross-Batch Governance
- Maintain a single source of truth for status in `PRODUCTION_READY_REPORT.md` with batch checkboxes.
- Document risk owners and escalation contacts per batch.
- Schedule weekly readiness reviews until Batch C completion.

## Next Actions Summary
1. Finish Batch A by provisioning secrets and updating consent/analytics IDs (blocker removal).
2. Kick off Batch B integration work once backend env validation passes.
3. Prepare Batch C verification scripts and monitoring configuration in parallel to avoid launch delays.

