# Intelligent A/B Testing Framework

> Automated conversion optimization system with statistical winner selection for Mr. DJ website

## Overview

The Mr. DJ A/B Testing Framework is a complete, production-ready system for testing and optimizing content across the website. It automatically tracks performance, calculates statistical significance, and declares winners when confidence thresholds are met.

### Key Features

- **Automated Winner Selection**: Chi-square statistical testing with 95% confidence
- **Consistent User Bucketing**: Hash-based assignment ensures users always see the same variant
- **Real-time Analytics**: Integration with Google Analytics 4 and custom webhooks
- **Multiple Test Types**: Images, videos, text, components, and layouts
- **Conversion Tracking**: Track impressions, conversions, and custom funnel steps
- **Production Ready**: Optimized database schema, indexes, and caching

## Project Structure

```
mr-djv1/
├── backend/
│   └── src/
│       ├── migrations/
│       │   └── create_ab_testing_tables.sql      # Database schema
│       ├── services/
│       │   ├── abTestingService.js               # Core A/B test logic
│       │   └── analyticsIntegration.js           # GA4 & webhook integration
│       ├── routes/
│       │   └── abTesting.js                      # API endpoints
│       └── scripts/
│           └── setup-ab-testing.js               # Setup automation
├── mr-dj-eds-components/
│   └── src/
│       ├── hooks/
│       │   └── useABTest.js                      # React hook
│       └── components/
│           └── ABTestHeroExample.jsx             # Example implementation
├── content/
│   └── ab-tests/
│       ├── variants.json                         # Test configurations
│       └── example-hero-test.json                # Example test
└── docs/
    ├── AB-TESTING-CONFIGURATION.md               # Full documentation
    ├── AB-TESTING-QUICKSTART.md                  # Quick setup guide
    └── AB-TESTING-README.md                      # This file
```

## Quick Start

### 1. Setup (10 minutes)

```bash
cd /srv/apps/mr-djv1/backend

# Run automated setup
node src/scripts/setup-ab-testing.js
```

This creates:
- 7 database tables
- Indexes and triggers
- Sample test configuration
- Verification tests

### 2. Configure Environment

```bash
# Add to .env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret
ANALYTICS_WEBHOOK_URL=https://your-webhook.com/ab-tests
```

### 3. Register Routes

In `backend/src/routes/index.js`:

```javascript
const abTestingRoutes = require('./abTesting');
router.use('/ab-tests', abTestingRoutes);
```

### 4. Use in Frontend

```jsx
import { useABTest } from '../hooks/useABTest';

function HeroSection() {
  const { variant, trackConversion } = useABTest('hero-image-001');

  return (
    <div>
      <img src={variant?.asset_url} alt="Hero" />
      <button onClick={() => trackConversion('contact_form_submit')}>
        Contact
      </button>
    </div>
  );
}
```

## Architecture

### Database Schema

7 tables optimized for high-traffic scenarios:

1. **ab_tests**: Test configurations and metadata
2. **ab_variants**: Variant definitions with assets
3. **ab_impressions**: User exposure tracking
4. **ab_conversions**: Goal completion tracking
5. **ab_results**: Aggregated statistics
6. **ab_user_assignments**: Consistent bucketing
7. **ab_events**: Audit log

### Service Layer

**ABTestingService** (`services/abTestingService.js`)
- Variant management
- User bucketing (hash-based)
- Statistical calculations (Chi-square)
- Automated winner selection

**AnalyticsIntegration** (`services/analyticsIntegration.js`)
- Google Analytics 4 Measurement Protocol
- Custom webhook support
- Event batching

### API Layer

RESTful endpoints (`routes/abTesting.js`):

```
GET  /api/ab-tests/active           - Get active tests
GET  /api/ab-tests/:id              - Get test details
GET  /api/ab-tests/:id/assign       - Assign user to variant
POST /api/ab-tests/impression       - Track impression
POST /api/ab-tests/conversion       - Track conversion
GET  /api/ab-tests/:id/results      - Get test results
POST /api/ab-tests/:id/declare-winner - Manually declare winner
```

### Frontend Integration

**useABTest Hook** (`hooks/useABTest.js`)
- Automatic variant assignment
- Cookie-based persistence
- Auto impression tracking
- Conversion tracking helpers
- Loading and error states

## Statistical Methodology

### Chi-Square Test

Tests statistical significance between variants:

```
χ² = Σ [(Observed - Expected)² / Expected]
```

### Confidence Levels

- **95% (0.95)**: Recommended for most tests
- **90% (0.90)**: Faster results, less certainty
- **99% (0.99)**: Maximum certainty, requires more data

### Winner Selection Criteria

Test automatically declares winner when:

1. ✅ Minimum sample size reached (all variants)
2. ✅ Test running ≥7 days
3. ✅ Statistical significance achieved (p < 0.05)
4. ✅ Positive uplift vs control exists

### Sample Size Calculation

```
n = (z² × p × (1-p)) / e²
```

Where:
- z = 1.96 (95% confidence)
- p = expected conversion rate
- e = margin of error (5%)

**Example**: 5% conversion rate → 73 impressions per variant (minimum)

## Test Types

### 1. Image Tests
Test different images (hero, gallery, testimonials)

```json
{
  "type": "image",
  "variants": [{
    "asset_url": "/media/photos/wedding.jpg"
  }]
}
```

### 2. Video Tests
Test video vs static content

```json
{
  "type": "video",
  "variants": [{
    "asset_url": "/media/videos/testimonial.mp4",
    "config": { "autoplay": false }
  }]
}
```

### 3. Text Tests
Test copy, headlines, CTAs

```json
{
  "type": "text",
  "variants": [{
    "asset": "Boek Nu Je DJ"
  }]
}
```

### 4. Component Tests
Test different UI implementations

```json
{
  "type": "component",
  "variants": [{
    "config": {
      "component": "TestimonialCards",
      "props": { "format": "text" }
    }
  }]
}
```

### 5. Layout Tests
Test structural changes

```json
{
  "type": "layout",
  "variants": [{
    "config": {
      "sidebar": true,
      "columns": 2
    }
  }]
}
```

## Usage Examples

### Basic Image Test

```jsx
const { variant, trackConversion } = useABTest('hero-image-001');

<img src={variant?.asset_url} alt={variant?.config?.alt_text} />
<button onClick={() => trackConversion('contact_form_submit')}>
  Contact
</button>
```

### Text/CTA Test

```jsx
const { variant, trackConversion } = useABTest('cta-button-text');

<button onClick={() => trackConversion('booking_form_open')}>
  {variant?.asset || 'Boek Nu'}
</button>
```

### Component Test

```jsx
const { variant } = useABTest('testimonial-format');

{variant?.config?.component === 'TestimonialCards' && (
  <TestimonialCards {...variant.config.props} />
)}
```

### Multiple Tests

```jsx
const heroTest = useABTest('hero-image-001');
const ctaTest = useABTest('cta-button-text');

<img src={heroTest.variant?.asset_url} />
<button onClick={() => heroTest.trackConversion()}>
  {ctaTest.variant?.asset}
</button>
```

### Advanced: Custom Conversion Values

```jsx
const { trackConversion } = useABTest('pricing-test');

const handleBooking = async (packagePrice) => {
  await submitBooking();
  // Track with monetary value
  trackConversion('booking_submit', packagePrice);
};
```

## API Examples

### Create Test

```bash
curl -X POST http://localhost:3000/api/ab-tests \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "hero-test-001",
    "name": "Hero Image Test",
    "type": "image",
    "goal": "contact_form_submit",
    "minSampleSize": 100,
    "confidenceLevel": 0.95
  }'
```

### Add Variants

```bash
curl -X POST http://localhost:3000/api/ab-tests/hero-test-001/variants \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "A",
    "name": "Control",
    "assetUrl": "/media/photos/wedding.jpg",
    "weight": 50,
    "isControl": true
  }'
```

### Activate Test

```bash
curl -X POST http://localhost:3000/api/ab-tests/hero-test-001/activate
```

### Get Results

```bash
curl http://localhost:3000/api/ab-tests/hero-test-001/results
```

## Best Practices

### Test Design

✅ **DO:**
- Test one variable at a time
- Run tests for at least 7 days
- Use minimum 100-200 samples per variant
- Define clear, measurable goals
- Document your hypothesis

❌ **DON'T:**
- Test multiple variables simultaneously
- End tests early
- Use tiny sample sizes
- Make decisions on partial data

### Sample Sizes

| Conversion Rate | Min Sample Size (per variant) |
|-----------------|-------------------------------|
| 1%             | 385                           |
| 2%             | 188                           |
| 5%             | 73                            |
| 10%            | 34                            |

Add 20-30% buffer for safety.

### Goal Selection

**Primary Goals** (Revenue/Leads):
- `contact_form_submit`
- `booking_form_submit`
- `phone_click`
- `email_click`

**Secondary Goals** (Engagement):
- `gallery_view`
- `package_view`
- `video_play`
- `scroll_depth_75`

### Traffic Allocation

- **100%**: All users → Fastest results
- **50%**: Half users → Safer for risky changes
- **10%**: Small sample → Major changes only

## Monitoring & Analytics

### View Results

```bash
curl http://localhost:3000/api/ab-tests/hero-image-001/results
```

Returns:
```json
{
  "results": [
    {
      "variant_id": "A",
      "impressions": 1250,
      "conversions": 45,
      "conversion_rate": 0.036,
      "is_significant": false
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
```

### Interpretation

- **is_significant**: true = Winner found at 95% confidence
- **uplift_vs_control**: % improvement over control
- **p_value**: < 0.05 = Statistically significant
- **conversion_rate**: Actual conversion percentage

### Google Analytics Integration

Events automatically sent to GA4:

- `ab_test_impression`: User sees variant
- `ab_test_conversion`: User converts
- `ab_test_winner`: Winner declared

View in GA4:
1. Events → Custom events
2. Filter by `ab_test_*`
3. Create custom reports

## Troubleshooting

### Issue: Tests not appearing

```bash
# Check test status
curl http://localhost:3000/api/ab-tests/active

# Verify test is activated
curl -X POST http://localhost:3000/api/ab-tests/test-id/activate
```

### Issue: No conversions tracked

Enable debug mode:

```jsx
const { variant } = useABTest('test-id', { debug: true });
```

Check browser console for tracking logs.

### Issue: Database errors

```bash
# Verify tables exist
psql $DATABASE_URL -c "\dt ab_*"

# Re-run migration if needed
node src/scripts/setup-ab-testing.js
```

## Performance Considerations

### Database Optimization

- Indexes on all foreign keys
- Partitioning for large impression tables (future)
- Regular aggregation of results

### Frontend Optimization

- Cookie-based caching (30 days)
- Session storage for quick lookups
- Lazy loading of analytics scripts

### API Optimization

- Connection pooling
- Query result caching
- Batch impression tracking

## Security

### Data Privacy

- No PII stored unless explicitly provided
- IP addresses hashed for privacy
- GDPR-compliant cookie consent integration
- Data retention policies configurable

### API Security

- Rate limiting on tracking endpoints
- CORS configuration
- Input validation
- SQL injection protection

## Roadmap

### Phase 1 (Current)
- ✅ Core A/B testing engine
- ✅ Statistical significance calculation
- ✅ Frontend integration
- ✅ Analytics integration

### Phase 2 (Planned)
- [ ] Admin dashboard UI
- [ ] Multi-armed bandit algorithm
- [ ] Advanced segmentation
- [ ] Automated test scheduling

### Phase 3 (Future)
- [ ] Machine learning-based optimization
- [ ] Predictive winner selection
- [ ] Multi-page funnel testing
- [ ] Personalization integration

## Support & Resources

### Documentation

- **Full Guide**: `/docs/AB-TESTING-CONFIGURATION.md`
- **Quick Start**: `/docs/AB-TESTING-QUICKSTART.md`
- **This File**: `/docs/AB-TESTING-README.md`

### Configuration Files

- **Variants**: `/content/ab-tests/variants.json`
- **Example**: `/content/ab-tests/example-hero-test.json`

### Code Files

- **Service**: `/backend/src/services/abTestingService.js`
- **Routes**: `/backend/src/routes/abTesting.js`
- **Hook**: `/mr-dj-eds-components/src/hooks/useABTest.js`
- **Example**: `/mr-dj-eds-components/src/components/ABTestHeroExample.jsx`

## License

Proprietary - Mr. DJ Internal Use Only

## Contributors

- Mr. DJ Development Team
- Built with Claude Code

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Status**: Production Ready
