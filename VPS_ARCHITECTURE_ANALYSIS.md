# VPS Architecture Analysis - Mr-DJ Setup
**Datum**: 22 Oktober 2025
**Server**: srv918009.hstgr.cloud (147.93.57.40)

## 🏗️ Huidige Architectuur Overzicht

### **Twee Parallelle Deployments**

#### 1. `/opt/mr-dj` - **Originele Deployment (Deels Inactief)**
- **Status**: Alleen Redis container actief
- **Git Repository**: Aanwezig (8 commits)
- **Technologie Stack**:
  - Traefik reverse proxy (geplanned, maar niet actief)
  - React frontend (mr-dj-eds-frontend)
  - Node.js backend (mr-dj-backend)
  - PostgreSQL database (mr-dj-postgres)
  - Redis cache (mr-dj-redis) ✅ **ACTIEF**

- **Docker Compose Services** (grotendeels gestopt):
  ```
  ✅ mr-dj-redis         (Up 9 hours, healthy)
  ❌ mr-dj-eds-frontend  (Gestopt)
  ❌ mr-dj-backend       (Gestopt)
  ❌ mr-dj-postgres      (Gestopt)
  ```

- **Documentatie**:
  - Uitgebreide GA4, SEO, deployment docs
  - STATUS_RAPPORT.md beschrijft deployment op mr-dj.sevensa.nl
  - Laatste activiteit: 20 oktober 2025

#### 2. `/srv/apps/mr-djv1` - **Actieve Deployment (EDS Components)**
- **Status**: **ACTIEF** - Serveert mr-dj.sevensa.nl
- **Git Repository**: 14 commits ahead of origin
- **Technologie Stack**:
  - Next.js 14.2 (dynamic-api met EDS componenten)
  - Prisma ORM
  - Radix UI componenten
  - Docker standalone deployment

- **Actieve Container**:
  ```
  ✅ mr-djv1-frontend-production (Up 9 hours)
     - Image: e89dbecff8fe (oude build zonder EDS componenten)
     - Network: sevensa-edge
     - Labels: Traefik routing voor mr-dj.sevensa.nl
     - Port: 3000 (intern)
     - BUILD_ID: OLGvUc9c-Ic-zIiN2E9GN (21 oktober)
  ```

- **Nieuwste Build** (NIET actief):
  ```
  📦 mr-djv1-frontend-eds:production
     - BUILD_ID: OPsRVRo_OxDATcrDTGEdG (22 oktober)
     - Bevat: 79 statische pagina's met EDS componenten
     - Status: Gebouwd maar niet deployed
  ```

- **Recente Commits**:
  ```
  44974c5 - Batch 03 – CI verify-all strikt en fail-fast
  35c24ec - Re-enable skipped components and create missing UI elements
  0fa970c - Fix AI-generated components and build compilation
  9540d9a - Add high-priority EDS components and improved generation tooling
  ```

---

## 🌐 Reverse Proxy & Routing

### **Nginx (Primaire Reverse Proxy)**
- **Status**: ✅ Actief (systemd)
- **Poort 80**: Luistert op 0.0.0.0:80
- **Configuratie**:
  - `/etc/nginx/sites-enabled/mr-dj-eds-components` (poort 1234, lokale dev)
  - `/etc/nginx/sites-enabled/vps-apps.conf` (lokale upstreams)
  - **Geen directe mr-dj.sevensa.nl configuratie gevonden**

### **Traefik (Labels-based Routing)**
- **Status**: ❌ Geen actieve Traefik container gevonden
- **Docker Labels**: Containers hebben Traefik labels, maar Traefik draait niet:
  ```
  traefik.http.routers.mr-dj-frontend.rule=Host(`mr-dj.sevensa.nl`)
  traefik.http.routers.mr-dj-frontend.entrypoints=websecure
  traefik.http.routers.mr-dj-frontend.tls.certresolver=letsencrypt
  ```

### **Routing Mysterie** 🔍
**Vraag**: Hoe bereikt mr-dj.sevensa.nl de container?
- `curl http://mr-dj.sevensa.nl` → ✅ Werkt (200 OK, Next.js content)
- `curl http://147.93.57.40` → ✅ Werkt (zelfde content)
- DNS: mr-dj.sevensa.nl → 147.93.57.40 ✅
- Nginx luistert op poort 80 ✅
- Traefik draait NIET ❌
- Container has Traefik labels ✅
- **Conclusie**: Nginx moet forwarden naar container, maar config is niet gevonden

---

## 📦 Container Ecosysteem

### **Actieve Containers** (Total: 16)

#### **Mr-DJ Containers**:
```
mr-djv1-frontend-production  → mr-dj.sevensa.nl (oude build)
mr-dj-metabase               → Analytics dashboard
mr-dj-onboarding             → Onboarding flow (unhealthy)
mr-dj-redis                  → Cache (healthy)
```

#### **RentGuy Production**:
```
rentguy-frontend-prod        → RentGuy frontend
rentguy-backend-prod         → RentGuy API
rentguy-celery-worker-prod   → Background tasks
rentguy-celery-beat-prod     → Scheduled tasks
rentguy-db-prod              → PostgreSQL + PostGIS
rentguy-redis-prod           → Redis cache
rentguy-backup-prod          → Database backups
rentguy-demo                 → Demo environment
```

#### **Shared Services**:
```
openbao                      → Secrets management
keycloak                     → Identity provider
keycloak-db                  → Keycloak database
```

### **Docker Networks**:
```
sevensa-edge                 → Main production network
rentguy-v1_rentguy-internal  → RentGuy internal
web                          → Legacy network
```

---

## 🔐 SSL/TLS Certificates

**Let's Encrypt Certificates** (via certbot):
```
✅ ai.sevensa.nl
✅ calculation-engine.sevensa.nl
✅ lovable.sevensa.nl
✅ manus.sevensa.nl
✅ n8n.sevensa.nl
✅ orchestrator.sevensa.nl
✅ psra.sevensa.nl
✅ quote-generator.sevensa.nl
✅ rentguy.sevensa.nl
✅ trading.sevensa.nl
❌ mr-dj.sevensa.nl (ONTBREEKT!)
```

**Bevinding**: Geen SSL certificaat voor mr-dj.sevensa.nl gevonden!

---

## 📊 Build Status Vergelijking

### **Container (Actief)** - 21 oktober
```
BUILD_ID: OLGvUc9c-Ic-zIiN2E9GN
- Oude Next.js build
- GEEN EDS componenten structuur
- GEEN components/ directory
- Standalone mode actief
```

### **Host Build (Nieuw)** - 22 oktober
```
BUILD_ID: OPsRVRo_OxDATcrDTGEdG
- Volledige EDS componenten:
  ├── atoms/
  ├── molecules/
  ├── organisms/
  ├── templates/
  └── ui/
- 79 statische pagina's
- TypeScript + Prisma
- All verifications passed ✅
```

**Discrepantie**: Container draait 1+ dag oude build zonder nieuwe features!

---

## 🎯 Problemen & Aanbevelingen

### **Kritieke Bevindingen**:

1. **Oude Build Actief** 🔴
   - Container serveert build van 21 oktober
   - Nieuwe EDS componenten (22 oktober) niet deployed
   - 79 nieuwe pagina's niet beschikbaar

2. **Ontbrekend SSL Certificaat** 🔴
   - mr-dj.sevensa.nl heeft geen Let's Encrypt cert
   - Mogelijk plain HTTP of andere SSL source?

3. **Geen Traefik Container** 🟡
   - Traefik labels aanwezig maar Traefik draait niet
   - Routing werkt toch (via nginx?)
   - Onduidelijke proxy setup

4. **Duplicaat Deployments** 🟡
   - /opt/mr-dj en /srv/apps/mr-djv1 parallel
   - Alleen Redis uit /opt/mr-dj actief
   - Verwarrende structuur

5. **Unhealthy Container** 🟡
   - mr-dj-onboarding = unhealthy status
   - Moet gecheckt worden

### **Aanbevolen Acties**:

#### **Prioriteit 1 - Deployment Update** (30 min)
```bash
# 1. Stop oude container
docker stop mr-djv1-frontend-production
docker rm mr-djv1-frontend-production

# 2. Start nieuwe build
docker run -d \
  --name mr-djv1-frontend-production \
  --network sevensa-edge \
  --restart unless-stopped \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.mr-dj-frontend.rule=Host(\`mr-dj.sevensa.nl\`)" \
  --label "traefik.http.routers.mr-dj-frontend.entrypoints=websecure" \
  --label "traefik.http.routers.mr-dj-frontend.tls.certresolver=letsencrypt" \
  --label "traefik.http.services.mr-dj-frontend.loadbalancer.server.port=3000" \
  mr-djv1-frontend-eds:production

# 3. Verify
curl -I http://mr-dj.sevensa.nl
docker exec mr-djv1-frontend-production cat /app/.next/BUILD_ID
```

#### **Prioriteit 2 - Routing Analyse** (1 uur)
```bash
# 1. Find nginx config voor mr-dj.sevensa.nl
grep -r "mr-dj.sevensa.nl" /etc/nginx/

# 2. Check actieve nginx upstream
nginx -T | grep -A 20 "mr-dj"

# 3. Determine: nginx direct → container OF nginx → traefik → container
```

#### **Prioriteit 3 - SSL Certificaat** (30 min)
```bash
# 1. Generate Let's Encrypt certificaat
certbot --nginx -d mr-dj.sevensa.nl

# 2. Verify SSL
curl -I https://mr-dj.sevensa.nl

# 3. Check cert
openssl s_client -connect mr-dj.sevensa.nl:443 -servername mr-dj.sevensa.nl
```

#### **Prioriteit 4 - Cleanup** (1 uur)
```bash
# 1. Consolideer deployments
# 2. Stop/verwijder oude /opt/mr-dj containers (behalve Redis if needed)
# 3. Update documentatie met definitieve architectuur
```

---

## 📝 Vragen Voor Gebruiker

1. **Deployment Voorkeur**:
   - Welke deployment is de "source of truth"?
   - /opt/mr-dj of /srv/apps/mr-djv1?

2. **Redis Gebruik**:
   - Is mr-dj-redis uit /opt/mr-dj actief in gebruik?
   - Moet het blijven draaien?

3. **SSL Setup**:
   - Hoe is SSL momenteel geconfigureerd?
   - Via Let's Encrypt, Cloudflare, of andere?

4. **Traefik vs Nginx**:
   - Is Traefik gewenst als reverse proxy?
   - Of blijven bij nginx direct routing?

---

**Analyse Compleet**: 22 Oktober 2025, 11:00
**Door**: Claude Code AI Assistant
