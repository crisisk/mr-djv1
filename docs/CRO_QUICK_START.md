# CRO System Quick Start Guide

## 5-Minute Setup

### 1. Initialize the System

```bash
cd /srv/apps/mr-djv1/backend

# Initialize CRO data directories
node -e "
const CROOrchestrator = require('./src/services/croOrchestrator');
const orchestrator = new CROOrchestrator();
orchestrator.initialize().then(() => console.log('✓ CRO system initialized'));
"
```

### 2. Create Your First Test

```bash
# Create a test via API
curl -X POST http://localhost:3000/api/cro/tests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hero Video vs Image Test",
    "type": "hero_content",
    "targetPage": "homepage",
    "hypothesis": "Video hero increases engagement and conversions",
    "variants": [
      {
        "id": "variant_video",
        "name": "Video Hero",
        "config": {
          "type": "video",
          "asset": {
            "id": "showreel-001",
            "file": "/media/videos/hero/showreel-001.mov",
            "duration": 25
          }
        }
      },
      {
        "id": "variant_image",
        "name": "Image Hero",
        "config": {
          "type": "image",
          "asset": {
            "id": "feest-001",
            "original": "/media/photos/gallery/parties/feest-001.jpg"
          }
        }
      }
    ]
  }'
```

### 3. Track Events in Your Frontend

Add this to your website:

```javascript
// Track impression (page view)
async function trackImpression(testId, variantId) {
  await fetch('/api/cro/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_id: testId,
      variant_id: variantId,
      event_type: 'impression',
      session_id: getSessionId(),
      device_type: getDeviceType(), // 'mobile', 'tablet', 'desktop'
      city: 'Amsterdam', // from IP geolocation
      timestamp: new Date().toISOString()
    })
  });
}

// Track conversion (form submission)
async function trackConversion(testId, variantId) {
  await fetch('/api/cro/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_id: testId,
      variant_id: variantId,
      event_type: 'conversion',
      session_id: getSessionId(),
      timestamp: new Date().toISOString()
    })
  });
}

// Track engagement
async function trackEngagement(testId, variantId, eventType) {
  await fetch('/api/cro/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_id: testId,
      variant_id: variantId,
      event_type: eventType, // 'video_play', 'scroll_depth_75', etc.
      session_id: getSessionId()
    })
  });
}

// Usage example
document.addEventListener('DOMContentLoaded', () => {
  const testId = 'test_123'; // Get from active test
  const variantId = 'variant_video'; // Randomly assigned or from cookie

  // Track impression
  trackImpression(testId, variantId);

  // Track video play
  const video = document.querySelector('video');
  video?.addEventListener('play', () => {
    trackEngagement(testId, variantId, 'video_play');
  });

  // Track form submission
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', () => {
    trackConversion(testId, variantId);
  });

  // Track scroll depth
  window.addEventListener('scroll', debounce(() => {
    const scrollPercent = (window.scrollY / document.body.scrollHeight);
    if (scrollPercent >= 0.75) {
      trackEngagement(testId, variantId, 'scroll_depth_75');
    }
  }, 1000));
});
```

### 4. Run Orchestration

```bash
# Manual run
curl -X POST http://localhost:3000/api/cro/orchestrate

# Or via node
node -e "
const CROOrchestrator = require('./src/services/croOrchestrator');
const orchestrator = new CROOrchestrator();
orchestrator.orchestrate().then(result => {
  console.log('Orchestration complete:', result);
});
"
```

### 5. Check Results

```bash
# View active tests
curl http://localhost:3000/api/cro/active-tests | jq

# View overview
curl http://localhost:3000/api/cro/overview | jq

# View recommendations
curl http://localhost:3000/api/cro/recommendations | jq
```

### 6. Setup Automation

```bash
cd /srv/apps/mr-djv1/scripts/cro
./setup-cron.sh

# This sets up:
# - Hourly orchestration
# - Weekly reports (Monday 9 AM)
# - Daily ML training (2 AM)
```

## Example: Complete Frontend Integration

```javascript
// cro-tracker.js
class CROTracker {
  constructor() {
    this.apiEndpoint = '/api/cro/events';
    this.sessionId = this.getOrCreateSessionId();
    this.activeTests = new Map();
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('cro_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('cro_session_id', sessionId);
    }
    return sessionId;
  }

  async loadActiveTests() {
    const response = await fetch('/api/cro/active-tests');
    const data = await response.json();

    for (const test of data.data.tests) {
      // Check if user already has variant assignment
      let variantId = localStorage.getItem(`test_${test.id}_variant`);

      if (!variantId) {
        // Assign variant based on traffic allocation
        variantId = this.assignVariant(test);
        localStorage.setItem(`test_${test.id}_variant`, variantId);
      }

      this.activeTests.set(test.id, {
        test,
        variantId,
        tracked: false
      });
    }
  }

  assignVariant(test) {
    // Randomly assign based on traffic allocation
    const variants = Object.keys(test.variants);
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variantId of variants) {
      const allocation = parseFloat(test.variants[variantId].trafficAllocation);
      cumulative += allocation;
      if (random <= cumulative) {
        return variantId;
      }
    }

    return variants[0]; // fallback
  }

  async trackEvent(testId, variantId, eventType, metadata = {}) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: testId,
          variant_id: variantId,
          event_type: eventType,
          session_id: this.sessionId,
          device_type: this.getDeviceType(),
          city: await this.getCity(),
          timestamp: new Date().toISOString(),
          ...metadata
        })
      });
    } catch (error) {
      console.error('CRO tracking error:', error);
    }
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  async getCity() {
    // Implement IP geolocation or use existing service
    return 'Unknown';
  }

  async init() {
    await this.loadActiveTests();

    // Track impressions for all active tests
    for (const [testId, testData] of this.activeTests) {
      if (!testData.tracked) {
        await this.trackEvent(testId, testData.variantId, 'impression');
        testData.tracked = true;
      }
    }

    // Setup automatic tracking
    this.setupAutoTracking();
  }

  setupAutoTracking() {
    // Track video interactions
    document.querySelectorAll('video').forEach(video => {
      video.addEventListener('play', () => {
        this.trackAllTests('video_play');
      });

      video.addEventListener('ended', () => {
        this.trackAllTests('video_complete');
      });
    });

    // Track scroll depth
    let scrollTracked75 = false;
    let scrollTracked100 = false;

    window.addEventListener('scroll', this.debounce(() => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

      if (scrollPercent >= 0.75 && !scrollTracked75) {
        this.trackAllTests('scroll_depth_75');
        scrollTracked75 = true;
      }

      if (scrollPercent >= 0.99 && !scrollTracked100) {
        this.trackAllTests('scroll_depth_100');
        scrollTracked100 = true;
      }
    }, 500));

    // Track time on page
    setTimeout(() => {
      this.trackAllTests('time_on_page_60s');
    }, 60000);

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', () => {
        this.trackAllTests('conversion');
      });
    });

    // Track CTA clicks
    document.querySelectorAll('[data-cta]').forEach(button => {
      button.addEventListener('click', () => {
        const ctaType = button.dataset.cta; // 'phone', 'whatsapp', 'email'
        this.trackAllTests(`${ctaType}_click`);
      });
    });

    // Track gallery interactions
    document.querySelectorAll('[data-gallery-item]').forEach(item => {
      item.addEventListener('click', () => {
        this.trackAllTests('gallery_interaction');
      });
    });
  }

  trackAllTests(eventType) {
    for (const [testId, testData] of this.activeTests) {
      this.trackEvent(testId, testData.variantId, eventType);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Get variant config for rendering
  getVariantConfig(testId) {
    const testData = this.activeTests.get(testId);
    if (!testData) return null;

    const test = testData.test;
    const variantId = testData.variantId;

    return test.variants[variantId];
  }
}

// Initialize tracker
const croTracker = new CROTracker();
croTracker.init();

// Export for use in components
window.croTracker = croTracker;
```

## Viewing Results

### Dashboard URLs

- **Overview**: `http://localhost:3000/api/cro/overview`
- **Active Tests**: `http://localhost:3000/api/cro/active-tests`
- **Winners**: `http://localhost:3000/api/cro/recent-winners?limit=10`
- **Asset Performance**: `http://localhost:3000/api/cro/asset-performance`
- **Recommendations**: `http://localhost:3000/api/cro/recommendations`

### Sample Dashboard Component (React)

```jsx
import React, { useState, useEffect } from 'react';

function CRODashboard() {
  const [overview, setOverview] = useState(null);
  const [activeTests, setActiveTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [overviewRes, testsRes] = await Promise.all([
        fetch('/api/cro/overview'),
        fetch('/api/cro/active-tests')
      ]);

      const overviewData = await overviewRes.json();
      const testsData = await testsRes.json();

      setOverview(overviewData.data);
      setActiveTests(testsData.data.tests);
      setLoading(false);
    } catch (error) {
      console.error('Error loading CRO data:', error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cro-dashboard">
      <h1>CRO Intelligence Dashboard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Overall Conversion Rate</h3>
          <div className="metric-value">
            {overview.metrics.overallConversionRate}
          </div>
        </div>

        <div className="metric-card">
          <h3>Active Tests</h3>
          <div className="metric-value">
            {overview.system.activeTests}
          </div>
        </div>

        <div className="metric-card">
          <h3>Tests Completed</h3>
          <div className="metric-value">
            {overview.metrics.testsCompleted}
          </div>
        </div>

        <div className="metric-card">
          <h3>Avg Improvement</h3>
          <div className="metric-value">
            {overview.metrics.avgImprovementPerTest}
          </div>
        </div>
      </div>

      <div className="active-tests">
        <h2>Active Tests</h2>
        {activeTests.map(test => (
          <div key={test.id} className="test-card">
            <h3>{test.name}</h3>
            <p className="test-meta">
              {test.type} • {test.age} • {test.totalImpressions} impressions
            </p>

            <div className="variants">
              {Object.entries(test.variants).map(([variantId, variant]) => (
                <div key={variantId} className="variant">
                  <h4>{variant.name}</h4>
                  <div className="variant-stats">
                    <span>{variant.impressions} impressions</span>
                    <span>{variant.conversions} conversions</span>
                    <span className="conversion-rate">{variant.conversionRate}</span>
                    <span className="traffic-allocation">{variant.trafficAllocation} traffic</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CRODashboard;
```

## Testing the System

### Generate Sample Data

```bash
node -e "
const CROOrchestrator = require('./src/services/croOrchestrator');
const orchestrator = new CROOrchestrator();

async function generateSampleData() {
  // Create a test
  const test = await orchestrator.createTest({
    name: 'Sample Hero Test',
    type: 'hero_content',
    targetPage: 'homepage',
    variants: [
      { id: 'variant_a', name: 'Variant A', config: {} },
      { id: 'variant_b', name: 'Variant B', config: {} }
    ]
  });

  console.log('Test created:', test.id);

  // Generate sample events
  for (let i = 0; i < 200; i++) {
    const variantId = Math.random() > 0.5 ? 'variant_a' : 'variant_b';

    // Impression
    await orchestrator.recordEvent({
      test_id: test.id,
      variant_id: variantId,
      event_type: 'impression',
      session_id: 'session_' + i,
      device_type: Math.random() > 0.5 ? 'mobile' : 'desktop'
    });

    // Random conversion (3-5% rate)
    if (Math.random() < (variantId === 'variant_a' ? 0.03 : 0.05)) {
      await orchestrator.recordEvent({
        test_id: test.id,
        variant_id: variantId,
        event_type: 'conversion',
        session_id: 'session_' + i
      });
    }
  }

  console.log('Sample data generated!');

  // Run orchestration
  const result = await orchestrator.orchestrate();
  console.log('Orchestration result:', result);
}

generateSampleData();
"
```

## Next Steps

1. **Add More Tests**: Create tests for different page elements
2. **Integrate Frontend**: Add tracking to your website
3. **Monitor Performance**: Check dashboard regularly
4. **Review Reports**: Read weekly reports for insights
5. **Train ML Model**: Once you have 5+ completed tests
6. **Optimize Content**: Create new content based on ML recommendations

## Common Commands

```bash
# Check system status
curl http://localhost:3000/api/cro/overview | jq

# View all active tests
curl http://localhost:3000/api/cro/active-tests | jq

# Manual orchestration
curl -X POST http://localhost:3000/api/cro/orchestrate

# Generate report
./scripts/cro/generate-report.sh

# Train ML model
curl -X POST http://localhost:3000/api/cro/ml/train

# End a test manually
curl -X POST http://localhost:3000/api/cro/tests/TEST_ID/end \
  -H "Content-Type: application/json" \
  -d '{"winnerId": "variant_a"}'
```

That's it! You're now running an automated CRO intelligence system.
