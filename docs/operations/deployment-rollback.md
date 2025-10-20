# Deployment Rollback & Hotfix Runbook

This runbook documents how to capture reproducible release artifacts, determine whether to execute a rollback or a hotfix, and safely restore the previous production version of Mister DJ services.

## 1. Capture Release Artifacts Before Deploying

Always create a restorable snapshot of the release you are about to ship. This ensures you can promote the same artifact again or quickly roll back.

1. **Tag Docker images locally before pushing**
   ```bash
   docker compose build
   docker tag mr-dj-backend:latest registry.example.com/mr-dj-backend:${RELEASE_TAG}
   docker tag mr-dj-frontend:latest registry.example.com/mr-dj-frontend:${RELEASE_TAG}
   docker push registry.example.com/mr-dj-backend:${RELEASE_TAG}
   docker push registry.example.com/mr-dj-frontend:${RELEASE_TAG}
   ```
   - Choose a semantic version or timestamp-based `${RELEASE_TAG}`.
   - Record the tag in the deployment notes so rollback targets are unambiguous.

2. **Archive the compose bundle and environment files**
   ```bash
   tar -czf artifacts/${RELEASE_TAG}-compose.tar.gz \
       docker-compose.yml \
       backend/.env \
       frontend/.env \
       docs/operations/deployment-rollback.md
   sha256sum artifacts/${RELEASE_TAG}-compose.tar.gz >> artifacts/SHA256SUMS.txt
   ```
   - Store archives in the `artifacts/` bucket or a secure offsite location.
   - Include any migration scripts or manual change logs referenced by the release.

3. **Snapshot database and stateful services**
   - Trigger managed backups or run `pg_dump` against the production database.
   - Confirm that snapshot verification jobs succeeded before proceeding.

## 2. Decide: Rollback or Hotfix?

Use the decision tree below to choose the correct recovery strategy.

### Quick Decision Tree

- **Is production down or customer-impacting within the last 30 minutes?**
  - **Yes:** Roll back immediately.
  - **No:** Continue.
- **Can the issue be mitigated by configuration or feature flag without code changes?**
  - **Yes:** Ship a configuration hotfix (no redeploy needed).
  - **No:** Continue.
- **Is there a low-risk patch that can be validated within 15 minutes?**
  - **Yes:** Prepare a hotfix build from `main` or a dedicated branch and redeploy.
  - **No:** Roll back to the previous known-good artifact.

### Prerequisites Before Rollback or Hotfix

1. **Backup validation**
   - Confirm the latest automated backup (database + storage) is marked `verified` in the backup dashboard.
   - If not, run an ad-hoc backup and verify restore on a staging environment.

2. **Traffic switch planning**
   - Notify stakeholders in the #ops Slack channel.
   - If using load balancers or CDN, prepare to drain traffic or toggle maintenance pages.
   - Ensure observability alerts are acknowledged to avoid duplicate paging.

3. **Communication steps**
   - Assign a single incident coordinator.
   - Update the status page with an incident banner.
   - Inform customer support and account managers about the expected impact and ETA.

### Choosing the Action

| Condition | Rollback | Hotfix |
| --- | --- | --- |
| Issue caused by deployment artifact (image/config) | ✅ | ⚪ |
| Issue requires code change | ⚪ | ✅ |
| Time-to-recover target < 15 min | ✅ | ⚪ |
| Regression present in prior release | ⚪ | ✅ |
| Regression isolated to new infrastructure change | ✅ | ⚪ |

## 3. Rollback Procedure

1. **Switch traffic to maintenance (if required)**
   ```bash
   ssh ${VPS_USER}@${VPS_HOST}
   cd /opt/mr-dj
   docker-compose run --rm mr-dj-backend npm run maintenance:on
   ```

2. **Restore previous compose bundle**
   ```bash
   ssh ${VPS_USER}@${VPS_HOST}
   cd /opt/mr-dj
   docker-compose down
   tar -xzf /opt/artifacts/${PREVIOUS_TAG}-compose.tar.gz -C /opt/mr-dj
   docker load < /opt/artifacts/${PREVIOUS_TAG}-images.tar
   ```
   - If images are stored in a registry, pull by `${PREVIOUS_TAG}` instead of loading a tarball.

3. **Redeploy previous version**
   ```bash
   docker-compose pull  # optional if using registry tags
   docker-compose up -d
   docker-compose exec -T mr-dj-backend npm run migrate:rollback -- --to ${PREVIOUS_MIGRATION}
   ```
   - Skip the migration rollback if the change was backward-compatible.

4. **Re-enable traffic**
   ```bash
   docker-compose run --rm mr-dj-backend npm run maintenance:off
   ```

## 4. Hotfix Procedure (if chosen)

1. Branch from the last known good commit or `main`.
2. Implement the minimal fix and add automated coverage.
3. Build images and tag with `${HOTFIX_TAG}`.
4. Validate on staging, then deploy via `./deploy.sh` using the hotfix artifacts.
5. Monitor metrics for at least one full request cycle (5–10 minutes).

## 5. Post-Rollback Verification

Run the following checks immediately after containers are healthy:

```bash
docker-compose ps
docker-compose logs --tail=50
curl -f https://staging.sevensa.nl/api/health | jq
npm run smoke:test --prefix backend
npm run smoke:test --prefix frontend
```

- Confirm health endpoints return `200` and expected JSON payloads.
- Execute manual smoke tests for booking and contact flows.
- Review Grafana dashboards for error-rate regression.

## 6. Communication & Follow-Up

1. Post an incident resolution summary in #ops and update the status page.
2. Create a retro issue capturing:
   - Root cause analysis.
   - Detection gaps.
   - Action items to prevent recurrence.
3. Attach artifact hashes and migration decisions to the deployment record in the release log.

Keep this document updated whenever deployment tooling or infrastructure changes so operators always have a current recovery path.
