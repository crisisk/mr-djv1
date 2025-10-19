# GA4 Configuration Manual Guide
## Mr. DJ Website - GA4 Property G-TXJLD3H2C8

**Date:** October 19, 2025
**GA4 Measurement ID:** G-TXJLD3H2C8
**GTM Container:** GTM-NST23HJX
**Website:** https://mr-dj.sevensa.nl
**Account:** info@mr-dj.nl

---

## Important Note

This document provides a step-by-step manual guide for configuring the GA4 console. Browser automation is not possible for this task, so these instructions must be followed manually by someone with access to the Google Analytics 4 property.

---

## Prerequisites

Before starting GA4 configuration:

- [ ] GTM container GTM-NST23HJX is configured (see GTM-CONFIG-COMPLETED.md)
- [ ] GTM container is published to production
- [ ] Website tracking code is live
- [ ] Access to GA4 property G-TXJLD3H2C8 with Editor or Administrator role

---

## Part 1: Access and Verify GA4 Property

### Step 1: Login to GA4

1. Open browser and navigate to: https://analytics.google.com/
2. Sign in with account: info@mr-dj.nl (or authorized admin account)
3. If multiple accounts/properties exist, ensure you select the correct one
4. Verify the property name or ID matches: **G-TXJLD3H2C8**

### Step 2: Verify Data Stream

1. Click **Admin** (gear icon in bottom left corner)
2. In the **Property** column (middle column), click **Data streams**
3. You should see a web data stream listed
4. Click on the data stream name to view details
5. Verify:
   - [ ] Stream URL matches your website: mr-dj.sevensa.nl
   - [ ] Stream name is appropriate
   - [ ] **Measurement ID**: G-TXJLD3H2C8
   - [ ] Stream is active (not deleted)
6. Take screenshot: `/opt/mr-dj/screenshots/ga4-data-stream.png`

**If data stream doesn't exist:**
- Click "Add stream" > Web
- Enter website URL: https://mr-dj.sevensa.nl
- Stream name: "Mr. DJ Website"
- Click "Create stream"
- Note the Measurement ID (should be G-TXJLD3H2C8)

---

## Part 2: Custom Dimensions Configuration

Custom dimensions allow you to segment conversion data by specific attributes. You need to create 8 custom dimensions.

### Navigate to Custom Definitions

1. In GA4, ensure you're in **Admin** view (click gear icon bottom left)
2. In the **Property** column (middle column), scroll down
3. Click **Custom definitions**
4. You should see two tabs: "Custom dimensions" and "Custom metrics"
5. Click **Custom dimensions** tab
6. Click **Create custom dimension** button (blue button top right)

### Create Dimension 1: variant

1. Click **Create custom dimension**
2. Fill in the form:
   - **Dimension name**: `variant`
   - **Scope**: Select **Event** from dropdown
   - **Description**: `A/B test variant (A or B)`
   - **Event parameter**: `variant` (must match exactly, case-sensitive)
3. Click **Save** button
4. Dimension should now appear in the list

### Create Dimension 2: conversion_type

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `conversion_type`
   - **Scope**: **Event**
   - **Description**: `Type of conversion event`
   - **Event parameter**: `conversion_type`
3. Click **Save**

### Create Dimension 3: form_type

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `form_type`
   - **Scope**: **Event**
   - **Description**: `Type of form submitted`
   - **Event parameter**: `form_type`
3. Click **Save**

### Create Dimension 4: event_type

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `event_type`
   - **Scope**: **Event**
   - **Description**: `Type of event (bruiloft, bedrijfsfeest, etc.)`
   - **Event parameter**: `event_type`
3. Click **Save**

### Create Dimension 5: click_location

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `click_location`
   - **Scope**: **Event**
   - **Description**: `Location where click occurred`
   - **Event parameter**: `click_location`
3. Click **Save**

### Create Dimension 6: package_name

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `package_name`
   - **Scope**: **Event**
   - **Description**: `Pricing package selected (brons, zilver, goud)`
   - **Event parameter**: `package_name`
3. Click **Save**

### Create Dimension 7: package_price

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `package_price`
   - **Scope**: **Event**
   - **Description**: `Price of package selected`
   - **Event parameter**: `package_price`
3. Click **Save**

### Create Dimension 8: navigation_source

1. Click **Create custom dimension**
2. Fill in:
   - **Dimension name**: `navigation_source`
   - **Scope**: **Event**
   - **Description**: `Source of navigation action`
   - **Event parameter**: `navigation_source`
3. Click **Save**

### Verification Checkpoint 1

After creating all 8 dimensions:

- [ ] Go to **Admin** > **Custom definitions** > **Custom dimensions** tab
- [ ] Verify all 8 dimensions appear in the list:
  1. variant
  2. conversion_type
  3. form_type
  4. event_type
  5. click_location
  6. package_name
  7. package_price
  8. navigation_source
- [ ] Check that Scope shows "Event" for all dimensions
- [ ] Take screenshot: `/opt/mr-dj/screenshots/ga4-custom-dimensions.png`

**Custom Dimensions Summary Table:**

| # | Dimension Name | Event Parameter | Scope | Description |
|---|---------------|-----------------|-------|-------------|
| 1 | variant | variant | Event | A/B test variant (A or B) |
| 2 | conversion_type | conversion_type | Event | Type of conversion event |
| 3 | form_type | form_type | Event | Type of form submitted |
| 4 | event_type | event_type | Event | Type of event (bruiloft, bedrijfsfeest, etc.) |
| 5 | click_location | click_location | Event | Location where click occurred |
| 6 | package_name | package_name | Event | Pricing package selected (brons, zilver, goud) |
| 7 | package_price | package_price | Event | Price of package selected |
| 8 | navigation_source | navigation_source | Event | Source of navigation action |

---

## Part 3: Conversion Events Configuration

You need to create and mark 6 conversion events. This is done in two steps:
1. First, create custom events that filter the base 'conversion' event by conversion_type
2. Then, mark each custom event as a conversion

**IMPORTANT NOTE:** Events must first appear in GA4 before you can mark them as conversions. You may need to:
- Complete GTM configuration
- Publish GTM container
- Generate test conversions on the website
- Wait 24-48 hours for events to appear in GA4

### Navigate to Events

1. In GA4, click **Admin** (gear icon bottom left)
2. In the **Property** column (middle column), click **Events**
3. You'll see a list of events (may be empty initially)

### Create Custom Event 1: form_conversion

1. Click **Create event** button (top right)
2. Click **Create** button in the popup
3. In the configuration panel:
   - **Custom event name**: `form_conversion`
   - Under **Matching conditions**, click **Add condition**
   - **Parameter**: Select `event` from first dropdown
   - **Operator**: Select `equals` from second dropdown
   - **Value**: Enter `conversion`
   - Click **Add condition** again (you need TWO conditions)
   - **Parameter**: Select `conversion_type` from first dropdown
   - **Operator**: Select `equals`
   - **Value**: Enter `form_submit`
4. Verify you have TWO conditions:
   - Condition 1: event equals conversion
   - AND Condition 2: conversion_type equals form_submit
5. Click **Create** button (top right)

### Create Custom Event 2: phone_conversion

1. Click **Create event**
2. Click **Create** in popup
3. Fill in:
   - **Custom event name**: `phone_conversion`
   - **Matching conditions**:
     - Condition 1: event equals conversion
     - AND Condition 2: conversion_type equals phone_click
4. Click **Create**

### Create Custom Event 3: quote_conversion

1. Click **Create event**
2. Click **Create** in popup
3. Fill in:
   - **Custom event name**: `quote_conversion`
   - **Matching conditions**:
     - Condition 1: event equals conversion
     - AND Condition 2: conversion_type equals quote_request
4. Click **Create**

### Create Custom Event 4: availability_conversion

1. Click **Create event**
2. Click **Create** in popup
3. Fill in:
   - **Custom event name**: `availability_conversion`
   - **Matching conditions**:
     - Condition 1: event equals conversion
     - AND Condition 2: conversion_type equals availability_check
4. Click **Create**

### Create Custom Event 5: pricing_cta_conversion

1. Click **Create event**
2. Click **Create** in popup
3. Fill in:
   - **Custom event name**: `pricing_cta_conversion`
   - **Matching conditions**:
     - Condition 1: event equals conversion
     - AND Condition 2: conversion_type equals pricing_cta
4. Click **Create**

### Create Custom Event 6: contact_nav_conversion

1. Click **Create event**
2. Click **Create** in popup
3. Fill in:
   - **Custom event name**: `contact_nav_conversion`
   - **Matching conditions**:
     - Condition 1: event equals conversion
     - AND Condition 2: conversion_type equals contact_navigation
4. Click **Create**

### Verification Checkpoint 2

- [ ] Go to **Admin** > **Events**
- [ ] Verify all 6 custom events are created:
  1. form_conversion
  2. phone_conversion
  3. quote_conversion
  4. availability_conversion
  5. pricing_cta_conversion
  6. contact_nav_conversion
- [ ] Take screenshot: `/opt/mr-dj/screenshots/ga4-custom-events-created.png`

**IMPORTANT:** These custom events won't appear in the events list immediately. They will only start appearing once:
1. The base 'conversion' events are sent from your website
2. GA4 processes the events (can take 24-48 hours)
3. The matching conditions are met

### Wait for Events to Appear

Before marking events as conversions:

1. [ ] Ensure GTM container is published
2. [ ] Visit website and perform test conversions
3. [ ] Check **Reports** > **Realtime** to see events in real-time
4. [ ] Wait 24-48 hours for events to process
5. [ ] Return to **Admin** > **Events** to verify events appear in the list

### Mark Events as Conversions

Once the custom events appear in the Events list:

1. Go to **Admin** > **Events**
2. Look for each custom event in the list
3. For each event, find the **Mark as conversion** toggle switch
4. Toggle the switch to **ON** (blue)
5. Confirm if prompted

**Mark these 6 events as conversions:**

- [ ] form_conversion - Toggle to ON
- [ ] phone_conversion - Toggle to ON
- [ ] quote_conversion - Toggle to ON
- [ ] availability_conversion - Toggle to ON
- [ ] pricing_cta_conversion - Toggle to ON
- [ ] contact_nav_conversion - Toggle to ON

### Verify Conversions

1. Go to **Admin** > **Conversions**
2. Verify all 6 conversion events appear in the list
3. Verify toggle is ON (blue) for each
4. Take screenshot: `/opt/mr-dj/screenshots/ga4-conversions-marked.png`

**Conversion Events Summary Table:**

| # | Conversion Event Name | Base Event | Conversion Type | Description |
|---|-----------------------|------------|-----------------|-------------|
| 1 | form_conversion | conversion | form_submit | Contact form submissions |
| 2 | phone_conversion | conversion | phone_click | Phone number link clicks |
| 3 | quote_conversion | conversion | quote_request | Quote request submissions |
| 4 | availability_conversion | conversion | availability_check | Date availability checks |
| 5 | pricing_cta_conversion | conversion | pricing_cta | Pricing package CTA clicks |
| 6 | contact_nav_conversion | conversion | contact_navigation | Contact navigation clicks |

---

## Part 4: Enhanced Measurement Configuration

Enhanced Measurement automatically tracks additional user interactions.

### Configure Enhanced Measurement Settings

1. Go to **Admin** > **Data streams**
2. Click on your web data stream
3. Scroll down to **Enhanced measurement** section
4. Click the **gear icon** (settings) next to Enhanced measurement
5. Review and configure settings:

**Recommended Settings:**

- [ ] **Page views**: ON (enabled by default) - Tracks pageview events
- [ ] **Scrolls**: ON - Tracks when users scroll 90% down the page
- [ ] **Outbound clicks**: ON - Tracks clicks to external domains
- [ ] **Site search**: OFF - Not applicable (no search functionality)
- [ ] **Video engagement**: OFF - Not applicable (no embedded videos)
- [ ] **File downloads**: ON - Tracks PDF, DOC, and other file downloads
- [ ] **Form interactions**: ON - Auto-tracks form starts and submissions

6. Click **Save** button
7. Take screenshot: `/opt/mr-dj/screenshots/ga4-enhanced-measurement.png`

---

## Part 5: Data Retention Configuration

Configure how long GA4 stores user-level and event-level data.

### Set Data Retention Period

1. Go to **Admin** > **Data settings** > **Data retention**
2. Review current settings:
   - **Event data retention**: This sets how long user-level and event-level data is stored
   - **Reset user data on new activity**: Resets the retention period when user returns
3. Configure:
   - [ ] **Event data retention**: Select **14 months** (maximum for free GA4)
   - [ ] **Reset user data on new activity**: Toggle **ON**
4. Click **Save**
5. Take screenshot: `/opt/mr-dj/screenshots/ga4-data-retention.png`

**Note:** Standard reports (aggregated data) are not affected by this setting. This only affects exploration reports and user-level analysis.

---

## Part 6: Google Signals Configuration

Google Signals enables cross-device tracking and additional demographic data.

### Enable Google Signals

1. Go to **Admin** > **Data settings** > **Data collection**
2. Scroll to **Google signals data collection** section
3. Click **Get Started** button
4. Read the information about Google Signals:
   - Enables cross-device reporting
   - Provides demographic and interest data
   - Requires user consent (your Cookie Consent handles this)
5. Click **Continue**
6. Review the requirements
7. Click **Activate**
8. Take screenshot: `/opt/mr-dj/screenshots/ga4-google-signals.png`

**Important:** Ensure your Cookie Consent implementation covers Google Signals data collection. The website's existing Consent Mode v2 implementation should handle this.

---

## Part 7: Reporting Identity Configuration

Configure how GA4 identifies users across sessions and devices.

### Set Reporting Identity

1. Go to **Admin** > **Data settings** > **Reporting identity**
2. Review the three options:
   - **Blended**: Uses User-ID, Google signals, Device-ID, and modeling
   - **Observed**: Uses User-ID, Google signals, and Device-ID only
   - **Device-based**: Uses Device-ID only
3. Select: **Blended** (recommended for most accurate reporting)
4. This prioritizes identifiers in this order:
   1. User-ID (if you implement user login tracking)
   2. Google signals (cross-device data)
   3. Device-ID (cookies)
   4. Modeling (ML-based estimation)
5. Click **Save**
6. Take screenshot: `/opt/mr-dj/screenshots/ga4-reporting-identity.png`

---

## Part 8: Data Filters Configuration

Create filters to exclude internal traffic from reports.

### Create Internal Traffic Filter

1. Go to **Admin** > **Data settings** > **Data filters**
2. Click **Create filter** button
3. Fill in:
   - **Filter name**: `Internal Traffic`
   - **Filter type**: Select **Internal traffic** from dropdown
4. Click **Create**
5. In the configuration screen:
   - Click **Add condition**
   - **traffic_type**: Select `equals`
   - **Value**: Enter `internal`
6. Click **Save**

**Note:** This filter needs to be paired with GTM configuration to tag internal traffic. You can also use IP address filtering.

### Alternative: IP Address Filter

If you want to filter by IP address:

1. First, find your office/home IP address: https://whatismyipaddress.com/
2. In GTM, create a new Variable:
   - Variable Type: JavaScript Variable
   - Variable Name: `traffic_type`
   - Check IP and return 'internal' if match
3. Or use GA4 IP filter (if available in your region)

### Activate Filter

1. In the Data filters list
2. Find your "Internal Traffic" filter
3. Set **Filter state** to **Testing** (to test first)
4. After verifying it works, change to **Active**
5. Click **Save**

---

## Part 9: DebugView Verification

Use DebugView to verify events are being tracked correctly in real-time.

### Access DebugView

1. In GA4, go to **Configure** in left sidebar
2. Click **DebugView**
3. DebugView will only show data if:
   - GTM Preview mode is active, OR
   - Debug mode is enabled in the data stream

### Enable Debug Mode for Your Device

1. Go to **Admin** > **Data streams**
2. Click on your web data stream
3. Scroll to **Debug mode** section
4. Click **Configure tag settings**
5. Click **Show advanced settings**
6. Enable **Send debug events** toggle

### Test in DebugView

With GTM Preview mode active (see GTM-CONFIG-COMPLETED.md):

1. Open DebugView in one browser tab
2. Open your website in another tab (with GTM Preview active)
3. Perform conversion actions on the website
4. In DebugView, verify:
   - [ ] Your device appears in the device list
   - [ ] `conversion` events appear in the event stream
   - [ ] Click on a conversion event to expand
   - [ ] Verify all event parameters are captured:
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
5. Take screenshots: `/opt/mr-dj/screenshots/ga4-debugview-conversion-event.png`

**Troubleshooting DebugView:**
- If no events appear, ensure GTM Preview is active
- Check that GA4 Configuration tag fires first
- Verify Measurement ID is correct: G-TXJLD3H2C8
- Wait a few seconds for events to appear

---

## Part 10: Audiences Configuration (Optional but Recommended)

Create audiences for remarketing and advanced analysis.

### Navigate to Audiences

1. Go to **Configure** > **Audiences** in left sidebar
2. Click **New audience** button (top right)

### Create Audience 1: Converted Users

1. Click **Create a custom audience**
2. Name: `Converted Users`
3. Click **Add new condition**
4. Select: **Event** > **event name** > **contains** > `conversion`
5. Set membership duration: **30 days** (or desired duration)
6. Click **Save**

### Create Audience 2: Form Submitters

1. Click **New audience** > **Create a custom audience**
2. Name: `Form Submitters`
3. Add conditions:
   - Condition 1: Event > event name > equals > conversion
   - AND Condition 2: Event > conversion_type > equals > form_submit
4. Membership duration: **30 days**
5. Click **Save**

### Create Audience 3: Phone Clickers

1. Click **New audience** > **Create a custom audience**
2. Name: `Phone Clickers`
3. Add conditions:
   - Condition 1: Event > event name > equals > conversion
   - AND Condition 2: Event > conversion_type > equals > phone_click
4. Membership duration: **30 days**
5. Click **Save**

### Create Audience 4: Pricing Interest

1. Click **New audience** > **Create a custom audience**
2. Name: `Pricing Package Interest`
3. Add conditions:
   - Condition 1: Event > event name > equals > conversion
   - AND Condition 2: Event > conversion_type > equals > pricing_cta
4. Membership duration: **30 days**
5. Click **Save**

### Create Audience 5: High Intent Users

1. Click **New audience** > **Create a custom audience**
2. Name: `High Intent Users`
3. Add conditions:
   - Sequence: User performed multiple conversions
   - Event 1: conversion (any type)
   - THEN Event 2: conversion (any type)
   - Within: 7 days
4. Membership duration: **30 days**
5. Click **Save**

### Verification Checkpoint 3

- [ ] Go to **Configure** > **Audiences**
- [ ] Verify all audiences are created
- [ ] Take screenshot: `/opt/mr-dj/screenshots/ga4-audiences.png`

**Audiences Summary:**

| # | Audience Name | Criteria | Purpose |
|---|---------------|----------|---------|
| 1 | Converted Users | Any conversion event | All users who converted |
| 2 | Form Submitters | conversion_type = form_submit | Users who submitted forms |
| 3 | Phone Clickers | conversion_type = phone_click | Users who clicked phone |
| 4 | Pricing Package Interest | conversion_type = pricing_cta | Users who clicked pricing |
| 5 | High Intent Users | 2+ conversions within 7 days | Highly engaged users |

---

## Part 11: Custom Reports Configuration

Create custom reports for conversion analysis.

### Navigate to Explore

1. Click **Explore** in left sidebar
2. Click **Blank** template to create a new exploration

### Create Report 1: Conversions by Variant

1. Click **Blank** exploration
2. Name: `Conversions by Variant` (click "Untitled exploration" at top)
3. In the **VARIABLES** panel on the left:
   - **Dimensions**: Click + and add:
     - variant (custom dimension)
     - conversion_type (custom dimension)
     - Date
   - **Metrics**: Click + and add:
     - Event count
     - Conversions
     - Total users
4. In the **SETTINGS** panel on the right:
   - Visualization: **Table**
   - **Rows**: Drag `variant` and `conversion_type` from Variables to Rows
   - **Values**: Drag `Event count` and `Conversions` to Values
   - **Filters**: Add filter for event name equals "conversion"
5. Click **Save** (top right)
6. Take screenshot: `/opt/mr-dj/screenshots/ga4-report-variant-conversions.png`

### Create Report 2: Package Performance

1. Click **Blank** exploration (or duplicate previous one)
2. Name: `Package Performance Analysis`
3. Variables:
   - **Dimensions**: Add:
     - package_name (custom dimension)
     - package_price (custom dimension)
     - variant (custom dimension)
   - **Metrics**: Add:
     - Event count
     - Total users
4. Settings:
   - Visualization: **Bar chart**
   - **Breakdown**: package_name
   - **Values**: Event count
   - **Filters**: Add filter:
     - conversion_type equals "pricing_cta"
5. Click **Save**
6. Take screenshot: `/opt/mr-dj/screenshots/ga4-report-package-performance.png`

### Create Report 3: Conversion Funnel

1. Click **Blank** exploration
2. Name: `Conversion Funnel Analysis`
3. In TECHNIQUES panel, select **Funnel exploration**
4. Configure funnel steps:
   - Step 1: page_view (any page)
   - Step 2: conversion (conversion_type = availability_check)
   - Step 3: conversion (conversion_type = pricing_cta)
   - Step 4: conversion (conversion_type = form_submit OR phone_click)
5. Breakdown: By variant (to compare A vs B)
6. Click **Save**

### Create Report 4: Event Type Performance

1. Click **Blank** exploration
2. Name: `Event Type Performance`
3. Variables:
   - **Dimensions**: event_type (custom dimension), variant
   - **Metrics**: Event count, Conversions
4. Settings:
   - Visualization: **Table**
   - **Rows**: event_type, variant
   - **Values**: Event count
   - **Filters**: form_type equals "contact"
5. Click **Save**

---

## Part 12: Alerts Configuration

Set up custom alerts for monitoring.

### Navigate to Custom Alerts

**Note:** As of October 2025, GA4 alerts might be in **Admin** > **Custom alerts** or you may need to use Google Analytics Intelligence or Slack/Email integrations.

### Alternative: Use Insights

1. Go to **Home** in GA4
2. GA4 automatically generates insights
3. You can pin important insights to your home dashboard
4. Check insights regularly for anomalies

### Recommended Monitoring

Set up manual monitoring schedule:

- [ ] Check conversion reports daily for first week
- [ ] Review DebugView during testing phase
- [ ] Monitor Realtime report during business hours
- [ ] Weekly review of conversion trends
- [ ] Monthly review of variant performance

---

## Part 13: Standard Reports Configuration

Configure which reports appear in your Reports section.

### Access Report Library

1. Go to **Reports** in left sidebar
2. Click **Library** at the bottom of the reports menu
3. You'll see collections and individual reports

### Customize Report Collection

1. In Library, click **Life cycle** collection
2. Review available reports
3. Enable/disable reports as needed:
   - [ ] **Acquisition overview** - ON
   - [ ] **User acquisition** - ON
   - [ ] **Traffic acquisition** - ON
   - [ ] **Engagement overview** - ON
   - [ ] **Events** - ON (important for conversion tracking)
   - [ ] **Conversions** - ON (critical!)
   - [ ] **Pages and screens** - ON
4. Click **Save**

### Create Custom Report Collection

1. In Library, click **Create new collection**
2. Name: `Conversion Tracking`
3. Add reports:
   - Events report (filtered to conversions)
   - Conversions report
   - Your custom explorations
4. Click **Save**
5. This collection now appears in your Reports menu

---

## Part 14: Integration Verification

Verify that GTM and GA4 are properly integrated.

### Verification Steps

1. [ ] GTM container GTM-NST23HJX is published
2. [ ] GA4 Configuration tag fires on all pages
3. [ ] GA4 Event tag fires on conversion events
4. [ ] All 11 Data Layer Variables are created in GTM
5. [ ] All 11 event parameters map to custom dimensions in GA4
6. [ ] Custom conversion events are created in GA4
7. [ ] Conversion events are marked as conversions

### Test End-to-End Flow

1. Open website: https://mr-dj.sevensa.nl
2. Open browser console (F12)
3. Perform a conversion (e.g., submit form)
4. Verify in console: `GA4 Conversion Tracked: {...}` message appears
5. Check GTM Debug (if Preview mode active): conversion event fires
6. Check GA4 DebugView: conversion event appears with all parameters
7. Wait 48 hours
8. Check GA4 Reports > Conversions: conversion count increases
9. Check custom dimensions: data is populated

---

## Part 15: Documentation Completion

### Configuration Summary Document

Create a summary document with:

**GA4 Property Information:**
- Property ID: G-TXJLD3H2C8
- Property Name: (from GA4 interface)
- Account: info@mr-dj.nl
- Time Zone: (from GA4 settings)
- Currency: EUR
- Industry Category: (from GA4 settings)

**Custom Dimensions Created (8):**
1. variant - Event parameter: variant
2. conversion_type - Event parameter: conversion_type
3. form_type - Event parameter: form_type
4. event_type - Event parameter: event_type
5. click_location - Event parameter: click_location
6. package_name - Event parameter: package_name
7. package_price - Event parameter: package_price
8. navigation_source - Event parameter: navigation_source

**Conversion Events Marked (6):**
1. form_conversion
2. phone_conversion
3. quote_conversion
4. availability_conversion
5. pricing_cta_conversion
6. contact_nav_conversion

**Configuration Dates:**
- GTM Container Published: ___________
- Custom Dimensions Created: ___________
- Conversion Events Marked: ___________
- First Data Received: ___________

### Screenshots Checklist

Required screenshots:
- [ ] `/opt/mr-dj/screenshots/ga4-data-stream.png`
- [ ] `/opt/mr-dj/screenshots/ga4-custom-dimensions.png`
- [ ] `/opt/mr-dj/screenshots/ga4-custom-events-created.png`
- [ ] `/opt/mr-dj/screenshots/ga4-conversions-marked.png`
- [ ] `/opt/mr-dj/screenshots/ga4-enhanced-measurement.png`
- [ ] `/opt/mr-dj/screenshots/ga4-data-retention.png`
- [ ] `/opt/mr-dj/screenshots/ga4-google-signals.png`
- [ ] `/opt/mr-dj/screenshots/ga4-reporting-identity.png`
- [ ] `/opt/mr-dj/screenshots/ga4-debugview-conversion-event.png`
- [ ] `/opt/mr-dj/screenshots/ga4-audiences.png`
- [ ] `/opt/mr-dj/screenshots/ga4-report-variant-conversions.png`
- [ ] `/opt/mr-dj/screenshots/ga4-report-package-performance.png`

---

## Part 16: Testing Plan

### Phase 1: DebugView Testing (Day 1)

Complete all tests in GTM-CONFIG-COMPLETED.md with DebugView open:

- [ ] Test 1: Form submission - Verify in DebugView
- [ ] Test 2: Phone click - Verify in DebugView
- [ ] Test 3: Pricing CTA - Verify in DebugView
- [ ] Test 4: Availability checker - Verify in DebugView
- [ ] Test 5: Contact navigation - Verify in DebugView
- [ ] Test 6: Quote request - Verify in DebugView

For each test, verify in DebugView:
- Event appears with correct name
- All parameters are captured
- Custom dimensions are populated
- No errors in event details

### Phase 2: Real-Time Reporting (Day 1-2)

1. [ ] Go to **Reports** > **Realtime**
2. [ ] Perform conversions on website
3. [ ] Verify events appear in Realtime report
4. [ ] Check event count increases
5. [ ] Verify users appear in user count

### Phase 3: Standard Reporting (Day 2-3)

After 24-48 hours:

1. [ ] Go to **Reports** > **Events**
2. [ ] Verify 'conversion' event appears with count > 0
3. [ ] Go to **Reports** > **Conversions**
4. [ ] Verify all 6 conversion events appear
5. [ ] Check conversion counts for each type

### Phase 4: Custom Dimension Verification (Day 2-3)

1. [ ] Go to **Explore** > Your custom reports
2. [ ] Open "Conversions by Variant" report
3. [ ] Verify data is populated with:
   - Variant A and B data
   - Different conversion_type values
   - Event counts
4. [ ] Open "Package Performance" report
5. [ ] Verify package names and prices appear

### Phase 5: Conversion Funnel Analysis (Week 1)

After 7 days of data collection:

1. [ ] Review conversion funnel report
2. [ ] Identify drop-off points
3. [ ] Compare variant A vs B performance
4. [ ] Document findings

---

## Part 17: Ongoing Monitoring

### Daily Checks (First Week)

- [ ] Check Realtime report for live conversions
- [ ] Review DebugView for any error events
- [ ] Monitor browser console for JavaScript errors
- [ ] Verify conversion counts are reasonable

### Weekly Reviews

- [ ] Review Conversions report
- [ ] Compare week-over-week trends
- [ ] Analyze variant performance
- [ ] Review package CTA performance
- [ ] Check custom dimension data quality

### Monthly Analysis

- [ ] Full conversion funnel analysis
- [ ] A/B test results review
- [ ] Package pricing performance
- [ ] Event type preferences
- [ ] Form completion rates
- [ ] Phone click rates
- [ ] Overall conversion rate trends

---

## Troubleshooting Guide

### Issue 1: Custom Dimensions Show "(not set)"

**Possible Causes:**
- Event parameter names don't match exactly (case-sensitive)
- GTM Data Layer Variables not created correctly
- GA4 tag not including event parameters
- Need to wait 24-48 hours for dimension data to process

**Solutions:**
1. Verify event parameter names in GTM match GA4 custom dimension names
2. Check GTM tag configuration includes all parameters
3. Test in DebugView to see actual parameter values
4. Wait 24-48 hours after first events are sent

### Issue 2: Events Not Appearing in GA4

**Possible Causes:**
- GTM container not published
- GA4 Measurement ID incorrect
- Ad blockers interfering
- Events not firing from website

**Solutions:**
1. Verify GTM container is published (not in draft)
2. Check Measurement ID is G-TXJLD3H2C8
3. Test in incognito mode with ad blockers disabled
4. Check GTM Preview shows events firing
5. Verify browser console shows no errors

### Issue 3: Conversion Toggle Not Appearing

**Possible Causes:**
- Events haven't reached GA4 yet
- Custom events not configured correctly
- Need to wait for event processing

**Solutions:**
1. Wait 24-48 hours after first events are sent
2. Check that base 'conversion' events appear in Events report
3. Verify custom event matching conditions are correct
4. Test in DebugView to ensure events are being sent

### Issue 4: DebugView Empty

**Possible Causes:**
- GTM Preview mode not active
- Debug mode not enabled
- Wrong GA4 property selected

**Solutions:**
1. Enable GTM Preview mode first
2. Ensure you're viewing correct GA4 property
3. Check that device appears in DebugView device list
4. Perform actions on website to trigger events

### Issue 5: Variant Data Not Splitting

**Possible Causes:**
- All users seeing same variant
- Variant assignment not working
- Variant parameter not being sent

**Solutions:**
1. Check variant assignment logic in code
2. Verify dataLayer.push includes variant parameter
3. Test in different browsers/incognito windows
4. Check localStorage for variant value
5. Review variant assignment code in useABTest hook

---

## Configuration Completion Checklist

### All Sections Complete

- [ ] Part 1: Access and Verify GA4 Property
- [ ] Part 2: Custom Dimensions (8 dimensions created)
- [ ] Part 3: Conversion Events (6 conversions marked)
- [ ] Part 4: Enhanced Measurement configured
- [ ] Part 5: Data Retention set to 14 months
- [ ] Part 6: Google Signals enabled
- [ ] Part 7: Reporting Identity set to Blended
- [ ] Part 8: Data Filters created
- [ ] Part 9: DebugView verification complete
- [ ] Part 10: Audiences created (5 audiences)
- [ ] Part 11: Custom Reports created (4 reports)
- [ ] Part 12: Monitoring plan established
- [ ] Part 13: Standard Reports configured
- [ ] Part 14: Integration verified
- [ ] Part 15: Documentation complete
- [ ] Part 16: Testing plan executed
- [ ] Part 17: Ongoing monitoring scheduled

---

## Quick Reference

### Key URLs
- GA4 Property: https://analytics.google.com/ (select G-TXJLD3H2C8)
- GTM Container: https://tagmanager.google.com/ (select GTM-NST23HJX)
- Website: https://mr-dj.sevensa.nl

### Key IDs
- GA4 Measurement ID: G-TXJLD3H2C8
- GTM Container ID: GTM-NST23HJX
- Account: info@mr-dj.nl

### Custom Dimensions (8)
1. variant
2. conversion_type
3. form_type
4. event_type
5. click_location
6. package_name
7. package_price
8. navigation_source

### Conversion Events (6)
1. form_conversion
2. phone_conversion
3. quote_conversion
4. availability_conversion
5. pricing_cta_conversion
6. contact_nav_conversion

### Conversion Types Tracked
- form_submit
- phone_click
- quote_request
- availability_check
- pricing_cta
- contact_navigation

---

## Next Steps After Configuration

1. [ ] Wait 48 hours for initial data to populate
2. [ ] Review first week of conversion data
3. [ ] Analyze A/B test variant performance
4. [ ] Identify top-performing packages
5. [ ] Review form completion rates
6. [ ] Compare phone vs form conversions
7. [ ] Create weekly reports for stakeholders
8. [ ] Schedule monthly analytics review meetings
9. [ ] Plan optimizations based on data
10. [ ] Consider additional tracking needs

---

## Support Resources

- **GA4 Help Center**: https://support.google.com/analytics/
- **GTM Help Center**: https://support.google.com/tagmanager/
- **GA4 Community**: https://www.en.advertisercommunity.com/
- **Project Documentation**: `/opt/mr-dj/ga4-conversion-setup.md`
- **GTM Setup Guide**: `/opt/mr-dj/GTM-SETUP-GUIDE.md`
- **GA4 Checklist**: `/opt/mr-dj/GA4-CONFIG-CHECKLIST.md`
- **Testing Plan**: `/opt/mr-dj/GA4-TESTING-PLAN.md`

---

## Configuration Status

**Status**: MANUAL CONFIGURATION REQUIRED

This document provides complete step-by-step instructions for manual GA4 configuration. Browser automation is not possible, so these steps must be completed manually by someone with access to:
- Google Analytics 4 property G-TXJLD3H2C8
- Editor or Administrator role
- Account email: info@mr-dj.nl or authorized admin

**Estimated Time**:
- Custom Dimensions: 20 minutes
- Conversion Events: 30 minutes (+ 24-48 hours wait time)
- Additional Configuration: 45 minutes
- Testing and Verification: 60 minutes
- **Total**: ~2.5 hours active time + 24-48 hours processing time

---

**Configuration Complete!**

Once all steps are completed, your GA4 property will be fully configured for comprehensive conversion tracking, A/B testing analysis, and business insights.

Last Updated: October 19, 2025
