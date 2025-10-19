# GA4 Conversion Tracking Setup Guide
## Mr. DJ Website - Complete Implementation Documentation

**Date:** October 2025
**GTM Container:** GTM-NST23HJX
**Google Analytics Account:** info@mr-dj.nl
**Implementation Status:** Code Complete - Awaiting GA4 Configuration

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation Summary](#implementation-summary)
3. [Conversion Events](#conversion-events)
4. [GA4 Manual Configuration](#ga4-manual-configuration)
5. [Custom Dimensions Setup](#custom-dimensions-setup)
6. [GTM Tag Configuration](#gtm-tag-configuration)
7. [Testing & Verification](#testing--verification)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This document outlines the complete GA4 conversion tracking implementation for the Mr. DJ website. The tracking system supports A/B testing with variant attribution and tracks all major conversion points across the website.

### Key Features

- Comprehensive conversion tracking across all user touchpoints
- A/B test variant tracking for all conversions
- Phone click tracking with location attribution
- Form submission tracking with event type details
- Pricing package interaction tracking
- Contact page navigation tracking

### Technical Stack

- **Analytics Platform:** Google Analytics 4
- **Tag Manager:** Google Tag Manager (GTM-NST23HJX)
- **Implementation:** dataLayer events
- **Framework:** React

---

## Implementation Summary

### Files Created

1. **`/opt/mr-dj/mr-dj-eds-components/src/utils/trackConversion.js`**
   - Core tracking utility with all conversion functions
   - Manages dataLayer interactions
   - Handles variant management

2. **`/opt/mr-dj/mr-dj-eds-components/src/components/Atoms/PhoneLink.jsx`**
   - Reusable phone link component with built-in tracking
   - Simplifies implementation across pages

### Files Modified

1. **ContactForm.jsx** - Enhanced form submission tracking
2. **PricingTables.jsx** - Package CTA click tracking
3. **AvailabilityChecker.jsx** - Availability check tracking
4. **Header.jsx** - Phone and contact navigation tracking
5. **Footer.jsx** - Phone and contact navigation tracking

---

## Conversion Events

All conversion events are pushed to `window.dataLayer` with the following structure:

### Event Structure

```javascript
{
  event: 'conversion',
  conversion_type: 'TYPE',
  variant: 'A' | 'B',
  // Additional parameters specific to conversion type
  value: 1,
  currency: 'EUR',
  timestamp: 'ISO_8601_timestamp'
}
```

### Tracked Conversion Events

#### 1. Form Submission
**Event Name:** `conversion`
**Conversion Type:** `form_submit`

```javascript
{
  event: 'conversion',
  conversion_type: 'form_submit',
  form_type: 'contact' | 'quote' | 'availability',
  variant: 'A' | 'B',
  event_type: 'bruiloft' | 'bedrijfsfeest' | 'verjaardag' | 'jubileum' | 'feest' | 'anders',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Contact form submissions
- Quote request forms
- Availability checker submissions

---

#### 2. Phone Click
**Event Name:** `conversion`
**Conversion Type:** `phone_click`

```javascript
{
  event: 'conversion',
  conversion_type: 'phone_click',
  variant: 'A' | 'B',
  click_location: 'header' | 'footer' | 'contact_page' | 'faq_page' | etc.,
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Header phone button (desktop & mobile)
- Footer phone link
- All page-level tel: links
- Contact page phone numbers
- FAQ page phone numbers

---

#### 3. Quote Request
**Event Name:** `conversion`
**Conversion Type:** `quote_request`

```javascript
{
  event: 'conversion',
  conversion_type: 'quote_request',
  variant: 'A' | 'B',
  event_type: 'bruiloft' | 'bedrijfsfeest' | etc.,
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Contact form variant B (quote request form)
- Dedicated quote request pages

---

#### 4. Availability Check
**Event Name:** `conversion`
**Conversion Type:** `availability_check`

```javascript
{
  event: 'conversion',
  conversion_type: 'availability_check',
  variant: 'A' | 'B',
  selected_date: 'DD-MM-YYYY',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Availability checker component
- Date selection tools

---

#### 5. Pricing CTA Click
**Event Name:** `conversion`
**Conversion Type:** `pricing_cta`

```javascript
{
  event: 'conversion',
  conversion_type: 'pricing_cta',
  variant: 'A' | 'B',
  package_name: 'brons' | 'zilver' | 'goud',
  package_price: '€495' | '€795' | '€1.295',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Pricing table CTA buttons
- Package selection buttons
- "Boek Nu", "Meer Info", "Vraag Offerte Aan" buttons

---

#### 6. Contact Navigation
**Event Name:** `conversion`
**Conversion Type:** `contact_navigation`

```javascript
{
  event: 'conversion',
  conversion_type: 'contact_navigation',
  variant: 'A' | 'B',
  navigation_source: 'header' | 'footer' | 'hero' | etc.,
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Tracking Locations:**
- Header "Contact" button
- Footer "Contact" link
- Hero section CTA buttons
- Navigation menu contact links

---

#### 7. WhatsApp Click (Future)
**Event Name:** `conversion`
**Conversion Type:** `whatsapp_click`

```javascript
{
  event: 'conversion',
  conversion_type: 'whatsapp_click',
  variant: 'A' | 'B',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T...'
}
```

**Note:** Ready for implementation when WhatsApp chat feature is added.

---

## GA4 Manual Configuration

### Step 1: Access GA4 Admin

1. Log into Google Analytics 4
2. Navigate to **Admin** (bottom left gear icon)
3. Select the correct property for Mr. DJ website

### Step 2: Create Custom Dimensions

Navigate to **Admin > Property > Custom Definitions > Custom Dimensions**

Create the following custom dimensions:

| Display Name | Dimension Name | Scope | Description | Event Parameter |
|-------------|----------------|-------|-------------|-----------------|
| Variant | variant | Event | A/B test variant (A or B) | variant |
| Conversion Type | conversion_type | Event | Type of conversion event | conversion_type |
| Form Type | form_type | Event | Type of form submitted | form_type |
| Event Type | event_type | Event | Type of event (bruiloft, etc) | event_type |
| Click Location | click_location | Event | Location where click occurred | click_location |
| Package Name | package_name | Event | Pricing package selected | package_name |
| Package Price | package_price | Event | Price of package selected | package_price |
| Navigation Source | navigation_source | Event | Source of navigation action | navigation_source |

**Instructions:**
1. Click **"Create custom dimension"**
2. Enter the **Display Name**
3. Select **Scope**: Event
4. Enter the **Event parameter** (must match exactly)
5. Click **Save**
6. Repeat for all dimensions

### Step 3: Create Conversion Events

Navigate to **Admin > Property > Events**

Click **"Create event"** for each conversion type:

#### Conversion Event 1: Form Submissions
- **Event name:** `form_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `form_submit`
- **Mark as conversion:** YES

#### Conversion Event 2: Phone Clicks
- **Event name:** `phone_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `phone_click`
- **Mark as conversion:** YES

#### Conversion Event 3: Quote Requests
- **Event name:** `quote_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `quote_request`
- **Mark as conversion:** YES

#### Conversion Event 4: Availability Checks
- **Event name:** `availability_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `availability_check`
- **Mark as conversion:** YES

#### Conversion Event 5: Pricing CTA
- **Event name:** `pricing_cta_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `pricing_cta`
- **Mark as conversion:** YES

#### Conversion Event 6: Contact Navigation
- **Event name:** `contact_nav_conversion`
- **Matching conditions:**
  - Parameter: `event` equals `conversion`
  - AND Parameter: `conversion_type` equals `contact_navigation`
- **Mark as conversion:** YES

### Step 4: Verify Events are Marked as Conversions

Navigate to **Admin > Property > Conversions**

Ensure all 6 events appear in the list:
- ✓ form_conversion
- ✓ phone_conversion
- ✓ quote_conversion
- ✓ availability_conversion
- ✓ pricing_cta_conversion
- ✓ contact_nav_conversion

---

## GTM Tag Configuration

### Prerequisites

Ensure GA4 Configuration Tag exists in GTM with:
- **Tag Type:** Google Analytics: GA4 Configuration
- **Measurement ID:** Your GA4 Measurement ID (G-XXXXXXXXXX)

### Create Conversion Tag

1. **Navigate to GTM:** https://tagmanager.google.com/
2. **Select Container:** GTM-NST23HJX
3. **Create New Tag:**
   - Click **"New"** under Tags
   - Name: "GA4 - Conversion Events"

4. **Tag Configuration:**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Select your GA4 Configuration tag
   - Event Name: `{{Event}}` (uses dataLayer event variable)

5. **Event Parameters:** Add all parameters from dataLayer
   ```
   conversion_type: {{dlv - conversion_type}}
   variant: {{dlv - variant}}
   form_type: {{dlv - form_type}}
   event_type: {{dlv - event_type}}
   click_location: {{dlv - click_location}}
   package_name: {{dlv - package_name}}
   package_price: {{dlv - package_price}}
   navigation_source: {{dlv - navigation_source}}
   selected_date: {{dlv - selected_date}}
   value: {{dlv - value}}
   currency: {{dlv - currency}}
   ```

6. **Triggering:**
   - Trigger Type: **Custom Event**
   - Event name: `conversion`

7. **Save and Publish**

### Create Data Layer Variables

For each parameter, create a Data Layer Variable:

**Example for "conversion_type":**
1. Go to **Variables > New**
2. Name: `dlv - conversion_type`
3. Variable Type: **Data Layer Variable**
4. Data Layer Variable Name: `conversion_type`
5. Save

Repeat for all parameters listed above.

---

## Testing & Verification

### 1. Enable GTM Preview Mode

1. Open GTM
2. Click **"Preview"** button
3. Enter your website URL
4. GTM Debug panel will open

### 2. Test Each Conversion Type

#### Test Form Submission
1. Navigate to contact page
2. Fill out and submit contact form
3. Verify in GTM Debug:
   - Event `conversion` fires
   - `conversion_type = form_submit`
   - `variant = A or B`
   - `event_type` contains selected event type

#### Test Phone Click
1. Click phone number in header
2. Verify in GTM Debug:
   - Event `conversion` fires
   - `conversion_type = phone_click`
   - `click_location = header`

#### Test Pricing CTA
1. Navigate to pricing section
2. Click package CTA button
3. Verify in GTM Debug:
   - Event `conversion` fires
   - `conversion_type = pricing_cta`
   - `package_name` contains package name
   - `package_price` contains price

### 3. Verify in GA4 DebugView

1. Open GA4
2. Navigate to **Admin > DebugView**
3. Perform test actions on website
4. Verify events appear in real-time
5. Check all parameters are captured correctly

### 4. Browser Console Verification

Open browser console and look for tracking logs:
```
GA4 Conversion Tracked: {event: "conversion", conversion_type: "form_submit", ...}
```

---

## Custom Reports in GA4

### Create Conversion by Variant Report

1. Navigate to **Explore** in GA4
2. Create **Blank exploration**
3. Configure:
   - **Dimensions:** Variant, Conversion Type
   - **Metrics:** Event count, Conversions
   - **Visualization:** Table or Bar chart

### Create Conversion Funnel

1. Navigate to **Explore** in GA4
2. Create **Funnel exploration**
3. Add steps:
   - Step 1: Page view
   - Step 2: Contact navigation OR Phone click
   - Step 3: Form submission OR Quote request

---

## A/B Testing Integration

### Setting Variant

The tracking system includes variant management functions:

```javascript
import { setUserVariant, getUserVariant } from './utils/trackConversion';

// Set variant when A/B test initializes
setUserVariant('A'); // or 'B'

// Get current variant
const variant = getUserVariant(); // Returns 'A' or 'B'
```

### Variant Storage

- Stored in `sessionStorage` as `ab_variant`
- Persists for the duration of the session
- Automatically included in all conversion events

---

## Phone Link Implementation Guide

### Using PhoneLink Component

For new implementations, use the PhoneLink component:

```javascript
import PhoneLink from './components/Atoms/PhoneLink';

// Basic usage
<PhoneLink
  phoneNumber="+31408422594"
  displayText="040-8422594"
  location="contact_page"
  className="text-blue-500 hover:underline"
/>

// With children
<PhoneLink
  phoneNumber="+31408422594"
  location="hero_section"
  className="btn btn-primary"
>
  <span className="icon-phone"></span>
  Bel Ons Direct
</PhoneLink>
```

### Manual Implementation

For existing code that needs to remain unchanged:

```javascript
import { trackPhoneClick, getUserVariant } from './utils/trackConversion';

const handlePhoneClick = () => {
  const variant = getUserVariant();
  trackPhoneClick(variant, 'my_page_location');
};

<a href="tel:+31408422594" onClick={handlePhoneClick}>
  040-8422594
</a>
```

### Pages with Phone Links

The following pages contain tel: links and should use tracking:

1. FAQPage.jsx
2. BedrijfsfeestDJPage.jsx
3. ContactPage.jsx
4. BruiloftDJPage.jsx
5. VerhuurPage.jsx
6. OverOnsPage.jsx
7. TermsConditionsPage.jsx
8. CookiePolicyPage.jsx
9. FeestDJPage.jsx
10. DjSaxLanding.jsx
11. LocalSeoPage.jsx

**Recommendation:** Update these pages to use the PhoneLink component for consistent tracking.

---

## Troubleshooting

### Events Not Appearing in GA4

**Problem:** Conversion events not showing up in GA4

**Solutions:**
1. Check GTM Preview mode - verify events fire correctly
2. Verify GA4 Measurement ID is correct in GTM
3. Wait 24-48 hours for events to process (not in DebugView)
4. Check that dataLayer is defined before tracking functions run

### Missing Parameters

**Problem:** Some event parameters are undefined or null

**Solutions:**
1. Verify Data Layer Variables are created in GTM
2. Check that parameter names match exactly (case-sensitive)
3. Use browser console to inspect dataLayer: `console.log(window.dataLayer)`
4. Verify tracking function is called with all required parameters

### Variant Not Tracking

**Problem:** Variant shows as 'A' for all users

**Solutions:**
1. Ensure `setUserVariant()` is called when A/B test initializes
2. Check sessionStorage: `sessionStorage.getItem('ab_variant')`
3. Verify A/B testing framework is properly integrated
4. Test by manually setting variant in console: `sessionStorage.setItem('ab_variant', 'B')`

### GTM Tag Not Firing

**Problem:** GTM tag doesn't fire when event is pushed

**Solutions:**
1. Verify trigger matches event name exactly: `conversion`
2. Check that tag is published (not just saved in workspace)
3. Test in GTM Preview mode
4. Ensure no conflicting triggers or exceptions

### Phone Clicks Not Tracked

**Problem:** Phone link clicks not generating events

**Solutions:**
1. Verify `onClick` handler is attached to link
2. Check that tracking function is imported correctly
3. Test in browser console: Click link and check `window.dataLayer`
4. Ensure phone link doesn't navigate before tracking completes

---

## Best Practices

### 1. Consistent Naming
- Always use lowercase for `conversion_type` values
- Use underscore_case for multi-word parameters
- Keep location names descriptive and consistent

### 2. Testing
- Test all conversion points after deployment
- Use GTM Preview mode before publishing
- Monitor GA4 DebugView for 24 hours after launch
- Set up automated conversion alerts

### 3. Documentation
- Document any new conversion points
- Update this document when adding tracking
- Keep parameter definitions consistent

### 4. Performance
- Tracking functions are non-blocking
- Console logs are only for development
- dataLayer events are lightweight

### 5. Privacy
- Tracking complies with GDPR
- No PII (Personal Identifiable Information) in events
- Cookie consent is managed separately

---

## Event Reference Quick Guide

| Conversion Type | Function | Primary Use |
|----------------|----------|-------------|
| form_submit | trackFormSubmission() | Contact forms, quote forms |
| phone_click | trackPhoneClick() | All tel: links |
| quote_request | trackQuoteRequest() | Quote-specific forms |
| availability_check | trackAvailabilityCheck() | Date availability checker |
| pricing_cta | trackPricingCTA() | Pricing package buttons |
| contact_navigation | trackContactNavigation() | Links to contact page |
| whatsapp_click | trackWhatsAppClick() | WhatsApp chat buttons |

---

## Support & Maintenance

### Regular Checks
- Monthly: Review conversion rates in GA4
- Quarterly: Audit tracking implementation
- Yearly: Update documentation

### Contact
For questions about this implementation:
- Technical: Development team
- Analytics: Marketing team
- GA4 Account: info@mr-dj.nl

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-19 | Initial implementation with all conversion tracking |

---

## Appendix: Complete Event Examples

### Form Submission Event
```javascript
window.dataLayer.push({
  event: 'conversion',
  conversion_type: 'form_submit',
  form_type: 'contact',
  variant: 'A',
  event_type: 'bruiloft',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T14:30:00.000Z'
});
```

### Phone Click Event
```javascript
window.dataLayer.push({
  event: 'conversion',
  conversion_type: 'phone_click',
  variant: 'B',
  click_location: 'header',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T14:30:00.000Z'
});
```

### Pricing CTA Event
```javascript
window.dataLayer.push({
  event: 'conversion',
  conversion_type: 'pricing_cta',
  variant: 'A',
  package_name: 'zilver',
  package_price: '€795',
  value: 1,
  currency: 'EUR',
  timestamp: '2025-10-19T14:30:00.000Z'
});
```

---

**End of Documentation**
