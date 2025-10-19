# Testing and Troubleshooting Guide
## GTM and GA4 Configuration for Mr. DJ Website

**Date:** October 19, 2025
**GTM Container:** GTM-NST23HJX
**GA4 Measurement ID:** G-TXJLD3H2C8
**Website:** https://mr-dj.sevensa.nl

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Pre-Testing Checklist](#pre-testing-checklist)
3. [Testing Phases](#testing-phases)
4. [Test Cases](#test-cases)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)
6. [Verification Procedures](#verification-procedures)
7. [Data Quality Checks](#data-quality-checks)
8. [Performance Monitoring](#performance-monitoring)

---

## Testing Overview

### Purpose

This guide provides comprehensive testing procedures and troubleshooting steps for the GTM and GA4 implementation on the Mr. DJ website.

### Testing Goals

- Verify all conversion events fire correctly
- Confirm all event parameters are captured
- Validate custom dimensions in GA4
- Ensure A/B test variant tracking works
- Check cross-device and cross-session tracking
- Verify data quality and accuracy

### Testing Environment

- **Staging URL**: https://mr-dj.sevensa.nl (or staging environment)
- **Production URL**: (when ready)
- **Testing Tools**:
  - GTM Preview Mode
  - GA4 DebugView
  - Browser Console (F12)
  - GTM Debug Panel

---

## Pre-Testing Checklist

Before starting tests, verify:

### GTM Configuration
- [ ] All 11 Data Layer Variables created
- [ ] GA4 Configuration tag created with correct Measurement ID
- [ ] GA4 Conversion Events tag created with all parameters
- [ ] Custom Event trigger created for 'conversion'
- [ ] GTM container published to production
- [ ] GTM Preview mode accessible

### GA4 Configuration
- [ ] All 8 custom dimensions created
- [ ] All 6 custom conversion events created
- [ ] Conversion events marked as conversions
- [ ] DebugView accessible
- [ ] Realtime reports accessible

### Website Code
- [ ] GTM container snippet installed in `<head>` and `<body>`
- [ ] dataLayer initialized
- [ ] trackConversion.js implemented
- [ ] Conversion tracking calls in components
- [ ] No JavaScript errors in console

### Access and Tools
- [ ] Access to GTM account
- [ ] Access to GA4 property
- [ ] Browser with no ad blockers (or ad blockers disabled)
- [ ] Incognito/private browsing mode available
- [ ] Multiple devices for cross-device testing

---

## Testing Phases

### Phase 1: GTM Debug Testing (Day 1)
**Duration:** 2-3 hours
**Tools:** GTM Preview Mode, Browser Console

Test all conversion events fire correctly in GTM.

### Phase 2: GA4 DebugView Testing (Day 1)
**Duration:** 1-2 hours
**Tools:** GA4 DebugView, GTM Preview Mode

Verify events reach GA4 with all parameters.

### Phase 3: Realtime Reporting (Day 1-2)
**Duration:** 30 minutes per test session
**Tools:** GA4 Realtime Reports

Confirm events appear in GA4 Realtime reports.

### Phase 4: Standard Reporting (Day 2-3)
**Duration:** Wait 24-48 hours, then 1 hour testing
**Tools:** GA4 Standard Reports

Verify events appear in standard reports with custom dimensions.

### Phase 5: Custom Reports and Analysis (Day 3-7)
**Duration:** 1-2 hours
**Tools:** GA4 Explore Reports

Test custom reports and data analysis capabilities.

### Phase 6: Production Validation (Week 1)
**Duration:** Ongoing monitoring
**Tools:** All GA4 reports

Monitor production data for accuracy and completeness.

---

## Test Cases

### Test Case 1: Form Submission Conversion

**Objective:** Verify contact form submission tracking

**Prerequisites:**
- GTM Preview mode active
- GA4 DebugView open
- Browser console open

**Steps:**
1. Navigate to contact page or section
2. Fill out form fields:
   - Name: Test User
   - Email: test@example.com
   - Phone: 0612345678
   - Event Type: Select "Bruiloft"
   - Message: Test message
3. Click Submit button
4. Wait for form submission to complete

**Expected Results:**

**In Browser Console:**
- Message: `GA4 Conversion Tracked: {...}`
- No JavaScript errors

**In GTM Debug Panel:**
- Event: `conversion` appears in timeline
- Tag: `GA4 - Conversion Events` fires (green)
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "form_submit"
  variant: "A" or "B"
  form_type: "contact"
  event_type: "bruiloft"
  value: 1
  currency: "EUR"
  ```

**In GA4 DebugView:**
- Event: `conversion` appears
- Parameters include:
  - conversion_type: form_submit
  - variant: A or B
  - form_type: contact
  - event_type: bruiloft
  - value: 1
  - currency: EUR

**Pass Criteria:**
- [ ] Event fires in GTM
- [ ] All parameters present and correct
- [ ] Event appears in GA4 DebugView
- [ ] No errors in console

---

### Test Case 2: Phone Click Conversion

**Objective:** Verify phone number click tracking

**Test Locations:**
1. Header phone number
2. Footer phone number
3. Contact section phone number
4. Sticky phone button (if present)

**Steps:**
1. Locate phone number link
2. Note the location (header, footer, etc.)
3. Click the phone number link
4. Phone dialer should open (or click is registered)

**Expected Results:**

**In Browser Console:**
- Message: `GA4 Conversion Tracked: {...}`

**In GTM Debug Panel:**
- Event: `conversion`
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "phone_click"
  variant: "A" or "B"
  click_location: "header" (or appropriate location)
  value: 1
  currency: "EUR"
  ```

**In GA4 DebugView:**
- Event: `conversion`
- Parameters:
  - conversion_type: phone_click
  - click_location: (correct location)
  - variant: A or B

**Pass Criteria:**
- [ ] Click registers correctly
- [ ] Location parameter matches actual click location
- [ ] Event appears in GA4
- [ ] Test all 4 phone number locations

---

### Test Case 3: Pricing CTA Conversion

**Objective:** Verify pricing package CTA tracking

**Test Packages:**
1. Brons package
2. Zilver package
3. Goud package

**Steps:**
1. Scroll to pricing section
2. Note the package name and price
3. Click the CTA button (e.g., "Boek Nu" or "Contact")
4. Verify conversion fires

**Expected Results:**

**In GTM Debug Panel:**
- Event: `conversion`
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "pricing_cta"
  variant: "A" or "B"
  package_name: "brons" (or "zilver", "goud")
  package_price: "€495" (or appropriate price)
  value: 1
  currency: "EUR"
  ```

**In GA4 DebugView:**
- Event: `conversion`
- Parameters include package_name and package_price

**Pass Criteria:**
- [ ] Package name matches clicked package
- [ ] Package price is correct
- [ ] Test all 3 packages
- [ ] Event appears in GA4

---

### Test Case 4: Availability Checker Conversion

**Objective:** Verify availability checker tracking

**Steps:**
1. Navigate to availability checker component
2. Select a future date (e.g., 3 months from now)
3. Click "Check Availability" or submit button
4. Wait for response

**Expected Results:**

**In GTM Debug Panel:**
- Event: `conversion`
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "availability_check"
  variant: "A" or "B"
  selected_date: "2025-01-15" (ISO format)
  value: 1
  currency: "EUR"
  ```

**In GA4 DebugView:**
- Event: `conversion`
- Parameters include selected_date

**Pass Criteria:**
- [ ] Selected date is captured correctly
- [ ] Date format is consistent (ISO 8601)
- [ ] Event fires after date selection

---

### Test Case 5: Contact Navigation Conversion

**Objective:** Verify contact navigation click tracking

**Test Locations:**
1. Main navigation "Contact" link
2. Mobile menu "Contact" link
3. Footer "Contact" link
4. Any other contact links

**Steps:**
1. Locate contact navigation link
2. Click the link
3. Verify navigation occurs
4. Check conversion fires

**Expected Results:**

**In GTM Debug Panel:**
- Event: `conversion`
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "contact_navigation"
  variant: "A" or "B"
  navigation_source: "header" (or appropriate source)
  value: 1
  currency: "EUR"
  ```

**Pass Criteria:**
- [ ] Navigation occurs correctly
- [ ] Source parameter matches click location
- [ ] Test all contact navigation links

---

### Test Case 6: Quote Request Conversion

**Objective:** Verify quote request form tracking

**Steps:**
1. Locate "Request Quote" or "Offerte Aanvragen" button/form
2. Fill out quote request form (if separate from contact form)
3. Submit the form
4. Verify conversion fires

**Expected Results:**

**In GTM Debug Panel:**
- Event: `conversion`
- Data Layer shows:
  ```
  event: "conversion"
  conversion_type: "quote_request"
  variant: "A" or "B"
  form_type: "quote" (if applicable)
  value: 1
  currency: "EUR"
  ```

**Pass Criteria:**
- [ ] Quote request fires distinct from contact form
- [ ] Form type parameter is correct
- [ ] Event appears in GA4

---

### Test Case 7: A/B Test Variant Tracking

**Objective:** Verify variant assignment and tracking

**Steps:**
1. Open website in incognito window (Session 1)
2. Note the variant in console or localStorage
3. Perform a conversion
4. Verify variant is tracked
5. Clear cookies and open new incognito window (Session 2)
6. Note the variant (should be random, may differ)
7. Perform another conversion
8. Verify new variant is tracked

**Expected Results:**
- Variant is assigned on first visit
- Variant persists across pages in same session
- Variant is included in all conversion events
- Different sessions may have different variants
- Approximately 50/50 split over many sessions

**Verification in GA4:**
1. After several test sessions, check GA4 reports
2. Go to Explore > Conversions by Variant report
3. Verify both Variant A and Variant B appear
4. Check that conversions are attributed correctly

**Pass Criteria:**
- [ ] Variant is assigned consistently
- [ ] Variant persists in session
- [ ] Both variants appear in reports
- [ ] Variant is included in all conversion events

---

### Test Case 8: Cross-Page Tracking

**Objective:** Verify tracking works across multiple pages

**Steps:**
1. Start on home page with GTM Preview active
2. Verify GA4 Configuration tag fires
3. Navigate to about page
4. Verify GA4 Configuration tag fires again
5. Navigate to contact page
6. Verify GA4 Configuration tag fires
7. Submit contact form
8. Verify conversion event fires

**Expected Results:**
- GA4 Configuration tag fires on every page view
- page_view events appear in GA4 DebugView
- Session is maintained across pages
- Conversion event attributes to same session

**Pass Criteria:**
- [ ] Configuration tag fires on all pages
- [ ] Session ID remains consistent
- [ ] Conversions attribute to correct session

---

### Test Case 9: Multiple Conversions in One Session

**Objective:** Verify multiple conversion tracking in single session

**Steps:**
1. Open website in new session
2. Click phone number (Conversion 1)
3. Wait 30 seconds
4. Click pricing CTA (Conversion 2)
5. Wait 30 seconds
6. Submit contact form (Conversion 3)
7. Verify all three conversions tracked

**Expected Results:**
- All three conversion events appear in GTM Debug
- All three events appear in GA4 DebugView
- Each event has correct conversion_type
- All events share same session
- Variant is consistent across all three

**Pass Criteria:**
- [ ] All conversions tracked in same session
- [ ] Each conversion has correct type
- [ ] No duplicate events
- [ ] Variant remains consistent

---

### Test Case 10: Mobile Device Testing

**Objective:** Verify tracking on mobile devices

**Devices to Test:**
1. iOS Safari
2. Android Chrome
3. Mobile responsive view in desktop browser

**Steps:**
1. Open website on mobile device
2. Enable GTM Preview (may require QR code or special URL)
3. Perform conversion actions:
   - Tap phone number
   - Submit form
   - Click pricing CTA
4. Verify events fire

**Expected Results:**
- All conversion events fire on mobile
- Touch events register correctly
- Phone click opens dialer
- Form submission works on mobile
- Events appear in GA4 DebugView

**Pass Criteria:**
- [ ] iOS Safari tracking works
- [ ] Android Chrome tracking works
- [ ] Touch events register
- [ ] No mobile-specific errors

---

## Troubleshooting Common Issues

### Issue 1: Events Not Firing in GTM Debug

**Symptoms:**
- No conversion event appears in GTM Debug timeline
- Tags show as "Not Fired"
- Data Layer push not visible

**Diagnostic Steps:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Type `window.dataLayer` in console
4. Verify dataLayer exists and is array
5. Type `window.dataLayer.filter(e => e.event === 'conversion')` to see conversion events

**Possible Causes:**

**Cause 1: JavaScript Error Before Tracking Code**
- **Solution**: Fix JavaScript error in console
- **Solution**: Ensure tracking code is not blocked by earlier error

**Cause 2: dataLayer Not Initialized**
- **Solution**: Verify GTM snippet in `<head>` loads first
- **Solution**: Check `window.dataLayer = window.dataLayer || [];` exists

**Cause 3: Tracking Function Not Called**
- **Solution**: Verify `trackConversion()` is imported in component
- **Solution**: Check function is called in event handler
- **Solution**: Add `console.log('Tracking conversion:', data)` before dataLayer.push

**Cause 4: Ad Blocker Interfering**
- **Solution**: Disable all ad blockers and privacy extensions
- **Solution**: Test in incognito mode
- **Solution**: Try different browser

**Cause 5: GTM Container Not Loaded**
- **Solution**: Verify GTM container ID matches GTM-NST23HJX
- **Solution**: Check network tab for GTM script loading
- **Solution**: Ensure GTM Preview is connected

---

### Issue 2: Tags Firing But Events Not in GA4

**Symptoms:**
- GTM Debug shows tags firing (green)
- Events don't appear in GA4 DebugView
- Events don't appear in Realtime reports

**Diagnostic Steps:**
1. Click on fired tag in GTM Debug
2. Check tag configuration
3. Verify Measurement ID
4. Check for GA4 errors in network tab

**Possible Causes:**

**Cause 1: Wrong Measurement ID**
- **Solution**: Verify tag uses G-TXJLD3H2C8
- **Solution**: Check for typos in Measurement ID
- **Solution**: Ensure Configuration Tag has correct ID

**Cause 2: GA4 Configuration Tag Not Firing First**
- **Solution**: GA4 Configuration must fire before Event tag
- **Solution**: Verify Configuration tag trigger is "All Pages"
- **Solution**: Check tag firing sequence in GTM Debug

**Cause 3: Ad Blocker Blocking GA4 Requests**
- **Solution**: Disable ad blockers completely
- **Solution**: Check network tab for blocked requests
- **Solution**: Test in incognito mode

**Cause 4: Wrong GA4 Property Open**
- **Solution**: Verify you're viewing correct GA4 property
- **Solution**: Check property Measurement ID matches

**Cause 5: DebugView Not Enabled**
- **Solution**: Ensure GTM Preview mode is active
- **Solution**: Or enable debug mode in GA4 data stream settings

---

### Issue 3: Parameters Showing as Undefined

**Symptoms:**
- Event fires in GA4
- Some or all parameters show as (not set) or undefined
- Custom dimensions don't populate

**Diagnostic Steps:**
1. In GTM Debug, click on conversion event
2. Go to Data Layer tab
3. Check if parameters are in dataLayer
4. In GTM, check Data Layer Variables configuration
5. In tag configuration, verify parameters map to variables

**Possible Causes:**

**Cause 1: Parameter Not in dataLayer**
- **Solution**: Check tracking code includes all parameters
- **Solution**: Verify `trackConversion()` function includes parameter
- **Solution**: Add console.log before dataLayer.push to see data

**Cause 2: Data Layer Variable Name Mismatch**
- **Solution**: Verify variable name in GTM matches exactly (case-sensitive)
- **Solution**: Check for typos: `conversion_type` not `conversionType`
- **Solution**: Ensure underscore vs camelCase consistency

**Cause 3: Variable Not Mapped to Parameter**
- **Solution**: Check GA4 Event tag parameter configuration
- **Solution**: Verify {{ variable }} syntax is correct
- **Solution**: Ensure all 11 parameters are added to tag

**Cause 4: Parameter Optional and Not Always Present**
- **Solution**: Expected behavior for conditional parameters
- **Solution**: form_type only for form conversions
- **Solution**: package_name only for pricing conversions

---

### Issue 4: Custom Dimensions Not Populating in GA4 Reports

**Symptoms:**
- Events appear in GA4
- Parameters visible in DebugView
- Custom dimensions show (not set) in reports
- Explore reports don't show dimension data

**Diagnostic Steps:**
1. Check GA4 Admin > Custom definitions
2. Verify custom dimensions exist
3. Check event parameter names match exactly
4. Check how long since first event (need 24-48 hours)

**Possible Causes:**

**Cause 1: Custom Dimension Not Created**
- **Solution**: Create custom dimension in GA4
- **Solution**: Ensure dimension name matches
- **Solution**: Set scope to "Event"

**Cause 2: Event Parameter Name Mismatch**
- **Solution**: GA4 custom dimension must match event parameter exactly
- **Solution**: Case-sensitive: `variant` not `Variant`
- **Solution**: Check for typos in parameter names

**Cause 3: Need to Wait for Processing**
- **Solution**: Custom dimension data can take 24-48 hours to populate
- **Solution**: Check DebugView first (real-time)
- **Solution**: Standard reports update with delay

**Cause 4: Dimension Not Added to Report**
- **Solution**: In Explore, ensure dimension is added to Variables
- **Solution**: Drag dimension to Rows or Columns
- **Solution**: Some standard reports may not include custom dimensions

---

### Issue 5: Variant Not Splitting 50/50

**Symptoms:**
- All conversions show same variant
- 100% Variant A or 100% Variant B
- No variant distribution

**Diagnostic Steps:**
1. Check browser localStorage for `abTestVariant`
2. Test in multiple incognito windows
3. Check console for variant assignment logs
4. Verify useABTest hook is working

**Possible Causes:**

**Cause 1: Testing in Same Session**
- **Solution**: Variant persists in session
- **Solution**: Test in multiple incognito windows
- **Solution**: Clear localStorage between tests

**Cause 2: Variant Assignment Logic Issue**
- **Solution**: Check useABTest hook implementation
- **Solution**: Verify Math.random() < 0.5 logic
- **Solution**: Add console.log to see variant assignment

**Cause 3: LocalStorage Not Clearing**
- **Solution**: Manually clear localStorage: `localStorage.clear()`
- **Solution**: Use different browsers for testing
- **Solution**: Test on different devices

**Cause 4: Not Enough Data**
- **Solution**: Need significant sample size for 50/50 split
- **Solution**: With 10 tests, 7/3 split is possible by chance
- **Solution**: Check with 100+ sessions for accurate distribution

---

### Issue 6: GTM Preview Mode Won't Connect

**Symptoms:**
- GTM Preview shows "Waiting to connect"
- Debug panel doesn't appear on website
- Can't enter Preview mode

**Diagnostic Steps:**
1. Check GTM container ID on website
2. Verify ad blockers disabled
3. Try different browser
4. Check browser console for errors

**Possible Causes:**

**Cause 1: Wrong GTM Container ID**
- **Solution**: Verify website uses GTM-NST23HJX
- **Solution**: Check `<head>` and `<body>` snippets
- **Solution**: Search for "GTM-" in page source

**Cause 2: Ad Blocker or Privacy Extension**
- **Solution**: Disable all ad blockers
- **Solution**: Disable privacy badger, ghostery, etc.
- **Solution**: Test in incognito mode with extensions disabled

**Cause 3: Browser Cookie/Storage Issues**
- **Solution**: Clear browser cookies and cache
- **Solution**: Enable third-party cookies temporarily
- **Solution**: Try different browser

**Cause 4: CORS or CSP Headers**
- **Solution**: Check browser console for CORS errors
- **Solution**: Verify Content Security Policy allows GTM
- **Solution**: Contact web developer if CSP blocking

**Cause 5: GTM Container Not Published**
- **Solution**: Publish GTM container first
- **Solution**: Can preview draft workspace
- **Solution**: Ensure Preview mode uses correct workspace

---

### Issue 7: Form Conversion Fires Twice

**Symptoms:**
- Single form submission creates 2 conversion events
- Event count is double expected
- Duplicate events in GA4

**Diagnostic Steps:**
1. Check GTM Debug timeline for duplicate events
2. Review form submission handler code
3. Check if Enhanced Measurement form tracking is on
4. Verify trigger doesn't fire multiple times

**Possible Causes:**

**Cause 1: Event Handler Called Twice**
- **Solution**: Check form `onSubmit` handler
- **Solution**: Ensure form submission isn't triggering twice
- **Solution**: Check for both form submit and button click tracking

**Cause 2: Enhanced Measurement Conflicts**
- **Solution**: GA4 Enhanced Measurement auto-tracks forms
- **Solution**: May conflict with manual tracking
- **Solution**: Disable form_start and form_submit in Enhanced Measurement
- **Solution**: Or use only Enhanced Measurement for forms

**Cause 3: Trigger Fires Multiple Times**
- **Solution**: Check GTM trigger configuration
- **Solution**: Ensure trigger fires once per event
- **Solution**: Add trigger exception if needed

**Cause 4: Manual and GTM Tracking Both Active**
- **Solution**: Choose one tracking method
- **Solution**: Remove duplicate tracking code
- **Solution**: Standardize on GTM-based tracking

---

### Issue 8: Mobile Conversions Not Tracking

**Symptoms:**
- Desktop tracking works
- Mobile device conversions don't fire
- Mobile events missing in GA4

**Diagnostic Steps:**
1. Test on actual mobile device
2. Connect mobile device to GTM Preview (use QR code)
3. Check mobile browser console (remote debugging)
4. Verify touch events vs click events

**Possible Causes:**

**Cause 1: Touch Events Not Handled**
- **Solution**: Ensure tracking uses both click and touch events
- **Solution**: Use `onClick` in React (handles both)
- **Solution**: Test tap vs long-press behavior

**Cause 2: Mobile Browser Issues**
- **Solution**: Test on multiple mobile browsers
- **Solution**: iOS Safari may have different behavior
- **Solution**: Check for mobile-specific JavaScript errors

**Cause 3: GTM Preview Not Working on Mobile**
- **Solution**: Use GTM Preview QR code for mobile testing
- **Solution**: Or manually add preview parameters to URL
- **Solution**: Check GA4 DebugView from desktop while testing mobile

**Cause 4: Form Submission on Mobile Different**
- **Solution**: Mobile keyboards may affect form submission
- **Solution**: Test with form validation
- **Solution**: Verify submit button is tappable

---

## Verification Procedures

### Daily Verification (First Week)

**Checklist:**
- [ ] Check GA4 Realtime report for today's conversions
- [ ] Verify conversion count seems reasonable (not 0, not 1000s)
- [ ] Review DebugView for any error events
- [ ] Check browser console on website for JavaScript errors
- [ ] Test one random conversion type manually

**Time Required:** 10-15 minutes

### Weekly Verification (First Month)

**Checklist:**
- [ ] Review GA4 Conversions report
- [ ] Check conversion trends (increasing, stable, or decreasing)
- [ ] Verify custom dimensions populate correctly
- [ ] Review Conversions by Variant report
- [ ] Check package performance data
- [ ] Analyze conversion funnel
- [ ] Review form completion rates

**Time Required:** 30-45 minutes

### Monthly Verification (Ongoing)

**Checklist:**
- [ ] Full conversion funnel analysis
- [ ] A/B test statistical significance check
- [ ] Package pricing performance review
- [ ] Event type preference analysis
- [ ] Cross-device and cross-session analysis
- [ ] Data quality audit
- [ ] Custom dimension completeness check

**Time Required:** 1-2 hours

---

## Data Quality Checks

### Check 1: Conversion Count Reasonableness

**How to Check:**
1. Go to GA4 Reports > Conversions
2. Check total conversions for date range
3. Compare to website traffic volume
4. Check for abnormal spikes or drops

**Red Flags:**
- 0 conversions for multiple days
- Conversion rate >50% (unusually high)
- Sudden 10x spike without explanation
- Conversion count exactly equals page view count

**Expected Conversion Rates:**
- Phone clicks: 2-5% of visitors
- Form submissions: 1-3% of visitors
- Pricing CTA: 5-10% of visitors
- Total conversions: 10-20% of visitors

### Check 2: Custom Dimension Completeness

**How to Check:**
1. Go to Explore > Create table exploration
2. Add custom dimensions as rows
3. Add Event count as metric
4. Filter to conversion events
5. Check for (not set) values

**Red Flags:**
- More than 20% (not set) for required dimensions
- 100% (not set) for any dimension
- Inconsistent dimension population

**Required Dimensions (should rarely be not set):**
- variant: Should always be present
- conversion_type: Should always be present
- value: Should always be present
- currency: Should always be present

**Conditional Dimensions (not set is OK):**
- form_type: Only for form conversions
- event_type: Only for event-specific conversions
- package_name: Only for pricing conversions
- package_price: Only for pricing conversions
- click_location: Only for click conversions
- navigation_source: Only for navigation conversions
- selected_date: Only for availability checks

### Check 3: Variant Distribution

**How to Check:**
1. Go to Explore > Conversions by Variant report
2. Check total conversions for Variant A vs Variant B
3. Calculate percentage split

**Expected Results:**
- With 100+ conversions: 45-55% split acceptable
- With 1000+ conversions: 48-52% split expected
- With 10,000+ conversions: 49-51% split expected

**Red Flags:**
- 100% one variant, 0% other
- >70% one variant with significant sample size
- Variant distribution changes dramatically over time

### Check 4: Duplicate Events

**How to Check:**
1. Go to Explore > Create exploration
2. Add User, Session, Timestamp to dimensions
3. Add Event name, Event count to metrics
4. Filter to conversion events
5. Sort by timestamp
6. Look for duplicate events at same timestamp

**Red Flags:**
- Exact same event at exact same timestamp
- User has >10 conversions in single session
- Form submission count > form view count

### Check 5: Parameter Value Validity

**How to Check:**
1. In Explore, add custom dimensions
2. Review unique values for each dimension
3. Check for unexpected or invalid values

**Expected Values:**

**conversion_type:**
- form_submit
- phone_click
- quote_request
- availability_check
- pricing_cta
- contact_navigation
- (No other values expected)

**variant:**
- A
- B
- (No other values expected)

**package_name:**
- brons
- zilver
- goud
- (No other values expected)

**currency:**
- EUR
- (No other values expected)

**Red Flags:**
- Unexpected values in dimensions
- Typos or case variations
- NULL or undefined values
- HTML or code snippets in parameters

---

## Performance Monitoring

### GTM Container Performance

**Metrics to Monitor:**
- GTM container load time: <500ms ideal
- Number of tags firing per page: <20 recommended
- Impact on page load: <200ms ideal

**How to Check:**
1. Open browser DevTools > Performance
2. Record page load
3. Look for GTM-related activities
4. Check impact on page metrics

### GA4 Data Processing Delays

**Expected Delays:**
- DebugView: Real-time (seconds)
- Realtime reports: 1-5 minutes
- Standard reports: 24-48 hours
- Custom dimensions: 24-48 hours initially
- Explore reports: 24-48 hours

**If delays are longer:**
- Check GA4 property settings
- Verify data is actually being sent
- Contact GA4 support if delays exceed 72 hours

### Data Sampling

**What is Sampling:**
GA4 may sample data in reports with large data volumes to speed up processing.

**How to Check:**
- Green checkmark = unsampled data
- Yellow shield = sampled data
- Check at top of report

**How to Reduce Sampling:**
- Use shorter date ranges
- Use fewer dimensions in exploration
- Create custom tables instead of complex visualizations
- Export data for offline analysis

---

## Testing Completion Checklist

### GTM Testing Complete
- [ ] All 11 Data Layer Variables verified in Debug
- [ ] GA4 Configuration tag fires on all pages
- [ ] GA4 Event tag fires on all conversion types
- [ ] All 11 parameters captured correctly
- [ ] No JavaScript errors in console
- [ ] Preview mode works correctly
- [ ] Container published successfully

### GA4 Testing Complete
- [ ] All events appear in DebugView
- [ ] All 8 custom dimensions populated
- [ ] All 6 conversion events marked
- [ ] Realtime reports show conversions
- [ ] Standard reports show data (after 48 hours)
- [ ] Custom reports functional
- [ ] Audiences created and populating

### Conversion Type Testing Complete
- [ ] Form submission tested and verified
- [ ] Phone click tested and verified
- [ ] Pricing CTA tested and verified
- [ ] Availability check tested and verified
- [ ] Contact navigation tested and verified
- [ ] Quote request tested and verified

### Cross-Platform Testing Complete
- [ ] Desktop Chrome tested
- [ ] Desktop Safari tested
- [ ] Desktop Firefox tested
- [ ] Mobile iOS Safari tested
- [ ] Mobile Android Chrome tested

### Data Quality Verified
- [ ] Conversion counts reasonable
- [ ] Custom dimensions >80% populated
- [ ] Variant split approximately 50/50
- [ ] No duplicate events detected
- [ ] Parameter values all valid

### Documentation Complete
- [ ] All required screenshots taken
- [ ] Configuration documented
- [ ] Testing results documented
- [ ] Known issues documented
- [ ] Troubleshooting guide reviewed

---

## Support and Escalation

### When to Seek Help

**Immediate Escalation:**
- No events appearing in GA4 after 72 hours
- JavaScript errors blocking page functionality
- Data loss or missing historical data
- Security or privacy concerns

**Non-Urgent Support:**
- Custom dimension not populating after 48 hours
- Variant split slightly off (55/45 vs 50/50)
- Questions about report interpretation
- Feature requests or enhancements

### Support Resources

**Documentation:**
- GTM Help: https://support.google.com/tagmanager
- GA4 Help: https://support.google.com/analytics
- Project docs: `/opt/mr-dj/` directory

**Community:**
- GTM Community: https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager
- GA4 Community: https://www.en.advertisercommunity.com/t5/Google-Analytics-4/ct-p/Google-Analytics-4
- Stack Overflow: Tag questions with [google-tag-manager] or [google-analytics-4]

**Direct Support:**
- Google Analytics support (for property-level issues)
- Web developer (for code issues)
- GTM specialist (for complex tag configurations)

---

## Appendix: Testing Scripts

### Browser Console Test Script

Copy and paste into browser console to test dataLayer:

```javascript
// Check if dataLayer exists
console.log('dataLayer exists:', typeof window.dataLayer !== 'undefined');

// View all dataLayer events
console.log('All dataLayer events:', window.dataLayer);

// Filter to conversion events only
const conversions = window.dataLayer.filter(e => e.event === 'conversion');
console.log('Conversion events:', conversions);

// Check latest conversion
if (conversions.length > 0) {
  console.log('Latest conversion:', conversions[conversions.length - 1]);
} else {
  console.log('No conversion events found');
}

// Check variant
const variant = localStorage.getItem('abTestVariant');
console.log('Current variant:', variant);
```

### Manual Test Conversion

Paste into console to manually fire a test conversion:

```javascript
window.dataLayer.push({
  event: 'conversion',
  conversion_type: 'test',
  variant: localStorage.getItem('abTestVariant') || 'A',
  value: 1,
  currency: 'EUR',
  timestamp: new Date().toISOString()
});
console.log('Test conversion fired');
```

---

Last Updated: October 19, 2025
