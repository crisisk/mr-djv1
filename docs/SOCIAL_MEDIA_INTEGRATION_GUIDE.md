# Social Media Integration Guide - Mr. DJ
**Datum:** 2025-10-21
**Status:** Ready for implementation (Pixel IDs needed)

---

## 📋 Overzicht

Deze gids helpt je om social media tracking en integraties te implementeren voor www.mr-dj.nl:

1. **Facebook Pixel** - Conversie tracking en remarketing
2. **Instagram Feed** - Social proof en engagement
3. **Social Media Links** - Cross-platform navigation

---

## 🔐 Current Credentials

**Facebook Business Manager:**
- Admin Email: b_weijer@hotmail.com
- Password: Dansgarantie01!
- Page ID: (nog aan te maken)
- Pixel ID: (nog aan te maken)

**Instagram Business:**
- Username: mr_dj.nl
- Email: info@mr-dj.nl
- Password: Hacolita1!

---

## 📊 Part 1: Facebook Pixel Setup (30 minuten)

### 1.1 Facebook Pixel Aanmaken

**Stappen:**
1. Ga naar: https://business.facebook.com/events_manager2
2. Login met: b_weijer@hotmail.com
3. Klik: **Connect Data Sources** → **Web**
4. Klik: **Facebook Pixel** → **Connect**
5. Naam: `Mr. DJ Website Tracking`
6. Website URL: `www.mr-dj.nl`
7. Klik: **Continue**
8. Kies: **Manually Install Code Yourself**
9. **Kopieer de Pixel ID** (het nummer zoals: 1234567890123456)

**Opslaan in vault:**
```bash
# Update /srv/apps/mr-djv1/vault/.env
FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

### 1.2 Base Pixel Code

**Code om toe te voegen aan ALLE HTML pagina's:**

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID_HERE');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

**Locatie:** Plaats in `<head>` sectie, direct NA de GTM code

### 1.3 Conversion Events

**Event 1: Contact Form Submit**
```javascript
// In contact.html, na succesvol verzenden:
fbq('track', 'Lead', {
  content_name: 'Contact Form',
  content_category: formData.eventType,
  value: 100.00,
  currency: 'EUR'
});
```

**Event 2: Quote Request**
```javascript
// Bij quote request button click:
fbq('track', 'InitiateCheckout', {
  content_name: 'Quote Request',
  content_category: serviceType,
  value: 120.00,
  currency: 'EUR'
});
```

**Event 3: WhatsApp Click**
```javascript
// Bij WhatsApp button click:
fbq('track', 'Contact', {
  content_name: 'WhatsApp',
  value: 80.00,
  currency: 'EUR'
});
```

**Event 4: Phone Click**
```javascript
// Bij phone link click:
fbq('track', 'Contact', {
  content_name: 'Phone Call',
  value: 90.00,
  currency: 'EUR'
});
```

### 1.4 Custom Audiences

**In Facebook Events Manager:**

1. **Website Visitors**
   - All visitors (last 30 days)
   - Voor remarketing ads

2. **Service Page Viewers**
   - URL contains: `bruiloft-dj` OR `bedrijf` OR `prive`
   - Voor service-specific ads

3. **Contact Form Abandoners**
   - Viewed contact page
   - Did NOT submit form
   - Voor retargeting

4. **Converted Leads**
   - Completed Lead event
   - Exclude from acquisition campaigns

---

## 📸 Part 2: Instagram Feed Integration

### 2.1 Instagram Graph API Setup

**Prerequisites:**
- Instagram Business Account (✅ @mr_dj.nl)
- Facebook Business Page gekoppeld
- Access Token nodig

**Stappen:**
1. Ga naar: https://developers.facebook.com/apps
2. Klik: **Create App** → **Business**
3. App Name: `Mr. DJ Website`
4. Contact Email: info@mr-dj.nl
5. Add Product: **Instagram Graph API**
6. Basic Settings → Add Platform → **Website**
7. Website URL: `https://www.mr-dj.nl`

### 2.2 Access Token Genereren

**Via Graph API Explorer:**
1. https://developers.facebook.com/tools/explorer/
2. Select App: Mr. DJ Website
3. User Token → Permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
4. Generate Access Token
5. **Kopieer token** (lang token!)

**Token opslaan in vault:**
```bash
# In /srv/apps/mr-djv1/vault/.env
INSTAGRAM_ACCESS_TOKEN=YOUR_LONG_LIVED_TOKEN
INSTAGRAM_USER_ID=YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID
```

### 2.3 Instagram Feed Widget Code

**Plaats in gallery.html of homepage:**

```html
<!-- Instagram Feed Section -->
<section class="instagram-feed">
    <div class="container">
        <h2>Volg Ons Op Instagram</h2>
        <p class="subtitle">@mr_dj.nl</p>

        <div id="instagram-grid" class="instagram-grid">
            <!-- Will be populated by JavaScript -->
        </div>

        <a href="https://instagram.com/mr_dj.nl" target="_blank" class="btn-instagram">
            Bekijk Meer Op Instagram →
        </a>
    </div>
</section>

<style>
.instagram-feed {
    padding: 80px 20px;
    background: #f8f9fa;
    text-align: center;
}

.instagram-feed h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.instagram-feed .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 40px;
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto 40px;
}

.instagram-post {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    aspect-ratio: 1;
    cursor: pointer;
    transition: transform 0.3s;
}

.instagram-post:hover {
    transform: scale(1.05);
}

.instagram-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.instagram-post-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: white;
    font-size: 0.9rem;
    padding: 20px;
    text-align: center;
}

.instagram-post:hover .instagram-post-overlay {
    opacity: 1;
}

.btn-instagram {
    display: inline-block;
    padding: 15px 40px;
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: bold;
    transition: transform 0.3s;
}

.btn-instagram:hover {
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .instagram-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

<script>
// Instagram Feed Loader
(async function() {
    const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'; // Replace with actual token
    const INSTAGRAM_USER_ID = 'YOUR_USER_ID'; // Replace with actual user ID

    try {
        // Fetch recent media
        const response = await fetch(
            `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=6&access_token=${INSTAGRAM_ACCESS_TOKEN}`
        );

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const grid = document.getElementById('instagram-grid');

            data.data.forEach(post => {
                // Only show images (not videos)
                if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
                    const postElement = document.createElement('a');
                    postElement.href = post.permalink;
                    postElement.target = '_blank';
                    postElement.className = 'instagram-post';

                    const img = document.createElement('img');
                    img.src = post.media_url;
                    img.alt = post.caption ? post.caption.substring(0, 100) : 'Instagram post';
                    img.loading = 'lazy';

                    const overlay = document.createElement('div');
                    overlay.className = 'instagram-post-overlay';
                    overlay.textContent = post.caption ? post.caption.substring(0, 100) + '...' : 'View on Instagram';

                    postElement.appendChild(img);
                    postElement.appendChild(overlay);
                    grid.appendChild(postElement);
                }
            });
        }
    } catch (error) {
        console.error('Failed to load Instagram feed:', error);
        // Optionally hide the section if feed fails to load
        document.querySelector('.instagram-feed').style.display = 'none';
    }
})();
</script>
```

**⚠️ Security Note:**
Tokens niet hardcoded in frontend! Gebruik een backend proxy endpoint:
- Backend: `/api/instagram/feed`
- Returns: Cached Instagram posts (cache 1 hour)

---

## 🔗 Part 3: Social Media Links

### 3.1 Social Media Buttons (Header/Footer)

```html
<!-- Social Media Links -->
<div class="social-links">
    <a href="https://facebook.com/misterdj.nl" target="_blank" rel="noopener" aria-label="Facebook">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    </a>
    <a href="https://instagram.com/mr_dj.nl" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    </a>
    <a href="https://wa.me/31408422594" target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    </a>
</div>

<style>
.social-links {
    display: flex;
    gap: 15px;
    align-items: center;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
    color: #333;
    transition: all 0.3s;
}

.social-links a:hover {
    transform: scale(1.1);
    background: #00AEEF;
    color: white;
}
</style>
```

---

## 📈 Part 4: Conversion Tracking Setup

### 4.1 Facebook Conversions API (Server-Side)

**Backend endpoint:** `/api/facebook-conversion`

```javascript
// backend/src/routes/facebook-conversion.js
const crypto = require('crypto');
const fetch = require('node-fetch');

async function sendConversionEvent(eventData) {
    const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_CONVERSION_API_TOKEN;

    const payload = {
        data: [{
            event_name: eventData.event_name, // 'Lead', 'Contact', etc.
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: eventData.url,
            user_data: {
                em: [hashSHA256(eventData.email)],
                ph: [hashSHA256(eventData.phone)],
                client_ip_address: eventData.ip,
                client_user_agent: eventData.userAgent,
                fbc: eventData.fbc, // _fbc cookie
                fbp: eventData.fbp  // _fbp cookie
            },
            custom_data: {
                currency: 'EUR',
                value: eventData.value,
                content_name: eventData.content_name,
                content_category: eventData.content_category
            }
        }]
    };

    const response = await fetch(
        `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
    );

    return response.json();
}

function hashSHA256(value) {
    if (!value) return null;
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

module.exports = { sendConversionEvent };
```

**Integratie in contactService.js:**
```javascript
// Na succesvolle lead opslag:
const facebookConversion = require('./facebookConversion');

await facebookConversion.sendConversionEvent({
    event_name: 'Lead',
    url: 'https://www.mr-dj.nl/contact',
    email: payload.email,
    phone: payload.phone,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    fbc: req.cookies._fbc,
    fbp: req.cookies._fbp,
    value: 100.00,
    content_name: 'Contact Form',
    content_category: payload.eventType
});
```

### 4.2 Event Naming Convention

| User Action | Facebook Event | Value (EUR) |
|-------------|----------------|-------------|
| Contact form submit | `Lead` | €100 |
| Quote request | `InitiateCheckout` | €120 |
| WhatsApp click | `Contact` | €80 |
| Phone click | `Contact` | €90 |
| Service page view | `ViewContent` | - |
| Gallery view | `ViewContent` | - |

---

## 🧪 Part 5: Testing & Verification

### 5.1 Facebook Pixel Helper

**Chrome Extension:**
1. Install: https://chrome.google.com/webstore/detail/facebook-pixel-helper
2. Open www.mr-dj.nl
3. Click extension icon
4. Should show: Pixel ID, PageView event

### 5.2 Facebook Events Manager Test

1. Open: https://business.facebook.com/events_manager2
2. Select your Pixel
3. Go to: **Test Events**
4. Open website in other tab
5. Perform actions (contact form, etc.)
6. Check if events appear in Test Events

### 5.3 Test Checklist

- [ ] **Base Pixel fires** on all pages
- [ ] **PageView event** tracked correctly
- [ ] **Lead event** fires on form submit
- [ ] **Contact events** fire on WhatsApp/Phone clicks
- [ ] **ViewContent** fires on service pages
- [ ] **Server-side events** match client-side
- [ ] **Instagram feed** loads 6 recent posts
- [ ] **Social links** work correctly

---

## 📊 Part 6: Facebook Ads Campaign Setup

### 6.1 Campaign Structure

**Campaign 1: Brand Awareness**
- Objective: Reach
- Audience: Noord-Brabant + Limburg, 25-55 jaar
- Budget: €300/maand
- Placements: Facebook + Instagram Feed

**Campaign 2: Lead Generation**
- Objective: Conversions (Lead event)
- Audience: Custom Audience (Website Visitors, last 30 days)
- Budget: €500/maand
- Ad format: Carousel (services)

**Campaign 3: Retargeting**
- Objective: Conversions
- Audience: Contact page viewers (no conversion)
- Budget: €200/maand
- Offer: Special discount or free consultation

### 6.2 Ad Creative Guidelines

**Images:**
- Min resolution: 1200x628px
- Text overlay: <20% of image
- Show: DJ in action, happy crowds, professional setup

**Copy:**
- Headline: "100% Dansgarantie | Professional DJ Services"
- Body: Social proof (reviews), USPs, CTA
- CTA Button: "Vraag Offerte Aan" or "Meer Info"

**Landing Pages:**
- Brand awareness → Homepage
- Wedding → bruiloft-dj.html
- Corporate → bedrijfsfeest-dj.html
- Lead gen → contact.html

---

## 🔒 Security Best Practices

### API Tokens

**✅ DO:**
- Store tokens in vault/.env
- Use backend proxy for Instagram API
- Rotate tokens every 60 days
- Use long-lived tokens (not short-lived)

**❌ DON'T:**
- Hardcode tokens in frontend JavaScript
- Commit tokens to git
- Share tokens publicly
- Use personal access tokens for production

### GDPR Compliance

**Required:**
- Cookie consent banner (before loading Pixel)
- Privacy policy update (mention Facebook Pixel)
- Data processing agreement with Facebook

**Code example:**
```javascript
// Only load pixel after consent
if (getCookieConsent('marketing')) {
    // Load Facebook Pixel
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
}
```

---

## 📋 Implementation Checklist

**Phase 1: Facebook Pixel (30 min)**
- [ ] Create Facebook Pixel in Events Manager
- [ ] Copy Pixel ID to vault/.env
- [ ] Add base Pixel code to all HTML pages
- [ ] Add conversion events to contact form
- [ ] Test with Pixel Helper extension
- [ ] Verify events in Events Manager

**Phase 2: Conversion API (1 hour)**
- [ ] Generate Conversion API Access Token
- [ ] Add token to vault/.env
- [ ] Create backend conversion endpoint
- [ ] Integrate with contactService
- [ ] Test server-side events
- [ ] Verify matching with client-side

**Phase 3: Instagram Integration (1 hour)**
- [ ] Setup Instagram Graph API app
- [ ] Generate long-lived access token
- [ ] Create backend proxy endpoint
- [ ] Add Instagram feed widget to homepage
- [ ] Test feed loading
- [ ] Add error handling

**Phase 4: Social Links (15 min)**
- [ ] Add social media buttons to header
- [ ] Add social media buttons to footer
- [ ] Test all links
- [ ] Add aria-labels for accessibility

**Phase 5: Ads Setup (manual)**
- [ ] Create Facebook Ads account
- [ ] Setup payment method
- [ ] Create custom audiences
- [ ] Launch brand awareness campaign
- [ ] Launch lead generation campaign
- [ ] Setup retargeting campaign

---

## 📈 Expected Results (Na 30 dagen)

**Facebook Pixel Data:**
- PageViews: 1,500-3,000
- Lead events: 20-40
- Contact events: 50-80
- ViewContent: 500-1,000

**Instagram Engagement:**
- Profile visits: +30%
- Followers: +50-100
- Story views: +25%

**Facebook Ads ROI:**
- CTR: 2-4%
- Cost per Lead: €15-€25
- Conversion rate: 5-10%

---

## 🔗 Resources

**Facebook:**
- Events Manager: https://business.facebook.com/events_manager2
- Pixel Helper: https://chrome.google.com/webstore/detail/facebook-pixel-helper
- Conversions API Docs: https://developers.facebook.com/docs/marketing-api/conversions-api

**Instagram:**
- Graph API Docs: https://developers.facebook.com/docs/instagram-api
- Business Account Setup: https://help.instagram.com/502981923235522

**Tools:**
- Facebook Business Suite: https://business.facebook.com
- Meta Business Help Center: https://www.facebook.com/business/help

---

**Laatst bijgewerkt:** 2025-10-21
**Status:** Ready for implementation (awaiting Pixel ID)
**Contactpersoon:** info@mr-dj.nl
