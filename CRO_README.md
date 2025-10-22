# CRO Intelligence System

> Automated Conversion Rate Optimization with Machine Learning

## What Is This?

An **autonomous A/B testing and optimization system** that:

- ✅ Automatically creates and runs A/B tests
- ✅ Tracks user behavior and conversions
- ✅ Makes statistical decisions on winners
- ✅ Deploys winning variants to production
- ✅ Learns from historical data using ML
- ✅ Generates weekly performance reports
- ✅ Provides actionable recommendations

**No manual intervention needed** - the system continuously optimizes your website for maximum conversions.

## Quick Start

```bash
# 1. Initialize the system
cd /srv/apps/mr-djv1/backend
node -e "
const CRO = require('./src/services/croOrchestrator');
new CRO().initialize().then(() => console.log('✓ Ready'));
"

# 2. Generate sample data (for testing)
cd /srv/apps/mr-djv1/scripts/cro
./generate-test-data.js 3 500

# 3. View results
curl http://localhost:3000/api/cro/overview | jq

# 4. Setup automation
./setup-cron.sh
```

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Your Website/Frontend                   │
│  (Tracks: impressions, conversions, engagement)         │
└────────────────────┬────────────────────────────────────┘
                     │ Events API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              CRO Intelligence System                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📊 Orchestrator  →  🧠 Decision Engine  →  📈 Analyzer  │
│         ↓                    ↓                    ↓       │
│  🎲 Variant Gen   →  🤖 ML Model        →  📋 Reports    │
│                                                           │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Automated Actions:   │
         │  • Declare winners    │
         │  • Archive losers     │
         │  • Start new tests    │
         │  • Update production  │
         └───────────────────────┘
```

## Key Features

### 1. Automated Test Creation

```javascript
// System automatically generates hypotheses like:
{
  hypothesis: "Video hero increases engagement vs static image",
  priority: "high",
  expectedImpact: "high",
  variants: [
    { name: "Video Hero", config: { type: "video", asset: "showreel-001" } },
    { name: "Image Hero", config: { type: "image", asset: "feest-001" } }
  ]
}
```

### 2. Statistical Decision Making

- **Chi-square test** for statistical significance (p < 0.05)
- **Confidence intervals** at 95% level
- **Minimum effect size** of 10% required
- **Sample size validation** (min 100 impressions/variant)

### 3. Smart Traffic Allocation

```javascript
// Initially: 50/50 split
{ variant_a: 50%, variant_b: 50% }

// After data collection: Smart allocation
{ variant_a: 90%, variant_b: 10% }  // Favor winner, maintain statistical validity
```

### 4. Machine Learning Predictions

```javascript
// The ML model learns patterns like:
{
  rule: "optimal_video_duration",
  recommendation: "Use videos under 20 seconds for better conversion",
  confidence: 75%,
  data: {
    shortVideos: { count: 12, avgConvRate: 0.045 },
    longVideos: { count: 8, avgConvRate: 0.031 }
  }
}
```

### 5. Multi-Dimensional Analysis

- **By Device**: Mobile vs Tablet vs Desktop
- **By Geography**: Performance per city
- **By Time**: Hour of day, day of week
- **By Event Type**: Wedding vs Corporate vs Party
- **Engagement**: Scroll depth, video plays, gallery interactions
- **Time to Conversion**: How long until users convert

## File Structure

```
/srv/apps/mr-djv1/
├── backend/src/
│   ├── services/
│   │   ├── croOrchestrator.js       # Main orchestration
│   │   ├── decisionEngine.js        # Statistical analysis
│   │   ├── performanceAnalyzer.js   # Multi-dimensional analytics
│   │   └── variantGenerator.js      # Hypothesis generation
│   ├── ml/
│   │   └── predictionModel.js       # Machine learning
│   └── routes/
│       └── croDashboard.js          # API endpoints
│
├── config/
│   └── cro-config.json              # System configuration
│
├── scripts/cro/
│   ├── generate-report.sh           # Weekly report generator
│   ├── setup-cron.sh                # Automation setup
│   ├── generate-test-data.js        # Sample data generator
│   └── run-orchestration.sh         # Manual orchestration
│
├── data/cro/
│   ├── active-tests.json            # Currently running tests
│   ├── test-archive.json            # Completed tests
│   ├── test-events.json             # Tracked events
│   ├── production-variants.json     # Live variants
│   ├── recommendations.json         # Pending decisions
│   └── model-data.json              # ML model
│
├── docs/
│   ├── CRO_SYSTEM_DOCUMENTATION.md  # Full documentation
│   └── CRO_QUICK_START.md           # Quick start guide
│
└── reports/cro/
    └── cro-report-YYYY-MM-DD.*      # Generated reports
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cro/overview` | GET | System status and metrics |
| `/api/cro/active-tests` | GET | Currently running tests |
| `/api/cro/recent-winners` | GET | Completed tests with winners |
| `/api/cro/asset-performance` | GET | Performance by asset |
| `/api/cro/recommendations` | GET | ML-powered recommendations |
| `/api/cro/performance-analysis` | GET | Multi-dimensional analytics |
| `/api/cro/tests` | POST | Create new test |
| `/api/cro/tests/:id/end` | POST | End test manually |
| `/api/cro/events` | POST | Track user event |
| `/api/cro/orchestrate` | POST | Trigger orchestration |
| `/api/cro/ml/train` | POST | Train ML model |
| `/api/cro/ml/predict` | POST | Get prediction |

## Configuration

Edit `/srv/apps/mr-djv1/config/cro-config.json`:

```json
{
  "automation": {
    "enabled": true,                    // Enable/disable automation
    "min_sample_size": 100,             // Min impressions before evaluation
    "confidence_level": 0.95,           // 95% confidence required
    "max_concurrent_tests": 5,          // Max tests running at once
    "test_duration_max_days": 14,       // Force decision after X days
    "min_conversion_difference": 0.10,  // 10% minimum improvement
    "auto_declare_winners": true,       // Auto-deploy winners
    "auto_start_new_tests": true        // Auto-start new tests
  },
  "optimization_goals": [
    { "name": "contact_form_submit", "weight": 100 },
    { "name": "phone_click", "weight": 80 },
    { "name": "scroll_depth_75", "weight": 10 }
  ],
  "smart_allocation": {
    "enabled": true,                    // Smart traffic allocation
    "min_traffic_to_loser": 10         // Min % to losing variant
  }
}
```

## Usage Examples

### Create a Test

```bash
curl -X POST http://localhost:3000/api/cro/tests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hero Video Length Test",
    "type": "hero_video_length",
    "variants": [
      { "name": "Short Video (15s)", "config": { "duration": 15 } },
      { "name": "Long Video (60s)", "config": { "duration": 60 } }
    ]
  }'
```

### Track Events

```javascript
// In your frontend
fetch('/api/cro/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    test_id: 'test_abc123',
    variant_id: 'variant_0',
    event_type: 'impression',
    session_id: sessionId,
    device_type: 'mobile'
  })
});
```

### View Results

```bash
# Overview
curl http://localhost:3000/api/cro/overview | jq

# Active tests with real-time metrics
curl http://localhost:3000/api/cro/active-tests | jq

# Recent winners
curl http://localhost:3000/api/cro/recent-winners | jq

# Get ML recommendations
curl http://localhost:3000/api/cro/recommendations | jq
```

### Manual Orchestration

```bash
# Trigger orchestration cycle
curl -X POST http://localhost:3000/api/cro/orchestrate

# Or via Node.js
node -e "
const CRO = require('./backend/src/services/croOrchestrator');
new CRO().orchestrate().then(console.log);
"
```

### Generate Report

```bash
cd /srv/apps/mr-djv1/scripts/cro
./generate-report.sh

# Reports saved to:
# - reports/cro/cro-report-YYYY-MM-DD.txt
# - reports/cro/cro-report-YYYY-MM-DD.html
# - reports/cro/cro-report-YYYY-MM-DD.json
```

## Automation Setup

```bash
cd /srv/apps/mr-djv1/scripts/cro
./setup-cron.sh

# This creates cron jobs for:
# - Hourly orchestration (decision making)
# - Weekly reports (Monday 9 AM)
# - Daily ML training (2 AM)

# Install the cron jobs:
crontab /srv/apps/mr-djv1/scripts/cro/cro-crontab.txt
```

## How Decisions Are Made

### Example: Test Evaluation

```
Test: "Hero Video vs Image"

Variant A (Video):
  - 523 impressions
  - 18 conversions
  - Conversion rate: 3.44%

Variant B (Image):
  - 498 impressions
  - 12 conversions
  - Conversion rate: 2.41%

Statistical Analysis:
  ✓ Min sample size reached (>100 each)
  ✓ Chi-square p-value: 0.032 (< 0.05)
  ✓ Effect size: 42.7% improvement (> 10%)
  ✓ Confidence: 96.8%

Decision: DECLARE WINNER → Variant A (Video)
Action: Deploy video hero to production, archive image variant
```

## Machine Learning Insights

After training on historical data, the model provides insights like:

```json
{
  "recommendations": [
    {
      "category": "optimal_video_duration",
      "recommendation": "Use videos under 20 seconds for better conversion",
      "confidence": "75%",
      "priority": "high"
    },
    {
      "category": "optimal_event_type",
      "recommendation": "weddings content performs best for conversions",
      "confidence": "82%",
      "priority": "high"
    },
    {
      "category": "device_optimization",
      "recommendation": "Optimize for mobile users - they convert better",
      "confidence": "68%",
      "priority": "medium"
    }
  ],
  "featureImportance": {
    "video_duration": "28.50%",
    "event_type": "22.30%",
    "device_type": "18.70%",
    "time_of_day": "15.20%"
  }
}
```

## Testing the System

### Generate Sample Data

```bash
cd /srv/apps/mr-djv1/scripts/cro

# Generate 3 tests with 500 events each
./generate-test-data.js 3 500

# Generate more tests for ML training
./generate-test-data.js 10 1000
```

### Train ML Model

```bash
# After generating enough test data (5+ completed tests)
curl -X POST http://localhost:3000/api/cro/ml/train

# View recommendations
curl http://localhost:3000/api/cro/recommendations | jq
```

## Monitoring

### Dashboard URLs

- **System Status**: `http://localhost:3000/api/cro/overview`
- **Active Tests**: `http://localhost:3000/api/cro/active-tests`
- **Winners**: `http://localhost:3000/api/cro/recent-winners`
- **Asset Performance**: `http://localhost:3000/api/cro/asset-performance`
- **Recommendations**: `http://localhost:3000/api/cro/recommendations`

### Log Files

```bash
# Orchestration logs
tail -f /srv/apps/mr-djv1/logs/cro-orchestration.log

# View recent decisions
cat /srv/apps/mr-djv1/data/cro/active-tests.json | jq

# View archived tests
cat /srv/apps/mr-djv1/data/cro/test-archive.json | jq
```

## Best Practices

1. **Run tests for at least 7 days** to account for day-of-week variations
2. **Aim for 100+ impressions per variant** before making decisions
3. **Track multiple goals**, not just form submissions
4. **Review weekly reports** for insights and trends
5. **Train ML model regularly** (daily via cron) for better predictions
6. **Monitor asset performance** to guide content creation
7. **Start with high-priority tests** (hero, CTA, forms)

## Troubleshooting

### Tests Not Starting
- Check if automation is enabled in config
- Verify max_concurrent_tests not reached
- Check logs for errors

### No Winners Declared
- Ensure minimum sample size reached
- Check if test has run long enough
- Verify auto_declare_winners is enabled
- Look for statistical significance

### Events Not Tracking
- Verify API endpoint is accessible
- Check request payload format
- Ensure test_id and variant_id are valid
- Check browser console for errors

## Documentation

- **Full Documentation**: `/srv/apps/mr-djv1/docs/CRO_SYSTEM_DOCUMENTATION.md`
- **Quick Start Guide**: `/srv/apps/mr-djv1/docs/CRO_QUICK_START.md`
- **This README**: `/srv/apps/mr-djv1/CRO_README.md`

## Support

For issues or questions:
1. Check documentation in `/docs/`
2. Review configuration in `/config/cro-config.json`
3. Check logs in `/logs/`
4. Inspect data files in `/data/cro/`

## License

MIT License - Part of the Mr. DJ Platform

---

**Built with intelligence. Optimized automatically.**
