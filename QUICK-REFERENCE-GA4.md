# GA4 Conversion Tracking - Quick Reference Card

## Import Tracking Functions

```javascript
import {
  trackFormSubmission,
  trackPhoneClick,
  trackQuoteRequest,
  trackAvailabilityCheck,
  trackPricingCTA,
  trackContactNavigation,
  trackWhatsAppClick,
  setUserVariant,
  getUserVariant
} from './utils/trackConversion';
```

## Quick Usage Examples

### Track Form Submission
```javascript
const variant = getUserVariant();
trackFormSubmission(variant, 'bruiloft', 'contact');
```

### Track Phone Click
```javascript
const variant = getUserVariant();
trackPhoneClick(variant, 'contact_page');
```

### Track Pricing CTA
```javascript
const variant = getUserVariant();
trackPricingCTA(variant, 'zilver', '€795');
```

### Track Contact Navigation
```javascript
const variant = getUserVariant();
trackContactNavigation(variant, 'hero_section');
```

### Set A/B Variant
```javascript
setUserVariant('B'); // Call when A/B test initializes
```

## PhoneLink Component

```javascript
import PhoneLink from './components/Atoms/PhoneLink';

<PhoneLink
  phoneNumber="+31408422594"
  displayText="040-8422594"
  location="my_page"
  className="text-blue-500"
/>
```

## Event Structure

```javascript
{
  event: 'conversion',
  conversion_type: 'TYPE',
  variant: 'A' | 'B',
  // Additional params...
  value: 1,
  currency: 'EUR',
  timestamp: 'ISO_8601'
}
```

## Conversion Types

| Type | Use Case |
|------|----------|
| form_submit | Contact forms |
| phone_click | Phone links |
| quote_request | Quote forms |
| availability_check | Date checker |
| pricing_cta | Package buttons |
| contact_navigation | Contact page links |
| whatsapp_click | WhatsApp button |

## GA4 Custom Dimensions

1. variant
2. conversion_type
3. form_type
4. event_type
5. click_location
6. package_name
7. package_price
8. navigation_source

## GTM Setup Checklist

- [ ] Create Data Layer Variables (11 total)
- [ ] Create GA4 Event Tag
- [ ] Create Trigger (event = 'conversion')
- [ ] Test in Preview Mode
- [ ] Publish Container

## Testing Commands

```javascript
// Check dataLayer in console
console.log(window.dataLayer);

// Get current variant
console.log(sessionStorage.getItem('ab_variant'));

// Set variant manually for testing
sessionStorage.setItem('ab_variant', 'B');
```

## Files Reference

| File | Path |
|------|------|
| Tracking Utility | /opt/mr-dj/mr-dj-eds-components/src/utils/trackConversion.js |
| PhoneLink Component | /opt/mr-dj/mr-dj-eds-components/src/components/Atoms/PhoneLink.jsx |
| Full Documentation | /opt/mr-dj/ga4-conversion-setup.md |
| Implementation Summary | /opt/mr-dj/GA4-IMPLEMENTATION-SUMMARY.md |

## Support

Full documentation: `/opt/mr-dj/ga4-conversion-setup.md`
