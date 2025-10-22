# CRO Intelligence System Documentation

## Overview

The CRO (Conversion Rate Optimization) Intelligence System is an automated machine learning-powered platform that continuously tests, analyzes, and optimizes website content to maximize conversions. The system runs autonomously, making data-driven decisions to improve user engagement and conversion rates.

## Table of Contents

1. [Architecture](#architecture)
2. [Core Components](#core-components)
3. [How It Works](#how-it-works)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Running the System](#running-the-system)
7. [Monitoring & Reports](#monitoring--reports)
8. [Machine Learning Model](#machine-learning-model)
9. [Best Practices](#best-practices)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    CRO Intelligence System                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Orchestrator │  │   Decision   │  │  Performance │      │
│  │              │──│    Engine    │──│   Analyzer   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         │                  │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Variant    │  │      ML      │  │   Dashboard  │      │
│  │  Generator   │  │  Prediction  │  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Data Storage │
                    │  (JSON Files) │
                    └───────────────┘
```

### Data Flow

1. **Event Tracking** → User interactions are tracked and stored as events
2. **Orchestration** → Hourly orchestration checks test progress
3. **Analysis** → Performance is analyzed across multiple dimensions
4. **Decision Making** → Statistical tests determine winners
5. **Automation** → Winners are deployed, losers archived, new tests started
6. **Learning** → ML model learns from historical data to predict future performance

---

## Core Components

### 1. CRO Orchestrator (`croOrchestrator.js`)

**Purpose**: Main orchestration service that coordinates all CRO activities.

**Key Functions**:
- `orchestrate()` - Main orchestration loop (run hourly)
- `startNewTest(hypothesis)` - Create and start a new A/B test
- `declareWinner(decision)` - Archive completed test and update production
- `recordEvent(event)` - Track user interaction events
- `getStatus()` - Get system status

**Example Usage**:
```javascript
const CROOrchestrator = require('./services/croOrchestrator');
const orchestrator = new CROOrchestrator();

// Run orchestration cycle
await orchestrator.orchestrate();

// Create manual test
await orchestrator.createTest({
  name: 'Hero Video Test',
  type: 'hero_video',
  variants: [
    { name: 'Short Video', config: { /* ... */ } },
    { name: 'Long Video', config: { /* ... */ } }
  ]
});
```

### 2. Decision Engine (`decisionEngine.js`)

**Purpose**: Makes statistical decisions about test winners using chi-square tests and confidence intervals.

**Key Functions**:
- `evaluateTests(tests, metrics)` - Evaluate all active tests
- `performStatisticalAnalysis(metrics)` - Run chi-square test
- `chiSquareTest(...)` - Calculate statistical significance
- `calculateTrafficAllocation(...)` - Smart traffic distribution

**Statistical Criteria**:
- Minimum sample size: 100 impressions per variant
- Significance level: p-value < 0.05
- Minimum effect size: 10% improvement
- Confidence level: 95%

### 3. Performance Analyzer (`performanceAnalyzer.js`)

**Purpose**: Analyzes performance across multiple dimensions.

**Analysis Dimensions**:
- Overall performance
- By variant
- By device (mobile, tablet, desktop)
- By geography (city)
- By event type (wedding, corporate, party)
- By time of day
- By day of week
- Engagement metrics
- Time to conversion

**Example Usage**:
```javascript
const PerformanceAnalyzer = require('./services/performanceAnalyzer');
const analyzer = new PerformanceAnalyzer();

const analysis = await analyzer.analyzeComprehensive(tests, events);
// Returns detailed breakdown across all dimensions
```

### 4. Variant Generator (`variantGenerator.js`)

**Purpose**: Automatically generates test hypotheses based on available assets and ML insights.

**Generated Test Types**:
- Hero image vs video
- Video length variations
- Event type imagery (wedding vs party)
- Gallery arrangements
- CTA button text/color/placement
- Page layout variations
- Form placement

**Example Usage**:
```javascript
const VariantGenerator = require('./services/variantGenerator');
const generator = new VariantGenerator();

// Generate test hypotheses
const hypotheses = await generator.generateTestHypotheses();

// hypotheses[0]:
// {
//   type: 'hero_content',
//   hypothesis: 'Video hero increases engagement vs static image',
//   priority: 'high',
//   expectedImpact: 'high',
//   variants: [ ... ]
// }
```

### 5. ML Prediction Model (`predictionModel.js`)

**Purpose**: Simple machine learning model that learns from historical data to predict performance and make recommendations.

**Features Analyzed**:
- Image aspect ratio
- Video duration
- Event type (wedding/party/corporate)
- Device type
- Time of day
- Day of week

**Model Types**:
- Decision rules (simple decision tree)
- Linear correlations
- Feature importance ranking

**Example Usage**:
```javascript
const PredictionModel = require('./ml/predictionModel');
const model = new PredictionModel();

// Train on historical data
await model.train(historicalTests, events);

// Get predictions
const prediction = await model.predict(variantConfig);

// Get content recommendations
const recommendations = await model.getContentRecommendations();
```

---

## How It Works

### Automated Testing Workflow

```
1. System Initialization
   └─> Load media assets from manifest
   └─> Generate test hypotheses

2. Test Creation (Automatic)
   └─> Select top priority hypothesis
   └─> Create variants based on available assets
   └─> Start test with equal traffic split

3. Data Collection
   └─> Track impressions, conversions, engagement
   └─> Store events with metadata (device, location, time)

4. Orchestration Cycle (Hourly)
   └─> Calculate metrics for each test
   └─> Check if minimum sample size reached
   └─> Perform statistical analysis

5. Decision Making
   └─> Is test statistically significant? (p < 0.05)
   └─> Is effect size meaningful? (>10% difference)
   └─> YES → Declare winner, archive test
   └─> NO → Continue test or adjust traffic allocation

6. Production Update
   └─> Deploy winning variant to production
   └─> Archive losing variants
   └─> Start new challenger test

7. Machine Learning
   └─> Train model on completed tests
   └─> Update predictions and recommendations
   └─> Prioritize next test hypotheses
```

### Event Tracking

Events to track in your frontend:

```javascript
// Impression (page view with test variant shown)
POST /api/cro/events
{
  "test_id": "test_abc123",
  "variant_id": "variant_0",
  "event_type": "impression",
  "user_id": "user_xyz",
  "session_id": "session_abc",
  "device_type": "mobile",
  "city": "Amsterdam",
  "event_category": "weddings"
}

// Conversion (form submission)
POST /api/cro/events
{
  "test_id": "test_abc123",
  "variant_id": "variant_0",
  "event_type": "conversion",
  "user_id": "user_xyz",
  "session_id": "session_abc"
}

// Engagement events
{
  "event_type": "video_play",
  "event_type": "scroll_depth_75",
  "event_type": "gallery_interaction",
  "event_type": "phone_click"
}
```

### Traffic Allocation

**Equal Split (Default)**:
- Initial: 50/50 for 2 variants
- All variants get equal traffic

**Smart Allocation (Enabled)**:
- Gradually reduces traffic to underperforming variants
- Minimum 10% traffic to losing variant
- Maximizes conversions while maintaining statistical validity

---

## API Reference

### GET `/api/cro/overview`

Get overall system statistics.

**Response**:
```json
{
  "status": "success",
  "data": {
    "system": {
      "activeTests": 3,
      "archivedTests": 15
    },
    "metrics": {
      "overallConversionRate": "3.45%",
      "totalImpressions": 12500,
      "totalConversions": 431,
      "avgImprovementPerTest": "15.30%"
    }
  }
}
```

### GET `/api/cro/active-tests`

List all currently running tests.

**Response**:
```json
{
  "status": "success",
  "data": {
    "tests": [
      {
        "id": "test_123",
        "name": "Hero Video vs Image",
        "type": "hero_content",
        "age": "3d 5h",
        "variants": {
          "variant_0": {
            "name": "Video Hero",
            "impressions": 523,
            "conversions": 18,
            "conversionRate": "3.44%"
          },
          "variant_1": {
            "name": "Image Hero",
            "impressions": 498,
            "conversions": 12,
            "conversionRate": "2.41%"
          }
        }
      }
    ]
  }
}
```

### GET `/api/cro/recent-winners`

Recently completed tests with winners.

**Query Parameters**:
- `limit` (optional): Number of results (default: 10)

### GET `/api/cro/asset-performance`

Performance analytics by asset.

**Response**: Lists all assets with win rates and conversion rates.

### GET `/api/cro/recommendations`

AI-powered recommendations for next tests.

**Response**:
```json
{
  "status": "success",
  "data": {
    "mlRecommendations": [
      {
        "category": "optimal_video_duration",
        "recommendation": "Use videos under 20 seconds for better conversion",
        "confidence": "75%",
        "priority": "high"
      }
    ],
    "suggestedTests": [ ... ],
    "featureImportance": {
      "video_duration": "28.50",
      "image_aspect_ratio": "22.30"
    }
  }
}
```

### POST `/api/cro/tests`

Manually create a new test.

**Request Body**:
```json
{
  "name": "CTA Color Test",
  "type": "cta_color",
  "targetPage": "homepage",
  "variants": [
    {
      "name": "Blue Button",
      "config": { "color": "#007bff" }
    },
    {
      "name": "Orange Button",
      "config": { "color": "#ff6600" }
    }
  ]
}
```

### POST `/api/cro/tests/:testId/end`

Manually end a test.

**Request Body**:
```json
{
  "winnerId": "variant_0"
}
```

### POST `/api/cro/events`

Record a tracking event.

**Request Body**: See Event Tracking section above.

### POST `/api/cro/orchestrate`

Manually trigger orchestration cycle.

### POST `/api/cro/ml/train`

Train ML model on historical data.

### POST `/api/cro/ml/predict`

Get prediction for a variant configuration.

---

## Configuration

Edit `/srv/apps/mr-djv1/config/cro-config.json`:

```json
{
  "automation": {
    "enabled": true,
    "min_sample_size": 100,
    "confidence_level": 0.95,
    "max_concurrent_tests": 5,
    "test_duration_max_days": 14,
    "min_conversion_difference": 0.10,
    "auto_declare_winners": true,
    "auto_start_new_tests": true
  },
  "optimization_goals": [
    {
      "name": "contact_form_submit",
      "weight": 100
    }
  ],
  "smart_allocation": {
    "enabled": true,
    "min_traffic_to_loser": 10
  }
}
```

**Key Settings**:

- `enabled`: Master switch for automation
- `min_sample_size`: Minimum impressions before test can be evaluated
- `confidence_level`: Statistical confidence (0.95 = 95%)
- `max_concurrent_tests`: Maximum tests running simultaneously
- `test_duration_max_days`: Force decision after this many days
- `auto_declare_winners`: Automatically deploy winners
- `auto_start_new_tests`: Automatically start new tests when slots available

---

## Running the System

### Manual Orchestration

```bash
cd /srv/apps/mr-djv1/backend

node -e "
const CROOrchestrator = require('./src/services/croOrchestrator');
const orchestrator = new CROOrchestrator();
orchestrator.orchestrate().then(console.log);
"
```

### Setup Automated Cron Jobs

```bash
cd /srv/apps/mr-djv1/scripts/cro
./setup-cron.sh
```

This creates:
- **Hourly**: Orchestration cycle
- **Weekly** (Monday 9 AM): Generate report
- **Daily** (2 AM): Train ML model

### Manual Report Generation

```bash
cd /srv/apps/mr-djv1/scripts/cro
./generate-report.sh
```

Reports are saved to `/srv/apps/mr-djv1/reports/cro/`

---

## Monitoring & Reports

### Weekly Reports

Automatically generated every Monday at 9 AM.

**Contents**:
- System overview (active tests, completed tests)
- Recent winners with improvement percentages
- Key metrics (conversion rates, impressions)
- ML recommendations
- Pending manual decisions
- Asset performance insights

**Formats**:
- Text: `cro-report-YYYY-MM-DD.txt`
- HTML: `cro-report-YYYY-MM-DD.html`
- JSON: `cro-report-YYYY-MM-DD.json`

### Real-Time Dashboard

Access via API endpoints or build custom dashboard:

```javascript
// Dashboard data fetching
const overview = await fetch('/api/cro/overview');
const activeTests = await fetch('/api/cro/active-tests');
const winners = await fetch('/api/cro/recent-winners');
const recommendations = await fetch('/api/cro/recommendations');
```

### Log Files

```bash
# Orchestration logs
tail -f /srv/apps/mr-djv1/logs/cro-orchestration.log

# Report generation logs
tail -f /srv/apps/mr-djv1/logs/cro-reports.log
```

---

## Machine Learning Model

### How the Model Works

The system uses a **simple decision tree / rule-based approach**:

1. **Feature Extraction**: Extracts features from test variants
   - Image: aspect ratio, event type, has people
   - Video: duration, opening frame
   - Context: device, time, location

2. **Pattern Recognition**: Identifies patterns in historical winners
   - "Short videos (<20s) convert 15% better"
   - "Wedding imagery works best for mobile users"
   - "Evening traffic converts 20% higher"

3. **Rule Generation**: Creates actionable rules
   ```
   IF video_duration < 20s THEN expected_improvement = +15%
   IF device = mobile AND event_type = wedding THEN priority = high
   ```

4. **Feature Importance**: Ranks which factors matter most
   ```
   video_duration: 28.5%
   event_type: 22.3%
   device_type: 18.7%
   ```

### Training the Model

```bash
# Via API
curl -X POST http://localhost:3000/api/cro/ml/train

# Or via script
cd /srv/apps/mr-djv1/backend
node -e "
const PM = require('./src/ml/predictionModel');
const CO = require('./src/services/croOrchestrator');
const pm = new PM();
const co = new CO();
Promise.all([co.loadArchive(), co.loadEvents()])
  .then(([archive, events]) => pm.train(archive.archivedTests, events))
  .then(model => console.log('Model trained:', model));
"
```

### Using Predictions

```javascript
// Predict performance of a variant
const prediction = await model.predict({
  type: 'video',
  asset: {
    duration: 15,
    subcategory: 'weddings'
  }
});

// Get content creation recommendations
const recommendations = await model.getContentRecommendations();
```

---

## Best Practices

### 1. Test Design

**Good Tests**:
- Clear hypothesis ("Video increases engagement")
- Meaningful difference between variants
- Single variable changed at a time
- Sufficient traffic to reach significance

**Bad Tests**:
- Multiple changes at once
- Too similar variants
- Insufficient traffic
- No clear hypothesis

### 2. Sample Size

**Minimum Requirements**:
- 100 impressions per variant before evaluation
- At least 10 conversions per variant for reliable results
- Run tests for at least 3-7 days to account for day-of-week variations

**Calculator**:
```javascript
const DecisionEngine = require('./services/decisionEngine');
const engine = new DecisionEngine();

const requiredSampleSize = engine.calculateRequiredSampleSize(
  0.03,    // baseline conversion rate (3%)
  0.20,    // minimum detectable effect (20% improvement)
  0.05,    // alpha (5% significance level)
  0.80     // power (80%)
);
// Returns: ~3850 impressions per variant
```

### 3. Automation Settings

**Conservative** (fewer false positives):
```json
{
  "min_sample_size": 200,
  "confidence_level": 0.99,
  "min_conversion_difference": 0.15,
  "test_duration_max_days": 21
}
```

**Aggressive** (faster decisions):
```json
{
  "min_sample_size": 50,
  "confidence_level": 0.90,
  "min_conversion_difference": 0.10,
  "test_duration_max_days": 7
}
```

### 4. Event Tracking

**Required Events**:
- `impression`: Every page view with test variant
- `conversion`: Primary goal (form submit, booking, call)

**Recommended Events**:
- `video_play`, `video_complete`
- `scroll_depth_75`, `scroll_depth_100`
- `gallery_interaction`
- `phone_click`, `whatsapp_click`, `email_click`
- `time_on_page_60s`

### 5. Monitoring

**Daily**:
- Check active tests progress
- Review any failed tests or errors
- Monitor conversion rates

**Weekly**:
- Review automated report
- Check ML recommendations
- Plan content creation based on insights

**Monthly**:
- Review overall improvement metrics
- Analyze asset performance
- Adjust automation settings if needed

### 6. Content Strategy

**Based on ML Insights**:
```
IF model says "short videos convert better"
→ Create more 15-20 second videos

IF model says "wedding content performs best"
→ Prioritize wedding photography in tests

IF model says "mobile users convert at 3pm-6pm"
→ Schedule social media posts for that time
```

---

## Troubleshooting

### Tests Not Starting

**Check**:
1. Is automation enabled in config?
2. Are there available test slots?
3. Is media manifest accessible?
4. Check logs for errors

### No Winners Declared

**Possible Reasons**:
1. Insufficient sample size (< 100 impressions)
2. No significant difference between variants
3. Test hasn't run long enough
4. Auto-declaration disabled in config

### ML Model Not Learning

**Solutions**:
1. Ensure there are completed tests with winners
2. Manually train model: `POST /api/cro/ml/train`
3. Check that events have proper metadata
4. Verify at least 5-10 completed tests exist

---

## Advanced Usage

### Custom Test Types

Add custom test types to variant generator:

```javascript
// In variantGenerator.js
generateCustomVariants() {
  return [{
    type: 'custom_pricing_table',
    hypothesis: 'Prominent pricing increases transparency and conversions',
    variants: [
      { name: 'Pricing Hidden', config: { showPricing: false } },
      { name: 'Pricing Visible', config: { showPricing: true } }
    ],
    priority: 'high'
  }];
}
```

### Custom Optimization Goals

Add to config:

```json
{
  "optimization_goals": [
    {
      "name": "custom_goal_name",
      "weight": 50,
      "description": "Custom conversion goal"
    }
  ]
}
```

### Segmented Tests

Run different tests for different audiences:

```javascript
// Check user segment before showing variant
const segment = getUserSegment(user); // 'wedding', 'corporate', etc.
const test = await getTestForSegment(segment);
```

---

## Support & Contribution

For questions or issues:
1. Check logs in `/srv/apps/mr-djv1/logs/`
2. Review configuration in `/srv/apps/mr-djv1/config/cro-config.json`
3. Check API status: `GET /api/cro/overview`

---

## License

MIT License - Mr. DJ CRO Intelligence System
