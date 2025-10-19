# GTM Configuration Manual Guide
## Mr. DJ Website - GTM Container GTM-NST23HJX

**Date:** October 19, 2025
**GTM Container:** GTM-NST23HJX
**GA4 Measurement ID:** G-TXJLD3H2C8
**Website:** https://mr-dj.sevensa.nl

---

## Important Note

This document provides a step-by-step manual guide for configuring the GTM console. Browser automation is not possible for this task, so these instructions must be followed manually by someone with access to the Google Tag Manager account.

---

## Prerequisites Completed

- GTM container GTM-NST23HJX is already installed on the website
- GTM code is present in `/opt/mr-dj/mr-dj-eds-components/index.html` and `/opt/mr-dj/frontend/public/index.html`
- dataLayer is initialized
- Conversion tracking code is implemented

---

## Part 1: Data Layer Variables Configuration

### Access GTM Console

1. Open browser and navigate to: https://tagmanager.google.com
2. Sign in with account: info@mr-dj.nl (or authorized admin account)
3. Select container: **GTM-NST23HJX**
4. Click on **Variables** in left sidebar

### Create 11 Data Layer Variables

For each variable below, follow these steps:

1. Scroll to **User-Defined Variables** section
2. Click **New** button
3. Click the variable configuration area (top box)
4. Select **Variable Type**: Data Layer Variable
5. Enter the **Data Layer Variable Name** (exact spelling, case-sensitive)
6. Enter the **Display Name** (shown in GTM interface)
7. Set **Data Layer Version**: Version 2
8. Click **Save**

#### Variable 1: conversion_type
- **Display Name**: `dlv - conversion_type`
- **Data Layer Variable Name**: `conversion_type`
- **Description**: Type of conversion (form_submit, phone_click, etc.)

#### Variable 2: variant
- **Display Name**: `dlv - variant`
- **Data Layer Variable Name**: `variant`
- **Description**: A/B test variant (A or B)

#### Variable 3: form_type
- **Display Name**: `dlv - form_type`
- **Data Layer Variable Name**: `form_type`
- **Description**: Type of form submitted

#### Variable 4: event_type
- **Display Name**: `dlv - event_type`
- **Data Layer Variable Name**: `event_type`
- **Description**: Event type (bruiloft, bedrijfsfeest, etc.)

#### Variable 5: click_location
- **Display Name**: `dlv - click_location`
- **Data Layer Variable Name**: `click_location`
- **Description**: Location where click occurred

#### Variable 6: package_name
- **Display Name**: `dlv - package_name`
- **Data Layer Variable Name**: `package_name`
- **Description**: Pricing package name (brons, zilver, goud)

#### Variable 7: package_price
- **Display Name**: `dlv - package_price`
- **Data Layer Variable Name**: `package_price`
- **Description**: Package price value

#### Variable 8: navigation_source
- **Display Name**: `dlv - navigation_source`
- **Data Layer Variable Name**: `navigation_source`
- **Description**: Source of navigation action

#### Variable 9: selected_date
- **Display Name**: `dlv - selected_date`
- **Data Layer Variable Name**: `selected_date`
- **Description**: Date selected in availability checker

#### Variable 10: value
- **Display Name**: `dlv - value`
- **Data Layer Variable Name**: `value`
- **Description**: Conversion value (always 1)

#### Variable 11: currency
- **Display Name**: `dlv - currency`
- **Data Layer Variable Name**: `currency`
- **Description**: Currency code (EUR)

### Verification Checkpoint 1

After creating all 11 variables:
- [ ] Go to Variables > User-Defined Variables
- [ ] Verify all 11 variables are listed
- [ ] Take screenshot for documentation
- [ ] Save screenshot as: `/opt/mr-dj/screenshots/gtm-variables-created.png`

---

## Part 2: GA4 Configuration Tag Setup

### Create GA4 Configuration Tag

1. Click **Tags** in left sidebar
2. Click **New** button
3. Name the tag: `GA4 - Configuration`
4. Click tag configuration area (top box)

### Configure Tag Type

1. Choose Tag Type: **Google Analytics: GA4 Configuration**
2. Enter **Measurement ID**: `G-TXJLD3H2C8`
3. Leave all other settings as default

### Configure Triggering

1. Click **Triggering** section (bottom box)
2. Select trigger: **All Pages** (built-in trigger)
3. Click **Save**

### Verification Checkpoint 2

- [ ] Tag "GA4 - Configuration" is created
- [ ] Measurement ID is G-TXJLD3H2C8
- [ ] Trigger is set to "All Pages"
- [ ] Take screenshot: `/opt/mr-dj/screenshots/gtm-ga4-config-tag.png`

---

## Part 3: GA4 Conversion Event Tag Setup

### Create GA4 Event Tag

1. Click **Tags** in left sidebar
2. Click **New** button
3. Name the tag: `GA4 - Conversion Events`
4. Click tag configuration area

### Configure Tag Type

1. Choose Tag Type: **Google Analytics: GA4 Event**
2. **Configuration Tag**: Select `GA4 - Configuration` from dropdown
3. **Event Name**: Enter `conversion` (literal string, not a variable)

### Add Event Parameters

Click **+ Add Row** for each parameter below. In the Parameter Name field, enter the exact name shown. In the Value field, type `{{` to open the variable picker and select the corresponding variable.

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

**Important Notes:**
- Use the variable picker by typing `{{` - do not type the full variable name manually
- All parameter names must be lowercase with underscores
- Total of 11 parameters must be added

### Create Custom Event Trigger

1. Click **Triggering** section
2. Click **+** icon to create new trigger
3. Name the trigger: `Custom Event - conversion`
4. Click trigger configuration area
5. Choose Trigger Type: **Custom Event**
6. **Event name**: Enter `conversion` (exact match, case-sensitive)
7. **This trigger fires on**: Select "All Custom Events"
8. Click **Save** to save the trigger
9. The trigger is now attached to your tag
10. Click **Save** to save the tag

### Verification Checkpoint 3

- [ ] Tag "GA4 - Conversion Events" is created
- [ ] Configuration Tag is linked to "GA4 - Configuration"
- [ ] Event Name is "conversion"
- [ ] All 11 event parameters are added with correct variables
- [ ] Trigger "Custom Event - conversion" is created and attached
- [ ] Take screenshot: `/opt/mr-dj/screenshots/gtm-conversion-tag.png`

---

## Part 4: Testing with GTM Preview Mode

### Enable Preview Mode

1. Click **Preview** button (top right corner of GTM interface)
2. In the popup, enter your website URL: `https://mr-dj.sevensa.nl`
3. Click **Connect** button
4. A new tab will open with your website
5. GTM Debug panel should appear at the bottom of the page

### Verify Container Loaded

- [ ] GTM Debug panel shows "Container Loaded"
- [ ] Container ID shows GTM-NST23HJX
- [ ] "Container Loaded" event appears in event timeline

### Test 1: Form Submission Conversion

1. On the website, navigate to the contact form
2. Fill out the form fields:
   - Name: Test User
   - Email: test@example.com
   - Phone: 0612345678
   - Event type: Select any option
   - Message: Test message
3. Click Submit button
4. In GTM Debug panel:
   - [ ] Look for `conversion` event in the event list
   - [ ] Click on the `conversion` event
   - [ ] In "Tags" tab, verify "GA4 - Conversion Events" shows "Tags Fired"
   - [ ] In "Data Layer" tab, verify these values are present:
     - `event: "conversion"`
     - `conversion_type: "form_submit"`
     - `variant: "A"` or `"B"`
     - `form_type: "contact"`
     - `event_type:` (selected event type)
     - `value: 1`
     - `currency: "EUR"`
5. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-form-conversion.png`

### Test 2: Phone Click Conversion

1. Click any phone number link on the website (header, footer, or contact section)
2. In GTM Debug panel:
   - [ ] Look for `conversion` event
   - [ ] Verify "GA4 - Conversion Events" tag fired
   - [ ] In Data Layer, verify:
     - `conversion_type: "phone_click"`
     - `click_location:` (header, footer, or location of click)
     - `variant: "A"` or `"B"`
3. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-phone-click.png`

### Test 3: Pricing CTA Conversion

1. Scroll to the pricing section of the website
2. Click on any package CTA button (Brons, Zilver, or Goud)
3. In GTM Debug panel:
   - [ ] Verify `conversion` event fires
   - [ ] Check Data Layer shows:
     - `conversion_type: "pricing_cta"`
     - `package_name:` (brons, zilver, or goud)
     - `package_price:` (package price)
     - `variant: "A"` or `"B"`
4. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-pricing-cta.png`

### Test 4: Availability Checker Conversion

1. Navigate to the availability checker component
2. Select a date
3. Click submit or check availability
4. In GTM Debug panel:
   - [ ] Verify `conversion` event fires
   - [ ] Check Data Layer shows:
     - `conversion_type: "availability_check"`
     - `selected_date:` (selected date)
5. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-availability.png`

### Test 5: Contact Navigation Conversion

1. Click the "Contact" link in the main navigation
2. In GTM Debug panel:
   - [ ] Verify `conversion` event fires
   - [ ] Check Data Layer shows:
     - `conversion_type: "contact_navigation"`
     - `navigation_source:` (location of navigation)
3. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-contact-nav.png`

### Test 6: Quote Request Conversion

1. Find and click any "Request Quote" or "Offerte Aanvragen" button
2. In GTM Debug panel:
   - [ ] Verify `conversion` event fires
   - [ ] Check Data Layer shows:
     - `conversion_type: "quote_request"`
3. Take screenshot: `/opt/mr-dj/screenshots/gtm-test-quote-request.png`

### Troubleshooting During Testing

**If events don't appear:**
- Check browser console for JavaScript errors
- Verify dataLayer is defined: Type `window.dataLayer` in browser console
- Ensure no ad blockers are active
- Try in incognito/private browsing mode

**If tags show "Not Fired":**
- Verify trigger event name matches exactly: `conversion`
- Check that trigger is set to "All Custom Events"
- Ensure trigger is attached to the tag

**If parameters show as undefined:**
- Verify Data Layer Variable names match exactly (case-sensitive)
- Check that variables are properly created in GTM
- Inspect dataLayer in console to see actual values

---

## Part 5: Verify in GA4 DebugView

While GTM Preview mode is still active:

1. Open a new browser tab
2. Navigate to: https://analytics.google.com/
3. Sign in with the same account
4. Select property with Measurement ID: G-TXJLD3H2C8
5. In left sidebar, click **Configure**
6. Click **DebugView**
7. You should see your device/session appearing in real-time
8. Perform conversion actions on the website (in the Preview mode tab)
9. In DebugView, verify:
   - [ ] `conversion` events appear in the event stream
   - [ ] Click on a conversion event to expand details
   - [ ] Verify all 11 event parameters are captured:
     - conversion_type
     - variant
     - form_type (when applicable)
     - event_type (when applicable)
     - click_location (when applicable)
     - package_name (when applicable)
     - package_price (when applicable)
     - navigation_source (when applicable)
     - selected_date (when applicable)
     - value
     - currency
10. Take screenshots: `/opt/mr-dj/screenshots/ga4-debugview-events.png`

**Note:** DebugView only shows events when GTM Preview mode is active or when debug mode is explicitly enabled.

---

## Part 6: Publishing the GTM Container

Once all testing is complete and verified:

### Review Changes

1. Click **Workspace Changes** in the top menu bar
2. Review the summary:
   - [ ] 11 Variables created
   - [ ] 2 Tags created (GA4 - Configuration, GA4 - Conversion Events)
   - [ ] 1 Trigger created (Custom Event - conversion)
3. Verify all changes are correct

### Submit and Publish

1. Click **Submit** button (top right corner)
2. In the submission form:
   - **Version Name**: `GA4 Conversion Tracking v1.0`
   - **Version Description**:
     ```
     Initial GA4 conversion tracking setup for Mr. DJ website.

     Implemented:
     - GA4 Configuration tag with Measurement ID G-TXJLD3H2C8
     - GA4 Conversion Events tag with 11 event parameters
     - 11 Data Layer Variables for conversion tracking
     - Custom event trigger for 'conversion' events

     Conversion types tracked:
     - form_submit (contact form submissions)
     - phone_click (phone number clicks)
     - pricing_cta (pricing package CTA clicks)
     - availability_check (date availability checks)
     - contact_navigation (contact nav clicks)
     - quote_request (quote request submissions)

     All conversions include A/B test variant tracking.

     Tested in Preview mode: All conversion types verified.
     Verified in GA4 DebugView: Events and parameters confirmed.
     ```
3. Click **Publish** button
4. Wait for confirmation message
5. Take screenshot: `/opt/mr-dj/screenshots/gtm-published-version.png`

### Post-Publication Verification

1. Click **Exit** to leave Preview mode
2. Visit the website normally (without Preview mode): https://mr-dj.sevensa.nl
3. Open browser console (F12)
4. Perform a test conversion (e.g., click phone number)
5. In console, check for: `GA4 Conversion Tracked: {...}` message
6. Verify no JavaScript errors appear
7. Wait 24-48 hours, then check GA4 reports for conversion data

---

## Configuration Summary

### What Was Configured

#### Variables (11 total)
1. dlv - conversion_type - Maps dataLayer.conversion_type
2. dlv - variant - Maps dataLayer.variant
3. dlv - form_type - Maps dataLayer.form_type
4. dlv - event_type - Maps dataLayer.event_type
5. dlv - click_location - Maps dataLayer.click_location
6. dlv - package_name - Maps dataLayer.package_name
7. dlv - package_price - Maps dataLayer.package_price
8. dlv - navigation_source - Maps dataLayer.navigation_source
9. dlv - selected_date - Maps dataLayer.selected_date
10. dlv - value - Maps dataLayer.value
11. dlv - currency - Maps dataLayer.currency

#### Tags (2 total)
1. **GA4 - Configuration**
   - Type: Google Analytics: GA4 Configuration
   - Measurement ID: G-TXJLD3H2C8
   - Trigger: All Pages
   - Purpose: Initializes GA4 on every page load

2. **GA4 - Conversion Events**
   - Type: Google Analytics: GA4 Event
   - Event Name: conversion
   - Parameters: 11 event parameters mapped to Data Layer Variables
   - Trigger: Custom Event - conversion
   - Purpose: Sends conversion events to GA4 with all parameters

#### Triggers (1 total)
1. **Custom Event - conversion**
   - Type: Custom Event
   - Event name: conversion
   - Fires on: All Custom Events
   - Purpose: Fires GA4 Event tag when conversion event is pushed to dataLayer

### How It Works

1. User performs a conversion action on website (form submit, phone click, etc.)
2. JavaScript tracking code executes `window.dataLayer.push({event: 'conversion', ...})`
3. GTM detects the 'conversion' custom event
4. "Custom Event - conversion" trigger activates
5. "GA4 - Conversion Events" tag fires
6. Tag collects values from Data Layer Variables
7. Event with parameters is sent to GA4 property G-TXJLD3H2C8
8. Event appears in GA4 reports and DebugView

### Conversion Types Tracked

1. **form_submit** - Contact form submissions
2. **phone_click** - Phone number link clicks
3. **pricing_cta** - Pricing package CTA button clicks
4. **availability_check** - Availability checker submissions
5. **contact_navigation** - Contact navigation link clicks
6. **quote_request** - Quote request form submissions

### A/B Test Variant Tracking

All conversions include the `variant` parameter (A or B) to enable:
- Conversion rate comparison between variants
- Package preference analysis by variant
- Form completion rate comparison
- Click behavior analysis by variant

---

## Testing Results Checklist

Mark each test as completed:

- [ ] Test 1: Form Submission - PASSED
- [ ] Test 2: Phone Click - PASSED
- [ ] Test 3: Pricing CTA - PASSED
- [ ] Test 4: Availability Checker - PASSED
- [ ] Test 5: Contact Navigation - PASSED
- [ ] Test 6: Quote Request - PASSED
- [ ] GTM Preview Mode - WORKING
- [ ] GA4 DebugView - VERIFIED
- [ ] All Parameters Captured - CONFIRMED
- [ ] Container Published - SUCCESS

---

## Common Issues and Solutions

### Issue 1: Variable Picker Not Working
**Solution**: Make sure to type exactly `{{` to trigger the variable picker dropdown

### Issue 2: Events Not Appearing in DebugView
**Solution**:
- Ensure GTM Preview mode is active
- Check that GA4 Measurement ID is correct: G-TXJLD3H2C8
- Verify GA4 Configuration tag fires before conversion events
- Wait a few seconds for events to appear

### Issue 3: Parameters Showing as Undefined
**Solution**:
- Verify Data Layer Variable names match exactly (case-sensitive)
- Check that dataLayer.push() includes all expected parameters
- Use GTM Debug panel > Data Layer tab to inspect actual values

### Issue 4: Tag Not Firing
**Solution**:
- Verify trigger event name is exactly `conversion` (case-sensitive)
- Ensure trigger is set to "All Custom Events", not "Some Custom Events"
- Check that trigger is properly attached to the tag
- Review trigger configuration in GTM Debug panel

### Issue 5: GTM Preview Won't Connect
**Solution**:
- Disable all ad blockers and privacy extensions
- Try in incognito/private browsing mode
- Clear browser cache and cookies
- Ensure website is accessible
- Verify GTM container ID matches GTM-NST23HJX

---

## Next Steps

After completing GTM configuration:

1. [ ] Proceed to GA4 Console Configuration (see GA4-CONFIG-COMPLETED.md)
2. [ ] Create Custom Dimensions in GA4
3. [ ] Mark Conversion Events in GA4
4. [ ] Configure GA4 reports
5. [ ] Set up alerts and monitoring
6. [ ] Wait 48 hours for data to populate
7. [ ] Review initial conversion data
8. [ ] Schedule weekly analytics review meetings

---

## Documentation and Screenshots

Required screenshots to take:
1. `/opt/mr-dj/screenshots/gtm-variables-created.png` - All 11 variables listed
2. `/opt/mr-dj/screenshots/gtm-ga4-config-tag.png` - GA4 Configuration tag
3. `/opt/mr-dj/screenshots/gtm-conversion-tag.png` - GA4 Conversion Events tag with parameters
4. `/opt/mr-dj/screenshots/gtm-test-form-conversion.png` - Form conversion test in Debug
5. `/opt/mr-dj/screenshots/gtm-test-phone-click.png` - Phone click test
6. `/opt/mr-dj/screenshots/gtm-test-pricing-cta.png` - Pricing CTA test
7. `/opt/mr-dj/screenshots/gtm-test-availability.png` - Availability checker test
8. `/opt/mr-dj/screenshots/gtm-test-contact-nav.png` - Contact navigation test
9. `/opt/mr-dj/screenshots/gtm-test-quote-request.png` - Quote request test
10. `/opt/mr-dj/screenshots/ga4-debugview-events.png` - GA4 DebugView showing events
11. `/opt/mr-dj/screenshots/gtm-published-version.png` - Published container version

---

## Support and Resources

- **GTM Documentation**: https://support.google.com/tagmanager
- **GTM Community**: https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager
- **Setup Guide**: `/opt/mr-dj/GTM-SETUP-GUIDE.md`
- **GA4 Configuration**: `/opt/mr-dj/GA4-CONFIG-CHECKLIST.md`
- **Testing Plan**: `/opt/mr-dj/GA4-TESTING-PLAN.md`
- **Architecture**: `/opt/mr-dj/GA4-TRACKING-ARCHITECTURE.md`

---

## Configuration Status

**Status**: MANUAL CONFIGURATION REQUIRED

This document provides complete instructions for manual GTM configuration. Browser automation is not possible, so these steps must be completed manually by someone with access to:
- Google Tag Manager account with GTM-NST23HJX container
- Google Analytics account with property G-TXJLD3H2C8
- Account email: info@mr-dj.nl or authorized admin

**Estimated Time**: 45-60 minutes for configuration + 30 minutes for testing

---

Last Updated: October 19, 2025
