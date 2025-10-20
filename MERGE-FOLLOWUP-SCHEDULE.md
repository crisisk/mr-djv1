# Post-Merge Action Tracker

This tracker captures follow-up items identified in the merge documentation and organizes them into sequential batches for execution.

## Action Items & Open Questions

### Confirm Functionality & Tracking
- Start the backend server in development mode and confirm health and contact endpoints respond as expected.
- Exercise the contact form flow against PostgreSQL to verify validation, persistence, and CRM sync triggers.
- Validate Google Tag Manager/GA4 events fire for key user journeys (landing page views, CTA clicks, booking flow, testimonials, pricing, city pages).
- Run Schema.org validation through Google's Rich Results Test for Organization, Service, Breadcrumb, and WebPage schemas.

### Quality & Testing Gaps
- Execute backend unit, integration, end-to-end, load, and Lighthouse performance tests that were deferred during the merge.
- Perform manual smoke tests on staging and production environments after deployment.
- Review bundle sizes and investigate opportunities for code splitting and image optimization.

### Infrastructure & Operations
- Verify PostgreSQL availability, schema state, and readiness for new contact records.
- Monitor Docker services (backend, frontend, supporting infrastructure) with `docker-compose ps` and `docker-compose logs -f` post-deployment.
- Check telemetry dashboards, alerts, and metrics emitted by the observability stack once environments are live.
- Confirm Traefik/CORS/domain configuration continues to function in staging and production.

### Dependency & Security Follow-ups
- Address outstanding npm audit vulnerabilities (2 low, 2 moderate) after validating fixes in a safe environment.
- Revisit OpenTelemetry peer dependency mismatches and plan upgrades to remove `--legacy-peer-deps` usage.

### Documentation Updates
- Update README.md with the modular architecture overview and deployment implications.
- Document CRM integration setup and observability runbook procedures.
- Add guidance for configuring the AB testing and personalization systems when activation is approved.
- Refresh deployment guides to align with the new flow and tooling.

### Feature Enablement Decisions (Open Questions)
- Determine rollout timing for the AB testing framework and associated personalization components.
- Decide when to enable the ROI calculator, video hero variants, and content hub showcase within DjSaxLanding.
- Clarify ownership and success metrics for upcoming personalization experiments.

## Batch Schedule

### Batch 1 – Verification & Smoke Testing (Immediate, Day 0-1)
1. Start backend server locally, validate health and contact endpoints, and confirm PostgreSQL connectivity.
2. Execute GA4 event verification and Schema.org validation in a test environment.
3. Run manual smoke tests on staging once the merged branch is deployed; monitor Docker services and telemetry for regressions.

### Batch 2 – Automated Testing & Hardening (Day 2-4)
1. Run the full automated suite: backend unit/integration tests, end-to-end scenarios, load testing, and Lighthouse performance checks.
2. Address any failing tests or regressions surfaced during Batch 1 or Batch 2.
3. Audit bundle sizes, pursue code-splitting opportunities, and optimize large assets identified in performance runs.

### Batch 3 – Documentation & Dependency Maintenance (Day 4-6)
1. Update core documentation (README, deployment guides, observability runbook, CRM setup notes) with the new architecture details.
2. Prepare playbooks for activating AB testing and personalization features, ensuring marketing stakeholders have clear steps.
3. Plan and, if risk is acceptable, begin applying fixes for npm audit findings and investigate OpenTelemetry dependency upgrades.

### Batch 4 – Feature Activation Planning (Day 6-10)
1. Facilitate product/marketing decision-making on AB testing rollout, personalization targets, and ROI calculator adoption.
2. Prototype integration of advanced components (VideoHeroSection, PersonaMatchShowcase, ContentHubShowcase) behind feature flags.
3. Define success metrics, monitoring requirements, and rollback strategies for each planned activation before implementation.

### Batch 5 – Post-Activation Monitoring & Optimization (Post-Decisions, Ongoing)
1. Once new features are live, monitor telemetry, GA4 funnels, and CRM sync performance to ensure stability.
2. Iterate on performance tuning (database indexes, query optimization, caching adjustments) informed by production data.
3. Review dependency health quarterly to keep OpenTelemetry and other critical packages current.

## Notes
- Re-evaluate scheduling as dependencies (e.g., stakeholder decisions, production incidents) shift.
- Maintain the safety branch `merge-origin-main-20251019` and backup `/opt/mr-dj-backup-20251019-current.tar.gz` until all batches complete.
