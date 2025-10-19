# GA4 Testing and Verification Plan
## Mr. DJ Website - Comprehensive Testing Procedures

**Date:** October 2025
**GA4 Measurement ID:** G-TXJLD3H2C8
**GTM Container:** GTM-NST23HJX
**Website:** mr-dj.sevensa.nl

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Pre-Testing Checklist](#pre-testing-checklist)
3. [Test Environment Setup](#test-environment-setup)
4. [Conversion Type Testing](#conversion-type-testing)
5. [GTM Debug Testing](#gtm-debug-testing)
6. [GA4 DebugView Testing](#ga4-debugview-testing)
7. [Browser Console Testing](#browser-console-testing)
8. [Cross-Browser Testing](#cross-browser-testing)
9. [Mobile Device Testing](#mobile-device-testing)
10. [A/B Testing Verification](#ab-testing-verification)
11. [Production Verification](#production-verification)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Testing Sign-Off](#testing-sign-off)

---

## Testing Overview

### Purpose

This testing plan ensures that:
- All conversion events track correctly
- GTM tags fire as expected
- GA4 receives complete event data
- Custom dimensions populate properly
- No tracking errors occur

### Testing Phases

1. **Development Testing:** Local environment with GTM Preview
2. **Staging Testing:** Staging environment with real GA4
3. **Production Testing:** Live site monitoring

### Success Criteria

- [ ] All 6 conversion types fire correctly
- [ ] All 8 custom dimensions capture data
- [ ] No JavaScript errors in console
- [ ] Events appear in GA4 DebugView
- [ ] Data populates in GA4 reports (after 48 hours)

---

## Pre-Testing Checklist

Before starting tests, ensure:

### [ ] GTM Configuration Complete

- [ ] GTM container published
- [ ] GA4 Configuration tag created
- [ ] GA4 Event tag created
- [ ] All 11 Data Layer Variables created
- [ ] Custom event trigger for 'conversion' created

### [ ] GA4 Configuration Complete

- [ ] All 8 custom dimensions created
- [ ] Conversion events marked (or ready to mark)
- [ ] Access to GA4 DebugView
- [ ] Admin access to GA4 property

### [ ] Website Deployment

- [ ] Latest code deployed to staging/production
- [ ] GTM container ID verified in index.html: GTM-NST23HJX
- [ ] GA4 Measurement ID verified: G-TXJLD3H2C8
- [ ] trackConversion.js deployed with all tracking functions

### [ ] Testing Tools Ready

- [ ] Chrome browser installed
- [ ] Chrome DevTools knowledge
- [ ] GTM Preview mode accessible
- [ ] GA4 DebugView accessible
- [ ] Multiple devices available for mobile testing

---

## Test Environment Setup

### [ ] 1. Enable GTM Preview Mode

1. [ ] Navigate to https://tagmanager.google.com/
2. [ ] Select GTM container: GTM-NST23HJX
3. [ ] Click **Preview** button (top right)
4. [ ] In popup, enter: `https://staging.sevensa.nl` (or your URL)
5. [ ] Click **Connect**
6. [ ] Verify GTM Debug panel opens at bottom of website

**Expected Result:** GTM Debug panel shows "Container Loaded" message

### [ ] 2. Open GA4 DebugView

1. [ ] Open new browser tab
2. [ ] Navigate to https://analytics.google.com/
3. [ ] Select GA4 property
4. [ ] Go to **Admin > DebugView** (bottom left)
5. [ ] Keep this tab open during testing

**Expected Result:** DebugView is ready to receive events

### [ ] 3. Open Browser Console

1. [ ] In website tab, press F12 (or Cmd+Option+I on Mac)
2. [ ] Navigate to **Console** tab
3. [ ] Clear console (click trash icon)
4. [ ] Keep console open during all tests

**Expected Result:** Clean console with no errors

---

## Conversion Type Testing

Test each conversion type individually. For each test, verify in 3 places:
1. Browser Console
2. GTM Debug Panel
3. GA4 DebugView

### Test 1: Form Submission

#### [ ] 1.1 Navigate to Contact Form

- [ ] Go to `/contact` page on website
- [ ] Verify contact form is visible

#### [ ] 1.2 Fill Out Form

- [ ] Fill in all required fields:
  - Name: Test User
  - Email: test@example.com
  - Phone: 0612345678
  - Event Type: Select "Bruiloft"
  - Message: Test message
- [ ] Do NOT submit yet

#### [ ] 1.3 Submit Form and Verify

- [ ] Click Submit button
- [ ] Wait for success message

#### [ ] 1.4 Verify in Browser Console

Look for log message:
```
GA4 Conversion Tracked: {
  event: "conversion",
  conversion_type: "form_submit",
  form_type: "contact",
  variant: "A",
  event_type: "bruiloft",
  value: 1,
  currency: "EUR",
  timestamp: "..."
}
```

- [ ] Message appears
- [ ] All parameters present
- [ ] No errors

#### [ ] 1.5 Verify in GTM Debug Panel

- [ ] Check event list for `conversion` event (newest at top)
- [ ] Click on the event
- [ ] In **Data Layer** tab, verify:
  - [ ] `event: "conversion"`
  - [ ] `conversion_type: "form_submit"`
  - [ ] `form_type: "contact"`
  - [ ] `variant: "A"` or `"B"`
  - [ ] `event_type: "bruiloft"`
  - [ ] `value: 1`
  - [ ] `currency: "EUR"`

- [ ] In **Tags** tab, verify:
  - [ ] "GA4 - Conversion Events" tag shows as **Fired**
  - [ ] Click tag to see details
  - [ ] Verify all parameters sent to GA4

#### [ ] 1.6 Verify in GA4 DebugView

- [ ] Switch to GA4 DebugView tab
- [ ] Look for `conversion` event in event stream (newest at top)
- [ ] Click on the event to expand
- [ ] Verify event parameters:
  - [ ] conversion_type: "form_submit"
  - [ ] variant: "A"
  - [ ] form_type: "contact"
  - [ ] event_type: "bruiloft"
  - [ ] value: 1
  - [ ] currency: "EUR"

**Test 1 Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

### Test 2: Phone Click

#### [ ] 2.1 Locate Phone Link

Test phone links in multiple locations:
- [ ] Header (desktop navigation)
- [ ] Header (mobile menu)
- [ ] Footer
- [ ] Contact page

#### [ ] 2.2 Click Phone Link (Header)

- [ ] Clear browser console
- [ ] Click phone number in header
- [ ] Browser may try to open phone app (expected)

#### [ ] 2.3 Verify in Browser Console

Look for:
```
GA4 Conversion Tracked: {
  event: "conversion",
  conversion_type: "phone_click",
  variant: "A",
  click_location: "header",
  value: 1,
  currency: "EUR",
  timestamp: "..."
}
```

- [ ] Message appears
- [ ] `click_location: "header"` is correct
- [ ] No errors

#### [ ] 2.4 Verify in GTM Debug Panel

- [ ] Find `conversion` event in event list
- [ ] Verify Data Layer:
  - [ ] `conversion_type: "phone_click"`
  - [ ] `click_location: "header"`
  - [ ] `variant` present
- [ ] Verify "GA4 - Conversion Events" tag fired

#### [ ] 2.5 Verify in GA4 DebugView

- [ ] Find `conversion` event
- [ ] Verify parameters:
  - [ ] conversion_type: "phone_click"
  - [ ] click_location: "header"

#### [ ] 2.6 Test Other Phone Link Locations

Repeat test for:
- [ ] Footer phone link (expect `click_location: "footer"`)
- [ ] Contact page phone link (expect `click_location: "contact_page"`)

**Test 2 Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

### Test 3: Pricing CTA Click

#### [ ] 3.1 Navigate to Pricing Section

- [ ] Go to homepage or pricing page
- [ ] Scroll to pricing tables section
- [ ] Verify all three packages visible: Brons, Zilver, Goud

#### [ ] 3.2 Click Brons Package CTA

- [ ] Clear browser console
- [ ] Click CTA button on Brons package (e.g., "Boek Nu", "Meer Info")
- [ ] May navigate to contact page (expected)

#### [ ] 3.3 Verify in Browser Console

Look for:
```
GA4 Conversion Tracked: {
  event: "conversion",
  conversion_type: "pricing_cta",
  variant: "A",
  package_name: "brons",
  package_price: "€495",
  value: 1,
  currency: "EUR",
  timestamp: "..."
}
```

- [ ] Message appears
- [ ] `package_name: "brons"` is correct
- [ ] `package_price` matches pricing table
- [ ] No errors

#### [ ] 3.4 Verify in GTM Debug Panel

- [ ] Find `conversion` event
- [ ] Verify Data Layer:
  - [ ] `conversion_type: "pricing_cta"`
  - [ ] `package_name: "brons"`
  - [ ] `package_price: "€495"`
- [ ] Verify tag fired

#### [ ] 3.5 Verify in GA4 DebugView

- [ ] Find `conversion` event
- [ ] Verify parameters match

#### [ ] 3.6 Test Other Packages

- [ ] Navigate back to pricing section
- [ ] Test Zilver package (expect `package_name: "zilver"`, `package_price: "€795"`)
- [ ] Test Goud package (expect `package_name: "goud"`, `package_price: "€1.295"`)

**Test 3 Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

### Test 4: Availability Check

#### [ ] 4.1 Navigate to Availability Checker

- [ ] Find availability checker component (homepage or dedicated page)
- [ ] Verify date picker is visible

#### [ ] 4.2 Select Date and Submit

- [ ] Clear browser console
- [ ] Select a date (e.g., 2 months in future)
- [ ] Click "Check Availability" or similar button
- [ ] Wait for response

#### [ ] 4.3 Verify in Browser Console

Look for:
```
GA4 Conversion Tracked: {
  event: "conversion",
  conversion_type: "availability_check",
  variant: "A",
  selected_date: "DD-MM-YYYY",
  value: 1,
  currency: "EUR",
  timestamp: "..."
}
```

- [ ] Message appears
- [ ] `selected_date` contains date you selected
- [ ] No errors

#### [ ] 4.4 Verify in GTM Debug Panel

- [ ] Find `conversion` event
- [ ] Verify Data Layer:
  - [ ] `conversion_type: "availability_check"`
  - [ ] `selected_date` present
- [ ] Verify tag fired

#### [ ] 4.5 Verify in GA4 DebugView

- [ ] Find `conversion` event
- [ ] Verify parameters match

**Test 4 Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

### Test 5: Contact Navigation

#### [ ] 5.1 Test Header Contact Link

- [ ] Navigate to homepage
- [ ] Clear browser console
- [ ] Click "Contact" link in header navigation
- [ ] Should navigate to `/contact` page

#### [ ] 5.2 Verify in Browser Console

Look for:
```
GA4 Conversion Tracked: {
  event: "conversion",
  conversion_type: "contact_navigation",
  variant: "A",
  navigation_source: "header",
  value: 1,
  currency: "EUR",
  timestamp: "..."
}
```

- [ ] Message appears
- [ ] `navigation_source: "header"` is correct
- [ ] No errors

#### [ ] 5.3 Verify in GTM Debug Panel

- [ ] Find `conversion` event
- [ ] Verify Data Layer:
  - [ ] `conversion_type: "contact_navigation"`
  - [ ] `navigation_source: "header"`
- [ ] Verify tag fired

#### [ ] 5.4 Verify in GA4 DebugView

- [ ] Find `conversion` event
- [ ] Verify parameters match

#### [ ] 5.5 Test Other Contact Links

Repeat test for:
- [ ] Footer contact link (expect `navigation_source: "footer"`)
- [ ] Hero section CTA (expect `navigation_source: "hero"`)
- [ ] Any other contact navigation buttons

**Test 5 Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

### Test 6: Quote Request (If Implemented)

If your site has a specific quote request form separate from contact form:

#### [ ] 6.1 Navigate to Quote Request

- [ ] Go to quote request page/form
- [ ] Verify form is visible

#### [ ] 6.2 Fill and Submit Form

- [ ] Fill out quote request form
- [ ] Select event type
- [ ] Submit form

#### [ ] 6.3 Verify Tracking

Expected event:
```
{
  event: "conversion",
  conversion_type: "quote_request",
  variant: "A",
  event_type: "bruiloft",
  value: 1,
  currency: "EUR"
}
```

- [ ] Verify in console
- [ ] Verify in GTM Debug
- [ ] Verify in GA4 DebugView

**Test 6 Result:** [ ] PASS [ ] FAIL [ ] N/A (not implemented)

**Notes:** ___________________________________

---

## GTM Debug Testing

### [ ] Verify All Tags Fire Correctly

#### [ ] 1. Check Tags Summary

In GTM Debug panel:
- [ ] Click on "Summary" tab
- [ ] Verify these tags fired:
  - [ ] "GA4 - Configuration" (on page load)
  - [ ] "GA4 - Conversion Events" (on conversion actions)

#### [ ] 2. Check Variables Populate

For a conversion event:
- [ ] Click on the `conversion` event in GTM Debug
- [ ] Go to **Variables** tab
- [ ] Verify all Data Layer Variables have values:
  - [ ] dlv - conversion_type: (has value)
  - [ ] dlv - variant: (has value)
  - [ ] dlv - form_type: (has value or undefined if not applicable)
  - [ ] dlv - event_type: (has value or undefined)
  - [ ] dlv - click_location: (has value or undefined)
  - [ ] dlv - package_name: (has value or undefined)
  - [ ] dlv - package_price: (has value or undefined)
  - [ ] dlv - navigation_source: (has value or undefined)
  - [ ] dlv - value: 1
  - [ ] dlv - currency: EUR

**Note:** Some variables will be undefined depending on conversion type. This is expected.

#### [ ] 3. Check Data Layer State

- [ ] In GTM Debug, click "Data Layer" tab
- [ ] Scroll through data layer history
- [ ] Verify structure is correct:
  - Initial gtm.js event
  - Page view events
  - Your conversion events

**GTM Debug Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## GA4 DebugView Testing

### [ ] Verify Events in Real-Time

#### [ ] 1. Check Event Stream

In GA4 DebugView:
- [ ] Events appear in chronological order (newest at top)
- [ ] Each conversion action generates a `conversion` event
- [ ] Events show within 1-2 seconds of action

#### [ ] 2. Check Event Parameters

For each `conversion` event:
- [ ] Click to expand event details
- [ ] Verify all event parameters present
- [ ] Verify parameter values are correct
- [ ] No parameters show as "(not set)" that should have values

#### [ ] 3. Check Custom Dimensions

- [ ] In expanded event, look for custom dimensions section
- [ ] Verify custom dimensions are captured:
  - variant
  - conversion_type
  - form_type (if applicable)
  - event_type (if applicable)
  - click_location (if applicable)
  - package_name (if applicable)
  - package_price (if applicable)
  - navigation_source (if applicable)

**Note:** Custom dimensions may take 24-48 hours to process even if event parameters are captured.

#### [ ] 4. Check User Properties

- [ ] Click on user icon in DebugView
- [ ] Verify user properties if you've set any
- [ ] Check device, location, and other automatic properties

**GA4 DebugView Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## Browser Console Testing

### [ ] Verify No Errors

#### [ ] 1. Check for JavaScript Errors

- [ ] Open browser console (F12)
- [ ] Perform all conversion actions
- [ ] Look for any red error messages
- [ ] Verify no errors related to:
  - dataLayer
  - trackConversion
  - GTM
  - GA4

**Expected:** No errors related to tracking

#### [ ] 2. Check Tracking Logs

- [ ] Verify "GA4 Conversion Tracked:" logs appear
- [ ] Logs show complete event data
- [ ] Logs appear immediately after conversion action

#### [ ] 3. Check dataLayer Directly

In console, type:
```javascript
window.dataLayer
```

- [ ] Returns an array
- [ ] Contains your conversion events
- [ ] No duplicate events (unless action was repeated)

**Console Test Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## Cross-Browser Testing

Test in multiple browsers to ensure compatibility.

### [ ] Chrome

- [ ] All conversion types work
- [ ] No console errors
- [ ] Events tracked correctly

**Chrome Result:** [ ] PASS [ ] FAIL

### [ ] Firefox

- [ ] All conversion types work
- [ ] No console errors
- [ ] Events tracked correctly

**Firefox Result:** [ ] PASS [ ] FAIL

### [ ] Safari

- [ ] All conversion types work
- [ ] No console errors
- [ ] Events tracked correctly
- [ ] ITP (Intelligent Tracking Prevention) doesn't block GA4

**Safari Result:** [ ] PASS [ ] FAIL

### [ ] Edge

- [ ] All conversion types work
- [ ] No console errors
- [ ] Events tracked correctly

**Edge Result:** [ ] PASS [ ] FAIL

**Cross-Browser Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## Mobile Device Testing

Test on actual mobile devices, not just browser responsive mode.

### [ ] iOS (iPhone)

#### [ ] Test in Safari

- [ ] Navigate to website
- [ ] Test phone click (should open phone dialer)
- [ ] Test form submission
- [ ] Test pricing CTA
- [ ] Verify events track (use GA4 DebugView to confirm)

**iOS Safari Result:** [ ] PASS [ ] FAIL

#### [ ] Test in Chrome iOS

- [ ] Repeat key tests
- [ ] Verify tracking works

**iOS Chrome Result:** [ ] PASS [ ] FAIL

### [ ] Android

#### [ ] Test in Chrome

- [ ] Navigate to website
- [ ] Test phone click
- [ ] Test form submission
- [ ] Test pricing CTA
- [ ] Verify events track

**Android Chrome Result:** [ ] PASS [ ] FAIL

#### [ ] Test in Firefox

- [ ] Repeat key tests
- [ ] Verify tracking works

**Android Firefox Result:** [ ] PASS [ ] FAIL

### [ ] Mobile-Specific Features

- [ ] Header mobile menu phone button tracks correctly
- [ ] Mobile contact forms track correctly
- [ ] Click-to-call links work and track
- [ ] No JavaScript errors on mobile

**Mobile Testing Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## A/B Testing Verification

### [ ] Test Variant A

#### [ ] 1. Set Variant to A

In browser console:
```javascript
sessionStorage.setItem('ab_variant', 'A');
location.reload();
```

#### [ ] 2. Perform Conversions

- [ ] Submit form
- [ ] Click phone link
- [ ] Click pricing CTA

#### [ ] 3. Verify Variant in Events

- [ ] Check browser console logs show `variant: "A"`
- [ ] Check GTM Debug shows `variant: "A"`
- [ ] Check GA4 DebugView shows `variant: "A"`

**Variant A Result:** [ ] PASS [ ] FAIL

### [ ] Test Variant B

#### [ ] 1. Set Variant to B

In browser console:
```javascript
sessionStorage.setItem('ab_variant', 'B');
location.reload();
```

#### [ ] 2. Perform Conversions

- [ ] Submit form
- [ ] Click phone link
- [ ] Click pricing CTA

#### [ ] 3. Verify Variant in Events

- [ ] Check browser console logs show `variant: "B"`
- [ ] Check GTM Debug shows `variant: "B"`
- [ ] Check GA4 DebugView shows `variant: "B"`

**Variant B Result:** [ ] PASS [ ] FAIL

### [ ] Test Default Variant

#### [ ] 1. Clear Variant

In browser console:
```javascript
sessionStorage.removeItem('ab_variant');
location.reload();
```

#### [ ] 2. Perform Conversion

- [ ] Submit form or perform any conversion

#### [ ] 3. Verify Default Variant

- [ ] Should default to `variant: "A"`
- [ ] Verify in all three places (console, GTM, GA4)

**Default Variant Result:** [ ] PASS [ ] FAIL

**A/B Testing Result:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## Production Verification

After deploying to production, perform final verification.

### [ ] 24 Hours After Launch

#### [ ] Check Events Report

- [ ] Go to GA4: **Reports > Events**
- [ ] Verify `conversion` event appears
- [ ] Check event count > 0
- [ ] Click on event to see details

#### [ ] Check Conversions Report

- [ ] Go to GA4: **Reports > Conversions**
- [ ] Verify conversion events appear (if marked as conversions)
- [ ] Check conversion count > 0

#### [ ] Check Real-Time Report

- [ ] Go to GA4: **Reports > Realtime**
- [ ] Perform test conversion
- [ ] Verify event appears in real-time

**24-Hour Verification:** [ ] PASS [ ] FAIL

### [ ] 48 Hours After Launch

#### [ ] Check Custom Dimensions

- [ ] Go to **Explore** in GA4
- [ ] Create blank exploration
- [ ] Add custom dimensions as dimensions:
  - variant
  - conversion_type
  - form_type
- [ ] Add metric: Event count
- [ ] Build table
- [ ] Verify dimensions are populated (not "(not set)")

#### [ ] Check Conversion Events

- [ ] Go to **Admin > Events**
- [ ] Verify `conversion` event appears with count
- [ ] If using custom conversion events:
  - form_conversion
  - phone_conversion
  - etc.
- [ ] Verify these appear with counts

#### [ ] Check Conversion Segmentation

- [ ] In Explore, filter by:
  - conversion_type = "form_submit"
  - conversion_type = "phone_click"
  - etc.
- [ ] Verify data segments correctly

**48-Hour Verification:** [ ] PASS [ ] FAIL

### [ ] 1 Week After Launch

#### [ ] Review Weekly Data

- [ ] Check total conversion count
- [ ] Review conversion rate
- [ ] Compare variant A vs B performance
- [ ] Check most popular packages
- [ ] Review click locations

#### [ ] Check Alerts

- [ ] Verify no alert emails received (unless actual issue)
- [ ] Test alert by manually triggering condition

#### [ ] Team Review

- [ ] Present findings to team
- [ ] Discuss any issues or anomalies
- [ ] Plan optimizations based on data

**1-Week Verification:** [ ] PASS [ ] FAIL

**Production Verification:** [ ] PASS [ ] FAIL

**Notes:** ___________________________________

---

## Troubleshooting Guide

### Problem: Events Fire in GTM but Not in GA4

**Symptoms:**
- GTM Debug shows tag fired
- GA4 DebugView shows no events

**Solutions:**
1. [ ] Verify GA4 Measurement ID is correct in GTM Configuration tag
2. [ ] Check that Configuration tag fires before Event tag
3. [ ] Verify no ad blockers are active
4. [ ] Check browser console for network errors
5. [ ] Try in incognito mode
6. [ ] Wait 5-10 minutes (sometimes delay in DebugView)

---

### Problem: Parameters Show as Undefined

**Symptoms:**
- Events track but parameters are undefined
- GTM Debug shows variable as "undefined"

**Solutions:**
1. [ ] Verify Data Layer Variable names match exactly (case-sensitive)
2. [ ] Check that event parameter is included in dataLayer.push()
3. [ ] Verify variable is attached to the event (not user-scoped)
4. [ ] Check spelling of parameter names
5. [ ] Review trackConversion.js to ensure parameter is included

---

### Problem: Duplicate Events

**Symptoms:**
- Single action triggers multiple events
- Event count doubles

**Solutions:**
1. [ ] Check for duplicate onClick handlers in code
2. [ ] Verify tracking function is only called once
3. [ ] Check that tag doesn't fire multiple times in GTM
4. [ ] Review trigger conditions for duplicates
5. [ ] Ensure no event bubbling issues

---

### Problem: Mobile Events Not Tracking

**Symptoms:**
- Desktop tracking works
- Mobile tracking fails

**Solutions:**
1. [ ] Test on actual device (not just responsive mode)
2. [ ] Check mobile browser console for errors
3. [ ] Verify GTM loads on mobile
4. [ ] Test with mobile network (not just WiFi)
5. [ ] Check for mobile-specific JavaScript errors
6. [ ] Verify click events work on touch devices

---

### Problem: Variant Not Tracking

**Symptoms:**
- All conversions show variant "A"
- No variant "B" events

**Solutions:**
1. [ ] Verify A/B testing framework is implemented
2. [ ] Check that setUserVariant() is called
3. [ ] Verify sessionStorage is accessible
4. [ ] Check that getUserVariant() is called in tracking functions
5. [ ] Test manually setting variant in console

---

### Problem: Form Submission Doesn't Track

**Symptoms:**
- Form submits successfully
- No conversion event fires

**Solutions:**
1. [ ] Verify trackFormSubmission() is called after API success
2. [ ] Check that form doesn't navigate away immediately
3. [ ] Add delay before navigation (if needed)
4. [ ] Verify no JavaScript errors on form submission
5. [ ] Check that dataLayer is defined when tracking fires

---

### Problem: Custom Dimensions Show "(not set)"

**Symptoms:**
- Events track in GA4
- Custom dimensions show "(not set)" in reports

**Solutions:**
1. [ ] Wait 24-48 hours for data to process
2. [ ] Verify custom dimensions are created in GA4 Admin
3. [ ] Check that event parameter names match dimension setup
4. [ ] Verify parameters are included in GA4 Event tag in GTM
5. [ ] Test in DebugView to see if parameters are captured

---

## Testing Sign-Off

### Test Results Summary

| Test Category | Result | Notes |
|--------------|--------|-------|
| Form Submission | [ ] PASS [ ] FAIL | |
| Phone Click | [ ] PASS [ ] FAIL | |
| Pricing CTA | [ ] PASS [ ] FAIL | |
| Availability Check | [ ] PASS [ ] FAIL | |
| Contact Navigation | [ ] PASS [ ] FAIL | |
| Quote Request | [ ] PASS [ ] FAIL | |
| GTM Debug | [ ] PASS [ ] FAIL | |
| GA4 DebugView | [ ] PASS [ ] FAIL | |
| Browser Console | [ ] PASS [ ] FAIL | |
| Cross-Browser | [ ] PASS [ ] FAIL | |
| Mobile Testing | [ ] PASS [ ] FAIL | |
| A/B Testing | [ ] PASS [ ] FAIL | |
| Production Verification | [ ] PASS [ ] FAIL | |

### Overall Result

- [ ] **ALL TESTS PASSED** - Ready for production
- [ ] **SOME TESTS FAILED** - Issues need resolution
- [ ] **TESTS INCOMPLETE** - Testing in progress

### Sign-Off

**Tested By:** _____________________

**Date:** _____________________

**Approved By:** _____________________

**Date:** _____________________

**Notes:**
___________________________________
___________________________________
___________________________________

---

## Next Steps After Testing

1. [ ] Document any issues found
2. [ ] Fix any failing tests
3. [ ] Re-test after fixes
4. [ ] Deploy to production (if on staging)
5. [ ] Monitor production for 1 week
6. [ ] Schedule weekly analytics review meetings
7. [ ] Plan A/B tests based on initial data
8. [ ] Set up automated reporting

---

## Testing Resources

- **GTM Preview Mode Guide:** https://support.google.com/tagmanager/answer/6107056
- **GA4 DebugView Guide:** https://support.google.com/analytics/answer/7201382
- **Chrome DevTools Guide:** https://developer.chrome.com/docs/devtools/
- **Project Documentation:** `/opt/mr-dj/ga4-conversion-setup.md`

---

**End of Testing Plan**

Last Updated: October 19, 2025
