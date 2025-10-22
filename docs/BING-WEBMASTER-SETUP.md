# Bing Webmaster Tools Setup Guide
## Mr. DJ Website Submission

**Website:** https://mr-dj.sevensa.nl
**Doel:** De Mr. DJ website toevoegen aan Bing Webmaster Tools voor Bing/Yahoo zoekmachine zichtbaarheid

---

## Waarom Bing Webmaster Tools?

### Marktaandeel & Bereik
- **Bing:** ~3-5% marktaandeel in Nederland
- **Yahoo:** Gebruikt Bing's search index
- **DuckDuckGo:** Haalt gedeeltelijk resultaten van Bing
- **Microsoft producten:** Windows Search, Cortana, Edge
- **Zakelijke gebruikers:** Hoger percentage op enterprise devices

### Voordelen
- Gratis tools en analytics
- Minder competitie dan Google (makkelijker om te ranken)
- Directe toegang tot Microsoft's search ecosystem
- Goede keyword research tools
- SEO insights en aanbevelingen

---

## Stap 1: Account Aanmaken

### 1.1 Toegang tot Bing Webmaster Tools

1. Ga naar [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Klik op **Sign in** of **Get Started**
3. Log in met een Microsoft account:
   - Gebruik een bestaand Microsoft/Outlook account
   - Of maak een nieuw zakelijk Microsoft account aan

```
[SCREENSHOT PLACEHOLDER: Bing Webmaster homepage]
```

### 1.2 Account Type
**Aanbeveling:** Gebruik een zakelijk Microsoft 365 account voor professioneel beheer.

---

## Stap 2: Website Toevoegen

### 2.1 Import vanuit Google Search Console (Snelste Methode)

Als je al Google Search Console hebt ingesteld:

1. Klik op **Import from Google Search Console**
2. Log in met je Google account
3. Selecteer de property: `https://mr-dj.sevensa.nl`
4. Klik **Import**

**Voordelen:**
- Automatische verificatie
- Sitemap wordt automatisch overgenomen
- Instellingen worden gekopieerd
- Snelste setup (2-3 minuten)

```
[SCREENSHOT PLACEHOLDER: Import from Google Search Console button]
```

**Let op:** Je moet dezelfde email gebruiken voor beide accounts, of toegang hebben tot beide accounts.

### 2.2 Handmatig Toevoegen

Als import niet mogelijk is:

1. Klik op **Add a site**
2. Voer de website URL in: `https://mr-dj.sevensa.nl`
3. Klik **Add**
4. Ga verder met verificatie (Stap 3)

```
[SCREENSHOT PLACEHOLDER: Add site interface]
```

---

## Stap 3: Eigendomsverificatie

Bing biedt drie verificatiemethoden:

### Methode 1: XML Bestand Upload (Aanbevolen)

1. **Download het verificatiebestand:**
   - Bing geeft een bestand zoals: `BingSiteAuth.xml`
   - Download dit naar je computer

2. **Upload naar website root:**
   ```bash
   # Kopieer bestand naar public directory
   cp ~/Downloads/BingSiteAuth.xml /srv/apps/mr-djv1/public/

   # Deploy
   cd /srv/apps/mr-djv1
   npm run build
   # Deploy naar productie server
   ```

3. **Test de URL:**
   ```bash
   curl https://mr-dj.sevensa.nl/BingSiteAuth.xml
   ```
   Je moet de XML inhoud zien met je verificatie code.

4. **Verifieer in Bing:**
   - Klik op **Verify** knop
   - Bing controleert het bestand

```
[SCREENSHOT PLACEHOLDER: XML file verification interface]
```

### Methode 2: Meta Tag Verificatie

1. **Kopieer de meta tag** die Bing geeft:
   ```html
   <meta name="msvalidate.01" content="JOUW_VERIFICATIE_CODE" />
   ```

2. **Voeg toe aan website:**
   - Open: `/srv/apps/mr-djv1/public/index.html`
   - Plaats in de `<head>` sectie:

   ```html
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="google-site-verification" content="..." />
     <meta name="msvalidate.01" content="JOUW_BING_CODE" />
     <!-- Andere meta tags -->
   </head>
   ```

3. **Deploy en verifieer:**
   ```bash
   cd /srv/apps/mr-djv1
   git add public/index.html
   git commit -m "Add Bing Webmaster verification meta tag"
   npm run build
   # Deploy
   ```

4. **Klik op Verify** in Bing Webmaster Tools

### Methode 3: CNAME DNS Verificatie

1. **Ontvang CNAME record** van Bing:
   ```
   Host: [random-string]
   Points to: verify.bing.com
   ```

2. **Voeg toe aan DNS instellingen** bij je hostingprovider:
   - Type: `CNAME`
   - Host: `[random-string].mr-dj.sevensa.nl`
   - Value/Target: `verify.bing.com`
   - TTL: `3600`

3. **Wacht op DNS propagatie** (15 minuten tot 48 uur)

4. **Verifieer de DNS record:**
   ```bash
   dig CNAME [random-string].mr-dj.sevensa.nl
   ```

5. **Klik op Verify** in Bing Webmaster Tools

```
[SCREENSHOT PLACEHOLDER: CNAME verification interface]
```

---

## Stap 4: Sitemap Indienen

### 4.1 Sitemap Toevoegen

1. Ga naar **Sitemaps** in het linker menu
2. Klik op **Submit a sitemap**
3. Voer de sitemap URL in: `https://mr-dj.sevensa.nl/sitemap.xml`
4. Klik **Submit**

```
[SCREENSHOT PLACEHOLDER: Sitemap submission interface]
```

### 4.2 Sitemap Status Controleren

- **Pending:** Bing verwerkt de sitemap
- **Success:** Sitemap geaccepteerd
- **Has Errors:** Los errors op (zie error details)

**Verwachte timing:** 24-72 uur voor eerste crawl.

### 4.3 Meerdere Sitemaps (Optioneel)

Als Mr. DJ aparte sitemaps heeft voor verschillende secties:
```
https://mr-dj.sevensa.nl/sitemap-pages.xml
https://mr-dj.sevensa.nl/sitemap-blog.xml
https://mr-dj.sevensa.nl/sitemap-events.xml
```

Submit elke sitemap apart via dezelfde interface.

---

## Stap 5: Site Configuratie

### 5.1 Site Settings

1. Ga naar **Configure My Site** > **Site Settings**

**Belangrijke instellingen:**
- **Country/Region:** Netherlands
- **Language:** Dutch (nl-NL)
- **URL Parameters:** Standaard laten, tenzij je query parameters gebruikt
- **Anonymous URL Submission:** Off (voorkomt spam)

```
[SCREENSHOT PLACEHOLDER: Site settings interface]
```

### 5.2 Crawl Control

1. Ga naar **Configure My Site** > **Crawl Control**

**Instellingen:**
- **Crawl rate:** Auto (laat Bing bepalen)
- **Preferred crawl time:** Standaard, of stel in buiten piekuren
- **Block URLs:** Voeg toe als je bepaalde URLs wilt blokkeren

### 5.3 URL Normalization

1. Ga naar **Configure My Site** > **URL Normalization**

**Check:**
- Trailing slash preference: `/page` vs `/page/`
- WWW vs non-WWW: `www.mr-dj.sevensa.nl` vs `mr-dj.sevensa.nl`
- HTTPS vs HTTP: Altijd HTTPS preferred

---

## Stap 6: Belangrijke Tools & Features

### 6.1 Site Explorer

**Locatie:** Site Explorer

**Gebruik dit voor:**
- Overzicht van geindexeerde paginas
- Inkomende links naar je site
- Outbound links van je site
- Meest gelinkte paginas

**Acties:**
- Controleer of alle belangrijke paginas geindexeerd zijn
- Bekijk welke sites naar je linken (backlink profile)

```
[SCREENSHOT PLACEHOLDER: Site Explorer dashboard]
```

### 6.2 URL Inspection

**Locatie:** URL Inspection

**Gebruik:**
1. Voer een specifieke URL in: `https://mr-dj.sevensa.nl/prijzen`
2. Bekijk indexatie status
3. **Submit URL:** Vraag om snellere indexatie
4. Bekijk crawl details (laatste crawl datum, status codes)

### 6.3 SEO Reports

**Locatie:** Reports & Data > SEO Reports

**Belangrijke rapporten:**

#### SEO Analyzer
- Page scan voor on-page SEO issues
- Technische problemen (broken links, missing meta tags)
- Content quality scores

**Acties:**
- Los high-priority issues op
- Verbeter meta descriptions en title tags
- Fix broken links

#### Site Scan
Automatische scan voor:
- Missing alt text op images
- Duplicate content
- Slow loading pages
- Missing H1 tags

```
[SCREENSHOT PLACEHOLDER: SEO Reports overview]
```

### 6.4 Keyword Research

**Locatie:** Diagnostics & Tools > Keyword Research

**Gebruik:**
1. Voer zoektermen in gerelateerd aan DJ services
2. Bekijk search volume in Nederland
3. Vind gerelateerde keywords
4. Exporteer keyword lists

**Voorbeeld zoektermen:**
```
dj huren
bruiloft dj
feest dj
dj prijs
bedrijfsfeest dj
```

### 6.5 Traffic Analytics

**Locatie:** Reports & Data > Search Performance

**Metrics:**
- **Clicks:** Aantal clicks vanuit Bing
- **Impressions:** Hoe vaak site verscheen in resultaten
- **Average Position:** Ranking positie
- **CTR:** Click-through rate

**Filters:**
- Date range
- Device type (desktop, mobile, tablet)
- Country/region
- Specific queries

---

## Stap 7: Index Versnellen

### 7.1 Submit URLs

**Voor nieuwe of belangrijke paginas:**

1. Ga naar **URL Submission**
2. Voer URLs in (1 per regel), bijvoorbeeld:
   ```
   https://mr-dj.sevensa.nl/
   https://mr-dj.sevensa.nl/diensten
   https://mr-dj.sevensa.nl/prijzen
   https://mr-dj.sevensa.nl/over-ons
   https://mr-dj.sevensa.nl/contact
   ```
3. Klik **Submit**

**Limieten:**
- Standaard: 10 URLs per dag
- Met API: Tot 10.000 URLs per dag

### 7.2 IndexNow Protocol (Geavanceerd)

IndexNow is een protocol voor real-time indexatie updates.

**Voordelen:**
- Instant indexatie notificaties
- Automatische updates bij content wijzigingen
- Ondersteund door Bing, Yandex, en andere zoekmachines

**Implementatie:**

1. **Genereer API key:**
   ```bash
   # Genereer random key
   openssl rand -hex 32
   # Voorbeeld: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

2. **Maak key file:**
   ```bash
   echo "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" > /srv/apps/mr-djv1/public/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.txt
   ```

3. **Verify key in Bing:**
   - Ga naar **IndexNow** in Bing Webmaster
   - Voer je key in
   - Bing verifieert via: `https://mr-dj.sevensa.nl/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.txt`

4. **Submit URLs via API:**
   ```bash
   curl -X POST "https://api.indexnow.org/indexnow" \
     -H "Content-Type: application/json" \
     -d '{
       "host": "mr-dj.sevensa.nl",
       "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
       "keyLocation": "https://mr-dj.sevensa.nl/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.txt",
       "urlList": [
         "https://mr-dj.sevensa.nl/",
         "https://mr-dj.sevensa.nl/nieuw-artikel"
       ]
     }'
   ```

**Integratie met build process:**
```javascript
// Example: Notify IndexNow after deployment
const notifyIndexNow = async (urls) => {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'mr-dj.sevensa.nl',
      key: process.env.INDEXNOW_KEY,
      keyLocation: `https://mr-dj.sevensa.nl/${process.env.INDEXNOW_KEY}.txt`,
      urlList: urls
    })
  });
  return response.status === 200;
};
```

---

## Stap 8: Te Monitoren Metrics

### Weekly Checks

**Must-check metrics:**

1. **Search Performance** (Reports & Data)
   - Total clicks trend (up/down)
   - Average position improvements
   - New keywords ranking

2. **Site Scan** (SEO Reports)
   - New errors or warnings
   - Priority issues to fix

3. **Indexed Pages** (Site Explorer)
   - Number of indexed pages
   - Should match sitemap URLs count

4. **Backlinks** (Site Explorer > Inbound Links)
   - New backlinks
   - Lost backlinks
   - Backlink quality

### Monthly Deep Dive

1. **Keyword Performance:**
   - Top performing keywords
   - Opportunity keywords (high impressions, low clicks)
   - Declining keywords

2. **Content Analysis:**
   - Pages with most clicks
   - Pages with best CTR
   - Underperforming pages

3. **Technical Health:**
   - Crawl errors
   - Server response times
   - Mobile usability issues

```
[SCREENSHOT PLACEHOLDER: Performance dashboard]
```

---

## Stap 9: Gebruikers Beheren

### Team Members Toevoegen

1. Ga naar **Users** (gear icon > Users)
2. Klik **Add User**
3. Voer email adres in (moet Microsoft account zijn)
4. Selecteer rol:
   - **Administrator:** Volledige toegang, kan settings wijzigen
   - **Read-only:** Kan alleen rapporten bekijken

**Best practice:** Minimaal 2 administrators voor backup.

---

## Tijdlijn & Verwachtingen

| Tijdstip | Wat te Verwachten |
|----------|-------------------|
| **Direct** | Site toegevoegd, verificatie compleet |
| **24-48 uur** | Eerste crawl, sitemap verwerkt |
| **3-7 dagen** | Eerste paginas in index verschijnen |
| **1-2 weken** | Meeste paginas geindexeerd |
| **2-4 weken** | Eerste traffic data in reports |
| **1-2 maanden** | Stabiele indexatie en ranking data |

**Let op:** Bing indexeert langzamer dan Google, maar is grondig.

---

## Troubleshooting

### Probleem: Verificatie Mislukt

**Oplossingen:**
```bash
# Test verificatiebestand
curl https://mr-dj.sevensa.nl/BingSiteAuth.xml

# Test meta tag
curl -s https://mr-dj.sevensa.nl | grep "msvalidate"

# Check DNS CNAME (if using DNS method)
dig CNAME [your-string].mr-dj.sevensa.nl
```

### Probleem: Sitemap Errors

**Veelvoorkomende errors:**
- **Timeout:** Sitemap te groot (split in meerdere sitemaps)
- **Format error:** Controleer XML syntax
- **URLs blocked by robots.txt:** Check robots.txt bestand
- **404 errors in sitemap:** Verwijder niet-bestaande URLs

**Fix:**
```bash
# Valideer sitemap XML
xmllint --noout /srv/apps/mr-djv1/public/sitemap.xml

# Test sitemap accessibility
curl -I https://mr-dj.sevensa.nl/sitemap.xml
```

### Probleem: Paginas Niet Geindexeerd

**Check:**
1. **robots.txt:** Blokkeert het Bingbot?
   ```bash
   curl https://mr-dj.sevensa.nl/robots.txt | grep -i "bing"
   ```

2. **Noindex tag:** Staat er een noindex meta tag?
   ```bash
   curl -s https://mr-dj.sevensa.nl/page | grep -i "noindex"
   ```

3. **Server errors:** Geeft de pagina errors tijdens crawl?
   - Check server logs
   - Test via URL Inspection tool

4. **Crawl budget:** Bing crawlt minder frequent dan Google
   - Prioriteer belangrijke paginas via URL Submission
   - Verbeter site speed voor efficienter crawlen

---

## Vergelijking: Bing vs Google Search Console

| Feature | Google Search Console | Bing Webmaster Tools |
|---------|----------------------|---------------------|
| **Markt share** | ~90% in NL | ~3-5% in NL |
| **Indexatie snelheid** | Sneller (uren-dagen) | Langzamer (dagen-weken) |
| **Data diepte** | Zeer gedetailleerd | Goed, minder granular |
| **Keyword research** | Beperkt | Uitgebreider (gratis) |
| **SEO tools** | Basis | Meer built-in tools |
| **API access** | Ja (beperkt) | Ja (IndexNow, meer generous) |
| **Support** | Community/docs | Actievere community forums |

**Conclusie:** Beide platforms zijn essentieel voor complete SEO coverage.

---

## Checklist voor Go-Live

- [ ] Bing Webmaster Tools account aangemaakt
- [ ] Microsoft account gelinkt (bij voorkeur zakelijk)
- [ ] Site toegevoegd: https://mr-dj.sevensa.nl
- [ ] Eigendom geverifieerd (XML bestand of meta tag)
- [ ] Sitemap ingediend (sitemap.xml)
- [ ] Site settings geconfigureerd:
  - [ ] Country: Netherlands
  - [ ] Language: Dutch
- [ ] Belangrijkste paginas via URL Submission ingediend
- [ ] SEO Reports eerste scan gedaan
- [ ] Team members toegevoegd als users
- [ ] IndexNow geconfigureerd (optioneel maar aanbevolen)
- [ ] Wekelijkse monitoring ingesteld

---

## Best Practices

### 1. Gebruik Beide Platforms
- Google Search Console voor primaire traffic
- Bing voor extra exposure en insights

### 2. Vergelijk Data
- Cross-reference keyword performance
- Identificeer verschillen in ranking factors
- Test verschillende content strategies

### 3. Optimaliseer voor Bing Specifiek
- Bing waardeert:
  - Duidelijke site structuur
  - Social signals (Facebook, Twitter shares)
  - Exact match domains en keywords
  - Oudere, meer gevestigde content
  - Multimedia content (images, videos)

### 4. Monitor Regelmatig
- Wekelijkse quick check (5 min)
- Maandelijkse deep dive (30 min)
- Driemaandelijkse strategy review

---

## Nuttige Links

- **Bing Webmaster Tools:** https://www.bing.com/webmasters/
- **Help Center:** https://www.bing.com/webmasters/help/
- **Webmaster Guidelines:** https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a
- **IndexNow Documentation:** https://www.indexnow.org/
- **Bing Webmaster Blog:** https://blogs.bing.com/webmaster/
- **Support Forum:** https://www.bing.com/webmasters/community

---

## API & Automation

Voor developers die automation willen:

### Bing Webmaster API

**Endpoints:**
```bash
# Get site profile
GET https://ssl.bing.com/webmaster/api.svc/json/GetSite?siteUrl=https://mr-dj.sevensa.nl

# Get crawl stats
GET https://ssl.bing.com/webmaster/api.svc/json/GetCrawlStats?siteUrl=https://mr-dj.sevensa.nl

# Submit URL
POST https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl
```

**API Key:** Te verkrijgen via Settings > API Access in Bing Webmaster Tools.

**Rate Limits:**
- 10 calls per minute
- 100 calls per day (gratis tier)

---

## Contact & Ondersteuning

Voor vragen over Bing Webmaster setup:
- **Technical Lead:** [Naam invoegen]
- **SEO Team:** [Contact invoegen]
- **Documentatie datum:** 2025-10-18

---

**Volgende stap:** Zie `SEO-SUBMISSION-CHECKLIST.md` voor een snelle referentie checklist van beide platforms.
