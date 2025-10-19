# GA4 Tracking Architecture - Mr. DJ Website

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Mr. DJ Website (React)                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  User Interactions                         │  │
│  │  - Form Submissions                                        │  │
│  │  - Phone Clicks                                            │  │
│  │  - Pricing CTA Clicks                                      │  │
│  │  - Contact Navigation                                      │  │
│  │  - Availability Checks                                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        trackConversion.js Utility                         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ • trackFormSubmission()                            │  │  │
│  │  │ • trackPhoneClick()                                │  │  │
│  │  │ • trackPricingCTA()                                │  │  │
│  │  │ • trackAvailabilityCheck()                         │  │  │
│  │  │ • trackContactNavigation()                         │  │  │
│  │  │ • getUserVariant() / setUserVariant()              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  window.dataLayer                         │  │
│  │  {                                                        │  │
│  │    event: 'conversion',                                   │  │
│  │    conversion_type: 'form_submit',                        │  │
│  │    variant: 'A',                                          │  │
│  │    value: 1,                                              │  │
│  │    ...                                                    │  │
│  │  }                                                        │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
       ┌────────────────────────────────────┐
       │   Google Tag Manager (GTM)          │
       │   Container: GTM-NST23HJX           │
       │                                     │
       │  ┌─────────────────────────────┐   │
       │  │  Trigger: event='conversion' │   │
       │  └───────────┬─────────────────┘   │
       │              │                      │
       │              ▼                      │
       │  ┌─────────────────────────────┐   │
       │  │  GA4 Event Tag               │   │
       │  │  - Maps dataLayer params     │   │
       │  │  - Sends to GA4              │   │
       │  └───────────┬─────────────────┘   │
       └──────────────┼──────────────────────┘
                      │
                      ▼
       ┌────────────────────────────────────┐
       │   Google Analytics 4 (GA4)          │
       │   Account: info@mr-dj.nl            │
       │                                     │
       │  ┌─────────────────────────────┐   │
       │  │  Custom Dimensions:          │   │
       │  │  • variant                   │   │
       │  │  • conversion_type           │   │
       │  │  • form_type                 │   │
       │  │  • event_type                │   │
       │  │  • click_location            │   │
       │  │  • package_name              │   │
       │  │  • package_price             │   │
       │  │  • navigation_source         │   │
       │  └─────────────────────────────┘   │
       │                                     │
       │  ┌─────────────────────────────┐   │
       │  │  Conversion Events:          │   │
       │  │  • form_conversion           │   │
       │  │  • phone_conversion          │   │
       │  │  • quote_conversion          │   │
       │  │  • availability_conversion   │   │
       │  │  • pricing_cta_conversion    │   │
       │  │  • contact_nav_conversion    │   │
       │  └─────────────────────────────┘   │
       └─────────────────────────────────────┘
```

## Component Tracking Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      Website Components                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Header.jsx                                                       │
│  ├─ Phone Button (Desktop)  → trackPhoneClick('header')          │
│  ├─ Phone Button (Mobile)   → trackPhoneClick('header')          │
│  ├─ Contact Link (Desktop)  → trackContactNavigation('header')   │
│  └─ Contact Link (Mobile)   → trackContactNavigation('header')   │
│                                                                   │
│  Footer.jsx                                                       │
│  ├─ Phone Link              → trackPhoneClick('footer')          │
│  └─ Contact Link            → trackContactNavigation('footer')   │
│                                                                   │
│  ContactForm.jsx                                                  │
│  └─ Form Submit             → trackFormSubmission(variant,       │
│                                   eventType, 'contact')           │
│                                                                   │
│  PricingTables.jsx                                                │
│  ├─ Brons CTA               → trackPricingCTA(variant,           │
│  │                               'brons', '€495')                 │
│  ├─ Zilver CTA              → trackPricingCTA(variant,           │
│  │                               'zilver', '€795')                │
│  └─ Goud CTA                → trackPricingCTA(variant,           │
│                                 'goud', '€1.295')                 │
│                                                                   │
│  AvailabilityChecker.jsx                                          │
│  └─ Check Submit            → trackAvailabilityCheck(variant,    │
│                                   selectedDate)                   │
│                                                                   │
│  PhoneLink.jsx (Reusable Component)                               │
│  └─ Any Phone Link          → trackPhoneClick(variant, location) │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Action → Component Handler → trackConversion Function
                                          ↓
                                  Get Variant from Session
                                          ↓
                                  Build Event Object
                                          ↓
                              Push to window.dataLayer
                                          ↓
                                    GTM Listens
                                          ↓
                              GTM Trigger Fires (event='conversion')
                                          ↓
                                   GTM Tag Executes
                                          ↓
                        Map Data Layer Variables to GA4 Parameters
                                          ↓
                                   Send to GA4
                                          ↓
                              GA4 Receives Event
                                          ↓
                          Apply Custom Dimensions
                                          ↓
                        Check Conversion Event Rules
                                          ↓
                          Mark as Conversion (if matches)
                                          ↓
                       Store in GA4 Database
                                          ↓
                    Available in Reports & DebugView
```

## Conversion Event Flow

```
┌──────────────────────────────────────────────────────────────┐
│ Conversion Type: form_submit                                  │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  User fills form                                               │
│       ↓                                                        │
│  Clicks Submit                                                 │
│       ↓                                                        │
│  Form validates                                                │
│       ↓                                                        │
│  API call successful                                           │
│       ↓                                                        │
│  trackFormSubmission(variant, eventType, 'contact')           │
│       ↓                                                        │
│  dataLayer.push({                                              │
│    event: 'conversion',                                        │
│    conversion_type: 'form_submit',                             │
│    form_type: 'contact',                                       │
│    variant: 'A',                                               │
│    event_type: 'bruiloft',                                     │
│    value: 1,                                                   │
│    currency: 'EUR'                                             │
│  })                                                            │
│       ↓                                                        │
│  GTM receives event                                            │
│       ↓                                                        │
│  GA4 processes                                                 │
│       ↓                                                        │
│  Marked as 'form_conversion'                                   │
│       ↓                                                        │
│  Available in reports                                          │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## A/B Testing Variant Flow

```
┌────────────────────────────────────────────────────────────┐
│ Session Start                                               │
│       ↓                                                     │
│ A/B Testing Framework Initializes                           │
│       ↓                                                     │
│ Assigns Variant (A or B)                                    │
│       ↓                                                     │
│ setUserVariant('B')                                         │
│       ↓                                                     │
│ Stores in sessionStorage                                    │
│   key: 'ab_variant'                                         │
│   value: 'B'                                                │
│       ↓                                                     │
│ Persists for entire session                                 │
│       ↓                                                     │
│ Every conversion automatically includes variant             │
│       ↓                                                     │
│ getUserVariant() → 'B'                                      │
│       ↓                                                     │
│ Included in all tracking calls                              │
│       ↓                                                     │
│ Enables segmentation in GA4                                 │
│   - Conversion rate by variant                              │
│   - Compare A vs B performance                              │
│   - Statistical significance testing                        │
└────────────────────────────────────────────────────────────┘
```

## Implementation Status Matrix

```
┌──────────────────────────┬──────────┬────────────────────────┐
│ Component                 │ Status   │ Conversion Events      │
├──────────────────────────┼──────────┼────────────────────────┤
│ trackConversion.js        │ ✓ Done   │ All 7 functions        │
│ PhoneLink.jsx             │ ✓ Done   │ phone_click            │
│ ContactForm.jsx           │ ✓ Done   │ form_submit            │
│ PricingTables.jsx         │ ✓ Done   │ pricing_cta            │
│ AvailabilityChecker.jsx   │ ✓ Done   │ availability_check     │
│ Header.jsx                │ ✓ Done   │ phone_click, contact   │
│ Footer.jsx                │ ✓ Done   │ phone_click, contact   │
├──────────────────────────┼──────────┼────────────────────────┤
│ GA4 Custom Dimensions     │ ⏳ Todo  │ 8 dimensions needed    │
│ GA4 Conversion Events     │ ⏳ Todo  │ 6 events needed        │
│ GTM Data Layer Variables  │ ⏳ Todo  │ 11 variables needed    │
│ GTM Conversion Tag        │ ⏳ Todo  │ 1 tag needed           │
│ GTM Trigger               │ ⏳ Todo  │ 1 trigger needed       │
├──────────────────────────┼──────────┼────────────────────────┤
│ Testing & Verification    │ ⏳ Todo  │ All conversion types   │
│ Page Phone Links Update   │ ⏳ Todo  │ 11 pages, 12 links     │
└──────────────────────────┴──────────┴────────────────────────┘
```

## File Structure

```
/opt/mr-dj/
│
├── ga4-conversion-setup.md           (19 KB - Complete GA4 Config Guide)
├── GA4-IMPLEMENTATION-SUMMARY.md     (16 KB - Implementation Details)
├── QUICK-REFERENCE-GA4.md            (2.7 KB - Quick Reference)
└── GA4-TRACKING-ARCHITECTURE.md      (This File - Visual Architecture)

/opt/mr-dj/mr-dj-eds-components/src/
│
├── utils/
│   └── trackConversion.js            (5.6 KB - Core tracking utility)
│
├── components/
│   ├── Atoms/
│   │   └── PhoneLink.jsx             (1.2 KB - Reusable phone component)
│   │
│   ├── Molecules/
│   │   └── Header.jsx                (✓ Modified - Added tracking)
│   │
│   └── Organisms/
│       ├── ContactForm.jsx           (✓ Modified - Added tracking)
│       ├── PricingTables.jsx         (✓ Modified - Added tracking)
│       ├── AvailabilityChecker.jsx   (✓ Modified - Added tracking)
│       └── Footer.jsx                (✓ Modified - Added tracking)
```

## Key Metrics Trackable

```
┌─────────────────────────────────────────────────────────────┐
│                    Conversion Metrics                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 Primary Conversions                                       │
│  • Total form submissions                                     │
│  • Quote requests                                             │
│  • Phone clicks                                               │
│  • Availability checks                                        │
│  • Pricing CTA clicks                                         │
│  • Contact page navigations                                   │
│                                                               │
│  🔬 A/B Testing Metrics                                       │
│  • Conversion rate by variant (A vs B)                        │
│  • Engagement rate by variant                                 │
│  • Package preference by variant                              │
│  • Form completion rate by variant                            │
│                                                               │
│  📦 Package Performance                                        │
│  • Clicks per package (Brons/Zilver/Goud)                     │
│  • Most popular package                                       │
│  • Package click-through rate                                 │
│  • Price point analysis                                       │
│                                                               │
│  📱 Channel Analysis                                           │
│  • Phone vs form conversions                                  │
│  • Header vs footer engagement                                │
│  • Mobile vs desktop conversion rate                          │
│  • Click location heatmap data                                │
│                                                               │
│  🎯 Event Type Analysis                                        │
│  • Conversions by event type (bruiloft, etc.)                 │
│  • Most requested event types                                 │
│  • Seasonal trends                                            │
│                                                               │
│  🔄 Funnel Analysis                                            │
│  • Page view → Contact interaction                            │
│  • Contact interaction → Phone/Form                           │
│  • Pricing view → CTA click                                   │
│  • Availability check → Form submit                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

```
Current State:                    After GA4 Config:
┌──────────────┐                 ┌──────────────┐
│   Website    │                 │   Website    │
│    (React)   │                 │    (React)   │
└──────┬───────┘                 └──────┬───────┘
       │                                │
       │ trackConversion.js             │ trackConversion.js
       │ ✓ Implemented                  │ ✓ Implemented
       │                                │
       ▼                                ▼
┌──────────────┐                 ┌──────────────┐
│  dataLayer   │                 │  dataLayer   │
│ ✓ Configured │                 │ ✓ Configured │
└──────┬───────┘                 └──────┬───────┘
       │                                │
       │ Events pushed                  │ Events pushed
       │                                │
       ▼                                ▼
┌──────────────┐                 ┌──────────────┐
│     GTM      │                 │     GTM      │
│ ⏳ Config    │  ────────────>  │ ✓ Configured │
│    Pending   │                 │   Variables  │
└──────┬───────┘                 │   Tags       │
       │                         │   Triggers   │
       │                         └──────┬───────┘
       ▼                                │
┌──────────────┐                        │
│     GA4      │                        ▼
│ ⏳ Setup     │  ────────────>  ┌──────────────┐
│    Pending   │                 │     GA4      │
└──────────────┘                 │ ✓ Configured │
                                 │   Dimensions │
                                 │   Events     │
                                 │   Reports    │
                                 └──────────────┘
```

## Quick Start Guide

1. **Complete GA4 Setup** (1 hour)
   ```
   Follow: /opt/mr-dj/ga4-conversion-setup.md
   Section 4: GA4 Manual Configuration
   Section 6: GTM Tag Configuration
   ```

2. **Test Implementation** (30 min)
   ```
   - Enable GTM Preview
   - Test each conversion type
   - Verify in GA4 DebugView
   ```

3. **Monitor & Optimize** (Ongoing)
   ```
   - Check GA4 reports daily
   - Analyze conversion rates
   - Compare variant performance
   - Adjust strategy based on data
   ```

---

**Visual Architecture Guide Complete**
All diagrams and flow charts for GA4 implementation.
