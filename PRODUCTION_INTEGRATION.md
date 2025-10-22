# Production Integration - MR-DJ Dynamic Content System

## ✅ Completed Integration Steps

### 1. Docker Compose Configuration
Added two new services to `/srv/apps/mr-djv1/docker-compose.yml`:

#### Dynamic API Service
- **Container:** `mr-dj-dynamic-api`
- **URL:** `https://mr-dj.sevensa.nl/api/personalize`
- **Purpose:** A/B testing and personalization API
- **Technology:** Next.js 14 with Thompson sampling

#### Metabase Analytics
- **Container:** `mr-dj-metabase`
- **URL:** `https://mr-dj.sevensa.nl/analytics`
- **Purpose:** Analytics dashboard for experiments
- **Technology:** Metabase latest

### 2. Traefik Routing Configured
- `/api/personalize` → Dynamic API
- `/analytics` → Metabase Dashboard
- SSL/TLS certificates managed by Traefik + Let's Encrypt

### 3. Frontend Integration
Created `/srv/apps/mr-djv1/frontend/public/assets/js/dynamic-content.js`:
- Anonymous user tracking (cookie-based)
- Session management
- Automatic hero section personalization
- Event tracking (form submissions, CTA clicks)
- Exposure and outcome logging

### 4. Services Directory
Copied competitive intelligence services to `/srv/apps/mr-djv1/services/`:
- `snapshotper/` - Playwright-based competitor snapshots
- `extractor/` - HTML feature extraction
- `variant-factory/` - AI variant generation

## 🚀 Deployment Steps

### Step 1: Add Script to HTML Templates

Add this line to the `<head>` section of all HTML files:

```html
<!-- Dynamic Content & A/B Testing -->
<link rel="modulepreload" href="/assets/js/dynamic-content.js">
```

Add this line before the closing `</body>` tag:

```html
<!-- Dynamic Content Script -->
<script src="/assets/js/dynamic-content.js" defer></script>
```

**Batch update all HTML files:**
```bash
cd /srv/apps/mr-djv1/frontend/public

# Find all HTML files and add script reference
for file in *.html; do
  # Check if script not already added
  if ! grep -q "dynamic-content.js" "$file"; then
    # Add before closing </body> tag
    sed -i 's|</body>|<script src="/assets/js/dynamic-content.js" defer></script>\n</body>|' "$file"
  fi
done
```

### Step 2: Build and Deploy Services

```bash
cd /srv/apps/mr-djv1

# Build the dynamic-api service
docker-compose build dynamic-api

# Start both new services
docker-compose up -d dynamic-api metabase

# Check logs
docker logs mr-dj-dynamic-api -f
docker logs mr-dj-metabase -f
```

### Step 3: Rebuild Frontend (if needed)

```bash
# Rebuild frontend with new JavaScript
docker-compose build eds-frontend
docker-compose up -d eds-frontend
```

### Step 4: Verify Services

```bash
# Test Dynamic API
curl -s https://mr-dj.sevensa.nl/api/personalize?zone=hero | jq .

# Test Metabase (should redirect to setup)
curl -I https://mr-dj.sevensa.nl/analytics

# Check all containers
docker-compose ps
```

## 📊 Metabase Setup

1. **Access Dashboard:**
   ```
   https://mr-dj.sevensa.nl/analytics
   ```

2. **Initial Setup:**
   - Create admin account
   - Add database connection:
     - Type: PostgreSQL
     - Host: `mr-dj-postgres`
     - Port: `5432`
     - Database: `mrdj_db`
     - User: `mrdj_user`
     - Password: `mrdj_secure_password_2025`

3. **Import Queries:**
   - Copy queries from `/srv/apps/mr-djv1/../dashboards/metabase_queries.sql`
   - Create dashboards for:
     - Experiment performance
     - User journey analytics
     - Competitor intelligence

## 🤖 Automated Competitor Tracking

### Setup Cron Jobs

Create `/srv/apps/mr-djv1/cron/competitor-tracking.sh`:

```bash
#!/bin/bash
# Daily competitor tracking

SERVICES_DIR="/srv/apps/mr-djv1/services"
LOG_DIR="/var/log/mrdj-competitor"

mkdir -p "$LOG_DIR"

# Run snapshotper
echo "$(date): Running competitor snapshots..." >> "$LOG_DIR/tracking.log"
cd "$SERVICES_DIR/snapshotper"
npm install --silent > /dev/null 2>&1
node index.mjs >> "$LOG_DIR/snapshots.log" 2>&1

# Run extractor
echo "$(date): Extracting competitor features..." >> "$LOG_DIR/tracking.log"
cd "$SERVICES_DIR/extractor"
npm install --silent > /dev/null 2>&1
node index.mjs >> "$LOG_DIR/extractor.log" 2>&1

echo "$(date): Competitor tracking complete" >> "$LOG_DIR/tracking.log"
```

**Install cron job:**
```bash
# Make script executable
chmod +x /srv/apps/mr-djv1/cron/competitor-tracking.sh

# Add to crontab (runs daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * /srv/apps/mr-djv1/cron/competitor-tracking.sh") | crontab -

# Verify
crontab -l
```

## 📝 Frontend Usage Examples

### Basic Integration

The script automatically:
- Personalizes hero sections
- Tracks form submissions
- Tracks CTA clicks
- Manages user/session IDs

### Manual Event Tracking

```javascript
// Log a custom conversion event
window.MRDJTracking.logOutcome('contact_phone_click', 1);

// Log a valued outcome
window.MRDJTracking.logOutcome('booking_completed', 1500); // €1500 booking

// Get user IDs
const anonId = window.MRDJDynamic.getAnonId();
const sessionId = window.MRDJDynamic.getSessionId();
```

### Custom Zone Personalization

```javascript
// Fetch personalized content for any zone
const content = await window.MRDJDynamic.fetchContent('pricing');

// Apply to custom element
if (content && content.variant) {
  document.querySelector('.pricing-hero').innerHTML = content.variant.assets.headline;
}
```

## 🎨 Hero Section Requirements

For dynamic content to work, hero sections should have:

```html
<!-- Option 1: Class-based -->
<section class="hero-section">
  <h1>Default Headline</h1>
  <p class="hero-subline">Default subline</p>
  <a href="/contact" class="cta-button">Default CTA</a>
</section>

<!-- Option 2: Data attribute-based -->
<div data-zone="hero">
  <h1>Default Headline</h1>
  <p class="lead">Default subline</p>
  <a href="/contact" class="btn-primary">Default CTA</a>
</div>
```

## 🔍 Testing

### Test Dynamic API

```bash
# Test from command line
curl https://mr-dj.sevensa.nl/api/personalize?zone=hero

# Expected response:
# {
#   "segment": {"wedding": false, "journey": "awareness"},
#   "variant": {
#     "key": "A",
#     "assets": {...}
#   },
#   "exposure_token": "exp_..."
# }
```

### Test Frontend Integration

1. Open browser console on https://mr-dj.sevensa.nl
2. Check for:
   ```
   [MR-DJ Dynamic] Initialized
   ```
3. Verify cookies set:
   - `mrdj_anon_id`
   - `mrdj_session_id`
4. Check hero section updated with variant

### Monitor Analytics

```sql
-- Check exposures
SELECT exp_key, variant, COUNT(*)
FROM exposures
WHERE ts >= NOW() - INTERVAL '24 hours'
GROUP BY exp_key, variant;

-- Check outcomes
SELECT event, COUNT(*), SUM(value)
FROM outcomes
WHERE ts >= NOW() - INTERVAL '24 hours'
GROUP BY event;
```

## 📈 Monitoring

### Service Health Checks

```bash
# Check all services
docker-compose ps

# Check logs
docker logs mr-dj-dynamic-api --tail 100
docker logs mr-dj-metabase --tail 100

# Check database connections
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db -c "SELECT COUNT(*) FROM exposures;"
```

### Traefik Dashboard

Access Traefik dashboard to verify routing:
```
http://your-server-ip:8080 (if dashboard enabled)
```

## 🚨 Rollback Plan

If issues occur:

```bash
# Stop new services
docker-compose stop dynamic-api metabase

# Remove from HTML (if needed)
cd /srv/apps/mr-djv1/frontend/public
for file in *.html; do
  sed -i '/dynamic-content.js/d' "$file"
done

# Rebuild frontend
docker-compose build eds-frontend
docker-compose up -d eds-frontend

# Revert docker-compose.yml
git checkout docker-compose.yml
```

## 📁 File Structure After Integration

```
/srv/apps/mr-djv1/
├── docker-compose.yml              (Updated with 2 new services)
├── dynamic-api/                    (New: Next.js API)
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── app/api/personalize/route.ts
│   └── services/experimentation/
├── services/                       (New: Competitor tracking)
│   ├── snapshotper/
│   ├── extractor/
│   ├── variant-factory/
│   └── experimentation/
├── cron/                          (New: Automation scripts)
│   └── competitor-tracking.sh
├── frontend/public/
│   └── assets/js/
│       └── dynamic-content.js     (New: Frontend integration)
└── PRODUCTION_INTEGRATION.md      (This file)
```

## 🎯 Success Criteria

- [ ] Dynamic API responding at `/api/personalize`
- [ ] Metabase accessible at `/analytics`
- [ ] Frontend loading `dynamic-content.js`
- [ ] Hero sections being personalized
- [ ] Exposures logged to database
- [ ] Outcomes tracked on form submissions
- [ ] Cron job running nightly
- [ ] Metabase dashboards configured

## 🔗 URLs

- **Main Site:** https://mr-dj.sevensa.nl
- **Dynamic API:** https://mr-dj.sevensa.nl/api/personalize
- **Analytics Dashboard:** https://mr-dj.sevensa.nl/analytics
- **Backend API:** https://mr-dj.sevensa.nl/api

## 📞 Support

For issues or questions, check:
1. Docker logs: `docker logs <container-name>`
2. Database queries in Metabase
3. Browser console for JavaScript errors
4. `/opt/mr-dj-dynamic-content-starter/README_COMPLETE.md` for detailed docs
