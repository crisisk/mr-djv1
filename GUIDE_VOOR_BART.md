# Mister DJ - Complete Systeem Overzicht voor Bart

**Datum:** 21 Oktober 2025
**Website:** https://mr-dj.sevensa.nl
**Status:** ✅ VOLLEDIG OPERATIONEEL

---

## 🎯 Wat Je Website Nu Kan

Je website is nu een **geavanceerd marketing systeem** met:
- 🤖 **Automatische A/B Testing** - Test verschillende teksten en CTAs
- 🎨 **Personalisatie** - Toon andere content aan bruiloft vs. bedrijfsfeest klanten
- 📊 **Analytics Dashboard** - Zie welke aanpak het beste werkt
- 🔍 **Concurrent Tracking** - Houd bij wat andere DJ's doen
- 📈 **Data-gedreven Beslissingen** - Niet gokken, maar weten wat werkt

---

## 📸 Wat Er Net Gefixed Is

### Probleem
De website toonde gekleurde placeholder images (SVG) in plaats van je echte foto's en video's.

### Oplossing ✅
- **Gallery sectie** nu met 6 echte foto's van bruiloften en feesten
- **Hero video** werkt met je showreel videos
- **49 professionele foto's** beschikbaar
- **6 video's** beschikbaar

**Check het zelf:** https://mr-dj.sevensa.nl (scroll naar beneden naar "Momenten uit de Mister DJ media gallery")

---

## 🚀 Systeem #1: Dynamic Content & A/B Testing

### Wat Doet Het?
De website test automatisch verschillende versies van content om te zien wat beter werkt.

### Voorbeeld
**Voor een bruiloft klant:**
- Variant A: "Jullie avond, onze soundtrack"
- Variant B: "Dansvloer altijd vol"
- Variant C: "Ja-woord. Ja-feest."

De website leert automatisch welke headline meer boekingen oplevert.

### Hoe Werkt Het Technisch?
1. **Bezoeker komt op site** → Krijgt automatisch een unieke ID (cookie)
2. **Website detecteert** → Bruiloft of bedrijfsfeest interesse (based on pagina/UTM)
3. **API kiest variant** → Thompson Sampling algoritme kiest beste optie
4. **Personalized content** → Bezoeker ziet aangepaste headline/CTA
5. **Tracking** → Elk formulier/klik wordt gelogd
6. **Learning** → Systeem leert welke variant beste conversie heeft

### Waar Staat Het?
- **API Endpoint:** https://mr-dj.sevensa.nl/api/personalize
- **Container:** mr-dj-dynamic-api
- **Code:** `/srv/apps/mr-djv1/dynamic-api/`

### Test Het Zelf
```bash
# Open terminal en typ:
curl https://mr-dj.sevensa.nl/api/personalize?zone=hero

# Je krijgt JSON terug met de gekozen variant
```

---

## 📊 Systeem #2: Analytics Dashboard (Metabase)

### Wat Doet Het?
Een visueel dashboard waar je kunt zien:
- Welke headlines/CTAs het beste werken
- Hoeveel mensen van "awareness" naar "booking" gaan
- Welke marketing campagnes (Google Ads, social media) beste ROI hebben
- Hoe concurrenten hun site aanpassen

### Hoe Toegang?
**URL:** https://mr-dj.sevensa.nl/analytics

**Eerste keer setup:**
1. Ga naar bovenstaande URL
2. Maak admin account aan
3. Klik "Add Database"
4. Selecteer "PostgreSQL"
5. Vul in:
   - Host: `mr-dj-postgres`
   - Port: `5432`
   - Database: `mrdj_db`
   - Username: `mrdj_user`
   - Password: `mrdj_secure_password_2025`
6. Klik "Save"

### Wat Kun Je Zien?
- **Experiment Performance** - Conversion rates per variant
- **User Journey** - Van eerste bezoek tot boeking
- **Traffic Sources** - Google Ads vs. organic vs. social
- **Competitor Intelligence** - Wat doen andere DJ's?

### Pre-Built Queries
In `/opt/mr-dj-dynamic-content-starter/dashboards/metabase_queries.sql` staan 15+ kant-en-klare queries die je kunt importeren.

---

## 🕵️ Systeem #3: Competitive Intelligence

### Wat Doet Het?
Elke nacht om 03:00 automatisch:
1. **Screenshots** van 6 concurrent websites
2. **Feature extractie** - Welke USPs gebruiken ze?
3. **Opslaan in database** - Historische data voor trends
4. **Dashboard ready** - Zie het in Metabase

### Welke Concurrenten?
- bruiloftdjbrabant.nl
- disco-limburg.nl
- feest-dj-limburg.nl
- draaimeesters.com
- timebeatz.com
- mr-dj.nl (jouw eigen site, voor vergelijking)

### Wat Tracken We?
- Hero H1 (hoofdkop)
- Photobooth aanbod (ja/nee)
- "100% dansgarantie" (ja/nee)
- "Drive-in show" (ja/nee)
- "All-in prijzen" (ja/nee)
- Jaren ervaring

### Handmatig Runnen
```bash
/srv/apps/mr-djv1/cron/competitor-tracking.sh
```

### Logs Checken
```bash
tail -f /var/log/mrdj-competitor/tracking.log
```

---

## 🗂️ Database Overzicht

### Tabellen & Hun Doel

**A/B Testing:**
- `experiments` - Welke tests draaien er
- `experiment_variants` - Verschillende versies (A, B, C)
- `exposures` - Wie heeft welke variant gezien
- `outcomes` - Wie heeft geboekt/contact opgenomen

**User Tracking:**
- `user_features` - Per bezoeker: bruiloft of bedrijfsfeest? In welke fase?
- `session_features` - Per sessie: device, region, UTM parameters

**Competitive Intelligence:**
- `competitors` - Lijst van 6 concurrenten
- `ci_snapshots` - Screenshots (pad naar bestanden)
- `competitor_features` - Geëxtraheerde features

### Database Toegang
```bash
# Via Docker:
docker exec -it mr-dj-postgres psql -U mrdj_user -d mrdj_db

# Voorbeelden:
# Zie alle exposures van vandaag:
SELECT exp_key, variant, COUNT(*) FROM exposures WHERE ts >= CURRENT_DATE GROUP BY exp_key, variant;

# Zie conversion rate per variant:
SELECT
  variant_key,
  (metrics->>'conversions')::float / (metrics->>'exposures')::float AS conv_rate
FROM experiment_variants;
```

---

## 🎨 Frontend Integration

### Wat Gebeurt Er Automatisch?
Elke pagina op je website heeft nu:

1. **Anoniem ID** - Cookie: `mrdj_anon_id`
2. **Sessie ID** - Cookie: `mrdj_session_id`
3. **Auto-personalisatie** - Hero sections worden aangepast
4. **Event tracking** - Elk formulier & CTA klik wordt gelogd

### JavaScript Functies
```javascript
// In browser console kun je typen:
window.MRDJDynamic.getAnonId()  // Zie je user ID
window.MRDJDynamic.getSessionId()  // Zie je session ID

// Handmatig event loggen:
window.MRDJTracking.logOutcome('phone_call', 1);
window.MRDJTracking.logOutcome('booking_completed', 1500);
```

### Welke Pagina's Zijn Updated?
**Alle 140+ HTML bestanden** hebben nu:
- Dynamic content script: `/assets/js/dynamic-content.js`
- Automatische tracking
- Personalisatie

---

## 🤖 Hoe Gebruikt Het Systeem Jouw Data?

### Journey Stage Detection
Het systeem detecteert automatisch in welke fase een bezoeker zit:

1. **Awareness** - Eerste bezoek, homepage, algemene info
2. **Consideration** - Pakketten, prijzen, reviews bekijken
3. **Evaluation** - FAQ, vergelijken, dieper graven
4. **Intent** - Offerte aanvragen, contact formulier, check beschikbaarheid
5. **Booking** - Bevestiging, betaling, dashboard
6. **Post-Booking** - Na event, reviews schrijven

**Hoe?** Door URL patronen:
- `/` → awareness
- `/pakketten` of `/prijzen` → consideration
- `/offerte` of `/contact` → intent
- `/bevestiging` → booking

### Bruiloft vs. Bedrijfsfeest
Het systeem detecteert automatisch:
- **URL bevat** "bruiloft", "trouw" → Wedding
- **URL bevat** "zakelijk", "bedrijf", "corporate" → Corporate
- **UTM parameter** `?event=wedding` → Wedding
- **Referer** van bruiloft gerelateerde pagina → Wedding

---

## 📈 Wat Kun Je Nu Doen?

### 1. Monitor Je Performance
- **Elke week:** Check Metabase dashboard
- **Zie welke headlines** het beste werken
- **Identificeer winning variants** en pas main site aan
- **Track conversion rates** per traffic source

### 2. Test Nieuwe Ideeën
Wil je een nieuwe headline testen?

**Stap 1:** Edit `/srv/apps/mr-djv1/dynamic-api/app/api/personalize/route.ts`

Voeg nieuwe variant toe:
```typescript
{
  key: "D",
  assets: {
    headline: "Jouw nieuwe headline hier",
    subline: "Jouw nieuwe subline",
    cta: { label: "Jouw CTA", href: "/contact" }
  },
  metrics: { exposures: 0, clicks: 0, conversions: 0 }
}
```

**Stap 2:** Rebuild & restart
```bash
cd /srv/apps/mr-djv1
docker build -t mr-djv1-dynamic-api ./dynamic-api
docker restart mr-dj-dynamic-api
```

### 3. Concurrent Analyse
- **Check Metabase** voor competitor features
- **Zie trends** - Wat doen ze anders dan vorige maand?
- **Identificeer gaps** - Bieden zij iets aan wat jij niet hebt?
- **Stay ahead** - Pas jouw strategie aan

### 4. Optimize Conversions
- **Identify drop-offs** - Waar verlies je mensen in de funnel?
- **Test verschillende CTAs** - "Vraag offerte" vs. "Gratis intake"
- **Personalize by segment** - Bruiloft klanten andere tekst dan corporate
- **Data-driven decisions** - Niet gokken, maar weten

---

## 🔧 Technische Details (Voor Later)

### Docker Containers
```bash
# Alle services checken:
docker ps | grep mr-dj

# Logs bekijken:
docker logs mr-dj-dynamic-api
docker logs mr-dj-metabase
docker logs mr-dj-eds-frontend

# Service herstarten:
docker restart mr-dj-dynamic-api
```

### Cron Jobs
```bash
# Zie alle cron jobs:
crontab -l

# Output:
# 0 3 * * * /srv/apps/mr-djv1/cron/competitor-tracking.sh
# → Draait elke nacht om 03:00
```

### Backup
Dagelijkse backup staat in: `/tmp/backup_21_oktober_2025.zip` (7.5GB)

---

## 🎯 Key Takeaways Voor Bart

### ✅ Wat Je NU Hebt
1. **Slimme website** die automatisch leert wat werkt
2. **Data dashboard** om je performance te zien
3. **Concurrent tracking** om bij te blijven
4. **Professionele foto's** live on site
5. **Video backgrounds** working

### 💡 Wat Je KUNT Doen
1. **Monitor weekly** - 10 minuten in Metabase
2. **Test new ideas** - Nieuwe headlines/CTAs proberen
3. **Learn from competitors** - Zie wat zij doen
4. **Optimize based on data** - Niet gissen, maar weten
5. **Scale** - More experiments, more zones (pricing, about, etc.)

### 📞 Waar Te Beginnen?
**Morgen:**
1. Open https://mr-dj.sevensa.nl/analytics
2. Setup je Metabase account (5 minuten)
3. Importeer de pre-built queries
4. Bekijk je eerste dashboard!

**Deze Week:**
1. Monitor welke variants winnen
2. Check competitor intelligence
3. Identificeer 1 nieuwe test om te draaien

**Deze Maand:**
1. Roll out winning variants naar main site
2. Expand testing naar andere zones (pricing, about)
3. Analyze conversion funnel
4. Optimize based on data

---

## 📚 Documentatie Locaties

**Volledige Docs:**
- `/srv/apps/mr-djv1/PRODUCTION_INTEGRATION.md` - Technical integration guide
- `/srv/apps/mr-djv1/DEPLOYMENT_SUCCESS_DYNAMIC_CONTENT.md` - Deployment summary
- `/opt/mr-dj-dynamic-content-starter/README_COMPLETE.md` - Complete system docs
- `/opt/mr-dj-dynamic-content-starter/dashboards/METABASE_SETUP.md` - Metabase howto
- `/opt/mr-dj-dynamic-content-starter/dashboards/metabase_queries.sql` - 15+ analytics queries

---

## 🆘 Support & Vragen?

**Check First:**
1. Metabase dashboard - Zie je data?
2. Docker containers - Draaien ze? (`docker ps | grep mr-dj`)
3. Logs - Errors? (`docker logs mr-dj-dynamic-api`)

**Common Issues:**
- **Geen data in Metabase?** - Database connectie checken
- **API werkt niet?** - Container restart: `docker restart mr-dj-dynamic-api`
- **Foto's niet zichtbaar?** - Cache clear, hard refresh (Ctrl+Shift+R)

---

## 🎉 Success!

Je website is nu een **datagedreven marketing machine**. Niet meer gokken welke tekst werkt - je WEET het nu!

**De resultaten komen vanzelf** als je:
- ✅ Regelmatig dashboard checkt
- ✅ Op data gebaseerde beslissingen maakt
- ✅ Blijft testen en optimaliseren
- ✅ Van concurrenten leert

**Veel success, Bart! 🚀🎧**

---

*Laatste update: 21 Oktober 2025*
*Systeem status: VOLLEDIG OPERATIONEEL ✅*
