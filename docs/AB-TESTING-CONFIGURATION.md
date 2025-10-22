# A/B Testing Framework Configuration Guide

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Quick Start](#quick-start)
4. [Creating a New Test](#creating-a-new-test)
5. [Variant Types](#variant-types)
6. [Statistical Methodology](#statistical-methodology)
7. [API Reference](#api-reference)
8. [Frontend Integration](#frontend-integration)
9. [Best Practices](#best-practices)
10. [Example Configurations](#example-configurations)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

The Mr. DJ A/B Testing Framework is an intelligent system that automatically tests multiple variants of content and selects winners based on statistical significance. It includes:

- **Automated Winner Selection**: Chi-square statistical testing with configurable confidence levels
- **Consistent User Bucketing**: Hash-based assignment ensures users always see the same variant
- **Real-time Analytics**: Integration with Google Analytics 4 and custom webhooks
- **Multiple Test Types**: Support for images, videos, text, components, and layouts
- **Conversion Tracking**: Track impressions, conversions, and custom funnel steps

---

## System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React Hook)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│   API Layer     │◄────►│  A/B Test        │
│   (Express)     │      │  Service         │
└────────┬────────┘      └──────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│   Database      │      │  Analytics       │
│   (PostgreSQL)  │      │  Integration     │
└─────────────────┘      └──────────────────┘
                                 │
                                 ▼
                         ┌──────────────────┐
                         │  GA4 / Webhooks  │
                         └──────────────────┘
```

### Components

1. **Database Layer** (`/backend/src/migrations/create_ab_testing_tables.sql`)
   - Stores tests, variants, impressions, conversions, and results
   - 7 main tables with optimized indexes

2. **Service Layer** (`/backend/src/services/abTestingService.js`)
   - Core business logic for variant assignment
   - Statistical significance calculation
   - Automated winner selection

3. **Analytics Integration** (`/backend/src/services/analyticsIntegration.js`)
   - Google Analytics 4 Measurement Protocol
   - Custom webhook support
   - Event tracking

4. **API Layer** (`/backend/src/routes/abTesting.js`)
   - RESTful endpoints for test management
   - Impression and conversion tracking
   - Results retrieval

5. **Frontend Hook** (`/mr-dj-eds-components/src/hooks/useABTest.js`)
   - React integration
   - Automatic impression tracking
   - Conversion tracking helpers

6. **Configuration** (`/content/ab-tests/variants.json`)
   - Centralized test definitions
   - Variant configurations

---

## Quick Start

### 1. Database Setup

Run the migration to create necessary tables:

```bash
cd /srv/apps/mr-djv1/backend
psql $DATABASE_URL -f src/migrations/create_ab_testing_tables.sql
```

### 2. Environment Variables

Add to your `.env` file:

```bash
# Google Analytics 4 (Optional)
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret

# Custom Analytics Webhook (Optional)
ANALYTICS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ab-tests

# Debug Mode
ANALYTICS_DEBUG=false
```

### 3. Register API Routes

In `/backend/src/routes/index.js`, add:

```javascript
const abTestingRoutes = require('./abTesting');
router.use('/ab-tests', abTestingRoutes);
```

### 4. Use in Frontend

```jsx
import { useABTest } from '../hooks/useABTest';

function HeroSection() {
  const { variant, trackConversion, isLoading } = useABTest('hero-image-001');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <img
        src={variant?.asset_url}
        alt={variant?.config?.alt_text}
      />
      <button onClick={() => trackConversion('contact_form_submit')}>
        Contact Us
      </button>
    </div>
  );
}
```

---

## Creating a New Test

### Method 1: Using the Configuration File

Add to `/content/ab-tests/variants.json`:

```json
{
  "tests": {
    "my-new-test": {
      "id": "my-new-test",
      "name": "My New Test",
      "description": "Test description",
      "type": "image",
      "status": "draft",
      "goal": "contact_form_submit",
      "min_sample_size": 100,
      "confidence_level": 0.95,
      "traffic_allocation": 1.0,
      "variants": [
        {
          "id": "A",
          "name": "Control",
          "asset": "/path/to/control.jpg",
          "weight": 50,
          "is_control": true
        },
        {
          "id": "B",
          "name": "Variant",
          "asset": "/path/to/variant.jpg",
          "weight": 50,
          "is_control": false
        }
      ]
    }
  }
}
```

Then create via API:

```bash
curl -X POST http://localhost:3000/api/ab-tests \
  -H "Content-Type: application/json" \
  -d @content/ab-tests/variants.json
```

### Method 2: Direct API Creation

```bash
# Create test
curl -X POST http://localhost:3000/api/ab-tests \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "my-test-001",
    "name": "My First Test",
    "description": "Testing hero images",
    "type": "image",
    "goal": "contact_form_submit",
    "minSampleSize": 100,
    "confidenceLevel": 0.95
  }'

# Add variant A (control)
curl -X POST http://localhost:3000/api/ab-tests/my-test-001/variants \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "A",
    "name": "Control Image",
    "assetUrl": "/media/photos/control.jpg",
    "assetType": "image",
    "weight": 50,
    "isControl": true
  }'

# Add variant B
curl -X POST http://localhost:3000/api/ab-tests/my-test-001/variants \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "B",
    "name": "Test Image",
    "assetUrl": "/media/photos/variant.jpg",
    "assetType": "image",
    "weight": 50,
    "isControl": false
  }'

# Activate test
curl -X POST http://localhost:3000/api/ab-tests/my-test-001/activate
```

---

## Variant Types

### 1. Image Variants

Test different images to see which drives more conversions.

```json
{
  "type": "image",
  "variants": [
    {
      "id": "A",
      "asset": "/media/photos/wedding-scene.jpg",
      "asset_type": "image",
      "config": {
        "alt_text": "Wedding DJ setup",
        "loading": "eager",
        "sizes": "(max-width: 768px) 100vw, 1920px"
      }
    }
  ]
}
```

**Use Case**: Hero images, testimonial photos, gallery images

### 2. Video Variants

Test video vs static content or different video types.

```json
{
  "type": "video",
  "variants": [
    {
      "id": "A",
      "asset": "/media/videos/testimonial-1.mp4",
      "asset_type": "video",
      "config": {
        "poster": "/media/videos/poster-1.jpg",
        "autoplay": false,
        "loop": false,
        "muted": true
      }
    }
  ]
}
```

**Use Case**: Testimonial videos, promotional content, event highlights

### 3. Text Variants

Test different copy, headlines, or CTA button text.

```json
{
  "type": "text",
  "variants": [
    {
      "id": "A",
      "asset": "Boek Nu Je DJ",
      "asset_type": "text",
      "config": {
        "element": "button",
        "class": "cta-primary"
      }
    },
    {
      "id": "B",
      "asset": "Gratis Vrijblijvend Gesprek",
      "asset_type": "text"
    }
  ]
}
```

**Use Case**: CTA buttons, headlines, value propositions

### 4. Component Variants

Test entirely different component implementations.

```json
{
  "type": "component",
  "variants": [
    {
      "id": "A",
      "asset": "TestimonialCards",
      "asset_type": "component",
      "config": {
        "component": "TestimonialCards",
        "props": {
          "format": "text",
          "count": 6,
          "layout": "grid"
        }
      }
    },
    {
      "id": "B",
      "asset": "TestimonialVideos",
      "asset_type": "component",
      "config": {
        "component": "TestimonialVideos",
        "props": {
          "format": "video",
          "count": 3,
          "layout": "carousel"
        }
      }
    }
  ]
}
```

**Use Case**: Different UI patterns, layout changes, feature variations

### 5. Layout Variants

Test different page layouts or structural changes.

```json
{
  "type": "layout",
  "variants": [
    {
      "id": "A",
      "asset": "traditional-layout",
      "config": {
        "sidebar": true,
        "columns": 2
      }
    },
    {
      "id": "B",
      "asset": "modern-layout",
      "config": {
        "sidebar": false,
        "columns": 1
      }
    }
  ]
}
```

**Use Case**: Page structure, navigation patterns, content organization

---

## Statistical Methodology

### Chi-Square Test

The framework uses the **Chi-square test** to determine statistical significance between variants.

#### Formula

```
χ² = Σ [(Observed - Expected)² / Expected]
```

#### Calculation Process

1. **Collect Data**: Impressions and conversions for each variant
2. **Calculate Expected Values**: Based on null hypothesis (no difference)
3. **Compute Chi-Square Statistic**: Using the formula above
4. **Determine P-Value**: Convert chi-square to probability
5. **Check Significance**: Compare p-value to (1 - confidence_level)

#### Confidence Levels

- **95% (0.95)**: Standard for most tests (recommended)
- **90% (0.90)**: Faster results, less certainty
- **99% (0.99)**: Higher certainty, requires more data

### Minimum Sample Size

Each variant must reach the minimum sample size before winner selection:

- **Default**: 100 impressions per variant
- **Recommended for small tests**: 100-200
- **Recommended for high-impact tests**: 200-500

### Automated Winner Selection

The system automatically declares a winner when:

1. ✅ All variants reach minimum sample size
2. ✅ Test has been running for at least 7 days (configurable)
3. ✅ Chi-square test shows statistical significance
4. ✅ One variant has positive uplift vs control

### Confidence Intervals

Wilson score intervals provide a range estimate for the true conversion rate:

```
CI = (p + z²/2n ± z√(p(1-p)/n + z²/4n²)) / (1 + z²/n)
```

Where:
- p = conversion rate
- n = sample size
- z = z-score for confidence level (1.96 for 95%)

---

## API Reference

### Get Active Tests

```http
GET /api/ab-tests/active
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "tests": [
    {
      "test_id": "hero-image-001",
      "name": "Hero Image Test",
      "status": "active",
      "variants": [...]
    }
  ]
}
```

### Get Test Details

```http
GET /api/ab-tests/:testId
```

**Response:**
```json
{
  "success": true,
  "test": {
    "test_id": "hero-image-001",
    "name": "Hero Image Test",
    "type": "image",
    "status": "active",
    "goal": "contact_form_submit",
    "variants": [...]
  }
}
```

### Assign Variant

```http
GET /api/ab-tests/:testId/assign?userId=123&sessionId=abc
```

**Response:**
```json
{
  "success": true,
  "testId": "hero-image-001",
  "variantId": "B",
  "variant": {
    "variant_id": "B",
    "name": "Party Image",
    "asset_url": "/media/photos/party.jpg",
    "config": {...}
  }
}
```

### Track Impression

```http
POST /api/ab-tests/impression
Content-Type: application/json

{
  "testId": "hero-image-001",
  "variantId": "B",
  "userId": "user123",
  "sessionId": "session456",
  "pageUrl": "https://mrdj.nl/",
  "deviceType": "desktop",
  "browser": "Chrome"
}
```

### Track Conversion

```http
POST /api/ab-tests/conversion
Content-Type: application/json

{
  "testId": "hero-image-001",
  "variantId": "B",
  "userId": "user123",
  "sessionId": "session456",
  "conversionType": "contact_form_submit",
  "conversionValue": 0
}
```

### Get Results

```http
GET /api/ab-tests/:testId/results
```

**Response:**
```json
{
  "success": true,
  "results": {
    "test_id": "hero-image-001",
    "status": "active",
    "results": [
      {
        "variant_id": "A",
        "impressions": 1250,
        "conversions": 45,
        "conversion_rate": 0.036,
        "is_significant": false,
        "uplift_vs_control": 0
      },
      {
        "variant_id": "B",
        "impressions": 1280,
        "conversions": 62,
        "conversion_rate": 0.0484,
        "is_significant": true,
        "uplift_vs_control": 34.44,
        "p_value": 0.0234
      }
    ]
  }
}
```

### Declare Winner

```http
POST /api/ab-tests/:testId/declare-winner
Content-Type: application/json

{
  "variantId": "B"
}
```

---

## Frontend Integration

### Basic Usage

```jsx
import { useABTest } from '../hooks/useABTest';

function MyComponent() {
  const { variant, trackConversion, isLoading } = useABTest('hero-image-001');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <img src={variant?.asset_url} alt="Hero" />
      <button onClick={() => trackConversion('button_click')}>
        Click Me
      </button>
    </div>
  );
}
```

### Advanced Usage with Options

```jsx
const { variant, trackConversion } = useABTest('hero-image-001', {
  enabled: true,                    // Enable/disable test
  autoTrackImpression: true,        // Auto-track when variant loads
  debug: true,                      // Console logging
  onVariantAssigned: (variant) => {
    console.log('Assigned to:', variant);
  },
  onConversion: (data) => {
    console.log('Conversion tracked:', data);
  }
});
```

### Manual Impression Tracking

```jsx
const { variant, trackImpression } = useABTest('hero-image-001', {
  autoTrackImpression: false
});

useEffect(() => {
  // Track impression only when user scrolls to element
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      trackImpression();
    }
  });

  observer.observe(elementRef.current);
}, [trackImpression]);
```

### Multiple Tests

```jsx
import { useABTests } from '../hooks/useABTest';

function MyPage() {
  const { tests, isLoading } = useABTests([
    'hero-image-001',
    'cta-button-text',
    'pricing-display-001'
  ]);

  // Access individual test variants
  const heroVariant = tests['hero-image-001']?.variantId;
}
```

### Component Variant Testing

```jsx
const { variant } = useABTest('testimonial-format-001');

return (
  <div>
    {variant?.config?.component === 'TestimonialCards' && (
      <TestimonialCards {...variant.config.props} />
    )}
    {variant?.config?.component === 'TestimonialVideos' && (
      <TestimonialVideos {...variant.config.props} />
    )}
  </div>
);
```

---

## Best Practices

### 1. Test Design

✅ **DO:**
- Test one variable at a time (isolated changes)
- Run tests for at least 7 days to account for weekly patterns
- Use minimum sample size of 100-200 per variant
- Define clear, measurable goals
- Document your hypothesis

❌ **DON'T:**
- Test multiple variables simultaneously
- End tests too early (statistical flukes)
- Use tiny sample sizes
- Make decisions based on partial data

### 2. Sample Size Calculation

Use this formula to estimate required sample size:

```
n = (z² × p × (1-p)) / e²
```

Where:
- n = sample size per variant
- z = z-score (1.96 for 95% confidence)
- p = expected conversion rate
- e = margin of error (typically 0.05)

**Example**: With 5% conversion rate and 5% margin of error:
```
n = (1.96² × 0.05 × 0.95) / 0.05²
n = 73 impressions per variant
```

Add 20-30% buffer for safety.

### 3. Goal Selection

**Primary Goals** (Direct revenue/lead generation):
- `contact_form_submit`
- `booking_form_submit`
- `phone_click`
- `email_click`

**Secondary Goals** (Engagement):
- `gallery_view`
- `package_view`
- `video_play`
- `scroll_depth_75`

### 4. Traffic Allocation

- **1.0 (100%)**: All users in test - fastest results
- **0.5 (50%)**: Half of users - safer for risky changes
- **0.1 (10%)**: Small sample - for major changes

### 5. Variant Naming

Use clear, descriptive names:

✅ **GOOD:**
- `wedding-scene-elegant`
- `party-scene-energetic`
- `cta-direct-action`
- `cta-free-consultation`

❌ **BAD:**
- `variant-a`
- `test-1`
- `new-version`

### 6. Statistical Significance

Don't end tests early! Wait until:

1. Minimum sample size reached (all variants)
2. At least 7 days of data
3. Statistical significance achieved (p < 0.05 for 95% confidence)
4. Results are consistent across multiple days

### 7. Winner Implementation

When test concludes:

1. Review results dashboard
2. Verify winner has sustained performance
3. Update production with winning variant
4. Archive test in configuration
5. Document learnings
6. Plan follow-up tests

---

## Example Configurations

### Example 1: Hero Image Test

**Goal**: Increase contact form submissions

```json
{
  "id": "hero-wedding-vs-party",
  "name": "Hero Image: Wedding vs Party",
  "type": "image",
  "goal": "contact_form_submit",
  "min_sample_size": 150,
  "variants": [
    {
      "id": "A",
      "name": "Wedding Scene (Control)",
      "asset": "/media/photos/wedding-elegant.jpg",
      "is_control": true,
      "weight": 50
    },
    {
      "id": "B",
      "name": "Party Scene",
      "asset": "/media/photos/party-energetic.jpg",
      "is_control": false,
      "weight": 50
    }
  ]
}
```

### Example 2: CTA Button Text Test

**Goal**: Increase booking form interactions

```json
{
  "id": "cta-button-wording",
  "name": "CTA Button Text Optimization",
  "type": "text",
  "goal": "booking_form_open",
  "min_sample_size": 200,
  "variants": [
    {
      "id": "A",
      "asset": "Boek Nu",
      "is_control": true,
      "weight": 33
    },
    {
      "id": "B",
      "asset": "Gratis Gesprek",
      "weight": 33
    },
    {
      "id": "C",
      "asset": "Check Beschikbaarheid",
      "weight": 34
    }
  ]
}
```

### Example 3: Pricing Display Strategy

**Goal**: Increase contact form quality

```json
{
  "id": "pricing-strategy-test",
  "name": "Pricing Display: Price vs Quote",
  "type": "layout",
  "goal": "contact_form_submit",
  "min_sample_size": 250,
  "variants": [
    {
      "id": "A",
      "name": "Show Starting Price",
      "asset": "starting-from-price",
      "is_control": true,
      "config": {
        "display_type": "starting_from",
        "show_details": true
      }
    },
    {
      "id": "B",
      "name": "Request Custom Quote",
      "asset": "custom-quote-only",
      "config": {
        "display_type": "quote_cta",
        "hide_prices": true
      }
    }
  ]
}
```

### Example 4: Testimonial Format

**Goal**: Build trust and increase conversions

```json
{
  "id": "testimonial-format-test",
  "name": "Testimonials: Text vs Video",
  "type": "component",
  "goal": "contact_form_submit",
  "min_sample_size": 200,
  "traffic_allocation": 0.5,
  "variants": [
    {
      "id": "A",
      "name": "Text Testimonials",
      "asset": "TestimonialCards",
      "is_control": true,
      "config": {
        "component": "TestimonialCards",
        "props": {
          "count": 6,
          "layout": "grid"
        }
      }
    },
    {
      "id": "B",
      "name": "Video Testimonials",
      "asset": "TestimonialVideos",
      "config": {
        "component": "TestimonialVideos",
        "props": {
          "count": 3,
          "layout": "carousel",
          "autoplay": false
        }
      }
    }
  ]
}
```

---

## Troubleshooting

### Issue: Tests not showing up

**Check:**
1. Test status is "active"
2. Traffic allocation > 0
3. API routes are registered
4. Database migration ran successfully

**Debug:**
```bash
# Check active tests
curl http://localhost:3000/api/ab-tests/active

# Check test details
curl http://localhost:3000/api/ab-tests/hero-image-001
```

### Issue: User always gets same variant

**This is expected!** The system uses consistent hashing to ensure users always see the same variant. This is correct behavior.

### Issue: No conversions tracked

**Check:**
1. `trackConversion()` is being called
2. Test ID matches active test
3. Variant is assigned before conversion
4. Network requests are succeeding

**Debug:**
```javascript
const { variant, trackConversion } = useABTest('test-id', { debug: true });

// Check console for debug logs
await trackConversion('my_goal');
```

### Issue: Winner not being auto-selected

**Requirements:**
1. All variants reach minimum sample size
2. Test running for 7+ days
3. Statistical significance achieved
4. Positive uplift exists

**Check:**
```bash
# Get results
curl http://localhost:3000/api/ab-tests/hero-image-001/results

# Check if significance is achieved
# Look for: is_significant: true, p_value < 0.05
```

### Issue: Analytics not working

**Check:**
1. Environment variables set (GA4_MEASUREMENT_ID, GA4_API_SECRET)
2. Analytics enabled in config
3. Network requests succeeding

**Test:**
```bash
# Check analytics status
curl http://localhost:3000/api/ab-tests/analytics/status
```

### Issue: Database errors

**Common causes:**
1. Migration not run
2. Database connection issues
3. Missing indexes

**Fix:**
```bash
# Re-run migration
psql $DATABASE_URL -f src/migrations/create_ab_testing_tables.sql

# Check tables exist
psql $DATABASE_URL -c "\dt ab_*"
```

---

## Advanced Topics

### Custom Conversion Values

Track monetary value with conversions:

```javascript
trackConversion('booking_submit', 500); // €500 booking
```

### Funnel Step Tracking

Track intermediate steps in conversion funnel:

```javascript
const { trackFunnelStep } = useABTest('test-id');

// User viewed pricing
trackFunnelStep('viewed_pricing', 1);

// User clicked CTA
trackFunnelStep('clicked_cta', 2);

// User started form
trackFunnelStep('started_form', 3);
```

### Server-Side Testing

For critical paths, implement server-side:

```javascript
const ABTestingService = require('./services/abTestingService');
const service = new ABTestingService(db);

app.get('/page', async (req, res) => {
  const variantId = await service.assignUserToVariant(
    'test-id',
    req.user?.id,
    req.sessionID
  );

  const variant = await getVariant('test-id', variantId);

  res.render('page', { variant });
});
```

### Multi-Armed Bandit (Future)

For dynamic allocation based on performance:

```javascript
// Coming soon
const { variant } = useABTest('test-id', {
  strategy: 'bandit',
  explorationRate: 0.1
});
```

---

## Support

For questions or issues:

1. Check this documentation
2. Review code comments
3. Check API responses for error messages
4. Enable debug mode: `useABTest('test-id', { debug: true })`

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Maintained by**: Mr. DJ Development Team
