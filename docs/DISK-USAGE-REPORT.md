# Disk Usage Analysis Report - Mr. DJ Server

**Date:** 2025-10-18
**Server:** /srv/apps/mr-djv1
**Analysis Status:** Complete

---

## Executive Summary

The Mr. DJ server currently uses **157GB out of 194GB (81% full)** on the root filesystem. While the Mr. DJ application itself is relatively small (429MB), the server hosts multiple applications and Docker resources that collectively consume significant disk space.

**Key Findings:**
- Docker resources account for **19.4GB** of disk usage
  - Images: 9.1GB (68% reclaimable)
  - Build cache: 6.8GB (100% reclaimable)
  - Volumes: 3.4GB (96% reclaimable)
- Largest application: psra-ltsd-v1 (1.4GB)
- Node modules across all projects: ~1.6GB
- **Potential space recovery: 17-20GB** through cleanup operations

---

## Detailed Disk Usage Breakdown

### 1. Overall Server Usage

```
Filesystem      Size  Used  Avail  Use%  Mounted on
/dev/sda1       194G  157G   38G   81%   /
```

### 2. Application Directory Sizes

| Directory | Size | Primary Content |
|-----------|------|-----------------|
| `/srv/apps/psra-ltsd-v1` | 1.4GB | Next.js app with node_modules (1.2GB), .next build (153MB), coverage (46MB) |
| `/srv/apps/RentGuy-v1` | 501MB | Backend app with node_modules (397MB), git history (63MB) |
| `/srv/apps/mr-djv1` | 429MB | EDS components with node_modules (399MB) |

### 3. Mr. DJ Application Breakdown

| Component | Size | Description |
|-----------|------|-------------|
| `mr-dj-eds-components/` | 402MB | React component library |
| `node_modules/` | 399MB | NPM dependencies |
| `.git/` | 16MB | Git repository |
| `docs/` | 8.5MB | Documentation |
| `backend/` | 1.1MB | Backend code |
| `frontend/` | 664KB | Frontend code |
| Other | ~1MB | Scripts, tests, configs |

### 4. Largest Node Dependencies (mr-dj-eds-components)

| Package | Size | Removable? |
|---------|------|------------|
| `date-fns` | 60MB | No (runtime dependency) |
| `lucide-react` | 56MB | No (UI icons) |
| `storybook` | 36MB | **Yes** (dev-only) |
| `@babel` | 16MB | **Yes** (dev-only) |
| `playwright-core` | 11MB | **Yes** (testing) |
| `esbuild` | 11MB | **Yes** (dev-only) |
| `lodash` | 9.1MB | Review (may be tree-shakeable) |

### 5. Docker Resource Usage

#### Docker Images (9.1GB total, 6.2GB reclaimable)

| Repository | Tag | Size | Status |
|------------|-----|------|--------|
| `rentguy-backend` | latest | 391MB | Active |
| `mr-djv1-mr-dj-backend` | latest | 378MB | Active |
| `mr-djv1-eds-frontend` | latest | 54MB | Active |
| Multiple `<none>` images | - | ~6.2GB | **Dangling - Can be removed** |

**Analysis:** 97 dangling images (tagged as `<none>`) consuming approximately 6.2GB. These are old build layers no longer referenced by any tagged images.

#### Docker Volumes (3.4GB total, 3.3GB reclaimable)

- **Total Volumes:** 87
- **Active Volumes:** 8
- **Unused Volumes:** 79 (consuming 3.3GB)

**Risk:** Unused volumes may contain data. Review before deletion.

#### Docker Build Cache (6.8GB - 100% reclaimable)

- **Cache Entries:** 426
- **All entries are unused** and can be safely pruned
- Rebuilding will recreate necessary cache layers

#### Docker Containers (166MB total)

| Container | Status | Size |
|-----------|--------|------|
| `rentguy-migrations` | Exited | 31.5kB |
| `psra-demo` | Exited | 0B |
| 17 active containers | Running | ~166MB |

**Recommendation:** Remove exited containers (minimal space savings but good housekeeping).

### 6. Build Artifacts

#### Identified Build Directories

| Directory | Size | Can Remove? | Notes |
|-----------|------|-------------|-------|
| `/srv/apps/mr-djv1/mr-dj-eds-components/dist` | 612KB | Yes | Rebuild with `npm run build` |
| `/srv/apps/psra-ltsd-v1/.next` | 153MB | **Yes** | Next.js build - rebuild on deploy |
| `/srv/apps/psra-ltsd-v1/coverage` | 46MB | **Yes** | Test coverage reports |
| `/srv/apps/RentGuy-v1/dist` | 2.2MB | Yes | Build output |
| `node_modules/.cache/*` | 24KB | Yes | Minimal but safe to remove |

**Potential Savings:** ~200MB (not including node_modules)

### 7. Log Files

**Current Status:**
- Very few log files found (mostly in RentGuy-v1/artifacts)
- All logs are small (8KB each)
- No log rotation issues detected

**Recommendation:** Implement log rotation for production applications.

### 8. Temporary Files

- **Location:** `/tmp`
- **Old files (>7 days):** 250 files
- **Estimated savings:** Unknown (need to check sizes)

### 9. Git Repositories

| Repository | .git Size | Optimization Potential |
|------------|-----------|------------------------|
| `/srv/apps/RentGuy-v1` | 63MB | Medium - run `git gc` |
| `/srv/apps/mr-djv1` | 16MB | Low |

---

## Cleanup Recommendations

### Immediate Actions (Safe & High Impact)

#### 1. Docker Cleanup (17-18GB recoverable)

**Priority:** HIGH
**Risk:** LOW

```bash
# Remove dangling images (~6.2GB)
docker image prune -f

# Remove unused build cache (~6.8GB)
docker builder prune -af

# Remove unused volumes (~3.3GB) - REVIEW FIRST
docker volume ls -f dangling=true
docker volume prune -f

# Remove stopped containers (minimal space)
docker container prune -f
```

**Expected Recovery:** 17-18GB

#### 2. Build Artifacts Cleanup (200MB recoverable)

**Priority:** MEDIUM
**Risk:** LOW (can be rebuilt)

```bash
# Next.js builds
rm -rf /srv/apps/psra-ltsd-v1/.next
rm -rf /srv/apps/psra-ltsd-v1/coverage

# Distribution builds
rm -rf /srv/apps/RentGuy-v1/dist
rm -rf /srv/apps/mr-djv1/mr-dj-eds-components/dist

# Node caches
find /srv/apps -path "*/node_modules/.cache" -type d -exec rm -rf {} +
```

**Note:** Rebuild with appropriate commands (`npm run build`, `next build`, etc.)

#### 3. Temporary Files Cleanup (Unknown recovery)

**Priority:** LOW
**Risk:** VERY LOW

```bash
# Clean old temp files (>7 days)
find /tmp -type f -mtime +7 -delete
find /tmp -type d -empty -delete
```

### Aggressive Actions (Requires Reinstallation)

#### 4. Node Modules Cleanup (1.6GB recoverable)

**Priority:** LOW
**Risk:** MEDIUM (requires npm install)

```bash
# Only if needed - requires reinstalling dependencies
find /srv/apps -name "node_modules" -type d -exec rm -rf {} +

# Then reinstall in each project
npm install
```

**When to use:** Before major deployments or when critically low on space.

#### 5. Development Dependencies Optimization

**Priority:** LOW
**Risk:** LOW

Consider using `npm prune --production` on production servers to remove dev dependencies.

---

## Prevention Strategies

### 1. Automated Cleanup Schedule

Create a cron job to run the cleanup script weekly:

```bash
# Add to crontab (run every Sunday at 2 AM)
0 2 * * 0 /srv/apps/mr-djv1/scripts/maintenance/disk-cleanup.sh --dry-run >> /var/log/disk-cleanup.log 2>&1
```

### 2. Docker Image Management

**Best Practices:**
- Tag images with version numbers instead of just 'latest'
- Remove old tagged images after successful deployments
- Use multi-stage builds to reduce final image sizes
- Implement image retention policy (keep last 3 versions)

**Automated cleanup:**
```bash
# Keep only last 3 versions of each image
docker images | grep -v REPOSITORY | awk '{print $1":"$2}' | sort | uniq -c | awk '$1 > 3'
```

### 3. Log Rotation

Implement logrotate for application logs:

**Create `/etc/logrotate.d/mr-dj`:**
```
/srv/apps/*/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0644 root root
}
```

### 4. Build Artifact Management

**CI/CD Integration:**
- Clean build artifacts before new builds
- Use separate build servers when possible
- Don't commit `dist/`, `build/`, `.next/` to git

**Add to `.gitignore`:**
```
dist/
build/
.next/
coverage/
node_modules/.cache/
```

### 5. Docker Volume Management

**Best Practices:**
- Name volumes explicitly (avoid anonymous volumes)
- Use bind mounts for development
- Regular audits: `docker volume ls` and review usage
- Document which volumes contain important data

### 6. Monitoring and Alerts

**Set up disk usage monitoring:**

```bash
# Add to crontab - alert at 85% usage
0 */6 * * * df -h / | awk 'NR==2 {if ($5+0 > 85) print "Disk usage high: " $5}' | mail -s "Disk Alert" admin@example.com
```

**Recommended tools:**
- `ncdu` - NCurses Disk Usage (interactive disk analyzer)
- `df` - Disk free space
- `du` - Disk usage
- `docker system df` - Docker disk usage

### 7. Development Best Practices

**For Node.js Projects:**
- Use `npm ci` instead of `npm install` in CI/CD (faster, cleaner)
- Consider using `pnpm` or `yarn` with workspaces for monorepos (shared dependencies)
- Regularly update dependencies to remove deprecated packages

**For Docker:**
- Use `.dockerignore` to exclude unnecessary files
- Optimize layer caching in Dockerfiles
- Use slim or alpine base images where possible
- Combine RUN commands to reduce layers

### 8. Quarterly Maintenance Tasks

**Every 3 months, perform:**
1. Full Docker cleanup (images, containers, volumes, cache)
2. Git repository optimization (`git gc --aggressive`)
3. Dependency audit and update
4. Review and archive old projects
5. Database vacuum/optimize operations
6. Review and remove old backups

---

## Cleanup Script Usage

The automated cleanup script is located at:
```
/srv/apps/mr-djv1/scripts/maintenance/disk-cleanup.sh
```

### Basic Usage

```bash
# Dry run (recommended first)
./disk-cleanup.sh --dry-run

# Standard cleanup
./disk-cleanup.sh

# Aggressive cleanup (includes node_modules cache, build artifacts)
./disk-cleanup.sh --aggressive

# Docker only
./disk-cleanup.sh --docker

# Logs only
./disk-cleanup.sh --logs

# Aggressive dry run
./disk-cleanup.sh --aggressive --dry-run
```

### What the Script Does

**Standard Mode:**
- Removes Docker dangling images
- Removes stopped containers
- Removes unused Docker volumes
- Compresses logs older than 30 days
- Removes compressed logs older than 90 days
- Removes node_modules cache directories
- Removes Python cache files
- Cleans temporary files older than 7 days
- Optimizes git repositories

**Aggressive Mode (includes above plus):**
- Removes Docker build cache
- Removes all node_modules directories (requires reinstall)
- Removes build artifacts (dist, .next, build, coverage)

### Safety Features

- Always shows what will be deleted
- Requires confirmation for destructive operations
- Reports disk space before and after
- Logs all operations
- Can be run in dry-run mode

---

## Risk Assessment

### Low Risk Operations (Recommended Now)

1. **Docker image prune** - Remove dangling images
2. **Docker build cache cleanup** - Can be rebuilt automatically
3. **Temporary file cleanup** - Safe after 7+ days
4. **Log compression** - Keeps logs but saves space

**Potential Issues:** None if Docker services are running properly

### Medium Risk Operations (Review First)

1. **Docker volume cleanup** - May contain data
   - **Risk:** Data loss if volumes are still needed
   - **Mitigation:** Review volume list, backup if unsure

2. **Build artifact removal** - Requires rebuild
   - **Risk:** Downtime if rebuild fails
   - **Mitigation:** Ensure build process works before cleanup

### High Risk Operations (Use with Caution)

1. **Node modules removal** - Requires full reinstall
   - **Risk:** Version mismatches, installation failures
   - **Mitigation:** Document dependency versions, test in staging

---

## Monitoring Dashboard

### Current Status

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Disk Usage | 81% | 85% | ⚠️ WARNING |
| Docker Images | 9.1GB | - | ℹ️ INFO |
| Reclaimable Space | ~17GB | - | ✅ GOOD |
| Unused Volumes | 79 | - | ⚠️ REVIEW |
| Dangling Images | 97 | 10 | ❌ ACTION NEEDED |

### Recommended Actions Priority

1. 🔴 **HIGH:** Clean Docker dangling images (6.2GB recovery)
2. 🔴 **HIGH:** Clean Docker build cache (6.8GB recovery)
3. 🟡 **MEDIUM:** Review and clean unused volumes (3.3GB recovery)
4. 🟡 **MEDIUM:** Remove build artifacts (200MB recovery)
5. 🟢 **LOW:** Set up automated monitoring
6. 🟢 **LOW:** Implement log rotation
7. 🟢 **LOW:** Schedule weekly cleanup

---

## Appendix

### A. Useful Commands

```bash
# Check disk usage by directory
du -h --max-depth=1 /srv/apps | sort -hr

# Find largest files
find /srv/apps -type f -exec du -h {} + | sort -hr | head -20

# Docker disk usage
docker system df -v

# List all Docker volumes
docker volume ls

# Find old files
find /srv/apps -type f -mtime +30 -ls

# Check inode usage
df -i

# NCurses disk usage analyzer (if installed)
ncdu /srv/apps
```

### B. Space Recovery Summary

| Action | Space Recovery | Risk Level | Time Required |
|--------|----------------|------------|---------------|
| Docker dangling images | 6.2GB | Low | 1 min |
| Docker build cache | 6.8GB | Low | 1 min |
| Docker unused volumes | 3.3GB | Medium | 5 min |
| Build artifacts | 200MB | Low | 1 min |
| Temp files | Unknown | Low | 1 min |
| **Total Potential** | **~17GB** | - | **~10 min** |

### C. Contact and Support

For questions or issues with disk cleanup:
- Review this documentation
- Check cleanup script logs
- Test in dry-run mode first
- Backup critical data before major cleanup

### D. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-18 | Initial disk usage analysis and cleanup script |

---

## Conclusion

The Mr. DJ server has adequate disk space available after cleanup, with **17-18GB immediately reclaimable** through safe Docker cleanup operations. The application itself is well-optimized at 429MB, with most space consumed by dependencies (node_modules) and Docker resources.

**Immediate Recommendation:**
Run the cleanup script with Docker cleanup enabled to recover ~17GB:

```bash
/srv/apps/mr-djv1/scripts/maintenance/disk-cleanup.sh --docker --dry-run
# Review output, then run without --dry-run
/srv/apps/mr-djv1/scripts/maintenance/disk-cleanup.sh --docker
```

This will bring disk usage down to approximately **64%**, providing comfortable headroom for normal operations.

**Long-term Recommendation:**
Implement automated weekly cleanup and monitoring to prevent future disk space issues.
