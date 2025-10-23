# Production Readiness Report

## Summary
- Status: 🟡 In Progress
- Focus: Batch A groundwork completed for environment provisioning and consent-controlled analytics; proceed with credential handoff and integration hardening before Batch C sign-off.
- Notes: Secrets still outstanding for Batch A, but validated scaffolding (`backend/.env.sample`, `backend/managed.env.sample`) and consent manager wiring unblock credential import.

## Checklist Snapshot
- [ ] CI build clean (`npm run build`)
- [ ] TypeScript checks pass
- [ ] ESLint clean
- [ ] Storybook build validated
- [ ] Lighthouse ≥ 90 (LCP, TBT, SEO)
- [ ] Playwright smoke tests green
- [ ] Accessibility scan < 5 minor issues

## Batch Execution Tracker

| Batch | Scope | Status | Exit Evidence |
| --- | --- | --- | --- |
| Batch A – Platform Foundation | Secrets, Complianz/GTM/GA4, consent QA | 🟡 In Progress (env scaffolding merged; awaiting secret injection) | `backend/.env.sample` & `backend/managed.env.sample`; consent banner controls GTM/GA4 & Facebook Pixel via `ConsentManager.jsx` |
| Batch B – Experience Integration | RentGuy proxy, Sevensa flow, regression automation | ⏳ Pending (requires Batch A completion) | Cypress/Playwright suites green, availability checker posts through backend, GA4 events logged in DebugView |
| Batch C – Launch & Monitoring | Performance, monitoring, production deploy | ⏳ Pending | Lighthouse ≥90 report, monitoring dashboards, signed `DEPLOYMENT_SUCCESS.md` |

## Batch Breakdown & Outstanding Tasks

### Batch A – Platform Foundation
- [ ] **Secrets provisioning:** Populate `backend/.env` and `backend/managed.env` with validated credentials for database, Redis, RentGuy, Sevensa, and automation webhooks; confirm `npm --prefix backend test` passes without Joi validation errors.
- [ ] **Consent & analytics IDs:** Replace placeholder Complianz site ID (`VITE_COMPLIANZ_SITE_ID`) and wire verified GTM container `GTM-NST23HJX`, GA4 measurement ID `G-TXJLD3H2C8`, and Facebook Pixel ID through the consent manager.
- [ ] **Documentation refresh:** Extend provisioning steps and credential ownership details in the deployment docs to reflect the new secret sources and validation evidence.

### Batch B – Experience Integration
- [ ] **Frontend data fetching:** Update React data loaders/hooks to call the backend proxy for RentGuy endpoints with robust loading/error states and retries for bookings, contact, and pricing flows.
- [ ] **Sevensa availability flow:** Replace placeholder Sevensa IDs in `AvailabilityChecker.jsx`, route submissions via backend queueing, and emit `availability_conversion` GA4 events on success.
- [ ] **Regression coverage:** Expand Cypress/Playwright suites to cover booking, contact, and availability journeys using mocked or staged RentGuy services; ensure runs are green in CI.
- [ ] **Branding & content alignment:** Ensure favicon, hero logo, and testimonials are sourced from the centralized asset pipeline with API/CMS fallback support.

### Batch C – Launch & Monitoring
- [ ] **Performance & accessibility:** Achieve Lighthouse ≥90 across performance, accessibility, best practices, and SEO; run automated accessibility audits (pa11y/axe) and document residual issues.
- [ ] **Monitoring & alerting:** Configure uptime monitoring, Sentry/LogRocket logging sinks, and incident runbooks with secrets managed alongside other production credentials.
- [ ] **Deployment sign-off:** Execute `./deploy.sh` to the production domain, complete staging validation (console, GA4 DebugView, GTM Preview), and obtain product/QA approval recorded in `DEPLOYMENT_SUCCESS.md`.
- [ ] **Post-launch verification:** Maintain dashboards for 24h stability, confirm GA4 events flowing into property `G-TXJLD3H2C8`, and mark the readiness report as ✅ Ready with evidence links.

## Next Steps
1. Provision backend and marketing secrets (Batch A) using the new managed env templates and rerun `npm --prefix backend test` for validation evidence.
2. Extend integration coverage (Batch B) now that `/availability/check` proxies to Sevensa through the backend; capture Cypress scenarios for booking/contact parity.
3. Prepare launch checklists, monitoring, and deployment dry run scripts ahead of Batch C to shorten the go-live runway.
