# GTM + GA4 Configuratie Gids - Mr. DJ
**Datum:** 2025-10-21
**Status:** ✅ GTM geïnstalleerd | ⏳ Dashboard configuratie vereist

---

## 📋 Overzicht

**Wat is al gedaan:**
- ✅ GTM Container ID: `GTM-TK95XXK` geïnstalleerd in alle 119 HTML bestanden
- ✅ GA4 Measurement ID: `G-166LYYHW64` beschikbaar
- ✅ GTM code in `<head>` en `<body>` secties

**Wat nog moet:**
- ⏳ GA4 tag configureren in GTM dashboard
- ⏳ Event tracking implementeren
- ⏳ Conversies instellen
- ⏳ Testen en verifiëren

---

## 🔐 Inloggegevens

**GTM Account:**
- URL: https://tagmanager.google.com
- Email: info@mr-dj.nl
- Wachtwoord: [Zie vault/.env]
- Container ID: GTM-TK95XXK

**GA4 Account:**
- URL: https://analytics.google.com
- Email: info@mr-dj.nl
- Wachtwoord: [Zie vault/.env]
- Measurement ID: G-166LYYHW64
- Property Naam: Mr. DJ Website

---

## 📦 Stap 1: GA4 Tag Configureren in GTM

### 1.1 Inloggen in GTM Dashboard

1. Ga naar https://tagmanager.google.com
2. Log in met info@mr-dj.nl
3. Selecteer workspace: **GTM-TK95XXK**

### 1.2 GA4 Configuration Tag Toevoegen

**Navigatie:** Tags → Nieuw → Tag Configuration

**Tag Details:**
```
Tag Type: Google Analytics: GA4 Configuration
Tag Naam: GA4 - Configuration
Measurement ID: G-166LYYHW64

Configuration Settings:
├── Send a page view event when this configuration loads: ✅ Enabled
├── Enhanced Measurement: ✅ Enabled
│   ├── Page views: ✅
│   ├── Scrolls: ✅ (90% threshold)
│   ├── Outbound clicks: ✅
│   ├── Site search: ❌ (geen search functie)
│   ├── Video engagement: ✅
│   └── File downloads: ✅
└── Cookie Domain: auto
```

**Trigger:**
```
Trigger Type: All Pages
Trigger Naam: All Pages
Fires On: All Pages
```

**Save & Publish:**
- Klik "Save"
- Klik "Submit" (rechts boven)
- Version Name: "GA4 Configuration - Initial Setup"
- Publish

### 1.3 Verificatie

1. Klik "Preview" (rechts boven)
2. Voer URL in: https://www.mr-dj.nl
3. Controleer of "GA4 - Configuration" tag vuurt op elke pagina

---

## 📊 Stap 2: Event Tracking Tags Configureren

### 2.1 Contact Form Submit Event

**Tag Configuration:**
```
Tag Type: Google Analytics: GA4 Event
Tag Naam: GA4 - Event - Contact Form Submit
Configuration Tag: GA4 - Configuration (select from dropdown)

Event Parameters:
├── Event Name: contact_form_submit
├── form_id: {{Form ID}} (use built-in variable)
├── form_name: contact
└── value: 100 (lead value in euros)

Trigger:
├── Type: Form Submission
├── Naam: Contact Form Submit
├── Wait for Tags: 2000ms
├── Check Validation: ✅ True
└── Fire On: All Forms
```

### 2.2 WhatsApp Click Event

**Tag Configuration:**
```
Tag Type: Google Analytics: GA4 Event
Tag Naam: GA4 - Event - WhatsApp Click
Configuration Tag: GA4 - Configuration

Event Parameters:
├── Event Name: whatsapp_click
├── link_text: {{Click Text}}
├── link_url: {{Click URL}}
└── value: 80 (high intent)

Trigger:
├── Type: Link Click
├── Naam: WhatsApp Link Clicks
├── Wait for Tags: 2000ms
└── Fire On: Click URL contains "wa.me"
```

### 2.3 Phone Click Event

**Tag Configuration:**
```
Tag Type: Google Analytics: GA4 Event
Tag Naam: GA4 - Event - Phone Click
Configuration Tag: GA4 - Configuration

Event Parameters:
├── Event Name: phone_click
├── phone_number: {{Click URL}} (remove tel: prefix)
├── link_text: {{Click Text}}
└── value: 90 (very high intent)

Trigger:
├── Type: Link Click
├── Naam: Phone Link Clicks
├── Wait for Tags: 2000ms
└── Fire On: Click URL starts with "tel:"
```

### 2.4 Quote Request Event

**Tag Configuration:**
```
Tag Type: Google Analytics: GA4 Event
Tag Naam: GA4 - Event - Quote Request
Configuration Tag: GA4 - Configuration

Event Parameters:
├── Event Name: quote_request
├── service_type: {{Page Path}} (extract service from URL)
├── page_title: {{Page Title}}
└── value: 120 (lead value)

Trigger:
├── Type: Custom Event
├── Naam: Quote Request Click
└── Fire On: dataLayer.push event = 'quote_request'
```

### 2.5 Service Page View Event

**Tag Configuration:**
```
Tag Type: Google Analytics: GA4 Event
Tag Naam: GA4 - Event - Service Page View
Configuration Tag: GA4 - Configuration

Event Parameters:
├── Event Name: view_service
├── service_name: {{Page Path}} (extract from URL)
├── service_category: bruiloft / bedrijf / privé
└── engagement_time: {{Page View Duration}}

Trigger:
├── Type: Page View
├── Naam: Service Pages
└── Fire On: Page Path matches regex: .*(bruiloft|bedrijf|prive|dj-in-).*
```

---

## 🎯 Stap 3: Conversies Configureren in GA4

### 3.1 Inloggen in GA4

1. Ga naar https://analytics.google.com
2. Selecteer Property: **Mr. DJ Website** (G-166LYYHW64)

### 3.2 Conversies Markeren

**Navigatie:** Admin → Events → Mark as conversion

**Conversies om aan te vinken:**
```
✅ contact_form_submit (Primaire conversie)
✅ whatsapp_click (Hoge intent)
✅ phone_click (Zeer hoge intent)
✅ quote_request (Lead conversie)
```

### 3.3 Conversie Waarden Instellen

**Navigatie:** Admin → Events → Edit event → Modify parameter

**Waarden:**
| Event | Value | Reasoning |
|-------|-------|-----------|
| contact_form_submit | €100 | Gemiddelde lead waarde |
| whatsapp_click | €80 | Directe communicatie, hoge conversie |
| phone_click | €90 | Telefonisch contact = warme lead |
| quote_request | €120 | Offerte aanvraag = serieuze interesse |

---

## 💻 Stap 4: Event Tracking Code Implementeren

### 4.1 Data Layer Push Code

**Locatie:** Voeg toe aan elk HTML bestand voor `</body>` tag

**Bestand:** `/srv/apps/mr-djv1/frontend/public/js/gtm-events.js` (nieuw bestand)

```javascript
// GTM Event Tracking for Mr. DJ
// Version: 1.0
// Date: 2025-10-21

(function() {
  'use strict';

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];

  // Helper function to push events
  function pushEvent(eventName, eventParams) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
    console.log('GTM Event:', eventName, eventParams);
  }

  // 1. Contact Form Submission Tracking
  function trackContactForm() {
    const contactForms = document.querySelectorAll('form[name="contact"], form#contact-form, form.contact-form');

    contactForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        pushEvent('contact_form_submit', {
          form_id: this.id || 'contact-form',
          form_name: this.name || 'contact',
          page_path: window.location.pathname,
          page_title: document.title,
          value: 100
        });
      });
    });
  }

  // 2. WhatsApp Click Tracking
  function trackWhatsAppClicks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
      if (link) {
        pushEvent('whatsapp_click', {
          link_url: link.href,
          link_text: link.textContent.trim(),
          page_path: window.location.pathname,
          value: 80
        });
      }
    });
  }

  // 3. Phone Click Tracking
  function trackPhoneClicks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="tel:"]');
      if (link) {
        const phoneNumber = link.href.replace('tel:', '');
        pushEvent('phone_click', {
          phone_number: phoneNumber,
          link_text: link.textContent.trim(),
          page_path: window.location.pathname,
          value: 90
        });
      }
    });
  }

  // 4. Quote Request Button Tracking
  function trackQuoteRequests() {
    const quoteButtons = document.querySelectorAll(
      'a[href*="contact"][class*="cta"], ' +
      'button[class*="quote"], ' +
      'a[href*="#offerte"], ' +
      '.btn-primary, ' +
      '.cta-button'
    );

    quoteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Extract service type from URL or page
        const servicePath = window.location.pathname;
        let serviceType = 'general';

        if (servicePath.includes('bruiloft')) serviceType = 'bruiloft';
        else if (servicePath.includes('bedrijf')) serviceType = 'bedrijf';
        else if (servicePath.includes('prive')) serviceType = 'privé';
        else if (servicePath.includes('dj-sax')) serviceType = 'dj+sax';

        pushEvent('quote_request', {
          service_type: serviceType,
          button_text: this.textContent.trim(),
          page_path: window.location.pathname,
          page_title: document.title,
          value: 120
        });
      });
    });
  }

  // 5. Service Page View Tracking
  function trackServicePageViews() {
    const path = window.location.pathname;

    // Check if this is a service page
    if (path.match(/.*(bruiloft|bedrijf|prive|dj-in-|dj-sax).*/)) {
      let serviceCategory = 'general';
      let serviceName = document.title.split('|')[0].trim();

      if (path.includes('bruiloft')) serviceCategory = 'bruiloft';
      else if (path.includes('bedrijf')) serviceCategory = 'bedrijf';
      else if (path.includes('prive')) serviceCategory = 'privé';
      else if (path.includes('dj-sax')) serviceCategory = 'dj+sax';
      else if (path.includes('dj-in-')) {
        serviceCategory = 'lokaal';
        serviceName = path.match(/dj-in-([^\/]+)/)?.[1] || 'unknown';
      }

      pushEvent('view_service', {
        service_name: serviceName,
        service_category: serviceCategory,
        page_path: path,
        page_title: document.title
      });
    }
  }

  // 6. Scroll Depth Tracking (Custom)
  function trackScrollDepth() {
    let scrollDepthMarks = {
      25: false,
      50: false,
      75: false,
      90: false
    };

    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      Object.keys(scrollDepthMarks).forEach(mark => {
        if (scrollPercent >= parseInt(mark) && !scrollDepthMarks[mark]) {
          scrollDepthMarks[mark] = true;
          pushEvent('scroll_depth', {
            percent_scrolled: mark,
            page_path: window.location.pathname
          });
        }
      });
    });
  }

  // 7. Video Play Tracking (if videos exist)
  function trackVideoPlays() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
      video.addEventListener('play', function() {
        pushEvent('video_play', {
          video_url: this.currentSrc || this.src,
          video_title: this.title || 'Untitled',
          page_path: window.location.pathname
        });
      });
    });
  }

  // 8. Gallery Image Click Tracking
  function trackGalleryClicks() {
    const galleryImages = document.querySelectorAll('.gallery img, .portfolio img, [class*="image-grid"] img');

    galleryImages.forEach(img => {
      img.addEventListener('click', function() {
        pushEvent('gallery_image_click', {
          image_url: this.src,
          image_alt: this.alt || 'No alt text',
          page_path: window.location.pathname
        });
      });
    });
  }

  // Initialize all tracking on page load
  function initTracking() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        trackContactForm();
        trackWhatsAppClicks();
        trackPhoneClicks();
        trackQuoteRequests();
        trackServicePageViews();
        trackScrollDepth();
        trackVideoPlays();
        trackGalleryClicks();
      });
    } else {
      // DOM already loaded
      trackContactForm();
      trackWhatsAppClicks();
      trackPhoneClicks();
      trackQuoteRequests();
      trackServicePageViews();
      trackScrollDepth();
      trackVideoPlays();
      trackGalleryClicks();
    }
  }

  // Start tracking
  initTracking();

})();
```

### 4.2 Script Tag Toevoegen aan HTML

**Voeg toe aan alle HTML bestanden voor `</body>`:**

```html
<!-- GTM Event Tracking -->
<script src="/js/gtm-events.js"></script>
```

---

## 🧪 Stap 5: Testing & Verificatie

### 5.1 GTM Preview Mode

1. Open GTM Dashboard: https://tagmanager.google.com
2. Klik "Preview" (rechts boven)
3. Voer URL in: `https://www.mr-dj.nl`
4. Debug venster opent

**Te controleren:**
- ✅ GA4 Configuration tag vuurt op elke pagina
- ✅ Page view events worden gestuurd
- ✅ Enhanced measurement events werken

### 5.2 Event Testing

**Test elke event:**

1. **Contact Form:**
   - Ga naar contact pagina
   - Vul formulier in
   - Klik "Verstuur"
   - Check GTM Debug: `contact_form_submit` event

2. **WhatsApp Click:**
   - Klik op WhatsApp button
   - Check GTM Debug: `whatsapp_click` event
   - Parameters: link_url, value: 80

3. **Phone Click:**
   - Klik op telefoonnummer
   - Check GTM Debug: `phone_click` event
   - Parameters: phone_number, value: 90

4. **Quote Request:**
   - Klik op "Offerte aanvragen" button
   - Check GTM Debug: `quote_request` event
   - Parameters: service_type, value: 120

5. **Service Page View:**
   - Navigeer naar bruiloft pagina
   - Check GTM Debug: `view_service` event
   - Parameters: service_category: bruiloft

### 5.3 GA4 Real-time Verificatie

1. Open GA4: https://analytics.google.com
2. Ga naar: Reports → Realtime
3. Open website in andere tab: https://www.mr-dj.nl
4. Check Realtime rapport:
   - ✅ 1+ active users
   - ✅ Page views incrementing
   - ✅ Events showing up

### 5.4 GA4 DebugView

**Enable Debug Mode:**
```javascript
// Add to gtm-events.js (development only)
window.dataLayer.push({
  'gtm.debug': true
});
```

**View in GA4:**
1. Admin → DebugView
2. Open website
3. See real-time event stream
4. Verify all event parameters

---

## 📈 Stap 6: Rapportage Inrichten

### 6.1 Custom Reports in GA4

**Navigatie:** Explore → Create new exploration

**Report 1: Conversion Funnel**
```
Type: Funnel Exploration
Naam: Mr. DJ - Conversion Funnel

Steps:
1. page_view (All pages)
2. view_service (Service pages)
3. quote_request OR contact_form_submit OR whatsapp_click OR phone_click
4. conversion (Any conversion)

Breakdown: service_category
Filters: None
```

**Report 2: Service Performance**
```
Type: Free Form
Naam: Mr. DJ - Service Performance

Dimensions:
├── service_category
├── service_name
└── page_path

Metrics:
├── Sessions
├── Engaged sessions
├── Conversions
├── Conversion rate
└── Revenue (from event values)
```

**Report 3: Contact Method Comparison**
```
Type: Free Form
Naam: Mr. DJ - Contact Methods

Dimensions:
└── Event name (filter: contact_form_submit, whatsapp_click, phone_click)

Metrics:
├── Event count
├── Conversion rate
├── Total value
└── Avg. engagement time
```

### 6.2 Dashboard Setup

**Navigatie:** Home → Create dashboard

**Widgets:**

1. **Active Users (Real-time)**
   - Type: Scorecard
   - Metric: Active users

2. **Conversions Today**
   - Type: Scorecard
   - Metric: Conversions
   - Comparison: Yesterday

3. **Top Service Pages**
   - Type: Table
   - Dimension: Page path
   - Metric: Views, Conversions

4. **Contact Methods**
   - Type: Pie chart
   - Dimension: Event name
   - Metric: Event count
   - Filter: contact events only

5. **Conversion Rate by Service**
   - Type: Bar chart
   - Dimension: service_category
   - Metric: Conversion rate

---

## 🎯 Conversie Doelen & Optimalisatie

### 6.1 Conversion Goals

**Primaire Conversies:**
| Goal | Target per Week | Actual | Status |
|------|-----------------|--------|--------|
| Contact form submits | 5 | TBD | 🟡 |
| WhatsApp clicks | 10 | TBD | 🟡 |
| Phone clicks | 8 | TBD | 🟡 |
| Quote requests | 6 | TBD | 🟡 |

**Lead Value:**
- Gemiddelde event waarde: €100
- Target revenue per week: €2,900
- Conversion rate doel: >3%

### 6.2 A/B Testing Mogelijkheden

**Google Optimize (future):**
1. Test verschillende CTA button teksten
2. Test contact form plaatsing
3. Test service page layouts
4. Test prijsweergave

---

## 🔧 Troubleshooting

### GTM Tags Vuren Niet

**Check:**
1. GTM Preview mode actief?
2. Tag gepubliceerd? (Submit versie)
3. Trigger correct geconfigureerd?
4. Browser console errors?

**Debug:**
```javascript
// Check if GTM loaded
console.log(window.google_tag_manager);

// Check dataLayer
console.log(window.dataLayer);
```

### GA4 Geen Data

**Check:**
1. Measurement ID correct: G-166LYYHW64?
2. GA4 Configuration tag vuurt?
3. Real-time rapport na 30 seconden?
4. Firewall/Ad blocker disabled?

**Debug:**
```javascript
// Check GA4 loaded
console.log(window.gtag);

// Manual test event
gtag('event', 'test_event', {
  'event_category': 'test',
  'event_label': 'manual_test'
});
```

### Events Niet Zichtbaar in GA4

**Check:**
1. Event naam correct gespeld?
2. Parameters binnen limiet (25 per event)?
3. DebugView enabled voor real-time debugging?
4. Wacht 24-48 uur voor volledige data processing

---

## 📋 Checklist voor Go-Live

**Voor productie deployment:**

- [ ] GTM Container GTM-TK95XXK gepubliceerd
- [ ] GA4 Configuration tag actief met G-166LYYHW64
- [ ] Alle event tags aangemaakt en getest
- [ ] Conversies gemarkeerd in GA4
- [ ] gtm-events.js geüpload naar /js/ directory
- [ ] Script tag toegevoegd aan alle HTML bestanden
- [ ] GTM Preview mode getest op alle key pages
- [ ] GA4 Real-time rapport verified
- [ ] Custom reports aangemaakt
- [ ] Dashboard ingesteld
- [ ] Team getraind op GA4 interface
- [ ] Wekelijkse rapportage planning gemaakt

---

## 📚 Resources

**Documentatie:**
- GTM Help: https://support.google.com/tagmanager
- GA4 Help: https://support.google.com/analytics/answer/10089681
- Event Tracking Guide: https://developers.google.com/analytics/devguides/collection/ga4/events

**Nuttige Links:**
- GTM Dashboard: https://tagmanager.google.com/
- GA4 Dashboard: https://analytics.google.com/
- GA4 Measurement Protocol: https://developers.google.com/analytics/devguides/collection/protocol/ga4

**Support:**
- Google Analytics Community: https://support.google.com/analytics/community
- GTM Community: https://support.google.com/tagmanager/community

---

**Laatst bijgewerkt:** 2025-10-21
**Versie:** 1.0
**Contactpersoon:** info@mr-dj.nl
