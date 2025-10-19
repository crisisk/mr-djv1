# Google Tag Manager Setup Guide
## Mr. DJ Website - Complete GTM Configuration

**Date:** October 2025
**Current GTM Container:** GTM-NST23HJX
**Current GA4 Measurement ID:** G-TXJLD3H2C8
**Website:** mr-dj.sevensa.nl
**Google Analytics Account:** info@mr-dj.nl

---

## Table of Contents

1. [GTM Container Status](#gtm-container-status)
2. [Prerequisites](#prerequisites)
3. [GTM Container Setup](#gtm-container-setup)
4. [Data Layer Variables Configuration](#data-layer-variables-configuration)
5. [GA4 Configuration Tag Setup](#ga4-configuration-tag-setup)
6. [Conversion Event Tag Setup](#conversion-event-tag-setup)
7. [Triggers Configuration](#triggers-configuration)
8. [Testing with GTM Preview](#testing-with-gtm-preview)
9. [Publishing Your Container](#publishing-your-container)
10. [Troubleshooting](#troubleshooting)

---

## GTM Container Status

### Current Implementation

The mr-dj website **already has GTM container ID configured**:

- **Container ID:** `GTM-NST23HJX`
- **Implementation Location:**
  - `/opt/mr-dj/mr-dj-eds-components/index.html` (lines 15-19, 72-74)
  - `/opt/mr-dj/frontend/public/index.html` (lines 15-19, 73-75)
- **Status:** GTM code is installed and functional

### What This Means

You have two options:

**Option A: Use Existing Container (Recommended)**
- Access the existing GTM container `GTM-NST23HJX` at https://tagmanager.google.com
- Configure tags, triggers, and variables in the existing container
- No code changes needed

**Option B: Create New Container**
- Create a new GTM container with a different ID
- Update both index.html files with the new GTM container ID
- Rebuild and redeploy the application

**We recommend Option A** - using the existing container avoids unnecessary code changes and redeployment.

---

## Prerequisites

### 1. Google Accounts Access

Ensure you have access to:

- **Google Tag Manager Account:** With edit permissions for container GTM-NST23HJX
- **Google Analytics 4 Property:** Access to GA4 property with Measurement ID G-TXJLD3H2C8
- **Google Account Email:** info@mr-dj.nl (or your admin account)

### 2. Website Implementation Status

The following are **already implemented** in the website code:

- GTM container snippet (in `<head>` and `<body>`)
- dataLayer initialization
- Google Consent Mode v2
- Conversion tracking functions (trackConversion.js)
- Event tracking in all major components

### 3. Required Information

Gather this information before starting:

- GA4 Measurement ID: **G-TXJLD3H2C8**
- GTM Container ID: **GTM-NST23HJX**
- Website URL: **https://mr-dj.sevensa.nl** (or production URL when ready)

---

## GTM Container Setup

### Step 1: Access Your GTM Container

1. Navigate to https://tagmanager.google.com
2. Sign in with your Google account (info@mr-dj.nl)
3. Select **GTM-NST23HJX** container from the list
4. You should see the GTM dashboard with workspace, tags, triggers, and variables

### Step 2: Verify GTM Installation

1. In GTM, click **Preview** button (top right)
2. Enter your website URL: `https://staging.sevensa.nl`
3. GTM Debug panel should open showing your website
4. Verify "Container Loaded" message appears
5. Check that `dataLayer` is initialized

If GTM Preview fails:
- Verify GTM container ID in index.html matches GTM-NST23HJX
- Check browser console for errors
- Ensure ad blockers are disabled

### Step 3: Understand the Workspace

- **Workspace:** Your draft changes before publishing
- **Tags:** Code snippets that fire based on triggers
- **Triggers:** Conditions that determine when tags fire
- **Variables:** Dynamic values used in tags and triggers

---

## Data Layer Variables Configuration

The website pushes conversion events to `window.dataLayer` with the following parameters. You need to create GTM Data Layer Variables to capture these values.

### Required Data Layer Variables

Create the following 11 Data Layer Variables in GTM:

#### How to Create a Data Layer Variable

1. Navigate to **Variables** in left sidebar
2. Scroll to **User-Defined Variables** section
3. Click **New**
4. Click variable configuration area
5. Select **Variable Type:** Data Layer Variable
6. Enter **Data Layer Variable Name** (exact name from table below)
7. Enter **Display Name** (friendly name for GTM interface)
8. Click **Save**

#### Variables to Create

| Display Name | Data Layer Variable Name | Description |
|-------------|-------------------------|-------------|
| dlv - conversion_type | `conversion_type` | Type of conversion (form_submit, phone_click, etc.) |
| dlv - variant | `variant` | A/B test variant (A or B) |
| dlv - form_type | `form_type` | Type of form submitted |
| dlv - event_type | `event_type` | Event type (bruiloft, bedrijfsfeest, etc.) |
| dlv - click_location | `click_location` | Location where click occurred |
| dlv - package_name | `package_name` | Pricing package name (brons, zilver, goud) |
| dlv - package_price | `package_price` | Package price value |
| dlv - navigation_source | `navigation_source` | Source of navigation action |
| dlv - selected_date | `selected_date` | Date selected in availability checker |
| dlv - value | `value` | Conversion value (always 1) |
| dlv - currency | `currency` | Currency code (EUR) |

### Example: Creating "dlv - conversion_type" Variable

1. Variables > New
2. Name: `dlv - conversion_type`
3. Variable Type: **Data Layer Variable**
4. Data Layer Variable Name: `conversion_type`
5. Data Layer Version: **Version 2**
6. Save

Repeat for all 11 variables listed above.

---

## GA4 Configuration Tag Setup

Before creating conversion tags, you need a GA4 Configuration tag that initializes GA4 on every page.

### Step 1: Create GA4 Configuration Tag

1. Navigate to **Tags** in left sidebar
2. Click **New**
3. Name: `GA4 - Configuration`
4. Click tag configuration area

### Step 2: Configure Tag Type

1. Choose Tag Type: **Google Analytics: GA4 Configuration**
2. Enter **Measurement ID:** `G-TXJLD3H2C8`
3. Leave other settings as default

### Step 3: Configure Triggering

1. Click **Triggering** section
2. Choose trigger: **All Pages**
3. Save tag

### Step 4: Verify Configuration Tag

In GTM Preview mode:
- Load your website
- Check that "GA4 - Configuration" tag fires on every page
- Verify in GA4 DebugView that page_view events appear

---

## Conversion Event Tag Setup

Now create the main conversion tracking tag that will capture all conversion events.

### Step 1: Create Conversion Event Tag

1. Navigate to **Tags**
2. Click **New**
3. Name: `GA4 - Conversion Events`
4. Click tag configuration area

### Step 2: Configure Tag Type

1. Choose Tag Type: **Google Analytics: GA4 Event**
2. Select **Configuration Tag:** `GA4 - Configuration` (created in previous step)
3. **Event Name:** `conversion` (literal value, not a variable)

### Step 3: Add Event Parameters

Click **+ Add Row** to add each parameter. Map Data Layer Variables to GA4 event parameters:

| Parameter Name | Value (Variable) |
|---------------|------------------|
| conversion_type | `{{dlv - conversion_type}}` |
| variant | `{{dlv - variant}}` |
| form_type | `{{dlv - form_type}}` |
| event_type | `{{dlv - event_type}}` |
| click_location | `{{dlv - click_location}}` |
| package_name | `{{dlv - package_name}}` |
| package_price | `{{dlv - package_price}}` |
| navigation_source | `{{dlv - navigation_source}}` |
| selected_date | `{{dlv - selected_date}}` |
| value | `{{dlv - value}}` |
| currency | `{{dlv - currency}}` |

**Important:**
- Type `{{` to bring up variable picker
- Select the corresponding variable from dropdown
- All parameter names must be lowercase with underscores

### Step 4: Configure Triggering

1. Click **Triggering** section
2. Click **+** to create new trigger
3. Name: `Custom Event - conversion`
4. Trigger Type: **Custom Event**
5. Event name: `conversion` (exact match)
6. This trigger fires on: **All Custom Events**
7. Save trigger
8. Save tag

---

## Triggers Configuration

Triggers determine when tags fire. You need one custom event trigger for conversion tracking.

### Trigger: conversion

**Already created in previous step**, but here's the detailed configuration:

1. **Trigger Name:** `Custom Event - conversion`
2. **Trigger Type:** Custom Event
3. **Event name:** `conversion`
4. **This trigger fires on:** All Custom Events
5. **Use regex matching:** No (leave unchecked)

### How This Works

When your website code executes:

```javascript
window.dataLayer.push({
  event: 'conversion',
  conversion_type: 'form_submit',
  variant: 'A',
  // ... other parameters
});
```

The `event: 'conversion'` triggers the "Custom Event - conversion" trigger, which fires the "GA4 - Conversion Events" tag, sending data to GA4.

---

## Testing with GTM Preview

### Step 1: Enable Preview Mode

1. In GTM, click **Preview** button (top right)
2. Enter your website URL in the popup
3. Click **Connect**
4. A new tab opens with GTM Debug panel at bottom

### Step 2: Test Each Conversion Type

#### Test Form Submission

1. Navigate to contact page on your website
2. Fill out the contact form
3. Submit the form
4. In GTM Debug panel:
   - Look for `conversion` event in event list
   - Click on the event
   - Verify "GA4 - Conversion Events" tag fired
   - Check Data Layer tab shows:
     - `conversion_type: "form_submit"`
     - `variant: "A"` or `"B"`
     - `event_type: "bruiloft"` (or selected type)

#### Test Phone Click

1. Click any phone number link (header, footer, etc.)
2. In GTM Debug panel:
   - Look for `conversion` event
   - Verify tag fired
   - Check Data Layer shows:
     - `conversion_type: "phone_click"`
     - `click_location: "header"` (or appropriate location)

#### Test Pricing CTA

1. Scroll to pricing section
2. Click on any package CTA button
3. In GTM Debug panel:
   - Look for `conversion` event
   - Verify tag fired
   - Check Data Layer shows:
     - `conversion_type: "pricing_cta"`
     - `package_name: "brons"` (or selected package)
     - `package_price: "€495"` (or package price)

#### Test Availability Checker

1. Navigate to availability checker
2. Select a date and submit
3. Verify `conversion_type: "availability_check"`

#### Test Contact Navigation

1. Click "Contact" link in navigation
2. Verify `conversion_type: "contact_navigation"`

### Step 3: Verify in GA4 DebugView

1. Open GA4 at https://analytics.google.com/
2. Navigate to **Admin > DebugView** (bottom left)
3. You should see events appearing in real-time
4. Click on a `conversion` event
5. Verify all event parameters are captured:
   - conversion_type
   - variant
   - form_type (if applicable)
   - etc.

**Note:** DebugView only shows events when GTM is in Preview mode or when debug mode is enabled.

### Common Testing Issues

**Issue:** Events not appearing in GTM Debug
- **Solution:** Check browser console for dataLayer errors
- **Solution:** Verify dataLayer.push() is actually executing (add console.log)

**Issue:** Tag shows as "Not Fired"
- **Solution:** Check trigger conditions match event name exactly
- **Solution:** Verify event name is `conversion` (case-sensitive)

**Issue:** Parameters showing as undefined
- **Solution:** Verify Data Layer Variable names match exactly
- **Solution:** Check that dataLayer.push includes all expected parameters

---

## Publishing Your Container

Once testing is complete and all events are tracking correctly, you can publish your GTM container to production.

### Step 1: Review Changes

1. Click **Workspace Changes** in top menu
2. Review all tags, triggers, and variables you created
3. Ensure everything looks correct

### Step 2: Create Version and Publish

1. Click **Submit** button (top right)
2. **Version Name:** `GA4 Conversion Tracking v1.0`
3. **Version Description:**
   ```
   Initial GA4 conversion tracking setup:
   - GA4 Configuration tag
   - Conversion event tracking tag
   - 11 data layer variables
   - Custom event trigger for 'conversion'

   Tracks: form submissions, phone clicks, pricing CTAs,
   availability checks, contact navigation, and quote requests.
   ```
4. Click **Publish**

### Step 3: Verify Live Implementation

1. Visit your website (without GTM Preview mode)
2. Open browser console (F12)
3. Perform a conversion action (e.g., submit form)
4. Check console for: `GA4 Conversion Tracked: {...}`
5. Wait 24-48 hours, then check GA4 reports for conversion data

---

## Troubleshooting

### Events Not Appearing in GA4

**Problem:** Conversion events fire in GTM but don't show in GA4

**Solutions:**
1. Verify GA4 Measurement ID is correct: `G-TXJLD3H2C8`
2. Check GA4 Configuration tag fires before conversion tag
3. Wait 24-48 hours for data to process (DebugView is real-time)
4. Check that GA4 property is not in test mode
5. Verify no ad blockers are interfering

### Parameters Not Captured

**Problem:** Some event parameters show as undefined or missing

**Solutions:**
1. Check Data Layer Variable names match exactly (case-sensitive)
2. Verify dataLayer.push includes all parameters
3. Use GTM Debug panel > Data Layer tab to inspect values
4. Ensure variables are created in GTM with correct names

### Tag Not Firing

**Problem:** Conversion tag doesn't fire when event is pushed

**Solutions:**
1. Verify trigger is set to fire on "All Custom Events"
2. Check event name in trigger matches exactly: `conversion`
3. Ensure trigger is attached to the conversion tag
4. Try creating a new trigger from scratch
5. Check for conflicting triggers or exceptions

### GTM Preview Not Working

**Problem:** Can't connect GTM Preview to website

**Solutions:**
1. Disable ad blockers and privacy extensions
2. Ensure GTM container ID matches: GTM-NST23HJX
3. Try in incognito/private browsing mode
4. Clear browser cache and cookies
5. Check that index.html has GTM snippet in both `<head>` and `<body>`

### Browser Console Errors

**Problem:** `dataLayer is not defined` error

**Solutions:**
1. Verify GTM snippet loads before any tracking code
2. Check that dataLayer initialization is in `<head>`:
   ```javascript
   window.dataLayer = window.dataLayer || [];
   ```
3. Ensure tracking functions check for dataLayer existence

### Cookie Consent Issues

**Problem:** Analytics not working due to consent

**Solutions:**
1. The site uses Google Consent Mode v2
2. Check that consent is granted for analytics_storage
3. Test with cookies accepted
4. Review CookieConsent component implementation

---

## Next Steps

After completing GTM setup, proceed to:

1. **GA4 Configuration:** See `/opt/mr-dj/GA4-CONFIG-CHECKLIST.md`
2. **Testing Plan:** See `/opt/mr-dj/GA4-TESTING-PLAN.md`
3. **Monitor Data:** Check GA4 reports daily for first week
4. **Set Up Alerts:** Configure GA4 alerts for conversion spikes/drops

---

## GTM Container Structure Summary

After following this guide, your GTM container should have:

### Tags (2)
1. `GA4 - Configuration` - Fires on all pages
2. `GA4 - Conversion Events` - Fires on conversion events

### Triggers (2)
1. `All Pages` - Built-in trigger
2. `Custom Event - conversion` - Custom event trigger

### Variables (11 + Built-in)
1. dlv - conversion_type
2. dlv - variant
3. dlv - form_type
4. dlv - event_type
5. dlv - click_location
6. dlv - package_name
7. dlv - package_price
8. dlv - navigation_source
9. dlv - selected_date
10. dlv - value
11. dlv - currency

---

## Reference: DataLayer Event Examples

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

## Support Resources

- **GTM Documentation:** https://support.google.com/tagmanager
- **GA4 Documentation:** https://support.google.com/analytics/answer/9304153
- **GTM Community:** https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager
- **Project Documentation:** `/opt/mr-dj/ga4-conversion-setup.md`
- **Architecture Overview:** `/opt/mr-dj/GA4-TRACKING-ARCHITECTURE.md`

---

**End of GTM Setup Guide**

Last Updated: October 19, 2025
