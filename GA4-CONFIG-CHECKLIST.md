# GA4 Configuration Checklist
## Mr. DJ Website - Step-by-Step GA4 Setup

**Date:** October 2025
**GA4 Measurement ID:** G-TXJLD3H2C8
**GTM Container:** GTM-NST23HJX
**Website:** mr-dj.sevensa.nl

---

## Overview

This checklist guides you through configuring Google Analytics 4 for the Mr. DJ website. Complete each section in order, checking off items as you go.

**Estimated Time:** 60-90 minutes

**Prerequisites:**
- Access to GA4 property (G-TXJLD3H2C8)
- GTM container configured (see GTM-SETUP-GUIDE.md)
- Website with tracking code deployed

---

## Section 1: GA4 Property Access

### [ ] 1.1 Access Your GA4 Property

- [ ] Navigate to https://analytics.google.com/
- [ ] Sign in with account: info@mr-dj.nl (or your admin account)
- [ ] Select the correct GA4 property
- [ ] Verify Measurement ID is: **G-TXJLD3H2C8**

**If you don't have access:**
- Contact the GA4 property owner
- Request Editor or Administrator role
- Wait for invitation email

### [ ] 1.2 Verify Data Stream

- [ ] Go to **Admin** (bottom left)
- [ ] Under Property column, click **Data Streams**
- [ ] Verify web data stream exists for your website
- [ ] Click on the data stream
- [ ] Verify **Stream URL** matches your website
- [ ] Confirm **Measurement ID:** G-TXJLD3H2C8

---

## Section 2: Custom Dimensions Setup

Custom dimensions allow you to segment and analyze conversion data by specific attributes.

### Required Custom Dimensions

You need to create **8 custom dimensions**. Follow these steps for each dimension:

### [ ] 2.1 Navigate to Custom Definitions

- [ ] In GA4, go to **Admin** (bottom left gear icon)
- [ ] Under **Property** column, click **Custom definitions**
- [ ] Click **Custom dimensions** tab
- [ ] Click **Create custom dimension** button

### [ ] 2.2 Create Dimension: variant

- [ ] Click **Create custom dimension**
- [ ] **Dimension name:** `variant`
- [ ] **Scope:** Event
- [ ] **Description:** `A/B test variant (A or B)`
- [ ] **Event parameter:** `variant` (must match exactly)
- [ ] Click **Save**

### [ ] 2.3 Create Dimension: conversion_type

- [ ] **Dimension name:** `conversion_type`
- [ ] **Scope:** Event
- [ ] **Description:** `Type of conversion event`
- [ ] **Event parameter:** `conversion_type`
- [ ] Click **Save**

### [ ] 2.4 Create Dimension: form_type

- [ ] **Dimension name:** `form_type`
- [ ] **Scope:** Event
- [ ] **Description:** `Type of form submitted`
- [ ] **Event parameter:** `form_type`
- [ ] Click **Save**

### [ ] 2.5 Create Dimension: event_type

- [ ] **Dimension name:** `event_type`
- [ ] **Scope:** Event
- [ ] **Description:** `Type of event (bruiloft, bedrijfsfeest, etc.)`
- [ ] **Event parameter:** `event_type`
- [ ] Click **Save**

### [ ] 2.6 Create Dimension: click_location

- [ ] **Dimension name:** `click_location`
- [ ] **Scope:** Event
- [ ] **Description:** `Location where click occurred`
- [ ] **Event parameter:** `click_location`
- [ ] Click **Save**

### [ ] 2.7 Create Dimension: package_name

- [ ] **Dimension name:** `package_name`
- [ ] **Scope:** Event
- [ ] **Description:** `Pricing package selected (brons, zilver, goud)`
- [ ] **Event parameter:** `package_name`
- [ ] Click **Save**

### [ ] 2.8 Create Dimension: package_price

- [ ] **Dimension name:** `package_price`
- [ ] **Scope:** Event
- [ ] **Description:** `Price of package selected`
- [ ] **Event parameter:** `package_price`
- [ ] Click **Save**

### [ ] 2.9 Create Dimension: navigation_source

- [ ] **Dimension name:** `navigation_source`
- [ ] **Scope:** Event
- [ ] **Description:** `Source of navigation action`
- [ ] **Event parameter:** `navigation_source`
- [ ] Click **Save**

### [ ] 2.10 Verify All Dimensions Created

- [ ] Go to **Admin > Custom definitions > Custom dimensions**
- [ ] Verify you see all 8 dimensions in the list
- [ ] Take a screenshot for your records

**Custom Dimensions Summary:**

| # | Dimension Name | Event Parameter | Scope |
|---|---------------|-----------------|-------|
| 1 | variant | variant | Event |
| 2 | conversion_type | conversion_type | Event |
| 3 | form_type | form_type | Event |
| 4 | event_type | event_type | Event |
| 5 | click_location | click_location | Event |
| 6 | package_name | package_name | Event |
| 7 | package_price | package_price | Event |
| 8 | navigation_source | navigation_source | Event |

---

## Section 3: Conversion Events Setup

Mark specific events as conversions to track them in conversion reports.

### [ ] 3.1 Navigate to Events

- [ ] In GA4, go to **Admin** (bottom left)
- [ ] Under **Property** column, click **Events**
- [ ] You'll see a list of events (this will be empty initially)

**Note:** You need to wait for actual conversion events to be sent before you can mark them as conversions. The events must appear in GA4 first.

### [ ] 3.2 Test and Wait for Events

Before creating conversion events, you need to:

1. [ ] Complete GTM setup (see GTM-SETUP-GUIDE.md)
2. [ ] Publish GTM container
3. [ ] Test conversion tracking on website
4. [ ] Wait 24-48 hours for events to appear in GA4

### [ ] 3.3 Method 1: Mark Existing Events as Conversions

Once events appear in the Events list:

- [ ] Go to **Admin > Events**
- [ ] Find event name: `conversion`
- [ ] Toggle **Mark as conversion** switch to ON
- [ ] Confirm when prompted

**This marks ALL conversion events as conversions**, but you can't segment by conversion_type in the conversion report.

### [ ] 3.4 Method 2: Create Custom Conversion Events (Recommended)

For better reporting, create separate conversion events:

#### Create Conversion Event: form_conversion

- [ ] Go to **Admin > Events**
- [ ] Click **Create event** button
- [ ] **Custom event name:** `form_conversion`
- [ ] Click **Create**
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `form_submit`
- [ ] Click **Create**
- [ ] Wait for event to process (can take 24-48 hours)
- [ ] Return to Events list and toggle **Mark as conversion** for `form_conversion`

#### Create Conversion Event: phone_conversion

- [ ] Click **Create event**
- [ ] **Custom event name:** `phone_conversion`
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `phone_click`
- [ ] Click **Create**
- [ ] Mark as conversion once it appears

#### Create Conversion Event: quote_conversion

- [ ] Click **Create event**
- [ ] **Custom event name:** `quote_conversion`
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `quote_request`
- [ ] Click **Create**
- [ ] Mark as conversion once it appears

#### Create Conversion Event: availability_conversion

- [ ] Click **Create event**
- [ ] **Custom event name:** `availability_conversion`
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `availability_check`
- [ ] Click **Create**
- [ ] Mark as conversion once it appears

#### Create Conversion Event: pricing_cta_conversion

- [ ] Click **Create event**
- [ ] **Custom event name:** `pricing_cta_conversion`
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `pricing_cta`
- [ ] Click **Create**
- [ ] Mark as conversion once it appears

#### Create Conversion Event: contact_nav_conversion

- [ ] Click **Create event**
- [ ] **Custom event name:** `contact_nav_conversion`
- [ ] **Matching conditions:**
  - Condition 1: `event` | equals | `conversion`
  - AND Condition 2: `conversion_type` | equals | `contact_navigation`
- [ ] Click **Create**
- [ ] Mark as conversion once it appears

### [ ] 3.5 Verify Conversions List

- [ ] Go to **Admin > Conversions**
- [ ] Verify all 6 conversion events appear:
  - [ ] form_conversion
  - [ ] phone_conversion
  - [ ] quote_conversion
  - [ ] availability_conversion
  - [ ] pricing_cta_conversion
  - [ ] contact_nav_conversion
- [ ] Verify toggle is ON (blue) for each

---

## Section 4: Enhanced Measurement

Enhanced Measurement tracks additional user interactions automatically.

### [ ] 4.1 Configure Enhanced Measurement

- [ ] Go to **Admin > Data Streams**
- [ ] Click on your web data stream
- [ ] Scroll to **Enhanced measurement**
- [ ] Click the gear icon to configure
- [ ] Recommended settings:
  - [ ] **Page views:** ON (auto-enabled)
  - [ ] **Scrolls:** ON (track 90% scroll depth)
  - [ ] **Outbound clicks:** ON
  - [ ] **Site search:** OFF (not using search)
  - [ ] **Video engagement:** OFF (no embedded videos)
  - [ ] **File downloads:** ON (track PDF downloads)
  - [ ] **Form interactions:** ON (auto form tracking)
- [ ] Click **Save**

---

## Section 5: Data Filters

### [ ] 5.1 Create Internal Traffic Filter

To exclude your own traffic from analytics:

- [ ] Go to **Admin > Data filters** (under Property)
- [ ] Click **Create filter**
- [ ] **Filter name:** `Internal Traffic`
- [ ] **Filter type:** Internal traffic
- [ ] Click **Create**
- [ ] Click **Add condition**
- [ ] **IP address:** Enter your office IP address
- [ ] **IP match type:** equals
- [ ] Click **Save**

### [ ] 5.2 Enable Developer Traffic Filter

- [ ] In Data filters list
- [ ] Find filter named "Developer Traffic" (default filter)
- [ ] Set **Filter state** to **Active**
- [ ] Click **Save**

---

## Section 6: User Properties (Optional)

User properties track user-level attributes across sessions.

### [ ] 6.1 Create User Property: user_variant

If you want to track A/B test variant at user level:

- [ ] Go to **Admin > Custom definitions**
- [ ] Click **Custom dimensions** tab
- [ ] Click **Create custom dimension**
- [ ] **Dimension name:** `user_variant`
- [ ] **Scope:** User
- [ ] **Description:** `User's assigned A/B test variant`
- [ ] **User property:** `user_variant`
- [ ] Click **Save**

**Note:** This requires updating trackConversion.js to also set user properties.

---

## Section 7: Data Retention

Configure how long GA4 stores user-level data.

### [ ] 7.1 Set Data Retention Period

- [ ] Go to **Admin > Data retention** (under Property)
- [ ] **User data retention:** Select **14 months** (maximum for free tier)
- [ ] **Reset on new activity:** Toggle ON
- [ ] Click **Save**

---

## Section 8: Google Signals

Enable Google Signals for cross-device tracking (requires user consent).

### [ ] 8.1 Enable Google Signals

- [ ] Go to **Admin > Data collection** (under Property)
- [ ] Click **Get Started** under Google signals
- [ ] Review requirements
- [ ] Click **Continue**
- [ ] Click **Activate**

**Note:** Ensure your Cookie Consent implementation covers Google Signals.

---

## Section 9: Reporting Identity

Configure how GA4 identifies users across sessions.

### [ ] 9.1 Configure Reporting Identity

- [ ] Go to **Admin > Reporting identity** (under Property)
- [ ] **Reporting identity:** Select **Blended** (recommended)
- [ ] This uses:
  1. User-ID (if set)
  2. Google signals (if enabled)
  3. Device-ID (fallback)
- [ ] Click **Save**

---

## Section 10: Audiences (Optional but Recommended)

Create audiences for remarketing and analysis.

### [ ] 10.1 Create Audience: Converted Users

- [ ] Go to **Admin > Audiences** (under Property)
- [ ] Click **New audience**
- [ ] Click **Create a custom audience**
- [ ] **Audience name:** `Converted Users`
- [ ] Add condition: Event name | contains | `conversion`
- [ ] Click **Save**

### [ ] 10.2 Create Audience: Form Submitters

- [ ] Create custom audience
- [ ] **Audience name:** `Form Submitters`
- [ ] Add conditions:
  - Event name = `conversion`
  - conversion_type = `form_submit`
- [ ] Click **Save**

### [ ] 10.3 Create Audience: Phone Clickers

- [ ] Create custom audience
- [ ] **Audience name:** `Phone Clickers`
- [ ] Add conditions:
  - Event name = `conversion`
  - conversion_type = `phone_click`
- [ ] Click **Save**

---

## Section 11: Goals and KPIs

### [ ] 11.1 Document Your Goals

Define what success looks like:

- [ ] **Primary Goal:** Total conversions per month: ______
- [ ] **Secondary Goal:** Form submissions per week: ______
- [ ] **Tertiary Goal:** Phone clicks per week: ______
- [ ] **Conversion Rate Target:** _____% of visitors
- [ ] **Cost Per Conversion Target:** € _______

---

## Section 12: Reports Configuration

### [ ] 12.1 Configure Life Cycle Reports

- [ ] Go to **Reports** in left sidebar
- [ ] Click **Library** at bottom
- [ ] Browse available report templates
- [ ] Publish relevant reports to your workspace

Recommended reports:
- [ ] User acquisition
- [ ] Traffic acquisition
- [ ] Engagement overview
- [ ] Events report
- [ ] Conversions report
- [ ] Pages and screens

### [ ] 12.2 Create Custom Report: Conversion by Variant

- [ ] Go to **Explore** in left sidebar
- [ ] Click **Blank** template
- [ ] Name: `Conversions by Variant`
- [ ] **Dimensions:** Add `variant`, `conversion_type`
- [ ] **Metrics:** Add `Event count`, `Conversions`
- [ ] **Visualization:** Table
- [ ] Drag dimensions and metrics to build report
- [ ] Click **Save**

### [ ] 12.3 Create Custom Report: Package Performance

- [ ] Create blank exploration
- [ ] Name: `Package Performance`
- [ ] **Dimensions:** Add `package_name`, `package_price`
- [ ] **Metrics:** Add `Event count`
- [ ] **Filters:** Add filter for `conversion_type` equals `pricing_cta`
- [ ] **Visualization:** Bar chart
- [ ] Click **Save**

---

## Section 13: Alerts

Set up custom alerts to notify you of issues or opportunities.

### [ ] 13.1 Create Alert: Conversion Drop

- [ ] Go to **Admin > Custom alerts** (under Property)
- [ ] Click **Create alert**
- [ ] **Alert name:** `Conversion Drop`
- [ ] **Apply to:** All data
- [ ] **Condition:** Conversions | Decreases by more than | 50% | Compared to previous day
- [ ] **How to notify:** Email
- [ ] **Recipients:** info@mr-dj.nl
- [ ] Click **Save**

### [ ] 13.2 Create Alert: Conversion Spike

- [ ] Create alert
- [ ] **Alert name:** `Conversion Spike`
- [ ] **Condition:** Conversions | Increases by more than | 100% | Compared to previous day
- [ ] **How to notify:** Email
- [ ] Click **Save**

---

## Section 14: Verification

### [ ] 14.1 Verify DebugView

- [ ] Go to **Admin > DebugView**
- [ ] Open your website in another tab
- [ ] Perform a test conversion (e.g., submit form)
- [ ] In DebugView, verify:
  - [ ] `conversion` event appears
  - [ ] All parameters are captured (click event to expand)
  - [ ] Custom dimensions are populated
- [ ] Take screenshot for records

### [ ] 14.2 Verify Real-Time Report

- [ ] Go to **Reports > Realtime**
- [ ] Open website in another tab
- [ ] Navigate through pages
- [ ] Perform conversions
- [ ] In Realtime report, verify:
  - [ ] User count increases
  - [ ] Events appear in event list
  - [ ] Conversions show up
- [ ] Take screenshot

### [ ] 14.3 Wait for Data Processing

- [ ] Mark calendar for 48 hours from now
- [ ] After 48 hours, check:
  - [ ] Go to **Reports > Events**
  - [ ] Verify `conversion` event appears with event count > 0
  - [ ] Go to **Reports > Conversions**
  - [ ] Verify conversion events appear
  - [ ] Go to **Explore** > Your custom reports
  - [ ] Verify data is populated

---

## Section 15: Integration with GTM

### [ ] 15.1 Verify GTM Integration

- [ ] Confirm GTM container is published
- [ ] Verify GA4 Configuration tag fires on all pages
- [ ] Verify GA4 Event tag fires on conversion events
- [ ] Check that all Data Layer Variables are created in GTM

See `/opt/mr-dj/GTM-SETUP-GUIDE.md` for detailed instructions.

---

## Section 16: Documentation

### [ ] 16.1 Document Your Setup

Create a document recording:

- [ ] GA4 Measurement ID: G-TXJLD3H2C8
- [ ] GTM Container ID: GTM-NST23HJX
- [ ] Date custom dimensions created: __________
- [ ] Date conversion events marked: __________
- [ ] Date GTM container published: __________
- [ ] Admin users with access: __________
- [ ] Any custom configuration notes: __________

### [ ] 16.2 Save This Checklist

- [ ] Save completed checklist to your records
- [ ] Store screenshots of:
  - Custom dimensions list
  - Conversion events list
  - DebugView verification
  - First conversion data

---

## Section 17: Training and Handoff

### [ ] 17.1 Team Training

- [ ] Schedule GA4 training session with team
- [ ] Share access to GA4 property
- [ ] Review key reports and how to read them
- [ ] Demonstrate how to check conversion data
- [ ] Explain custom dimensions and their meaning

### [ ] 17.2 Create Quick Reference

- [ ] Print or bookmark key GA4 reports URLs
- [ ] Create cheat sheet for team:
  - How to access conversion data
  - How to filter by variant
  - How to read package performance
  - How to check daily conversion numbers

---

## Completion Checklist

### [ ] All Sections Complete

- [ ] Section 1: GA4 Property Access
- [ ] Section 2: Custom Dimensions (8 dimensions)
- [ ] Section 3: Conversion Events (6 conversions)
- [ ] Section 4: Enhanced Measurement
- [ ] Section 5: Data Filters
- [ ] Section 6: User Properties (optional)
- [ ] Section 7: Data Retention
- [ ] Section 8: Google Signals
- [ ] Section 9: Reporting Identity
- [ ] Section 10: Audiences (optional)
- [ ] Section 11: Goals and KPIs
- [ ] Section 12: Reports Configuration
- [ ] Section 13: Alerts
- [ ] Section 14: Verification
- [ ] Section 15: GTM Integration
- [ ] Section 16: Documentation
- [ ] Section 17: Training

---

## Quick Reference: What You Created

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

### Custom Reports (2+)
1. Conversions by Variant
2. Package Performance
3. (Any additional reports you created)

### Audiences (3)
1. Converted Users
2. Form Submitters
3. Phone Clickers

### Alerts (2)
1. Conversion Drop
2. Conversion Spike

---

## Troubleshooting

### Events Not Appearing in GA4

If events don't appear in GA4 after 48 hours:

1. [ ] Check GTM Preview mode - verify events fire
2. [ ] Verify GA4 Configuration tag has correct Measurement ID
3. [ ] Check browser console for errors
4. [ ] Verify dataLayer is defined and populated
5. [ ] Try clearing cache and testing in incognito mode
6. [ ] Check GA4 DebugView with GTM Preview active

### Custom Dimensions Not Populating

If custom dimensions show "(not set)":

1. [ ] Verify event parameter names match exactly (case-sensitive)
2. [ ] Check GTM Data Layer Variables are created correctly
3. [ ] Verify GA4 tag includes event parameters
4. [ ] Wait 24-48 hours for dimension data to process
5. [ ] Test with DebugView to see parameter values

### Conversions Not Marked

If conversion toggle doesn't appear:

1. [ ] Wait for events to appear in Events list (24-48 hours)
2. [ ] Verify events are firing (check DebugView)
3. [ ] Ensure GTM container is published
4. [ ] Check that event name matches exactly

---

## Next Steps

After completing this checklist:

1. [ ] Read `/opt/mr-dj/GA4-TESTING-PLAN.md`
2. [ ] Perform comprehensive testing (see testing plan)
3. [ ] Monitor data for 7 days
4. [ ] Schedule weekly review meetings
5. [ ] Set up automated reporting (weekly email summaries)
6. [ ] Plan A/B tests using variant dimension

---

## Support

If you encounter issues:

- **GA4 Help:** https://support.google.com/analytics/
- **GTM Help:** https://support.google.com/tagmanager/
- **Community Forum:** https://www.en.advertisercommunity.com/
- **Project Docs:** `/opt/mr-dj/ga4-conversion-setup.md`

---

**Configuration Complete!**

Congratulations! Your GA4 property is now fully configured for conversion tracking.

Last Updated: October 19, 2025
