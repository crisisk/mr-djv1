# A/B Testing Quick Start Guide

Get the A/B testing framework up and running in 10 minutes.

## Prerequisites

- PostgreSQL database configured
- Node.js backend running
- React frontend setup
- Environment variables configured

## Step 1: Run Setup Script (2 minutes)

```bash
cd /srv/apps/mr-djv1/backend

# Set database URL if not already set
export DATABASE_URL="postgresql://user:password@localhost:5432/mrdj"

# Run setup script
node src/scripts/setup-ab-testing.js
```

This will:
- Create all necessary database tables
- Set up indexes and triggers
- Create a sample test
- Verify everything works

## Step 2: Configure Environment (1 minute)

Add to `/srv/apps/mr-djv1/backend/.env`:

```bash
# Optional: Google Analytics 4 integration
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_secret_here

# Optional: Custom webhook for analytics
ANALYTICS_WEBHOOK_URL=https://your-webhook.com/ab-tests

# Optional: Debug mode
ANALYTICS_DEBUG=false
```

## Step 3: Register API Routes (2 minutes)

Edit `/srv/apps/mr-djv1/backend/src/routes/index.js`:

```javascript
const express = require('express');
const router = express.Router();

// Existing routes
const healthRoutes = require('./health');
const contactRoutes = require('./contact');
// ... other routes

// ADD THIS:
const abTestingRoutes = require('./abTesting');

// Register routes
router.use('/health', healthRoutes);
router.use('/contact', contactRoutes);
// ... other routes

// ADD THIS:
router.use('/ab-tests', abTestingRoutes);

module.exports = router;
```

If you need to pass the database connection:

```javascript
// In your main app.js or server.js
const abTestingRoutes = require('./routes/abTesting');

app.use((req, res, next) => {
  req.db = pool; // or your database connection
  next();
});

app.use('/api', routes);
```

## Step 4: Restart Backend (1 minute)

```bash
# If using npm
npm restart

# If using PM2
pm2 restart mr-dj-backend

# If using Docker
docker-compose restart backend
```

## Step 5: Test API (1 minute)

```bash
# Test 1: Get active tests
curl http://localhost:3000/api/ab-tests/active

# Test 2: Get test details
curl http://localhost:3000/api/ab-tests/hero-image-001

# Test 3: Assign variant
curl "http://localhost:3000/api/ab-tests/hero-image-001/assign?sessionId=test123"
```

Expected responses: All should return JSON with `"success": true`

## Step 6: Activate Your First Test (1 minute)

```bash
# Activate the sample test
curl -X POST http://localhost:3000/api/ab-tests/hero-image-001/activate
```

## Step 7: Integrate in Frontend (2 minutes)

Create or edit your hero section component:

```jsx
// src/components/HeroSection.jsx
import React from 'react';
import { useABTest } from '../hooks/useABTest';

function HeroSection() {
  const { variant, trackConversion, isLoading } = useABTest('hero-image-001');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!variant) {
    // Fallback if test not active
    return (
      <div className="hero">
        <img src="/media/photos/default-hero.jpg" alt="DJ Setup" />
      </div>
    );
  }

  return (
    <div className="hero">
      <img
        src={variant.asset_url}
        alt={variant.config?.alt_text || 'DJ Setup'}
        loading={variant.config?.loading || 'eager'}
      />
      <button
        onClick={() => {
          // Track conversion when goal is achieved
          trackConversion('contact_form_submit');
          // Then open contact form
          openContactForm();
        }}
      >
        Contact Us
      </button>
    </div>
  );
}

export default HeroSection;
```

## Step 8: Deploy and Monitor

### Deploy
```bash
# Build frontend
npm run build

# Deploy (your deployment process)
./deploy.sh
```

### Monitor Results

Check results after collecting data:

```bash
# View current results
curl http://localhost:3000/api/ab-tests/hero-image-001/results
```

Expected output:
```json
{
  "success": true,
  "results": {
    "test_id": "hero-image-001",
    "status": "active",
    "results": [
      {
        "variant_id": "A",
        "impressions": 150,
        "conversions": 5,
        "conversion_rate": 0.0333,
        "is_significant": false
      },
      {
        "variant_id": "B",
        "impressions": 148,
        "conversions": 8,
        "conversion_rate": 0.0541,
        "is_significant": false,
        "uplift_vs_control": 62.16
      }
    ]
  }
}
```

## Verification Checklist

- [ ] Database tables created (7 tables)
- [ ] API endpoints responding
- [ ] Sample test created and activated
- [ ] Frontend hook imported and working
- [ ] Impressions being tracked
- [ ] Conversions being tracked
- [ ] Results viewable via API

## Common Issues

### Issue: "Database connection not available"

**Fix:** Ensure database connection is passed to routes:

```javascript
app.use((req, res, next) => {
  req.db = pool;
  next();
});
```

### Issue: "Test not found"

**Fix:** Make sure test is activated:

```bash
curl -X POST http://localhost:3000/api/ab-tests/hero-image-001/activate
```

### Issue: Frontend hook not found

**Fix:** Make sure hook file exists:

```bash
ls -la /srv/apps/mr-djv1/mr-dj-eds-components/src/hooks/useABTest.js
```

### Issue: No data being tracked

**Fix:** Enable debug mode:

```javascript
const { variant } = useABTest('hero-image-001', { debug: true });
```

Check browser console for logs.

## Next Steps

1. **Create Your Own Test**: Copy `example-hero-test.json` and customize
2. **Set Up Analytics**: Configure GA4 for deeper insights
3. **Build Dashboard**: Create admin UI to manage tests
4. **Add More Tests**: Test CTAs, pricing, testimonials
5. **Read Full Docs**: See `/docs/AB-TESTING-CONFIGURATION.md`

## Quick Reference

### Create New Test (API)

```bash
curl -X POST http://localhost:3000/api/ab-tests \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "my-test",
    "name": "My Test",
    "type": "image",
    "goal": "contact_form_submit",
    "minSampleSize": 100
  }'
```

### Add Variant

```bash
curl -X POST http://localhost:3000/api/ab-tests/my-test/variants \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "A",
    "name": "Control",
    "assetUrl": "/image.jpg",
    "assetType": "image",
    "weight": 50,
    "isControl": true
  }'
```

### Frontend Usage

```jsx
const { variant, trackConversion } = useABTest('my-test');

// Use variant
<img src={variant?.asset_url} />

// Track conversion
trackConversion('my_goal');
```

## Support

- Full Documentation: `/docs/AB-TESTING-CONFIGURATION.md`
- Test Configurations: `/content/ab-tests/variants.json`
- Example Test: `/content/ab-tests/example-hero-test.json`

---

**Setup Time**: ~10 minutes
**Ready to Test**: Immediately after activation
**Minimum Data Needed**: 100 impressions per variant (configurable)
