# Integration Communication Plan

## Stakeholder Directory

- **RentGuy DevOps Team** – Owns deployment of the onboarding portal and is listed as the maintainer for the integration guide; primary technical contact is `admin@sevensa.nl`.【F:INTEGRATION-DEPLOYMENT-GUIDE.md†L592-L594】
- **Onboarding Portal Team (RentGuy Enterprise)** – Responsible for the 10-step onboarding wizard that remains built but not yet deployed, with assets under `/opt/rentguy/onboarding/mr-dj-onboarding-enhanced/`.【F:RENTGUY-INTEGRATION-REPORT.md†L25-L33】
- **Marketing Website Team (Mr. DJ Frontend)** – Operates the live marketing site at `https://mr-dj.sevensa.nl`, ensuring lead generation and public-facing content remain aligned with integration touchpoints.【F:RENTGUY-INTEGRATION-REPORT.md†L94-L102】
- **Backend API Team** – Maintains the Node.js backend services exposed via `/api` endpoints that will power booking submissions and onboarding token flows.【F:RENTGUY-INTEGRATION-REPORT.md†L103-L118】

## Sync Schedule Aligned to Major Features

| Milestone | Target Window | Purpose | Participants |
|-----------|---------------|---------|--------------|
| Phase 1 Kickoff – Onboarding Portal Deployment | Week 1, Day 2 | Confirm domain fix, container rollout, and smoke test readiness for the onboarding portal launch.| DevOps, Onboarding Portal Team |
| Phase 2 Review – Marketing Entry Points | Week 2, Day 1 | Validate homepage CTA placement, booking success messaging, and cross-linking from marketing to onboarding.| Marketing Website Team, Backend API Team |
| Phase 3 Integration Workshop – Token Prefill | Week 3, Day 3 | Walk through token generation, Redis storage, and onboarding prefill consumption before enabling automation.| Backend API Team, Onboarding Portal Team, DevOps |
| Phase 4 Roadmap Alignment – SSO & Long-Term Architecture | Week 5, Day 2 | Reassess roadmap for unified auth and shared services once foundational integration is stable.| DevOps, Backend API Team, Product Owners |

## Communication Task Backlog

1. Draft kickoff brief summarizing deployment checklist updates for DevOps and onboarding stakeholders ahead of Phase 1 sync.
2. Prepare marketing-to-onboarding handoff notes with CTA copy, analytics tags, and success criteria before Phase 2 review.
3. Assemble technical playbook for token lifecycle (generation, storage, expiry) for distribution after Phase 3 workshop.
4. Collect open questions on SSO approaches to compile an agenda for the Phase 4 roadmap alignment.
