# TODO List - Mr. DJ Website

**Project**: Mr. DJ Website (staging.sevensa.nl)  
**Datum**: 16 Oktober 2025  
**Status**: React SPA met 55+ landingspagina's gedeployed

---

## 🔴 **PRIORITEIT 1 - Kritieke Configuratie**

### T1.1: Google Tag Manager ID Configureren
**Status**: ⚪ Te doen  
**Beschrijving**: Vervang `GTM-PLACEHOLDER` met echte Google Tag Manager container ID  
**Locatie**: `/opt/mr-dj/mr-dj-eds-components/dist/index.html` (lines 10, 36)  
**Actie**:
1. Maak GTM container aan op https://tagmanager.google.com
2. Kopieer container ID (format: GTM-XXXXXXX)
3. Vervang beide `GTM-PLACEHOLDER` instanties
4. Rebuild React app: `cd /opt/mr-dj/mr-dj-eds-components && npm run build`
5. Deploy nieuwe build naar staging

**Prioriteit**: 🔴 Hoog  
**Geschatte tijd**: 30 minuten

---

### T1.2: Complianz Cookie Consent Site ID
**Status**: ⚪ Te doen  
**Beschrijving**: Vervang placeholder Complianz URL met echte site configuratie  
**Locatie**: `/opt/mr-dj/mr-dj-eds-components/dist/index.html` (line 30)  
**Huidige waarde**: `data-site-id="YOUR_SITE_ID"`  
**Actie**:
1. Registreer site op https://complianz.io of kies alternatief (Cookiebot, OneTrust)
2. Verkrijg site ID
3. Update script tag in source: `/opt/mr-dj/mr-dj-eds-components/index.html`
4. OF: Verwijder Complianz en implementeer andere consent oplossing
5. Rebuild en deploy

**Alternatief**: Implementeer eigen consent banner  
**Prioriteit**: 🔴 Hoog (GDPR compliance)  
**Geschatte tijd**: 1-2 uur

---

### T1.3: Page Titles Optimaliseren
**Status**: ✅ Voltooid (16 Okt 2025)
**Beschrijving**: Huidige title is generiek "mr-dj-eds-components"
**Locatie**: `/opt/mr-dj/mr-dj-eds-components/dist/index.html` (line 28)
**Actie**:
1. ✅ Update title in main index.html naar: "Mister DJ - Dé Feestspecialist van het Zuiden"
2. ✅ Zorg dat React Router dynamische titles toepast per pagina via react-helmet
3. ✅ Test alle landingspagina's hebben unieke, SEO-geoptimaliseerde titles

**Prioriteit**: 🔴 Hoog (SEO)
**Geschatte tijd**: 1 uur
**Werkelijke tijd**: 1 uur (incl. merge conflict fixes)

---

## 🟡 **PRIORITEIT 2 - Belangrijke Features**

### T2.1: Backend API Integratie
**Status**: ⚪ Te doen  
**Beschrijving**: Backend API (mr-dj-backend) draait maar is niet geïntegreerd met frontend  
**Locatie**: Backend op `https://staging.sevensa.nl/api`  
**Actie**:
1. Test backend endpoints: `curl https://staging.sevensa.nl/api/health`
2. Connect contact form naar backend `/api/contacts`
3. Implementeer booking systeem endpoints
4. Add error handling en loading states in React

**Prioriteit**: 🟡 Medium  
**Geschatte tijd**: 4-6 uur

---

### T2.2: Branding & Logo Update
**Status**: ⚪ Te doen  
**Beschrijving**: Gebruik officieel Mr. DJ logo in plaats van favicon.ico  
**Locatie**: Logo beschikbaar in `/opt/mr-dj/frontend/public.backup.*/assets/images/logo.webp`  
**Actie**:
1. Kopieer logo.webp en logo.png naar React app assets
2. Update favicon naar branded icon
3. Add logo in DjSaxLanding component header
4. Zorg voor consistent logo gebruik over alle pagina's

**Prioriteit**: 🟡 Medium  
**Geschatte tijd**: 2 uur

---

### T2.3: Contact Formulier Werkend Maken
**Status**: ⚪ Te doen  
**Beschrijving**: Contact formulieren op landingspagina's moeten functioneel zijn  
**Actie**:
1. Connect forms naar backend API endpoint
2. Implementeer form validatie (client & server side)
3. Add email notificaties via backend
4. Success/error messages tonen aan gebruiker
5. Google Analytics event tracking voor form submissions

**Prioriteit**: 🟡 Medium  
**Geschatte tijd**: 3-4 uur

---

### T2.4: Schema.org Structured Data Verificatie
**Status**: ⚪ Te doen  
**Beschrijving**: Verifieer dat Schema.org markup correct is geïmplementeerd  
**Actie**:
1. Test met Google Rich Results Test: https://search.google.com/test/rich-results
2. Voeg LocalBusiness schema toe voor elke stad-pagina
3. Add review markup met aggregateRating
4. Event schema voor DJ services
5. BreadcrumbList voor navigatie

**Prioriteit**: 🟡 Medium (SEO)  
**Geschatte tijd**: 2-3 uur

---

## 🟢 **PRIORITEIT 3 - Nice to Have**

### T3.1: Testimonials Carousel Implementeren
**Status**: ⚪ Te doen  
**Beschrijving**: Brand guidelines specificeren testimonials carousel (niet alleen statische kaarten)  
**Locatie**: Testimonials component  
**Actie**:
1. Implementeer carousel library (Swiper.js, react-slick)
2. Add auto-play met 5 seconden interval
3. Touch/swipe support voor mobile
4. Navigation arrows en dots
5. Lazy loading voor performance

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 2-3 uur

---

### T3.2: Klant Logo's Toevoegen (Social Proof)
**Status**: ⚪ Te doen  
**Beschrijving**: Brand guidelines noemen "Logo's van bekende klanten" in Social Proof sectie  
**Actie**:
1. Verzamel client logos (met toestemming)
2. Optimaliseer images (WebP, lazy loading)
3. Add "Vertrouwd door" sectie
4. Grayscale hover effect voor visuele consistency

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 2 uur (excl. logo verzameling)

---

### T3.3: "Over Ons" Sectie Toevoegen
**Status**: ⚪ Te doen  
**Beschrijving**: Navigatie heeft "Over Ons" link maar sectie bestaat niet  
**Actie**:
1. Add "Over Ons" section in DjSaxLanding component
2. Content: Wie is Mister DJ, 15+ jaar verhaal, missie/visie
3. Team foto of DJ setup foto
4. Consistent met brand guidelines tone of voice

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 2 uur

---

### T3.4: A/B Testing Implementatie Voltooien
**Status**: ⚪ Te doen  
**Beschrijving**: A/B testing framework is aanwezig maar niet volledig geconfigureerd  
**Locatie**: `/opt/mr-dj/mr-dj-eds-components/src/App.jsx` (variant logic)  
**Actie**:
1. Define A/B test scenarios (bijv. verschillende CTA button teksten)
2. Implementeer variant tracking in GTM
3. Setup Google Optimize of andere A/B tool
4. Document test procedures

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 4-6 uur

---

### T3.5: Performance Optimalisatie
**Status**: ⚪ Te doen  
**Beschrijving**: Optimaliseer page load times voor betere UX en SEO  
**Actie**:
1. Run Lighthouse audit en fix issues
2. Optimize images (WebP, lazy loading, responsive images)
3. Implement service worker voor offline support
4. Add preconnect voor externe resources (Google Fonts, GTM)
5. Critical CSS inline in `<head>`
6. Target: < 2s First Contentful Paint, > 90 Lighthouse score

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 4-6 uur

---

### T3.6: Social Media Integration
**Status**: ⚪ Te doen  
**Beschrijving**: Footer heeft social media links maar deze zijn placeholder "#"  
**Actie**:
1. Verkrijg echte social media URLs (Facebook, Instagram, LinkedIn)
2. Update links in footer
3. Add Open Graph meta tags voor social sharing
4. Twitter Card meta tags
5. Social share buttons op blog posts (toekomstig)

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 1 uur

---

## 🔧 **TECHNISCH ONDERHOUD**

### T4.1: Git Repository Opschonen
**Status**: ⚪ Te doen  
**Beschrijving**: Stash list bevat oude changes, local changes niet gecommit  
**Actie**:
1. `git stash list` - review en verwijder oude stashes
2. Commit docker-compose.yml en nginx.conf changes
3. Update .gitignore voor build artifacts
4. Tag current version: `git tag v1.0-react-spa`

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 30 minuten

---

### T4.2: Backup & Disaster Recovery
**Status**: ⚪ Te doen  
**Beschrijving**: Setup automated backups voor database en Docker volumes  
**Actie**:
1. Implement PostgreSQL automated backups (pg_dump cron job)
2. Backup Docker volumes (postgres_data)
3. Backup script voor volledige site restore
4. Document recovery procedures
5. Test restore process

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 2-3 uur

---

### T4.3: Monitoring & Alerting
**Status**: ⚪ Te doen  
**Beschrijving**: Setup uptime monitoring en error alerting  
**Actie**:
1. Implement health check endpoints monitoring
2. Setup Uptime Robot of Pingdom voor uptime checks
3. Container restart alerting
4. Error logging (Sentry.io of LogRocket)
5. Performance monitoring (New Relic of Datadog)

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 3-4 uur

---

### T4.4: Documentation Updates
**Status**: ⚪ Te doen  
**Beschrijving**: Update README en deployment docs met nieuwe React SPA setup  
**Actie**:
1. Update README.md met React app architecture
2. Document alle 55 landingspagina URLs
3. API documentation voor backend endpoints
4. Deployment procedure voor React app updates
5. Troubleshooting guide

**Prioriteit**: 🟢 Laag  
**Geschatte tijd**: 2 uur

---

## 📊 **PROGRESS TRACKING**

**Total Tasks**: 18
**Completed**: 1 (6%)
**High Priority**: 2 tasks remaining (1 completed)
**Medium Priority**: 4 tasks
**Low Priority**: 11 tasks

**Estimated Total Time**: 40-60 uur

---

## 🎯 **AANBEVOLEN VOLGORDE**

### Week 1: Kritieke Setup
1. T1.1 - GTM ID configureren
2. T1.2 - Complianz/Consent setup
3. T1.3 - Page titles optimaliseren
4. T2.1 - Backend API integratie starten

### Week 2: Features & Content
5. T2.2 - Branding & logo
6. T2.3 - Contact formulier werkend maken
7. T3.3 - Over Ons sectie
8. T2.4 - Schema.org verificatie

### Week 3: Optimalisatie & Polish
9. T3.1 - Testimonials carousel
10. T3.5 - Performance optimalisatie
11. T3.6 - Social media links
12. Overige nice-to-have features

### Week 4: Productie Ready
13. T4.1 - Git repository opschonen
14. T4.2 - Backup & disaster recovery
15. T4.3 - Monitoring setup
16. T4.4 - Documentation
17. **GO LIVE naar productie domein**

---

## 📝 **NOTITIES**

- Huidige deployment is op **staging.sevensa.nl**
- Productie domein: **www.mr-dj.nl** (nog te configureren)
- Backend API draait op: **staging.sevensa.nl/api**
- Database: PostgreSQL (mr-dj-postgres container)
- Alle assets beschikbaar in: `/opt/mr-dj/frontend/public.backup.*`

**Laatste update**: 16 Oktober 2025, 04:30 UTC
