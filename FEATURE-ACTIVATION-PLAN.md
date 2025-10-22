# 🎯 MR-DJ FEATURE ACTIVATION PLAN

**Created**: 22 Oktober 2025
**Status**: ANALYSIS COMPLETE - ACTIVATION PENDING
**Priority**: HIGH

---

## 📊 CURRENT STATUS ANALYSIS

### ✅ ACTIVE COMPONENTS

1. **Frontend (Next.js)**
   - Container: `mr-djv1-frontend-production` ✅ UP
   - URL: https://mr-dj.sevensa.nl/
   - Status: LIVE and responding
   - Features: 79 pages, professional content, SEO optimized

2. **Supporting Services**
   - `mr-dj-redis` ✅ UP (healthy)
   - `mr-dj-metabase` ✅ UP
   - `rentguy-backend-prod` ✅ UP (healthy)
   - `rentguy-redis-prod` ✅ UP (healthy)
   - `rentguy-db-prod` ✅ UP (healthy)

### ❌ INACTIVE COMPONENTS

1. **Backend API**
   - Container: `mr-dj-dynamic-api` ❌ CREATED (not running)
   - Source: `./backend/src/app.js`
   - Required for:
     - Config dashboard
     - Contact form submissions
     - RentGuy integration
     - Observability endpoints

2. **Database**
   - Container: `mr-dj-postgres` ❌ EXITED (127)
   - Status: Not running
   - Required for:
     - Contact form storage
     - User data
     - Session management

3. **Onboarding Service**
   - Container: `mr-dj-onboarding` ⚠️ UP (unhealthy)
   - Status: Running but unhealthy
   - Needs investigation

---

## 📋 MISSING FEATURES (per README)

### 1. Configuratie Dashboard
**Status**: ❌ NOT ACTIVE
**URL**: Should be at https://staging.sevensa.nl/dashboard OR https://mr-dj.sevensa.nl/api/dashboard
**Requirements**:
- Backend API running
- Database connection
- Environment variables configured
**Impact**: Cannot configure email, RentGuy, or other integrations

### 2. Backend API Endpoints
**Status**: ❌ NOT ACCESSIBLE
**Expected Endpoints**:
- `GET /health` - Health check
- `GET /metrics/queues` - Queue metrics for monitoring
- `POST /api/contact` - Contact form submissions
- `POST /api/booking` - Booking requests
- `POST /api/personalization` - User tracking

### 3. Database Integration
**Status**: ❌ NOT RUNNING
**Database**: PostgreSQL 15
**Required For**:
- Contact form storage
- Booking management
- User sessions
- Analytics data

### 4. RentGuy Integration
**Status**: ❌ NOT CONFIGURED (backend not running)
**Features**:
- Lead synchronization
- Booking sync with RentGuy system
- Queue management (BullMQ)
- Automatic retries

### 5. Email Integration
**Status**: ❌ NOT CONFIGURED
**Required For**:
- Contact form notifications
- Booking confirmations
- Customer communications

### 6. Observability & Alerts
**Status**: ❌ NOT ACTIVE
**Features**:
- OTEL tracing
- Queue metrics
- Webhook alerting (Slack/Teams)
- Performance monitoring

### 7. Auto-Content Generation
**Status**: ❌ NOT CONFIGURED
**Features**:
- City content workflow
- Cronjob for monthly updates
- LLM-based content generation
- Automatic page building

---

## 🔧 ACTIVATION PLAN

### Phase 1: Database Activation (15 min)
**Priority**: CRITICAL
**Dependencies**: None

```bash
# 1. Check database configuration
cd /srv/apps/mr-djv1
cat docker-compose.yml | grep -A 20 "mr-dj-postgres"

# 2. Check if data volume exists
docker volume ls | grep mr-dj

# 3. Start database
docker-compose up -d mr-dj-postgres

# OR manually start
docker start mr-dj-postgres

# 4. Verify database health
docker logs mr-dj-postgres --tail 50

# 5. Test connection
docker exec mr-dj-postgres psql -U postgres -c "SELECT version();"
```

**Success Criteria**:
- ✅ Container status: UP (healthy)
- ✅ PostgreSQL responding
- ✅ Database schema exists

---

### Phase 2: Backend API Activation (20 min)
**Priority**: CRITICAL
**Dependencies**: Database must be running

```bash
# 1. Check backend configuration
ls -la ./backend/

# 2. Check environment variables
cat ./backend/.env 2>/dev/null || echo "No .env found"

# 3. Start backend API
docker start mr-dj-dynamic-api

# OR rebuild and start
cd backend
docker build -t mr-djv1-dynamic-api:latest .
docker run -d --name mr-dj-dynamic-api \
  --network sevensa-edge \
  --restart unless-stopped \
  -p 3001:3000 \
  mr-djv1-dynamic-api:latest

# 4. Check logs
docker logs mr-dj-dynamic-api --tail 100

# 5. Test health endpoint
curl http://localhost:3001/health
```

**Success Criteria**:
- ✅ Container status: UP (healthy)
- ✅ `/health` returns 200 OK
- ✅ Database connection successful
- ✅ Redis connection successful

---

### Phase 3: Configure Nginx Proxy for Backend (15 min)
**Priority**: HIGH
**Dependencies**: Backend API running

```bash
# 1. Check current nginx config
cat /etc/nginx/sites-available/mr-dj.sevensa.nl

# 2. Add API proxy
sudo nano /etc/nginx/sites-available/mr-dj.sevensa.nl

# Add to location blocks:
# location /api/ {
#     proxy_pass http://localhost:3001/;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header X-Forwarded-Proto $scheme;
# }

# 3. Test configuration
sudo nginx -t

# 4. Reload nginx
sudo systemctl reload nginx

# 5. Test API endpoints
curl https://mr-dj.sevensa.nl/api/health
```

**Success Criteria**:
- ✅ Nginx config valid
- ✅ API accessible via HTTPS
- ✅ `/api/health` returns 200 OK

---

### Phase 4: Environment Variables Configuration (10 min)
**Priority**: HIGH
**Dependencies**: Backend running

```bash
# 1. Create/update backend .env
cat > ./backend/.env << 'EOF'
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@mr-dj-postgres:5432/mrdj
DB_HOST=mr-dj-postgres
DB_PORT=5432
DB_NAME=mrdj
DB_USER=postgres
DB_PASSWORD=<check docker-compose>

# Redis
REDIS_URL=redis://mr-dj-redis:6379
REDIS_HOST=mr-dj-redis
REDIS_PORT=6379

# RentGuy Integration
RENTGUY_API_BASE_URL=<from old config>
RENTGUY_API_KEY=<from old config>
RENTGUY_WORKSPACE_ID=<from old config>
RENTGUY_TIMEOUT_MS=30000

# Email
MAIL_PROVIDER=<provider>
MAIL_API_KEY=<key>
MAIL_FROM_ADDRESS=info@mr-dj.nl
MAIL_REPLY_TO=info@mr-dj.nl

# Alerts
ALERT_WEBHOOK_URLS=<slack/teams webhook>

# Security
JWT_SECRET=<generate strong secret>
SESSION_SECRET=<generate strong secret>
EOF

# 2. Restart backend with new env
docker restart mr-dj-dynamic-api

# 3. Verify environment loaded
docker exec mr-dj-dynamic-api env | grep DATABASE_URL
```

**Success Criteria**:
- ✅ All required env vars set
- ✅ Backend connects to database
- ✅ Backend connects to Redis
- ✅ No connection errors in logs

---

### Phase 5: Database Migrations (10 min)
**Priority**: HIGH
**Dependencies**: Database running, backend configured

```bash
# 1. Check for migration files
ls ./backend/migrations/ || ls ./backend/src/migrations/

# 2. Run migrations
docker exec mr-dj-dynamic-api npm run migrate

# OR manually
docker exec mr-dj-dynamic-api npx sequelize-cli db:migrate
# OR
docker exec mr-dj-dynamic-api npx prisma migrate deploy

# 3. Verify tables created
docker exec mr-dj-postgres psql -U postgres -d mrdj -c "\dt"

# 4. Check migration status
docker exec mr-dj-dynamic-api npm run migrate:status
```

**Success Criteria**:
- ✅ All migrations applied
- ✅ Tables exist in database
- ✅ Schema matches backend models

---

### Phase 6: Fix Onboarding Service (Optional - 10 min)
**Priority**: MEDIUM
**Dependencies**: None

```bash
# 1. Check onboarding logs
docker logs mr-dj-onboarding --tail 100

# 2. Check health endpoint
docker exec mr-dj-onboarding curl http://localhost/health

# 3. Restart service
docker restart mr-dj-onboarding

# 4. Or rebuild if needed
cd <onboarding-dir>
docker-compose up -d --build mr-dj-onboarding
```

**Success Criteria**:
- ✅ Container status: UP (healthy)
- ✅ Health check passing

---

### Phase 7: Enable Config Dashboard (5 min)
**Priority**: HIGH
**Dependencies**: Backend running, API accessible

```bash
# 1. Test dashboard access
curl https://mr-dj.sevensa.nl/api/dashboard

# 2. Check authentication
curl -u admin:sevensa https://mr-dj.sevensa.nl/api/dashboard

# 3. Or access via browser
# Navigate to: https://mr-dj.sevensa.nl/api/dashboard
# Login: admin / sevensa (update for production!)
```

**Success Criteria**:
- ✅ Dashboard accessible
- ✅ Can view config tabs
- ✅ Can update environment variables

---

### Phase 8: Test Contact Form Integration (10 min)
**Priority**: HIGH
**Dependencies**: Backend + database running

```bash
# 1. Test contact form endpoint
curl -X POST https://mr-dj.sevensa.nl/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "0612345678",
    "eventType": "Bruiloft",
    "eventDate": "2025-12-31",
    "message": "Test bericht"
  }'

# 2. Check database for submission
docker exec mr-dj-postgres psql -U postgres -d mrdj \
  -c "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5;"

# 3. Check backend logs
docker logs mr-dj-dynamic-api --tail 50 | grep contact
```

**Success Criteria**:
- ✅ API returns 200 OK
- ✅ Contact saved in database
- ✅ Email notification sent (if configured)

---

### Phase 9: Setup Cronjobs (Optional - 15 min)
**Priority**: LOW
**Dependencies**: Backend running, scripts available

```bash
# 1. Check for automation scripts
ls ./scripts/automation/

# 2. Test city content workflow
node scripts/automation/run-city-content-workflow.js --dry-run=true --limit=2

# 3. Add to crontab
crontab -e

# Add:
# 0 3 1 * * cd /srv/apps/mr-djv1 && node scripts/automation/run-city-content-workflow.js
# 0 4 * * * cd /srv/apps/mr-djv1 && npm run health-check

# 4. Verify crontab
crontab -l
```

**Success Criteria**:
- ✅ Cronjobs added
- ✅ Test run successful
- ✅ Reports generated

---

### Phase 10: Observability Setup (Optional - 20 min)
**Priority**: MEDIUM
**Dependencies**: Backend running

```bash
# 1. Test metrics endpoint
curl https://mr-dj.sevensa.nl/api/metrics/queues

# 2. Configure webhook alerts
# Update via dashboard or environment:
export ALERT_WEBHOOK_URLS="https://hooks.slack.com/services/..."
export ALERT_QUEUE_WARNING_BACKLOG=50
export ALERT_QUEUE_CRITICAL_BACKLOG=100

# 3. Test alert
curl -X POST https://mr-dj.sevensa.nl/api/test-alert

# 4. Verify webhook received
# Check Slack/Teams channel
```

**Success Criteria**:
- ✅ Metrics endpoint returns data
- ✅ Alerts configured
- ✅ Test alert received

---

## 📊 ESTIMATED TIMELINE

| Phase | Duration | Complexity | Critical |
|-------|----------|------------|----------|
| 1. Database | 15 min | Low | YES |
| 2. Backend API | 20 min | Medium | YES |
| 3. Nginx Proxy | 15 min | Low | YES |
| 4. Environment | 10 min | Low | YES |
| 5. Migrations | 10 min | Medium | YES |
| 6. Onboarding | 10 min | Low | NO |
| 7. Dashboard | 5 min | Low | YES |
| 8. Contact Form | 10 min | Medium | YES |
| 9. Cronjobs | 15 min | Low | NO |
| 10. Observability | 20 min | Medium | NO |

**Total Critical Path**: ~85 minutes (1h 25min)
**Full Activation**: ~130 minutes (2h 10min)

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Database Data Loss
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Check for existing database volumes before recreating
- Create backup before starting: `docker exec mr-dj-postgres pg_dump -U postgres mrdj > backup.sql`
- Use `docker start` instead of `docker run` if container exists

### Risk 2: Missing Environment Variables
**Probability**: High
**Impact**: High
**Mitigation**:
- Check old configs in `/opt/mr-dj/` or `/etc/mr-dj/`
- Ask user for RentGuy credentials
- Use placeholder values for testing, mark as "CHANGE IN PRODUCTION"

### Risk 3: Port Conflicts
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Check port availability: `netstat -tulpn | grep :3001`
- Use different port if needed
- Update nginx config accordingly

### Risk 4: Network Issues
**Probability**: Low
**Impact**: High
**Mitigation**:
- Ensure all containers on same network: `docker network ls`
- Use docker network name for inter-container communication
- Test connectivity: `docker exec mr-dj-dynamic-api ping mr-dj-postgres`

---

## ✅ SUCCESS CRITERIA

### Minimum Viable Activation
- ✅ Database running and accessible
- ✅ Backend API running and healthy
- ✅ API accessible via HTTPS
- ✅ Contact form saves to database
- ✅ No critical errors in logs

### Full Feature Activation
- ✅ All above +
- ✅ Config dashboard accessible
- ✅ RentGuy integration configured
- ✅ Email notifications working
- ✅ Metrics endpoint returning data
- ✅ Onboarding service healthy
- ✅ Cronjobs scheduled
- ✅ Alerts configured

---

## 🎯 NEXT STEPS

### Immediate (Do Now)
1. ✅ Document created
2. ⏳ Review with user
3. ⏳ Gather missing credentials (RentGuy, Email)
4. ⏳ Execute Phase 1-5 (Critical path)

### Short-term (Within 24h)
1. Execute Phase 6-8 (Core features)
2. Test all integrations
3. Document any issues
4. Update configuration

### Medium-term (Within week)
1. Execute Phase 9-10 (Optional features)
2. Performance testing
3. Security audit
4. Full documentation

---

## 📞 SUPPORT & DOCUMENTATION

### Configuration Files
- Backend config: `./backend/.env`
- Docker compose: `./docker-compose.yml`
- Nginx config: `/etc/nginx/sites-available/mr-dj.sevensa.nl`

### Logs & Debugging
```bash
# Backend logs
docker logs mr-dj-dynamic-api -f

# Database logs
docker logs mr-dj-postgres -f

# Nginx logs
tail -f /var/log/nginx/mr-dj.sevensa.nl.access.log
tail -f /var/log/nginx/mr-dj.sevensa.nl.error.log
```

### Health Checks
```bash
# Quick status check
docker ps | grep mr-dj

# Backend health
curl https://mr-dj.sevensa.nl/api/health

# Database health
docker exec mr-dj-postgres pg_isready
```

---

**Status**: READY FOR EXECUTION
**Approval Required**: User confirmation + credentials
**Estimated Completion**: 2-3 hours with testing

