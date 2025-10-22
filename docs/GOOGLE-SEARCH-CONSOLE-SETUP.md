# Google Search Console Setup Guide
## Mr. DJ Website Submission

**Website:** https://mr-dj.sevensa.nl
**Doel:** De Mr. DJ website toevoegen aan Google Search Console voor betere zoekmachine zichtbaarheid

---

## Stap 1: Google Search Console Toegang

### 1.1 Aanmelden
1. Ga naar [Google Search Console](https://search.google.com/search-console/)
2. Log in met het Google-account dat je wilt gebruiken voor websitebeheer
3. **Belangrijk:** Gebruik een bedrijfs Google-account, geen persoonlijk account

### 1.2 Property Type Kiezen
Na inloggen zie je de optie om een property toe te voegen:

- **URL-prefix** (Aanbevolen): `https://mr-dj.sevensa.nl`
- **Domain property**: `mr-dj.sevensa.nl` (vereist DNS-verificatie)

**Aanbeveling:** Begin met URL-prefix voor snellere setup.

```
[SCREENSHOT PLACEHOLDER: Google Search Console homepage met "Add Property" knop]
```

---

## Stap 2: Eigendomsverificatie

Je moet bewijzen dat je eigenaar bent van de website. Google biedt meerdere methoden:

### Methode 1: HTML Tag Verificatie (Snelst & Eenvoudigst)

1. **Kopieer de meta tag** die Google geeft:
   ```html
   <meta name="google-site-verification" content="JOUW_VERIFICATIE_CODE_HIER" />
   ```

2. **Voeg toe aan website:**
   - Open het bestand: `/srv/apps/mr-djv1/public/index.html`
   - Plaats de meta tag in de `<head>` sectie, voor de sluitende `</head>` tag

   ```html
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="google-site-verification" content="JOUW_CODE_HIER" />
     <!-- Andere meta tags -->
   </head>
   ```

3. **Deploy de wijziging:**
   ```bash
   cd /srv/apps/mr-djv1
   git add public/index.html
   git commit -m "Add Google Search Console verification meta tag"
   npm run build
   # Deploy naar productie
   ```

4. **Verifieer in Google Search Console:**
   - Klik op "Verify" knop
   - Wacht tot Google de verificatie bevestigt (kan enkele minuten duren)

```
[SCREENSHOT PLACEHOLDER: Google verificatie meta tag interface]
```

### Methode 2: HTML Bestand Upload

1. **Download het verificatiebestand** van Google (bijv. `google1234567890abcdef.html`)

2. **Upload naar website root:**
   ```bash
   # Kopieer bestand naar public directory
   cp ~/Downloads/google1234567890abcdef.html /srv/apps/mr-djv1/public/

   # Build en deploy
   cd /srv/apps/mr-djv1
   npm run build
   ```

3. **Test de URL:**
   ```bash
   curl https://mr-dj.sevensa.nl/google1234567890abcdef.html
   ```
   Je moet de inhoud van het bestand zien.

4. **Klik op "Verify"** in Google Search Console

### Methode 3: DNS Verificatie (Voor Domain Property)

1. **Ontvang TXT record** van Google, bijv:
   ```
   google-site-verification=abcd1234efgh5678ijkl
   ```

2. **Voeg toe aan DNS instellingen** bij je hostingprovider:
   - Type: `TXT`
   - Host: `@` of `mr-dj.sevensa.nl`
   - Value: `google-site-verification=abcd1234efgh5678ijkl`
   - TTL: `3600` (1 uur)

3. **Wacht op DNS propagatie** (kan 24-48 uur duren)

4. **Verifieer de DNS record:**
   ```bash
   dig TXT mr-dj.sevensa.nl
   # of
   nslookup -type=TXT mr-dj.sevensa.nl
   ```

5. **Klik op "Verify"** in Google Search Console

```
[SCREENSHOT PLACEHOLDER: DNS verificatie interface]
```

### Methode 4: Google Analytics Verificatie

Als je al Google Analytics gebruikt:
1. Zorg dat je dezelfde Google account gebruikt
2. Controleer dat het Analytics tracking code op de site staat
3. Google verifieert automatisch via Analytics

---

## Stap 3: Sitemap Indienen

Na succesvolle verificatie:

### 3.1 Sitemap Locatie Controleren

De Mr. DJ website heeft een sitemap op:
```
https://mr-dj.sevensa.nl/sitemap.xml
```

**Test of deze werkt:**
```bash
curl -I https://mr-dj.sevensa.nl/sitemap.xml
# Moet HTTP 200 OK retourneren
```

### 3.2 Sitemap Indienen

1. Ga naar **Sitemaps** in het linkermenu van Google Search Console
2. Voer in het veld "Add a new sitemap" in: `sitemap.xml`
3. Klik op **Submit**

```
[SCREENSHOT PLACEHOLDER: Sitemap submission interface]
```

### 3.3 Alternatief: robots.txt Update

Zorg dat `/srv/apps/mr-djv1/public/robots.txt` de sitemap bevat:

```txt
User-agent: *
Allow: /

Sitemap: https://mr-dj.sevensa.nl/sitemap.xml
```

---

## Stap 4: Belangrijke Instellingen Configureren

### 4.1 Voorkeursdomein Instellen

1. Ga naar **Settings** (Instellingen)
2. Controleer of HTTPS als voorkeur is ingesteld
3. Zorg dat `https://mr-dj.sevensa.nl` (met www of zonder) consistent is

### 4.2 Internationale Targeting

1. Ga naar **Settings** > **International Targeting**
2. Stel in:
   - **Land:** Nederland
   - **Taal:** Nederlands (nl)

### 4.3 Crawl Snelheid

1. Ga naar **Settings** > **Crawl rate**
2. Standaard instelling is meestal goed
3. Voor een nieuwe site: laat Google automatisch bepalen

---

## Stap 5: Te Monitoren Metrics

### Belangrijke Rapporten in Google Search Console

#### 5.1 Performance (Prestaties)
**Locatie:** Performance > Search results

**Metrics om te volgen:**
- **Total clicks:** Hoeveel gebruikers klikten vanuit Google
- **Total impressions:** Hoe vaak de site verscheen in zoekresultaten
- **Average CTR:** Click-through rate (clicks/impressions)
- **Average position:** Gemiddelde ranking positie

**Acties:**
- Filter op **Netherlands** voor lokale prestaties
- Bekijk **queries** die traffic genereren
- Identificeer paginas met hoge impressions maar lage CTR (verbeterkansen)

```
[SCREENSHOT PLACEHOLDER: Performance dashboard met grafieken]
```

#### 5.2 Coverage (Dekking)
**Locatie:** Coverage

**Metrics om te volgen:**
- **Valid pages:** Aantal correct geindexeerde paginas
- **Errors:** Paginas die niet geindexeerd kunnen worden
- **Valid with warnings:** Geindexeerd maar met problemen
- **Excluded:** Paginas die Google niet indexeert

**Acties:**
- Los errors direct op (404s, server errors, redirect chains)
- Controleer of belangrijke paginas niet excluded zijn
- Target: alle belangrijke paginas in "Valid"

#### 5.3 Enhancements (Verbeteringen)
**Locatie:** Enhancements

**Check:**
- **Mobile Usability:** Mobiele gebruikservaring
- **Core Web Vitals:** Laadsnelheid en user experience metrics
- **Breadcrumbs:** Navigatiestructuur in zoekresultaten

#### 5.4 Links
**Locatie:** Links

**Monitor:**
- **External links:** Wie linkt naar je site
- **Internal links:** Interne linkstructuur
- **Top linked pages:** Meest gelinkte paginas

#### 5.5 Sitemaps
**Locatie:** Sitemaps

**Check wekelijks:**
- Status: Success (groen)
- Discovered URLs: Aantal URLs in sitemap
- Indexed URLs: Hoeveel zijn daadwerkelijk geindexeerd

---

## Stap 6: URL Inspection Tool

### Individuele Paginas Testen

1. Gebruik de zoekbalk bovenaan: voer een volledige URL in
   ```
   https://mr-dj.sevensa.nl/prijzen
   ```

2. **Bekijk status:**
   - URL is on Google: Geindexeerd
   - URL is not on Google: Nog niet geindexeerd

3. **Request Indexing:**
   - Voor nieuwe paginas: klik "Request indexing"
   - Google crawlt binnen 1-7 dagen
   - **Let op:** Gebruik spaarzaam (rate limited)

```
[SCREENSHOT PLACEHOLDER: URL Inspection tool interface]
```

---

## Stap 7: Gebruikers Toevoegen

Voor teamsamenwerking:

1. Ga naar **Settings** > **Users and permissions**
2. Klik **Add user**
3. Voer email adres in
4. Kies permissie niveau:
   - **Owner:** Volledige controle (kan gebruikers toevoegen/verwijderen)
   - **Full user:** Kan alles zien en meeste acties uitvoeren
   - **Restricted user:** Alleen bekijken, geen wijzigingen

**Aanbeveling:** Voeg minimaal 2 owners toe voor backup.

---

## Tijdlijn & Verwachtingen

### Wat te Verwachten na Indienen

| Tijdstip | Verwachting |
|----------|-------------|
| **Direct** | Property is geverifieerd, geen data zichtbaar |
| **24-48 uur** | Eerste crawl, sitemap verwerkt |
| **3-7 dagen** | Eerste paginas verschijnen in index |
| **2-4 weken** | Volledige site geindexeerd, eerste performance data |
| **1-3 maanden** | Stabiele ranking data, trends zichtbaar |

### Indexatie Versnellen

```bash
# 1. Zorg voor goede interne linking
# 2. Submit belangrijkste paginas via URL Inspection
# 3. Zorg voor externe backlinks (social media, directories)
# 4. Update sitemap regelmatig bij nieuwe content
```

---

## Troubleshooting

### Probleem: Verificatie Mislukt

**Oplossingen:**
- Controleer of meta tag/bestand live staat op productie
- Clear browser cache en probeer opnieuw
- Wacht 10-15 minuten na deployment
- Controleer of er geen `noindex` meta tag staat
- Test met curl of wget vanuit terminal

```bash
# Test verificatie bestand
curl https://mr-dj.sevensa.nl/google1234567890abcdef.html

# Test meta tag
curl -s https://mr-dj.sevensa.nl | grep "google-site-verification"
```

### Probleem: Sitemap Niet Gevonden

**Oplossingen:**
```bash
# Test sitemap toegankelijkheid
curl -I https://mr-dj.sevensa.nl/sitemap.xml

# Controleer server configuratie (nginx/apache)
# Zorg dat .xml bestanden worden geserveerd met content-type: application/xml
```

### Probleem: Paginas Niet Geindexeerd

**Mogelijke Oorzaken:**
1. **robots.txt blokkeert:** Check `https://mr-dj.sevensa.nl/robots.txt`
2. **Noindex tag:** Zoek naar `<meta name="robots" content="noindex">`
3. **Canonical issues:** Verkeerde canonical tags
4. **Duplicate content:** Meerdere versies van dezelfde pagina
5. **Server errors:** 500 errors bij Google crawl

**Debug:**
```bash
# Check robots.txt
curl https://mr-dj.sevensa.nl/robots.txt

# Check voor noindex
curl -s https://mr-dj.sevensa.nl/pagina | grep -i "noindex"
```

---

## Checklist voor Go-Live

- [ ] Google Search Console account aangemaakt
- [ ] Property toegevoegd (https://mr-dj.sevensa.nl)
- [ ] Eigendom geverifieerd (meta tag methode)
- [ ] Sitemap ingediend (sitemap.xml)
- [ ] Internationale targeting ingesteld (NL)
- [ ] Team members toegevoegd als users
- [ ] URL Inspection test gedaan voor homepage
- [ ] Performance monitoring ingesteld (wekelijkse checks)
- [ ] robots.txt gecontroleerd en goedgekeurd
- [ ] Belangrijkste paginas via URL Inspection ingediend:
  - [ ] Homepage
  - [ ] /diensten
  - [ ] /prijzen
  - [ ] /over-ons
  - [ ] /contact

---

## Nuttige Links

- **Google Search Console:** https://search.google.com/search-console/
- **Help Documentatie:** https://support.google.com/webmasters/
- **Indexing API:** https://developers.google.com/search/apis/indexing-api/v3/quickstart
- **SEO Starter Guide:** https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Rich Results Test:** https://search.google.com/test/rich-results

---

## Contact & Ondersteuning

Voor vragen over deze setup:
- **Technical Lead:** [Naam invoegen]
- **Marketing Team:** [Contact invoegen]
- **Documentatie datum:** 2025-10-18

---

**Volgende stap:** Zie `BING-WEBMASTER-SETUP.md` voor Bing Webmaster Tools setup.
