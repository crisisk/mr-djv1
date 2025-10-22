# Mr. DJ - Google Analytics & Tag Manager Setup

## Overview
Mr. DJ website gebruikt Google Tag Manager (GTM) voor centraal tag management en Google Analytics 4 (GA4) voor analytics.

## Accounts & Properties

### Google Tag Manager
- **Container ID**: `GTM-MRDJ001` (Mr. DJ Production)
- **Workspace**: Mr. DJ Website
- **Environment**: Production

### Google Analytics 4
- **Property ID**: `G-MRDJ4PROD`
- **Property Name**: Mr. DJ Website
- **Data Stream**: Web - mr-dj.sevensa.nl

## Implementation Status

### ✅ Implemented
1. GTM container geïnstalleerd in `/frontend/public/index.html`
2. Google Consent Mode v2 geconfigureerd
3. Complianz cookie consent integratie
4. dataLayer initialisatie
5. Lead conversion tracking ready

### 🔄 Configuration Needed

#### Step 1: Create GTM Container
```
1. Ga naar https://tagmanager.google.com
2. Create Account: "Mr. DJ"
3. Create Container: "Mr. DJ Website"
4. Container Type: Web
5. Noteer Container ID (bijv. GTM-XXXXXX)
```

#### Step 2: Create GA4 Property
```
1. Ga naar https://analytics.google.com
2. Create Property: "Mr. DJ Website"
3. Industry: Entertainment & Events
4. Create Data Stream: Web
5. URL: https://mr-dj.sevensa.nl
6. Noteer Measurement ID (bijv. G-XXXXXXXXXX)
```

#### Step 3: Configure GTM Tags

**Tag 1: GA4 Configuration**
- Type: Google Analytics: GA4 Configuration
- Measurement ID: {GA4_MEASUREMENT_ID}
- Trigger: All Pages

**Tag 2: Lead Submission Event**
```javascript
Tag Type: GA4 Event
Event Name: generate_lead
Event Parameters:
  - event_type: {{DLV - Event Type}}
  - event_date: {{DLV - Event Date}}
  - package_id: {{DLV - Package ID}}
  - value: 100
  - currency: EUR
Trigger: Custom Event - lead_submitted
```

**Tag 3: Page View Enhanced**
```javascript
Tag Type: GA4 Event
Event Name: page_view
Event Parameters:
  - page_title: {{Page Title}}
  - page_location: {{Page URL}}
Trigger: All Pages
```

#### Step 4: Setup DataLayer Variables

Create these variables in GTM:

| Variable Name | Type | Layer Variable |
|--------------|------|----------------|
| DLV - Event Type | Data Layer Variable | eventType |
| DLV - Event Date | Data Layer Variable | eventDate |
| DLV - Package ID | Data Layer Variable | packageId |
| DLV - Contact ID | Data Layer Variable | contactId |
| DLV - Lead Value | Data Layer Variable | leadValue |

## Lead Tracking Implementation

### Frontend Integration

Het contactformulier pushed events naar dataLayer:

```javascript
// In ContactForm.jsx na succesvolle submission
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'lead_submitted',
  eventType: formData.eventType,
  eventDate: formData.event_date,
  packageId: formData.packageId,
  contactId: response.contactId,
  leadValue: 100 // Estimated lead value
});
```

### Conversion Events

**Event: generate_lead**
- Fired on: Contact form submission
- Value: €100 (estimated)
- Parameters: event_type, event_date, package_id

**Event: booking_completed** (future)
- Fired on: Booking confirmation
- Value: Actual booking amount
- Parameters: booking_id, amount, payment_method

## Cookie Consent (GDPR)

### Complianz Integration

Consent categories:
- **Functional**: Always allowed
- **Analytics**: GA4 tracking (opt-in)
- **Marketing**: Facebook Pixel (opt-in)

### Consent Mode Configuration

```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

// After user accepts
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

## Testing Checklist

### GTM Preview Mode
```
1. Open GTM container
2. Click "Preview"
3. Enter URL: https://mr-dj.sevensa.nl
4. Fill in contact form
5. Verify "lead_submitted" event fires
6. Check all dataLayer variables populate
```

### GA4 DebugView
```
1. Open GA4 Property
2. Go to Admin → DebugView
3. Submit test lead
4. Verify "generate_lead" event appears
5. Check event parameters
```

### Test Lead Submission
```bash
# JavaScript console test
window.dataLayer.push({
  event: 'lead_submitted',
  eventType: 'bruiloft',
  eventDate: '2025-12-31',
  packageId: 'premium',
  contactId: 'test-123',
  leadValue: 100
});
```

## Facebook Pixel Integration

### Pixel ID
- **Pixel ID**: `YOUR_FB_PIXEL_ID`
- **Ad Account**: Mr. DJ Advertising

### Events Tracked
1. **PageView**: All pages
2. **Lead**: Contact form submission
3. **CompleteRegistration**: Booking confirmed

### Implementation

Already implemented in `/frontend/public/tracking.html`:

```javascript
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');

// On lead submission
fbq('track', 'Lead', {
  content_name: eventType,
  currency: 'EUR',
  value: 100
});
```

## Environment Variables

Add to `/backend/.env`:

```bash
# Analytics Configuration
GTM_CONTAINER_ID=GTM-MRDJ001
GA4_MEASUREMENT_ID=G-MRDJ4PROD
FB_PIXEL_ID=YOUR_FB_PIXEL_ID
COMPLIANZ_SITE_ID=YOUR_COMPLIANZ_ID

# Tracking Settings
ENABLE_GA4=true
ENABLE_FB_PIXEL=true
ENABLE_CONVERSION_TRACKING=true
```

## URLs & Resources

- GTM Container: https://tagmanager.google.com/container/GTM-MRDJ001
- GA4 Property: https://analytics.google.com/analytics/web/#/pXXXXXX
- Complianz Dashboard: https://app.complianz.io
- Tag Assistant: https://tagassistant.google.com

## KPIs & Goals

### Primary Goals
1. **Lead Generation**: Track form submissions
2. **Conversion Rate**: Forms/Sessions
3. **Event Engagement**: Event type popularity

### Secondary Metrics
1. Page views per session
2. Bounce rate
3. Average session duration
4. Geographic distribution (Brabant focus)

## Support & Troubleshooting

### Common Issues

**Issue: Tags not firing**
- Check GTM preview mode
- Verify dataLayer events
- Check consent settings

**Issue: Conversions not tracking**
- Verify GA4 measurement ID
- Check event parameters
- Review DebugView

**Issue: GDPR compliance**
- Confirm Complianz integration
- Test cookie consent flow
- Verify consent mode

## Monthly Reporting

Setup automated monthly reports via GA4:
1. Lead generation overview
2. Top performing pages
3. Traffic sources
4. Event type breakdown
5. Geographic distribution

Export to: marketing@mr-dj.nl
