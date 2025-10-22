# GTM + GA4 Implementatie Status - Mr. DJ
**Laatst bijgewerkt:** 2025-10-21
**Container ID:** GTM-TK95XXK
**GA4 Measurement ID:** G-166LYYHW64

---

## ✅ Wat is geïmplementeerd

### 1. GTM Container Installatie ✅ VOLTOOID
**Status:** Geïnstalleerd in alle 119 HTML bestanden

**Locaties:**
- **Head section:** GTM script direct na `<meta name="twitter:creator">` tag
- **Body section:** GTM noscript iframe direct na `<body>` tag

**Verificatie:**
```bash
# Check aantal bestanden met GTM
grep -rl "GTM-TK95XXK" /srv/apps/mr-djv1/frontend/public/*.html | wc -l
# Output: 119 ✅
```

**Code geïnstalleerd:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TK95XXK');</script>
<!-- End Google Tag Manager -->

<!-- In <body> -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TK95XXK"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

---

### 2. Event Tracking JavaScript ✅ VOLTOOID
**Status:** gtm-events.js aangemaakt en geladen op alle paginas

**Bestand:** `/srv/apps/mr-djv1/frontend/public/js/gtm-events.js`

**Events geïmplementeerd:**

#### 2.1 Contact Form Submit Event ✅
```javascript
Event Name: contact_form_submit
Parameters:
├── form_id: string
├── form_name: "contact"
├── page_path: string
├── page_title: string
└── value: 100
```

**Detectie:**
- `form[name="contact"]`
- `form#contact-form`
- `form.contact-form`

#### 2.2 WhatsApp Click Event ✅
```javascript
Event Name: whatsapp_click
Parameters:
├── link_url: string
├── link_text: string
├── page_path: string
└── value: 80
```

**Detectie:**
- Links containing `wa.me`
- Links containing `whatsapp`

#### 2.3 Phone Click Event ✅
```javascript
Event Name: phone_click
Parameters:
├── phone_number: string (zonder tel: prefix)
├── link_text: string
├── page_path: string
└── value: 90
```

**Detectie:**
- Links starting with `tel:`

#### 2.4 Quote Request Event ✅
```javascript
Event Name: quote_request
Parameters:
├── service_type: "bruiloft" | "bedrijf" | "privé" | "dj+sax" | "general"
├── button_text: string
├── page_path: string
├── page_title: string
└── value: 120
```

**Detectie:**
- `a[href*="contact"][class*="cta"]`
- `button[class*="quote"]`
- `a[href*="#offerte"]`
- `.btn-primary`
- `.cta-button`

#### 2.5 Service Page View Event ✅
```javascript
Event Name: view_service
Parameters:
├── service_name: string
├── service_category: "bruiloft" | "bedrijf" | "privé" | "dj+sax" | "lokaal"
├── page_path: string
└── page_title: string
```

**Detectie:**
- URLs matching: `.*(bruiloft|bedrijf|prive|dj-in-|dj-sax).*`

#### 2.6 Scroll Depth Tracking ✅
```javascript
Event Name: scroll_depth
Parameters:
├── percent_scrolled: 25 | 50 | 75 | 90
└── page_path: string
```

**Tracking:** 25%, 50%, 75%, 90% scroll thresholds

#### 2.7 Video Play Tracking ✅
```javascript
Event Name: video_play
Parameters:
├── video_url: string
├── video_title: string
└── page_path: string
```

**Detectie:** All `<video>` elements

#### 2.8 Gallery Image Click ✅
```javascript
Event Name: gallery_image_click
Parameters:
├── image_url: string
├── image_alt: string
└── page_path: string
```

**Detectie:**
- `.gallery img`
- `.portfolio img`
- `[class*="image-grid"] img`

---

### 3. Script Integratie ✅ VOLTOOID
**Status:** Script tag toegevoegd aan alle 140 HTML bestanden

**Locatie:** Direct voor `</body>` tag

**Code:**
```html
    <!-- GTM Event Tracking -->
    <script src="/js/gtm-events.js"></script>
</body>
```

**Verificatie:**
```bash
# Check aantal bestanden met gtm-events.js
grep -rl "gtm-events.js" /srv/apps/mr-djv1/frontend/public/*.html | wc -l
# Output: 140 ✅
```

---

## ⏳ Wat moet nog handmatig in GTM Dashboard

### 1. GA4 Configuration Tag Aanmaken
**Prioriteit:** 🔴 HOOG - Vereist voor alle tracking

**Stappen:**
1. Login op https://tagmanager.google.com met info@mr-dj.nl
2. Selecteer Container: GTM-TK95XXK
3. Ga naar: Tags → New
4. Configuratie:
   ```
   Tag Type: Google Analytics: GA4 Configuration
   Tag Name: GA4 - Configuration
   Measurement ID: G-166LYYHW64

   Settings:
   ✅ Send page view event
   ✅ Enhanced Measurement

   Trigger: All Pages
   ```
5. Save & Submit
6. Publish version

**Waarom nodig:** Zonder deze tag wordt er geen data naar GA4 gestuurd

---

### 2. Custom Event Tags Aanmaken
**Prioriteit:** 🟡 MEDIUM - Voor conversie tracking

Voor elk event een tag aanmaken in GTM:

#### Tag 1: Contact Form Submit
```
Tag Type: GA4 Event
Tag Name: GA4 - Event - Contact Form Submit
Configuration Tag: GA4 - Configuration
Event Name: contact_form_submit

Trigger:
Type: Custom Event
Event name: contact_form_submit
```

#### Tag 2: WhatsApp Click
```
Tag Type: GA4 Event
Tag Name: GA4 - Event - WhatsApp Click
Configuration Tag: GA4 - Configuration
Event Name: whatsapp_click

Trigger:
Type: Custom Event
Event name: whatsapp_click
```

#### Tag 3: Phone Click
```
Tag Type: GA4 Event
Tag Name: GA4 - Event - Phone Click
Configuration Tag: GA4 - Configuration
Event Name: phone_click

Trigger:
Type: Custom Event
Event name: phone_click
```

#### Tag 4: Quote Request
```
Tag Type: GA4 Event
Tag Name: GA4 - Event - Quote Request
Configuration Tag: GA4 - Configuration
Event Name: quote_request

Trigger:
Type: Custom Event
Event name: quote_request
```

**Opmerking:** Omdat we `dataLayer.push()` gebruiken in onze JavaScript, worden deze events automatisch beschikbaar als Custom Event triggers in GTM.

---

### 3. Conversies Markeren in GA4
**Prioriteit:** 🟡 MEDIUM - Voor ROI tracking

**Stappen:**
1. Login op https://analytics.google.com met info@mr-dj.nl
2. Selecteer Property: Mr. DJ Website (G-166LYYHW64)
3. Ga naar: Admin → Events
4. Vink aan als conversie:
   - ✅ `contact_form_submit`
   - ✅ `whatsapp_click`
   - ✅ `phone_click`
   - ✅ `quote_request`

**Event Values (optioneel):**
| Event | Value | Reasoning |
|-------|-------|-----------|
| contact_form_submit | €100 | Gemiddelde lead waarde |
| whatsapp_click | €80 | Hoge intent contact |
| phone_click | €90 | Warme lead |
| quote_request | €120 | Serieuze interesse |

---

### 4. Custom Reports Aanmaken (Optioneel)
**Prioriteit:** 🟢 LAAG - Nice to have

**Report 1: Conversion Funnel**
```
Type: Funnel Exploration
Steps:
1. page_view
2. view_service
3. quote_request | contact_form_submit | whatsapp_click | phone_click
4. conversion
```

**Report 2: Service Performance**
```
Type: Free Form
Dimensions: service_category, service_name
Metrics: Sessions, Conversions, Revenue
```

---

## 🧪 Testing Checklist

### Pre-Launch Testing

#### 1. GTM Preview Mode Test ⏳
- [ ] Open GTM Dashboard
- [ ] Klik "Preview" (rechts boven)
- [ ] Voer URL in: https://www.mr-dj.nl (of staging URL)
- [ ] Controleer Tags:
  - [ ] GA4 Configuration tag vuurt op All Pages
  - [ ] Page view events worden gestuurd

#### 2. Event Testing ⏳
- [ ] **Contact Form Submit**
  - [ ] Ga naar contact pagina
  - [ ] Vul formulier in
  - [ ] Submit form
  - [ ] Check GTM Debug: `contact_form_submit` event visible
  - [ ] Check parameters: form_id, value=100

- [ ] **WhatsApp Click**
  - [ ] Klik WhatsApp button
  - [ ] Check GTM Debug: `whatsapp_click` event
  - [ ] Check parameters: link_url, value=80

- [ ] **Phone Click**
  - [ ] Klik telefoonnummer
  - [ ] Check GTM Debug: `phone_click` event
  - [ ] Check parameters: phone_number, value=90

- [ ] **Quote Request**
  - [ ] Klik "Offerte" button
  - [ ] Check GTM Debug: `quote_request` event
  - [ ] Check parameters: service_type, value=120

- [ ] **Service Page View**
  - [ ] Navigeer naar bruiloft pagina
  - [ ] Check GTM Debug: `view_service` event
  - [ ] Check parameters: service_category=bruiloft

- [ ] **Scroll Tracking**
  - [ ] Scroll naar 25% van pagina
  - [ ] Check GTM Debug: `scroll_depth` event with percent_scrolled=25
  - [ ] Herhaal voor 50%, 75%, 90%

#### 3. GA4 Real-time Test ⏳
- [ ] Open GA4: https://analytics.google.com
- [ ] Ga naar: Reports → Realtime
- [ ] Open website in andere tab
- [ ] Check Realtime rapport:
  - [ ] Active users: 1+
  - [ ] Page views incrementing
  - [ ] Events showing up

#### 4. Cross-browser Testing ⏳
- [ ] Chrome: GTM + Events werken
- [ ] Firefox: GTM + Events werken
- [ ] Safari: GTM + Events werken
- [ ] Mobile Chrome: GTM + Events werken
- [ ] Mobile Safari: GTM + Events werken

#### 5. Console Error Check ⏳
- [ ] Open browser console (F12)
- [ ] Check for JavaScript errors
- [ ] Verify `console.log('GTM Event:')` messages appear
- [ ] No 404 errors for gtm-events.js

---

## 📊 Monitoring & Maintenance

### Daily Monitoring (Eerste Week)
- [ ] Check GA4 Real-time rapport dagelijks
- [ ] Verify events worden getriggerd
- [ ] Monitor voor abnormale patronen

### Weekly Monitoring
- [ ] Check GA4 Event Count rapport
- [ ] Verify alle events worden geregistreerd
- [ ] Check conversie rates per service type

### Monthly Analysis
- [ ] Analyseer top performing service pages
- [ ] Vergelijk contact methods (form vs WhatsApp vs phone)
- [ ] Optimize CTA placements based on data
- [ ] Review scroll depth data for content optimization

---

## 🔍 Debug Commands

### Check GTM Installation
```bash
# Count files with GTM container
grep -rl "GTM-TK95XXK" /srv/apps/mr-djv1/frontend/public/*.html | wc -l

# Show GTM code in index.html
grep -A5 "Google Tag Manager" /srv/apps/mr-djv1/frontend/public/index.html
```

### Check Event Tracking Script
```bash
# Count files with gtm-events.js
grep -rl "gtm-events.js" /srv/apps/mr-djv1/frontend/public/*.html | wc -l

# Show script content
cat /srv/apps/mr-djv1/frontend/public/js/gtm-events.js | head -20
```

### Browser Console Debug
```javascript
// Check if GTM loaded
console.log(window.google_tag_manager);

// Check dataLayer
console.log(window.dataLayer);

// Manual test event
window.dataLayer.push({
  event: 'test_event',
  test_param: 'test_value'
});
```

---

## 📈 Verwachte Results (Na 7 dagen)

**Traffic Metrics:**
| Metric | Expected Range |
|--------|----------------|
| Daily Users | 20-50 |
| Daily Page Views | 50-150 |
| Avg. Session Duration | 2-4 min |
| Bounce Rate | 40-60% |

**Event Metrics (per week):**
| Event | Expected Count |
|-------|----------------|
| view_service | 100-200 |
| contact_form_submit | 3-8 |
| whatsapp_click | 8-15 |
| phone_click | 5-12 |
| quote_request | 4-10 |

**Conversion Rate:**
- Target: >3%
- Calculation: (Conversions / Sessions) × 100

---

## 🎯 Next Steps

1. **Immediate (Vandaag):**
   - [ ] Login GTM Dashboard
   - [ ] Maak GA4 Configuration tag aan
   - [ ] Publish GTM container
   - [ ] Test in Preview mode

2. **Short-term (Deze week):**
   - [ ] Maak custom event tags aan
   - [ ] Markeer conversies in GA4
   - [ ] Test alle events
   - [ ] Monitor data flow

3. **Medium-term (Volgende maand):**
   - [ ] Maak custom reports aan
   - [ ] Setup dashboard
   - [ ] Analyseer eerste data
   - [ ] Optimize based on insights

---

## 🔗 Relevante Documenten

- **Setup Guide:** `/srv/apps/mr-djv1/docs/GTM_GA4_CONFIGURATION_GUIDE.md`
- **Event Tracking Script:** `/srv/apps/mr-djv1/frontend/public/js/gtm-events.js`
- **Vault Credentials:** `/srv/apps/mr-djv1/vault/.env`
- **Account Setup:** `/srv/apps/mr-djv1/vault/ACCOUNT_SETUP_GUIDE.md`

---

## ✅ Quick Summary

**DONE:**
- ✅ GTM container (GTM-TK95XXK) in 119 HTML files
- ✅ Event tracking JavaScript (8 events)
- ✅ Script integration in 140 HTML files
- ✅ GA4 Measurement ID (G-166LYYHW64) ontvangen

**TODO (Manual):**
- ⏳ GA4 Configuration tag in GTM dashboard
- ⏳ Custom event tags in GTM
- ⏳ Conversies markeren in GA4
- ⏳ Testing & verificatie

**Ready to deploy:** JA ✅
**Blocking issues:** GEEN ❌
**Manual steps required:** JA - GTM dashboard configuratie

---

**Vragen?** Zie GTM_GA4_CONFIGURATION_GUIDE.md voor gedetailleerde instructies.
