# Pending Integration Tasks & Batch Assignment

## Source Summary
- **Integration conflicts**: Tasks `DEV3.2` and `DEV3.5` were skipped during the previous automation run because of file conflicts. These remain unresolved and must be reattempted manually. (Ref: `INTEGRATION_REPORT.json`)
- **Next integration actions**: The success report outlines six follow-up steps required to fully operationalize the integrated components. (Ref: `INTEGRATION_SUCCESS_REPORT.md`)

## Pending Task Breakdown
The remaining work is grouped into the three launch batches described in `BATCH_EXECUTION_READINESS.md`.

### Batch A – Platform Foundation (Immediate)
1. **Secrets & Managed Config**
   - Provision `backend/.env` and `backend/managed.env` with production credentials for the database, Redis, RentGuy, Sevensa, and automation webhooks.
   - Ownership: Backend engineering / DevOps.
   - Evidence: Successful `npm --prefix backend test` run with validation enabled.
2. **Consent & Tracking IDs**
   - Replace the Complianz placeholder with the live site ID and surface GTM `GTM-NST23HJX`, GA4 `G-TXJLD3H2C8`, and Facebook Pixel IDs through the consent manager.
   - Ownership: Marketing engineering.
   - Evidence: Consent banner suppresses tracking until marketing consent is granted.
3. **Documentation Refresh**
   - Update `PRODUCTION_READY_REPORT.md` and related runbooks to reference the new batch milestones and secret locations.

### Batch B – Experience Integration (Next)
1. **Frontend Data Fetching**
   - Wire booking/contact flows to backend proxy endpoints, add retry handling, and centralize loading states.
2. **Sevensa Availability Flow**
   - Move Sevensa submission out of the frontend placeholder (`AvailabilityChecker.jsx`) and into the backend service so queueing and dedupe logic run server-side.
3. **Regression Automation**
   - Extend Cypress/Playwright suites to cover booking, availability, and personalization journeys with live API mocks.

### Batch C – Full Launch & Monitoring (Final)
1. **Performance & Accessibility Gates**
   - Achieve Lighthouse ≥90 and axe/pa11y thresholds on staging prior to production release.
2. **Monitoring & Alerts**
   - Configure uptime checks, GA4 DebugView monitoring, and incident runbooks for RentGuy/Sevensa integrations.
3. **Production Deployment**
   - Execute `./deploy.sh`, capture go-live evidence, and obtain stakeholder sign-off.

## Coordination Notes
- Reassess batch scope after Batch A completes; escalate blockers immediately to avoid cascading delays.
- Confirm API contracts and authentication flows with RentGuy stakeholders before starting Batch B work.
- Keep the Production Readiness Report in sync with batch progress to maintain a single source of truth.
