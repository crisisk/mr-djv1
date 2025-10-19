# A/B Testing Implementation - Auto-CRO Traffic Splitting

## Overview
Automatic 50/50 A/B testing traffic splitting with cookie persistence for the Mr. DJ website. This implementation ensures consistent user experience across sessions while allowing for automatic variant assignment and manual overrides.

## Implementation Date
October 19, 2025

## Files Created/Modified

### Created Files
1. `/opt/mr-dj/mr-dj-eds-components/src/utils/abTesting.js`
   - Core A/B testing utility functions
   - Cookie management (get, set)
   - Variant assignment logic
   - GTM integration

2. `/opt/mr-dj/mr-dj-eds-components/src/utils/abTesting.test.js`
   - Test suite for A/B testing logic
   - Can be run in browser console: `window.runABTests()`

### Modified Files
1. `/opt/mr-dj/mr-dj-eds-components/src/App.jsx`
   - Imported `getOrAssignVariant` and `pushVariantToGTM` from utils
   - Added `useEffect` hook to handle variant assignment on app mount
   - Replaced manual `getVariant()` function with automatic assignment
   - Added GTM dataLayer push for `ab_test_assigned` event

## Features Implemented

### 1. Automatic Variant Assignment
- **50/50 Split**: Math.random() < 0.5 determines variant A or B
- **First Visit**: On first visit without cookie, automatically assigns a variant
- **No URL Parameter Required**: Works seamlessly without ?variant=B

### 2. Cookie Persistence
- **Cookie Name**: `mr_dj_ab_variant`
- **Values**: "A" or "B"
- **Expiration**: 30 days
- **Path**: "/" (site-wide)
- **Consistent Experience**: Same variant across all pages and sessions

### 3. Manual Override Support
- **URL Parameter**: `?variant=B` or `?variant=A`
- **Priority**: URL parameter takes precedence over cookie
- **Cookie Update**: Manual override updates the cookie for future visits

### 4. GTM Integration
- **Event**: `ab_test_assigned`
- **Data**:
  - `variant`: "A" or "B"
  - `ab_test_name`: "contact_form_optimization"
  - `timestamp`: ISO 8601 format
- **Trigger**: Fires once on app mount via useEffect

### 5. Existing Integration
- **ContactForm.jsx**: Already has variant support (line 15, 148, 297)
- **GTM Tracking**: Form submissions track `form_variant` (line 129)

## How It Works

### Variant Assignment Logic
```javascript
1. Check URL parameter (?variant=B or ?variant=A)
   └─> If present: Use URL variant and store in cookie
2. Check cookie (mr_dj_ab_variant)
   └─> If valid (A or B): Use cookie variant
3. Assign randomly (Math.random() < 0.5)
   └─> Store in cookie for 30 days
```

### Flow Diagram
```
User First Visit
      │
      ├─> Has ?variant in URL?
      │   ├─> YES: Use URL variant → Store in cookie
      │   └─> NO: Continue
      │
      ├─> Has valid cookie?
      │   ├─> YES: Use cookie variant
      │   └─> NO: Continue
      │
      └─> Assign random variant (50/50)
          └─> Store in cookie (30 days)
          └─> Push to GTM dataLayer
```

## GTM DataLayer Events

### 1. ab_test_assigned (New)
Pushed when variant is assigned on page load.

```javascript
{
  event: 'ab_test_assigned',
  variant: 'A' or 'B',
  ab_test_name: 'contact_form_optimization',
  timestamp: '2025-10-19T06:56:00.000Z'
}
```

### 2. contact_form_submit (Existing)
Pushed when contact form is submitted.

```javascript
{
  event: 'contact_form_submit',
  form_variant: 'A' or 'B',
  event_type: 'bruiloft' | 'bedrijfsfeest' | etc.
}
```

## Testing

### Browser Console Testing
1. Open browser console on Mr. DJ website
2. Run: `window.runABTests()`
3. Observe test results for:
   - Cookie set/get functionality
   - Random assignment distribution
   - Cookie persistence across calls
   - URL override functionality

### Manual Testing Scenarios

#### Scenario 1: First Visit (No Cookie)
1. Clear cookies for mr-dj.nl
2. Visit homepage
3. **Expected**: Random variant assigned, cookie created
4. Check cookie: `document.cookie` should contain `mr_dj_ab_variant=A` or `B`
5. Navigate to another page
6. **Expected**: Same variant persists

#### Scenario 2: Return Visit (With Cookie)
1. Visit site with existing cookie
2. **Expected**: Same variant as before
3. Check console: "A/B Test Variant Assigned: [A/B]"

#### Scenario 3: Manual Override
1. Visit: `https://mr-dj.nl/?variant=B`
2. **Expected**: Variant B forced, cookie updated to B
3. Navigate to another page without parameter
4. **Expected**: Variant B persists (from cookie)

#### Scenario 4: GTM Tracking
1. Open browser console → Network tab
2. Filter by "collect" or "gtm"
3. Visit homepage
4. **Expected**: GTM event with `ab_test_assigned` and variant

### Cookie Verification
```javascript
// In browser console:
// Get current variant
document.cookie.split('; ').find(row => row.startsWith('mr_dj_ab_variant='))?.split('=')[1]

// Clear cookie (for testing)
document.cookie = 'mr_dj_ab_variant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
```

## Build Verification
```bash
cd /opt/mr-dj/mr-dj-eds-components
npm run build
```

**Status**: ✅ Build successful (verified October 19, 2025)

## Code Quality

### Documentation
- ✅ Comprehensive JSDoc comments
- ✅ Inline code comments explaining logic
- ✅ Clear function naming

### Best Practices
- ✅ Separation of concerns (utility file)
- ✅ Cookie expiration handling
- ✅ URL parameter validation
- ✅ GTM dataLayer initialization check
- ✅ Console logging for debugging

### Security Considerations
- ✅ Cookie path restricted to "/" (site-wide only)
- ✅ No sensitive data in cookies
- ✅ Input validation for variant values
- ✅ Safe cookie parsing with error handling

## Future Enhancements

### Potential Improvements
1. **Multi-variate Testing**: Support more than 2 variants (A, B, C, D)
2. **Weighted Distribution**: Allow custom traffic splits (e.g., 70/30)
3. **User Segmentation**: Different variants for different user segments
4. **Analytics Dashboard**: Real-time A/B test results visualization
5. **Automatic Winner Detection**: Statistical significance calculation
6. **Variant Exclusion**: Exclude certain pages from A/B testing

### Code Refactoring Ideas
1. TypeScript conversion for type safety
2. Unit tests with Jest or Vitest
3. Integration tests with Playwright or Cypress
4. React Context for variant state management
5. Server-side variant assignment (if moving to SSR)

## Troubleshooting

### Issue: Variant Not Persisting
**Cause**: Cookie not being set properly
**Solution**: Check browser cookie settings, ensure cookies are enabled

### Issue: GTM Event Not Firing
**Cause**: GTM not initialized or dataLayer not available
**Solution**: Check GTM container is loaded, verify dataLayer exists

### Issue: Manual Override Not Working
**Cause**: URL parameter typo or incorrect value
**Solution**: Ensure parameter is `?variant=A` or `?variant=B` (case-sensitive)

### Issue: Different Variants on Different Pages
**Cause**: Cookie path or domain mismatch
**Solution**: Verify cookie path is "/" and domain matches

## Support & Maintenance

### Key Contacts
- **Implementation**: Agent 7 (Auto-CRO Traffic Splitting)
- **Code Location**: `/opt/mr-dj/mr-dj-eds-components/src/utils/abTesting.js`
- **Documentation**: This file

### Monitoring Recommendations
1. Monitor GTM events in Google Analytics
2. Track conversion rates for each variant
3. Monitor cookie acceptance rates (GDPR compliance)
4. Check for JavaScript errors in production

## Success Criteria Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| Automatic 50/50 variant assignment | ✅ Complete | Math.random() implementation |
| Variant stored in cookie for 30 days | ✅ Complete | Cookie expiration set correctly |
| Same variant across page navigation | ✅ Complete | Site-wide cookie path |
| GTM receives ab_test_assigned event | ✅ Complete | Pushed via pushVariantToGTM() |
| Manual ?variant=B override works | ✅ Complete | URL parameter takes precedence |
| Code is clean and documented | ✅ Complete | JSDoc + inline comments |
| Build successful | ✅ Complete | Verified with npm run build |

---

**Status**: 🚀 Ready for Production

**Last Updated**: October 19, 2025
