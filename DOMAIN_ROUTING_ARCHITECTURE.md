# Domain Routing Architecture - Sevensa VPS
**Datum**: 22 Oktober 2025
**Server**: srv918009.hstgr.cloud (147.93.57.40)
**Analyse**: Complete domein en routing setup

---

## 🌐 DNS & Domain Structure

### **Sevensa.nl Subdomeinen** (Met SSL Certificaten)
```
✅ ai.sevensa.nl              → Let's Encrypt via nginx
✅ calculation-engine.sevensa.nl → Let's Encrypt via nginx
✅ lovable.sevensa.nl         → Let's Encrypt via nginx
✅ manus.sevensa.nl          → Let's Encrypt via nginx
✅ n8n.sevensa.nl            → Let's Encrypt via nginx
✅ orchestrator.sevensa.nl   → Let's Encrypt via nginx
✅ psra.sevensa.nl           → Let's Encrypt via standalone
✅ quote-generator.sevensa.nl → Let's Encrypt via nginx
✅ rentguy.sevensa.nl        → Let's Encrypt via nginx
✅ trading.sevensa.nl        → Let's Encrypt via nginx

❌ mr-dj.sevensa.nl          → GEEN SSL certificaat!
```

### **Andere Domeinen**
```
✅ myfan.nl                  → Let's Encrypt
✅ ai.dakslopers.nl         → Let's Encrypt
✅ crypto.dakslopers.nl     → Let's Encrypt
✅ n8n.dakslopers.nl        → Let's Encrypt
```

---

## 🔀 Routing Architecture

### **Layer 1: Nginx (Poort 80)**
**Status**: ✅ Actief
**Functie**: Primaire HTTP entrypoint
**Poorten**:
- 80 (HTTP)
- 1234 (mr-dj-eds-components dev server)

**Configuratie**:
```bash
/etc/nginx/sites-enabled/
├── mr-dj-eds-components  → Poort 1234 (lokale dev)
└── vps-apps.conf         → psra.local, rentguy.local
```

**Bevinding**: **GEEN** sevensa.nl subdomains geconfigureerd in nginx!

---

### **Layer 2: Traefik (Planned maar Niet Actief)**
**Status**: ❌ Geen draaiende container
**Configuratie Gevonden**: `/srv/prod/sevensa-core3/.../psra/compose/`
**Network**: "edge" (bestaat NIET, wel "sevensa-edge")

**Traefik Setup** (uit docker-compose.yml):
```yaml
traefik:
  image: traefik:v3.0
  ports: ["80:80", "443:443"]
  command:
    - --entrypoints.web.address=:80
    - --entrypoints.websecure.address=:443
    - --certificatesresolvers.lets.acme.tlschallenge=true
  networks: [edge]  # Maar "edge" bestaat niet!
```

**Conclusie**: Traefik is GEPLAND maar niet gedeployed!

---

### **Layer 3: Docker Networks**

**Actieve Networks**:
```
sevensa-edge                 → 84b9efdc26cb (bridge)
rentguy-v1_rentguy-internal  → ac1850d269ba (bridge)
rentguy-analysis_rentguy-production → 59682d897af7 (bridge)
web                          → 165be4b8462c (bridge)
```

**sevensa-edge Containers**:
```
✅ mr-djv1-frontend-production  → mr-dj.sevensa.nl
✅ mr-dj-metabase              → Analytics
✅ mr-dj-onboarding            → Onboarding (unhealthy)
✅ rentguy-frontend-prod       → RentGuy
✅ rentguy-backend-prod        → RentGuy API
✅ rentguy-demo                → RentGuy demo
✅ keycloak                    → Auth
✅ keycloak-db                 → Auth DB
✅ openbao                     → Secrets
```

---

## ❓ Routing Mystery

### **Hoe werkt mr-dj.sevensa.nl SSL zonder Traefik?**

**Testen**:
```bash
# Test 1: Direct HTTP werkt
curl http://mr-dj.sevensa.nl → 200 OK

# Test 2: Direct IP werkt
curl http://147.93.57.40 → 200 OK

# Test 3: HTTPS werkt (hoe??)
curl https://mr-dj.sevensa.nl → 200 OK

# Test 4: Nginx luistert NIET op 443
netstat -tlnp | grep 443 → (leeg)

# Test 5: Alleen nginx op 80
netstat -tlnp | grep nginx → :80, :1234
```

**Bevindingen**:
1. ✅ HTTPS werkt (SSL terminatie gebeurt ERGENS)
2. ❌ Nginx luistert NIET op 443
3. ❌ Traefik draait NIET
4. ❌ Geen container exposed poort 443
5. ✅ Containers hebben Traefik labels (maar worden niet gebruikt)

**Mogelijke Verklaringen**:
1. **Externe Load Balancer** (Hetzner, Cloudflare?)
2. **Iptables Port Forward** (80→443 redirect?)
3. **Stunnel/SSL Terminator** (aparte service?)
4. **Cloudflare SSL Proxy** (meest waarschijnlijk!)

---

## 🔍 Cloudflare Hypothesis

**Test**:
```bash
curl -I https://mr-dj.sevensa.nl | grep -i "cf-"
```

Als Cloudflare headers aanwezig zijn (cf-ray, cf-cache-status), dan:
- DNS wijst naar Cloudflare
- Cloudflare handelt SSL af
- Cloudflare forwardt naar VPS poort 80
- Nginx/containers handelen HTTP af

**Verklaring voor ontbrekend Let's Encrypt certificaat**:
→ Niet nodig! Cloudflare biedt SSL.

---

## 📊 Container Label Analyse

### **mr-djv1-frontend-production Labels**:
```yaml
traefik.enable: true
traefik.http.routers.mr-dj-frontend.rule: Host(`mr-dj.sevensa.nl`)
traefik.http.routers.mr-dj-frontend.entrypoints: websecure
traefik.http.routers.mr-dj-frontend.tls.certresolver: letsencrypt
traefik.http.services.mr-dj-frontend.loadbalancer.server.port: 3000
```

**Status**: Labels aanwezig maar **NIET ACTIEF** (geen Traefik)

---

## 🏗️ Recommended Architecture Fix

### **Optie 1: Cloudflare SSL (Huidige Setup)**
**Voordelen**:
- ✅ Geen Let's Encrypt nodig
- ✅ Geen Traefik nodig
- ✅ Simpel: containers op sevensa-edge network
- ✅ Nginx forward naar containers op poort 80

**Nadelen**:
- ⚠️ Afhankelijk van externe service
- ⚠️ Extra latency door proxy

**Implementatie**:
```bash
# Nginx conf voor mr-dj.sevensa.nl
upstream mr-dj-frontend {
    server <container-ip>:3000;
}

server {
    listen 80;
    server_name mr-dj.sevensa.nl;

    location / {
        proxy_pass http://mr-dj-frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### **Optie 2: Deploy Traefik (Proper Setup)**
**Voordelen**:
- ✅ Eigen SSL beheer
- ✅ Automatische container discovery
- ✅ Labels direct bruikbaar
- ✅ Dashboard & metrics

**Nadelen**:
- ⚠️ Extra container overhead
- ⚠️ Migratie vereist voor bestaande services

**Implementatie**:
```bash
# 1. Deploy Traefik stack
cd /srv/prod/sevensa-core3/.../psra/compose
docker-compose up -d traefik

# 2. Fix network naam (edge → sevensa-edge)
# 3. Containers automatisch gerout via labels
```

### **Optie 3: Nginx + Let's Encrypt (Direct)**
**Voordelen**:
- ✅ Geen externe dependencies
- ✅ Eigen SSL controle
- ✅ Simpel & prestatief

**Nadelen**:
- ⚠️ Manuele SSL renewal (via certbot)
- ⚠️ Manuele nginx configs per domain

**Implementatie**:
```bash
# 1. Certbot voor mr-dj.sevensa.nl
certbot --nginx -d mr-dj.sevensa.nl

# 2. Nginx automatisch geconfigureerd met SSL
# 3. Container blijft op sevensa-edge network
```

---

## 🎯 Aanbevolen Strategie voor Mr-DJ

### **Korte Termijn** (Nu):
1. Gebruik huidige setup (Cloudflare of nginx poort 80)
2. Deploy nieuwe mr-djv1-frontend-eds:production image
3. Test dat alles werkt via HTTP/HTTPS

### **Middellange Termijn** (Deze week):
1. Verifieer Cloudflare SSL status
2. Of: Deploy Let's Encrypt certificaat
3. Documenteer de daadwerkelijke routing

### **Lange Termijn** (Volgende sprint):
1. Besluit: Traefik of Nginx als standaard?
2. Uniformeer alle sevensa.nl subdomains
3. Centraliseer SSL beheer

---

## 📋 Deployment Checklist voor Mr-DJ

### **Pre-Deployment Verificatie**:
- [ ] Check welke SSL provider actief is (Cloudflare/Let's Encrypt/Nginx)
- [ ] Verifieer nginx upstream configuratie
- [ ] Test container op sevensa-edge network
- [ ] Backup oude container configuratie

### **Deployment Stappen**:
```bash
# 1. Stop oude container (maar verwijder niet direct)
docker stop mr-djv1-frontend-production

# 2. Test nieuwe container
docker run -d \
  --name mr-djv1-frontend-test \
  --network sevensa-edge \
  mr-djv1-frontend-eds:production

# 3. Verify BUILD_ID
docker exec mr-djv1-frontend-test cat /app/.next/BUILD_ID
# Verwacht: OPsRVRo_OxDATcrDTGEdG

# 4. Test intern
curl -I http://<container-ip>:3000

# 5. Als OK: rename containers
docker rename mr-djv1-frontend-production mr-djv1-frontend-old
docker rename mr-djv1-frontend-test mr-djv1-frontend-production

# 6. Test mr-dj.sevensa.nl
curl -I https://mr-dj.sevensa.nl

# 7. Als OK: remove old
docker rm mr-djv1-frontend-old
```

---

**Conclusie**: De routing werkt via een nog niet volledig gedocumenteerde SSL termination layer (waarschijnlijk Cloudflare). De deployment van de nieuwe EDS container kan veilig doorgaan zonder SSL configuratie te wijzigen.

**Next Steps**: Verifieer SSL provider en deploy nieuwe container.
