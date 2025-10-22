# 🌐 SEVENSA & RENTGUY DOMAIN HIERARCHY

**Created**: 22 Oktober 2025
**Last Updated**: 22 Oktober 2025 - 16:10 CEST
**Server IP**: 147.93.57.40

---

## 📊 DOMAIN ARCHITECTURE OVERVIEW

```
147.93.57.40 (Main Server)
│
├─── sevensa.nl (Company Root Domain)
│    ├── @ → mister-dj.netlify.app (ALIAS - Legacy)
│    ├── www.sevensa.nl → CDN (Customer facing)
│    │
│    ├─── Development & Staging:
│    │    ├── mr-dj.sevensa.nl ✅ (Development environment for mr-dj.nl)
│    │    ├── staging.sevensa.nl (Staging environment)
│    │    └── demo.sevensa.nl (Demo environment)
│    │
│    ├─── Infrastructure Services:
│    │    ├── traefik.sevensa.nl (Reverse proxy/Load balancer)
│    │    ├── keycloak.sevensa.nl (Identity & Access Management)
│    │    ├── oauth.sevensa.nl (OAuth server)
│    │    ├── vault.sevensa.nl (Secrets management)
│    │    └── openbao.sevensa.nl (Secrets management)
│    │
│    ├─── Observability & Monitoring:
│    │    ├── observability.sevensa.nl (Monitoring dashboard)
│    │    ├── grafana.sevensa.nl (Metrics visualization)
│    │    ├── prometheus.sevensa.nl (Metrics collection)
│    │    └── security.sevensa.nl (Security monitoring)
│    │
│    ├─── Automation & Orchestration:
│    │    ├── n8n.sevensa.nl (Workflow automation)
│    │    ├── orchestrator.sevensa.nl (Service orchestrator)
│    │    ├── mcp.sevensa.nl (Model Context Protocol)
│    │    └── langgraph.sevensa.nl (LangGraph workflows)
│    │
│    ├─── AI & Analytics:
│    │    ├── ai.sevensa.nl (AI services)
│    │    ├── sevensaai.sevensa.nl (Sevensa AI platform)
│    │    ├── canary.ai.sevensa.nl (AI canary testing)
│    │    ├── claude.sevensa.nl (Claude API integration)
│    │    └── customer-analyse.sevensa.nl (Customer analytics)
│    │
│    ├─── Business Tools:
│    │    ├── cms.sevensa.nl (Content Management)
│    │    ├── quote-generator.sevensa.nl (Quote generation)
│    │    ├── calculation-engine.sevensa.nl (Pricing calculator)
│    │    ├── data-input.sevensa.nl (Data entry portal)
│    │    ├── roi.sevensa.nl (ROI calculator)
│    │    ├── trading.sevensa.nl (Trading platform)
│    │    └── installer.sevensa.nl (Installation wizard)
│    │
│    ├─── Agency & Partners:
│    │    ├── agency.sevensa.nl (Agency portal)
│    │    ├── lovable.sevensa.nl (Partner platform)
│    │    ├── manus.sevensa.nl (Manual management)
│    │    └── pass-uploader.sevensa.nl (Pass distribution)
│    │
│    └─── Compliance & Security:
│         ├── compliance.sevensa.nl (Compliance monitoring)
│         ├── auth.sevensa.nl (Authentication service)
│         └── wpcs.sevensa.nl (WordPress compliance scanner)
│
└─── rentguy.nl (RentGuy CRM Platform - Multi-tenant)
     ├── @ → rentguy.nl (Customer facing marketing frontend) 🌐
     ├── onboarding.rentguy.nl (Multi-tenant onboarding service)
     ├── observability.rentguy.nl (RentGuy observability)
     │
     └─── Multi-tenant Workspaces:
          ├── mr-dj.rentguy.nl ✅ (MR-DJ tenant - CORRECT URL!)
          │    ├── /api/v1/leads (Lead submission endpoint)
          │    ├── /api/v1/projects (Project management)
          │    ├── /api/v1/invoices (Billing & invoicing)
          │    └── / (CRM Dashboard for MR-DJ)
          │
          ├── sevensa.rentguy.nl (Sevensa internal tenant)
          └── [other-tenant].rentguy.nl (Other tenants...)
```

---

## 🎯 MR-DJ SPECIFIC DOMAINS

### **Production**
- **mr-dj.nl** ❌ (Not yet configured)
  - Target: Production website voor klanten
  - Status: DNS not configured yet

### **Development**
- **mr-dj.sevensa.nl** ✅ (Active - Development environment)
  - IP: 147.93.57.40
  - Container: mr-djv1-frontend-production
  - Purpose: Development/Design environment
  - Status: LIVE - 79 pages, professional content

### **RentGuy CRM Access**
- **mr-dj.rentguy.nl** ✅ (CORRECT URL for API!)
  - Purpose: RentGuy CRM tenant for MR-DJ
  - API Base: https://mr-dj.rentguy.nl/api/v1
  - Dashboard: https://mr-dj.rentguy.nl/
  - Database: rentguy_production (tenant_id: 'mr-dj')

---

## ⚠️ COMMON MISTAKES & CORRECTIONS

### ❌ WRONG URLs (DO NOT USE):
```bash
# WRONG - Sevensa tenant, not MR-DJ!
https://sevensa.rentguy.nl/api/v1/leads

# WRONG - Root domain is customer facing marketing
https://rentguy.nl/api/v1/leads
```

### ✅ CORRECT URLs:
```bash
# CORRECT - MR-DJ tenant API
https://mr-dj.rentguy.nl/api/v1/leads

# CORRECT - MR-DJ CRM Dashboard
https://mr-dj.rentguy.nl/

# CORRECT - Internal container-to-container (when available)
http://rentguy-backend-prod:8000/api/v1/leads
```

---

## 🔄 EXTERNAL vs INTERNAL URLs

### When to use EXTERNAL (https://):
- From client browsers
- From external services
- When SSL/TLS is required
- Example: Frontend → Backend API

### When to use INTERNAL (http://container:port):
- Container-to-container communication
- Within Docker network (sevensa-edge)
- Faster (no SSL overhead)
- Example: mr-dj-backend → rentguy-backend-prod

---

## 📁 ENVIRONMENT-SPECIFIC CONFIGURATION

### Development (mr-dj.sevensa.nl)
```env
# Frontend
PUBLIC_URL=https://mr-dj.sevensa.nl
NEXT_PUBLIC_API_URL=https://mr-dj.sevensa.nl/api

# Backend
RENTGUY_API_BASE_URL=http://rentguy-backend-prod:8000/api/v1  # Internal!
# OR
RENTGUY_API_BASE_URL=https://mr-dj.rentguy.nl/api/v1  # External (when internal not available)

RENTGUY_WORKSPACE_ID=mr-dj
```

### Production (mr-dj.nl - future)
```env
# Frontend
PUBLIC_URL=https://www.mr-dj.nl
NEXT_PUBLIC_API_URL=https://www.mr-dj.nl/api

# Backend
RENTGUY_API_BASE_URL=https://mr-dj.rentguy.nl/api/v1
RENTGUY_WORKSPACE_ID=mr-dj
```

---

## 🗄️ DATABASE ARCHITECTURE

### Multi-tenant RentGuy Database
```
rentguy_production (PostgreSQL @ rentguy-db-prod)
│
├── Tenant Isolation via `tenant_id` column:
│   ├── tenant_id = 'mr-dj' ✅ (MR-DJ data)
│   ├── tenant_id = 'sevensa' (Sevensa internal)
│   └── tenant_id = '[other]' (Other tenants)
│
├── crm_leads (3 mr-dj leads found) ✅
├── crm_projects
├── inv_items (inventory)
├── bil_invoices (billing)
└── ... (45 tables total)
```

### MR-DJ Local Database
```
mrdj_db (PostgreSQL @ mr-dj-postgres)
│
├── contacts (7 entries) ✅
├── bookings (0 entries)
├── packages (3 entries) ✅
├── reviews (3 entries) ✅
└── ab_* tables (A/B testing) ✅
```

---

## 🔗 INTEGRATION FLOW

### Contact Form Submission Flow:
```
1. User fills form on https://mr-dj.sevensa.nl/
   ↓
2. Frontend sends POST to https://mr-dj.sevensa.nl/api/contact
   ↓
3. Nginx routes to mr-dj-backend container (172.18.0.12:3000)
   ↓
4. Backend saves to LOCAL database (mrdj_db.contacts)
   ↓
5. Backend submits to RentGuy (internal: http://rentguy-backend-prod:8000/api/v1/leads)
   ↓
6. RentGuy saves to rentguy_production.crm_leads (tenant_id='mr-dj')
   ↓
7. Response back to user: "Bedankt voor je bericht!"
```

---

## 📊 DNS RECORDS SUMMARY

### A Records (all point to 147.93.57.40):
```
sevensa.nl subdomains:
- mr-dj.sevensa.nl ✅ (Development)
- staging.sevensa.nl (Staging)
- traefik.sevensa.nl (Reverse proxy)
- keycloak.sevensa.nl (IAM)
- n8n.sevensa.nl (Automation)
- grafana.sevensa.nl (Monitoring)
- ai.sevensa.nl (AI services)
- [30+ other services...]

rentguy.nl subdomains:
- rentguy.nl (Marketing frontend)
- onboarding.rentguy.nl (Onboarding)
- observability.rentguy.nl (Monitoring)
- [tenant].rentguy.nl (Multi-tenant workspaces)
```

### CNAME Records:
```
- www.sevensa.nl → www.sevensa.nl.cdn.hstgr.net (CDN)
- autodiscover → autodiscover.mail.hostinger.com (Email)
- autoconfig → autoconfig.mail.hostinger.com (Email)
```

### ALIAS Record:
```
- @ (sevensa.nl root) → mister-dj.netlify.app (Legacy)
```

---

## 🔐 SSL/TLS CERTIFICATES

All subdomains on 147.93.57.40 use Let's Encrypt certificates via:
- CAA records allow: letsencrypt.org, pki.goog, digicert.com, sectigo.com, comodoca.com, globalsign.com
- Certificates managed by acme.sh on server
- Wildcard certificates enabled via `issuewild` CAA records

---

## 📧 EMAIL CONFIGURATION

- **Provider**: Hostinger
- **MX Records**:
  - Priority 5: mx1.hostinger.com
  - Priority 10: mx2.hostinger.com
- **SPF**: `v=spf1 include:_spf.mail.hostinger.com ~all`
- **DMARC**: `v=DMARC1; p=none`
- **DKIM**: hostingermail-a, hostingermail-b, hostingermail-c

---

## 🚀 TRAEFIK ROUTING

All services behind Traefik reverse proxy (traefik.sevensa.nl):
- Automatic HTTPS via Let's Encrypt
- Docker labels for service discovery
- Network: sevensa-edge (172.18.0.0/16)

Example routing:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.mrdj-frontend.rule=Host(`mr-dj.sevensa.nl`)"
  - "traefik.http.routers.mrdj-frontend.entrypoints=websecure"
  - "traefik.http.routers.mrdj-frontend.tls.certresolver=letsencrypt"
```

---

## 📚 RELATED DOCUMENTATION

- `/srv/apps/RentGuy-v1/docs/multi_tenant_subdomain_rollout.md` - RentGuy multi-tenant architecture
- `/srv/apps/mr-djv1/docs/RENTGUY_API_INTEGRATION.md` - API integration guide
- `/srv/apps/mr-djv1/docs/capability-activation-report.md` - Feature activation
- `/srv/apps/mr-djv1/BACKEND-INTEGRATION-STATUS.md` - Backend integration status
- `/srv/apps/mr-djv1/DEPLOYMENT-STATUS.md` - Frontend deployment status

---

## ✅ CONFIGURATION CHECKLIST

### MR-DJ Backend Configuration:
```env
# ✅ CORRECT Configuration
RENTGUY_API_BASE_URL=https://mr-dj.rentguy.nl/api/v1
RENTGUY_WORKSPACE_ID=mr-dj
RENTGUY_API_KEY=[JWT token with workspace=mr-dj]
RENTGUY_TIMEOUT_MS=10000

# ❌ WRONG - DO NOT USE
RENTGUY_API_BASE_URL=https://sevensa.rentguy.nl/api/v1  # Wrong tenant!
RENTGUY_API_BASE_URL=https://rentguy.nl/api/v1  # Marketing site, no API!
```

### Network Connectivity:
- ✅ mr-dj-backend on sevensa-edge network
- ✅ rentguy-backend-prod on sevensa-edge network
- ✅ Can use internal: `http://rentguy-backend-prod:8000/api/v1`
- ✅ Can use external: `https://mr-dj.rentguy.nl/api/v1`

---

**Status**: ✅ ARCHITECTURE DOCUMENTED
**Next Step**: Fix RENTGUY_API_BASE_URL to use correct tenant URL

Last updated: 22 Oktober 2025, 16:10 CEST
