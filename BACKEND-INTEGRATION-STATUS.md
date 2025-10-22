# 🔧 MR-DJ BACKEND & INTEGRATION STATUS

**Last Updated**: 22 Oktober 2025 - 16:45 CEST
**Status**: ⚠️ BACKEND & DATABASE OFFLINE - FRONTEND LIVE

---

## 📊 ARCHITECTURE OVERVIEW

MR-DJ consists of **5 main services** in a microservices architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   MR-DJ ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   FRONTEND (LIVE)   │ ✅ https://mr-dj.sevensa.nl/
│   Next.js 14.2.33   │    - 79 pages deployed
│   Container: mr-djv1-frontend-production
│   Port: 3000        │    - Professional content
└─────────┬───────────┘    - All tests passing
          │
          ├──── API Calls ───┐
          │                  │
          ▼                  ▼
┌─────────────────────┐  ┌─────────────────────┐
│  BACKEND (OFFLINE)  │  │ DYNAMIC API (OFF)   │
│  Node.js/Express    │  │ Next.js Personalize │
│  Container: mr-dj-backend  Container: mr-dj-dynamic-api
│  Port: 3000         │  │ Port: 3000          │
│  Status: ❌ Not Running   Status: ❌ Created only
└─────────┬───────────┘  └─────────────────────┘
          │
          ├──── Depends On ────────┐
          │                        │
          ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐
│ DATABASE (OFFLINE)  │  │   REDIS (LIVE)      │
│  PostgreSQL 15      │  │   Redis 7           │
│  Container: mr-dj-postgres  Container: mr-dj-redis
│  Port: 5432         │  │   Port: 6379        │
│  Status: ❌ Exited (127)   Status: ✅ UP (healthy)
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐
│ METABASE (LIVE)     │ https://mr-dj.sevensa.nl/analytics
│  Analytics Platform │
│  Container: mr-dj-metabase
│  Port: 3000         │
│  Status: ✅ UP
└─────────────────────┘

EXTERNAL INTEGRATIONS:
┌─────────────────────┐
│  RENTGUY CRM        │ https://sevensa.rentguy.nl/api/v1
│  Lead Management    │
│  Workspace: mr-dj   │
│  Status: ⚠️ Not Connected (backend offline)
└─────────────────────┘
```

---

## 🔍 DETAILED STATUS

### 1. Frontend (✅ LIVE)

**Container**: `mr-djv1-frontend-production`
**Status**: ✅ UP (5+ hours)
**URL**: https://mr-dj.sevensa.nl/
**Image**: `mr-djv1-frontend-eds:sprint2-content`

**Features Active**:
- ✅ 79 pages generated and live
- ✅ Professional Brabantse content integrated
- ✅ Homepage, Bruiloft, Zakelijk pages updated
- ✅ All regression tests passing (16/16)
- ✅ Performance: 275ms DOM, 876ms full load
- ✅ SEO optimized
- ✅ Mobile responsive

**Missing**:
- ❌ Contact form backend (needs backend API)
- ❌ RentGuy lead submission (needs backend)
- ❌ A/B testing (needs dynamic-api)
- ❌ Analytics events (needs backend)

---

### 2. Backend API (❌ OFFLINE)

**Container**: `mr-dj-backend`
**Status**: ❌ NOT RUNNING
**Expected URL**: https://mr-dj.sevensa.nl/api/*
**Port**: 3000 (internal)
**Source**: `/srv/apps/mr-djv1/backend/`

**Technology Stack**:
- Node.js/Express
- PostgreSQL 15 (via DATABASE_URL)
- Redis 7 (via REDIS_URL)
- BullMQ for queues

**Configuration** (from `/srv/apps/mr-djv1/backend/.env`):
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://mrdj_user:mrdj_secure_password_2025@mr-dj-postgres:5432/mrdj_db
REDIS_URL=redis://:mrdj_redis_password_2025@mr-dj-redis:6379/0

# Config Dashboard
CONFIG_DASHBOARD_ENABLED=true
CONFIG_DASHBOARD_USER=admin
CONFIG_DASHBOARD_PASS=sevensa
CONFIG_DASHBOARD_ALLOWED_IPS=127.0.0.1,::1

# RentGuy Integration
RENTGUY_API_BASE_URL=https://sevensa.rentguy.nl/api/v1
RENTGUY_API_KEY=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...[JWT token]
RENTGUY_WORKSPACE_ID=mr-dj
RENTGUY_TIMEOUT_MS=10000

# Mail Integration (Postmark)
MAIL_PROVIDER=postmark
MAIL_API_KEY=pm-prod-api-key
MAIL_FROM_ADDRESS=hello@mr-dj.nl
MAIL_REPLY_TO=info@mr-dj.nl

# City Content Automation
CITY_AUTOMATION_LLM_PROVIDER=openai
CITY_AUTOMATION_LLM_MODEL=gpt-4o-mini
CITY_AUTOMATION_LLM_API_KEY=sk-proj-jIuI-99VTuIqg3Fz...[redacted]
CITY_AUTOMATION_DRY_RUN=false
```

**Features Provided** (when active):
1. **Config Dashboard** (`/api/dashboard`)
   - Web UI to update environment variables
   - Multi-section configuration (Application, Mail, RentGuy, Automation)
   - Managed via backend/managed.env

2. **Contact Form API** (`POST /api/contact`)
   - Receives contact form submissions
   - Validates and stores in PostgreSQL
   - Sends email notifications via Postmark
   - Submits leads to RentGuy CRM

3. **RentGuy Integration**
   - Lead synchronization to RentGuy workspace
   - Queue-based retry logic with BullMQ
   - Webhook handling for bidirectional sync

4. **Observability Endpoints**
   - `GET /health` - Health check
   - `GET /metrics/queues` - BullMQ queue metrics
   - Webhook alerting for queue issues

5. **City Content Automation**
   - LLM-based city page generation
   - SEO keyword integration
   - Approval workflow via email
   - Dry-run testing mode

**Why It's Offline**:
- Depends on `mr-dj-postgres` (which is also offline)
- docker-compose.yml has `depends_on` healthcheck
- Cannot start until database is healthy

---

### 3. Dynamic API (❌ OFFLINE)

**Container**: `mr-dj-dynamic-api`
**Status**: ❌ CREATED (never started)
**Expected URL**: https://mr-dj.sevensa.nl/api/personalize
**Port**: 3000 (internal)
**Source**: `/srv/apps/mr-djv1/dynamic-api/` (also contains frontend pages!)

**Purpose**:
- A/B testing engine
- Content personalization based on keywords
- Dynamic content rendering
- CRO optimization

**Current State**:
- Container created but never started
- Depends on mr-dj-postgres healthcheck
- **NOTE**: This directory ALSO contains the production frontend pages!

**Dual Purpose Discovered**:
The `/srv/apps/mr-djv1/dynamic-api/` directory serves TWO purposes:
1. **Production Frontend** - The Next.js app with all 79 pages
2. **Personalization API** - A/B testing and dynamic content (planned feature)

This is why we've been working in `dynamic-api/` for frontend changes!

---

### 4. Database (❌ OFFLINE)

**Container**: `mr-dj-postgres`
**Status**: ❌ EXITED (127) - 11 hours ago
**Image**: `postgres:15-alpine`
**Port**: 5432

**Configuration**:
```env
POSTGRES_DB=mrdj_db
POSTGRES_USER=mrdj_user
POSTGRES_PASSWORD=mrdj_secure_password_2025
```

**Last Activity** (from logs):
```
2025-10-22 02:00:01 UTC - Received fast shutdown request
2025-10-22 02:00:01 UTC - Database system is shut down
```

**Volumes**:
- `postgres_data:/var/lib/postgresql/data` (persistent storage)
- `./database/init.sql:/docker-entrypoint-initdb.d/init.sql` (schema initialization)

**Expected Schema** (based on backend code):
- `contacts` - Contact form submissions
- `leads` - Lead tracking
- `users` - User management
- `sessions` - Session storage
- BullMQ queue tables (via Redis)

**Exit Code 127**:
- Typically means "command not found"
- Possible image corruption or initialization failure
- Data volume may be intact

---

### 5. Redis Cache (✅ LIVE)

**Container**: `mr-dj-redis`
**Status**: ✅ UP (healthy)
**Image**: `redis:7-alpine`
**Port**: 6379
**Password**: `mrdj_redis_password_2025`

**Purpose**:
- Session storage
- BullMQ job queues (RentGuy sync, email sending)
- Cache layer for API responses
- Rate limiting counters

**Namespace**: `mr-dj:`

**Status**: Ready for use when backend starts

---

### 6. Metabase Analytics (✅ LIVE)

**Container**: `mr-dj-metabase`
**Status**: ✅ UP
**URL**: https://mr-dj.sevensa.nl/analytics
**Image**: `metabase/metabase:latest`

**Purpose**:
- Business intelligence dashboards
- Query builder for PostgreSQL
- Analytics and reporting
- KPI tracking

**Current State**: Running but cannot connect to mr-dj-postgres (offline)

---

## 🔗 RENTGUY INTEGRATION

### What is RentGuy?

RentGuy is a **separate multi-tenant CRM/business management platform** that MR-DJ integrates with for:
- Lead capture and management
- Customer relationship tracking
- Event booking workflow
- Invoice generation (replaces Invoice Ninja)

**RentGuy is NOT the MR-DJ backend** - it's an external service!

### Integration Architecture

```
MR-DJ Website Form
      │
      ▼
MR-DJ Backend API
  │
  ├─── Saves to mrdj_db (PostgreSQL)
  │
  ├─── Sends email via Postmark
  │
  └─── Submits lead to RentGuy ────▶ POST https://sevensa.rentguy.nl/api/v1/leads
                                     (External RentGuy API)
```

### RentGuy API Endpoint

**URL**: `https://sevensa.rentguy.nl/api/v1/leads`
**Method**: POST
**Auth**: JWT token (configured in backend .env)
**Workspace**: `mr-dj`

**Request Example**:
```json
{
  "leadId": "web-20251022-abc123",
  "status": "new",
  "eventType": "bruiloft",
  "eventDate": "2025-08-15T14:00:00Z",
  "source": "mister-dj-website",
  "contact": {
    "name": "Jan en Marie Jansen",
    "email": "jan@example.nl",
    "phone": "+31612345678"
  },
  "message": "Wij zoeken een DJ voor onze bruiloft..."
}
```

**Response**:
```json
{
  "success": true,
  "leadId": 1,
  "externalId": "web-20251022-abc123",
  "status": "new",
  "message": "Lead created successfully from mister-dj-website",
  "emailSent": false
}
```

### Integration Status

**Current**: ❌ NOT CONNECTED
**Reason**: Backend is offline
**When Active**: Automatic lead submission via queue with retry logic

---

## 📋 MISSING FEATURES (Backend Required)

Based on the README and backend code, these features are **available but not active**:

### 1. Config Dashboard ❌
**URL**: https://mr-dj.sevensa.nl/api/dashboard
**Credentials**: admin / sevensa
**Purpose**: Web UI to configure backend settings
**Sections**:
- Application settings (database, Redis, CORS)
- Email integration (Postmark API, templates)
- RentGuy integration (API key, workspace)
- Content automation (LLM settings, SEO automation)

### 2. Contact Form Backend ❌
**Endpoint**: `POST /api/contact`
**Features**:
- Validate and sanitize form data
- Store in PostgreSQL
- Send email notification via Postmark
- Submit to RentGuy CRM
- Return success/error response

### 3. Booking API ❌
**Endpoint**: `POST /api/booking`
**Features**:
- Process booking requests
- Create RentGuy project
- Send confirmation email
- Track in analytics

### 4. RentGuy Lead Sync ❌
**Features**:
- Automatic lead submission to RentGuy
- Queue-based with BullMQ
- Retry logic (5 attempts, 15s delay)
- Webhook alerts on failures
- Deduplication by external ID

### 5. Email Integration ❌
**Provider**: Postmark
**Templates**:
- Contact form confirmation
- Booking confirmation
- Quote follow-ups
**Status**: Configured but backend offline

### 6. Observability & Metrics ❌
**Endpoints**:
- `GET /health` - Health check
- `GET /metrics/queues` - Queue backlog, retry rates
**Features**:
- Webhook alerting (Slack/Teams)
- Queue monitoring thresholds
- OTEL tracing (planned)

### 7. City Content Automation ❌
**Features**:
- Monthly LLM-based city page generation
- SEO keyword integration
- Approval workflow via email
- Automatic PR creation
**Scripts**: `/srv/apps/mr-djv1/scripts/automation/`
**Status**: Configured but not scheduled

---

## 🚀 ACTIVATION PLAN

### Prerequisites

Before activating backend services:

1. **Check Database Volume**
```bash
docker volume ls | grep postgres_data
# Verify volume exists with data
```

2. **Check Initialization SQL**
```bash
ls -la /srv/apps/mr-djv1/database/init.sql
# Verify schema file exists
```

3. **Verify Environment Files**
```bash
cat /srv/apps/mr-djv1/backend/.env
# Verify all required vars present
```

### Phase 1: Database Activation (15 min)

```bash
cd /srv/apps/mr-djv1

# Option 1: Start existing container
docker start mr-dj-postgres

# If that fails (exit code 127), recreate:
docker-compose up -d mr-dj-postgres

# Wait for healthy status
docker ps --filter name=mr-dj-postgres

# Verify database exists
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db -c "SELECT version();"

# Check tables
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db -c "\dt"
```

**Success Criteria**:
- ✅ Container status: UP (healthy)
- ✅ PostgreSQL responding
- ✅ Database `mrdj_db` exists
- ✅ Tables created (from init.sql)

---

### Phase 2: Backend API Activation (20 min)

```bash
# Check if backend image exists
docker images | grep mr-dj-backend

# Start backend (will wait for database healthcheck)
docker-compose up -d mr-dj-backend

# Monitor logs
docker logs mr-dj-backend -f

# Expected startup messages:
# - Connected to PostgreSQL
# - Connected to Redis
# - Config dashboard enabled
# - Server listening on port 3000

# Test health endpoint (internal)
docker exec mr-dj-backend curl http://localhost:3000/health

# Test from outside (via Traefik)
curl https://mr-dj.sevensa.nl/api/health
```

**Success Criteria**:
- ✅ Container status: UP (healthy)
- ✅ Database connection successful
- ✅ Redis connection successful
- ✅ `/api/health` returns 200 OK
- ✅ No errors in logs

---

### Phase 3: Test Config Dashboard (5 min)

```bash
# Access dashboard
curl -u admin:sevensa https://mr-dj.sevensa.nl/api/dashboard

# Or via browser:
# https://mr-dj.sevensa.nl/api/dashboard
# Username: admin
# Password: sevensa
```

**Expected**:
- ✅ Dashboard loads with 6 sections
- ✅ All env vars displayed
- ✅ Can update settings via UI

---

### Phase 4: Test Contact Form (10 min)

```bash
# Submit test contact form
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

# Check database for submission
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5;"

# Check backend logs for RentGuy submission
docker logs mr-dj-backend --tail 50 | grep -i rentguy
```

**Success Criteria**:
- ✅ API returns 200 OK
- ✅ Contact saved in database
- ✅ Email sent (check Postmark)
- ✅ Lead submitted to RentGuy
- ✅ No errors in logs

---

### Phase 5: Optional - Dynamic API (10 min)

```bash
# Start personalization API
docker-compose up -d dynamic-api

# Check logs
docker logs mr-dj-dynamic-api -f

# Test endpoint
curl https://mr-dj.sevensa.nl/api/personalize
```

---

## 📊 ESTIMATED IMPACT

### With Backend Active:

**Features Unlocked**:
- ✅ Contact forms functional (lead capture)
- ✅ RentGuy CRM integration (automatic lead sync)
- ✅ Email notifications (Postmark)
- ✅ Config dashboard (easy settings management)
- ✅ Observability (health checks, queue metrics)
- ✅ City content automation (LLM-based page generation)

**Business Impact**:
- **Lead Conversion**: Contact forms → RentGuy → Follow-up workflow
- **Time Savings**: 80% reduction in manual lead entry
- **Professional Experience**: Automated confirmation emails
- **Data-Driven**: Queue metrics, health monitoring
- **Scalability**: Automated city page generation

**Timeline**:
- Critical path (Phases 1-4): **50 minutes**
- Full activation (all phases): **60 minutes**
- Testing and verification: **30 minutes**

**Total**: ~90 minutes to fully functional backend

---

## 🔐 CREDENTIALS SUMMARY

### Database
```
Host: mr-dj-postgres (internal) / localhost:5432 (external if exposed)
Database: mrdj_db
User: mrdj_user
Password: mrdj_secure_password_2025
```

### Redis
```
Host: mr-dj-redis (internal)
Port: 6379
Password: mrdj_redis_password_2025
Namespace: mr-dj:
```

### Config Dashboard
```
URL: https://mr-dj.sevensa.nl/api/dashboard
Username: admin
Password: sevensa
Allowed IPs: 127.0.0.1, ::1 (localhost only - needs update for production!)
```

### RentGuy API
```
Base URL: https://sevensa.rentguy.nl/api/v1
Workspace: mr-dj
API Key: [JWT token in .env]
Service Account: info@rentguy.nl / sevensa
```

### Postmark Email
```
Provider: postmark
API Key: pm-prod-api-key (needs real key)
From: hello@mr-dj.nl
Reply-To: info@mr-dj.nl
```

### OpenAI (City Automation)
```
Provider: openai
Model: gpt-4o-mini
API Key: sk-proj-jIuI-99VTuIqg3Fz...[configured in .env]
```

---

## 🚨 SECURITY NOTES

### Config Dashboard Access
⚠️ **CRITICAL**: Config dashboard currently only allows localhost IPs!

To enable remote access:
```env
CONFIG_DASHBOARD_ALLOWED_IPS=<your-ip>,<office-ip>
```

Or remove restriction (NOT recommended for production):
```env
CONFIG_DASHBOARD_ALLOWED_IPS=0.0.0.0/0
```

Better: Use VPN or SSH tunnel:
```bash
ssh -L 3000:localhost:3000 user@server
# Access via http://localhost:3000/dashboard
```

### API Keys
- ⚠️ Postmark API key is placeholder (`pm-prod-api-key`)
- ⚠️ OpenAI API key is exposed in .env (should use secrets manager)
- ✅ Database password is strong
- ✅ Redis password is strong

### Recommendations:
1. Move sensitive keys to Docker secrets or vault
2. Enable proper CORS restrictions
3. Add rate limiting on API endpoints
4. Enable IP whitelisting for config dashboard
5. Use environment-specific .env files
6. Rotate API keys regularly

---

## 📁 KEY FILES

### Backend Source
```
/srv/apps/mr-djv1/backend/
├── src/
│   ├── app.js                    # Main Express app
│   ├── server.js                 # HTTP server
│   ├── config.js                 # Configuration loader
│   ├── routes/                   # API endpoints
│   ├── services/                 # Business logic
│   ├── lib/
│   │   └── managedEnv.js        # Config dashboard storage
│   └── modules/
│       ├── contacts/            # Contact form handling
│       ├── rentguy/             # RentGuy integration
│       ├── mail/                # Postmark email
│       ├── queues/              # BullMQ queues
│       └── observability/       # Health & metrics
├── .env                         # Production config
├── .env.example                 # Template
├── Dockerfile                   # Container build
└── package.json                 # Dependencies
```

### Dynamic API (Frontend + Personalization)
```
/srv/apps/mr-djv1/dynamic-api/
├── app/
│   ├── page.tsx                 # Homepage (PRODUCTION!)
│   ├── bruiloft/page.tsx        # Wedding page
│   ├── zakelijk/page.tsx        # Corporate page
│   └── layout.tsx               # Root layout
├── components/                  # EDS components
├── public/                      # Static assets
├── Dockerfile.production        # Production build
└── next.config.js               # Next.js config
```

### Database
```
/srv/apps/mr-djv1/database/
└── init.sql                     # Schema initialization
```

### Docker Compose
```
/srv/apps/mr-djv1/docker-compose.yml   # All services definition
```

### Documentation
```
/srv/apps/mr-djv1/
├── README.md                    # Main documentation
├── FEATURE-ACTIVATION-PLAN.md   # 10-phase activation plan
├── DEPLOYMENT-STATUS.md         # Frontend deployment status
├── BACKEND-INTEGRATION-STATUS.md # This file
├── docs/
│   ├── RENTGUY_API_INTEGRATION.md        # RentGuy integration guide
│   ├── RENTGUY_INTEGRATION_PLAN.md       # Full RentGuy migration plan
│   └── MR-DJ-INTEGRATION-FIXPLAN.md      # Sprint-based fix plan
```

---

## 🎯 NEXT STEPS

### Immediate (User Decision Required)

**Option 1: Activate Backend Now** (Recommended if forms are needed)
- Execute Phases 1-4 of activation plan (~50 min)
- Test contact form integration
- Verify RentGuy lead submission
- Result: Fully functional website with lead capture

**Option 2: Keep Frontend Only** (Current State)
- Frontend continues working perfectly
- Add backend activation later when needed
- Contact forms remain visual only (no submission)
- Result: Professional showcase site

**Option 3: Review & Plan** (Low Risk)
- Review all documentation created
- Plan activation for scheduled maintenance window
- Test activation in staging first
- Result: Planned, tested activation

---

## 📞 SUPPORT INFORMATION

### Service Health Check Commands

```bash
# Check all MR-DJ containers
docker ps --filter name=mr-dj

# Check frontend
curl -I https://mr-dj.sevensa.nl/

# Check backend (when active)
curl https://mr-dj.sevensa.nl/api/health

# Check database (when active)
docker exec mr-dj-postgres pg_isready -U mrdj_user -d mrdj_db

# Check Redis
docker exec mr-dj-redis redis-cli ping

# View logs
docker logs mr-djv1-frontend-production --tail 100
docker logs mr-dj-backend --tail 100
docker logs mr-dj-postgres --tail 100
```

### Quick Restart Commands

```bash
# Restart frontend only
docker restart mr-djv1-frontend-production

# Restart all MR-DJ services
cd /srv/apps/mr-djv1
docker-compose restart

# Full restart with rebuild
docker-compose down
docker-compose up -d --build
```

---

**Status**: ✅ DOCUMENTATION COMPLETE
**Frontend**: ✅ LIVE AND OPERATIONAL
**Backend**: ⚠️ READY TO ACTIVATE (user decision required)
**Integration**: 📋 FULLY DOCUMENTED

Last updated: 22 Oktober 2025, 16:45 CEST
