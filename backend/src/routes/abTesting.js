/**
 * A/B Testing API Routes
 *
 * RESTful endpoints for managing and tracking A/B tests
 */

const express = require('express');
const router = express.Router();
const ABTestingService = require('../services/abTestingService');
const AnalyticsIntegration = require('../services/analyticsIntegration');

// Middleware to initialize services
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: 'Database connection not available' });
  }
  req.abTestingService = new ABTestingService(req.db);
  req.analytics = new AnalyticsIntegration();
  next();
});

/**
 * GET /api/ab-tests/active
 * Get all active A/B tests
 */
router.get('/active', async (req, res) => {
  try {
    const tests = await req.abTestingService.getActiveTests();
    res.json({
      success: true,
      count: tests.length,
      tests
    });
  } catch (error) {
    console.error('Error fetching active tests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active tests'
    });
  }
});

/**
 * GET /api/ab-tests/:testId
 * Get a specific test with variants
 */
router.get('/:testId', async (req, res) => {
  try {
    const test = await req.abTestingService.getTest(req.params.testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test'
    });
  }
});

/**
 * POST /api/ab-tests
 * Create a new A/B test
 */
router.post('/', async (req, res) => {
  try {
    const {
      testId,
      name,
      description,
      type,
      goal,
      minSampleSize,
      confidenceLevel,
      trafficAllocation,
      metadata
    } = req.body;

    if (!testId || !name || !type || !goal) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: testId, name, type, goal'
      });
    }

    const test = await req.abTestingService.createTest({
      testId,
      name,
      description,
      type,
      goal,
      minSampleSize,
      confidenceLevel,
      trafficAllocation,
      createdBy: req.user?.id || 'system',
      metadata
    });

    res.status(201).json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create test'
    });
  }
});

/**
 * POST /api/ab-tests/:testId/variants
 * Add a variant to a test
 */
router.post('/:testId/variants', async (req, res) => {
  try {
    const {
      variantId,
      name,
      description,
      assetUrl,
      assetType,
      config,
      weight,
      isControl
    } = req.body;

    if (!variantId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: variantId, name'
      });
    }

    const variant = await req.abTestingService.addVariant({
      testId: req.params.testId,
      variantId,
      name,
      description,
      assetUrl,
      assetType,
      config,
      weight,
      isControl
    });

    res.status(201).json({
      success: true,
      variant
    });
  } catch (error) {
    console.error('Error adding variant:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add variant'
    });
  }
});

/**
 * POST /api/ab-tests/:testId/activate
 * Activate a test
 */
router.post('/:testId/activate', async (req, res) => {
  try {
    const test = await req.abTestingService.activateTest(
      req.params.testId,
      req.user?.id || 'system'
    );

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error activating test:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to activate test'
    });
  }
});

/**
 * POST /api/ab-tests/:testId/pause
 * Pause a test
 */
router.post('/:testId/pause', async (req, res) => {
  try {
    const test = await req.abTestingService.pauseTest(
      req.params.testId,
      req.user?.id || 'system'
    );

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error pausing test:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to pause test'
    });
  }
});

/**
 * POST /api/ab-tests/:testId/complete
 * Complete a test
 */
router.post('/:testId/complete', async (req, res) => {
  try {
    const test = await req.abTestingService.completeTest(
      req.params.testId,
      req.user?.id || 'system'
    );

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error completing test:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete test'
    });
  }
});

/**
 * GET /api/ab-tests/:testId/assign
 * Assign user to a variant
 */
router.get('/:testId/assign', async (req, res) => {
  try {
    const userId = req.query.userId || req.cookies?.userId;
    const sessionId = req.query.sessionId || req.sessionID || req.cookies?.sessionId;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Session ID required'
      });
    }

    const variantId = await req.abTestingService.assignUserToVariant(
      req.params.testId,
      userId,
      sessionId
    );

    // Get variant details
    const test = await req.abTestingService.getTest(req.params.testId);
    const variant = test?.variants?.find(v => v.variant_id === variantId);

    res.json({
      success: true,
      testId: req.params.testId,
      variantId,
      variant
    });
  } catch (error) {
    console.error('Error assigning variant:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to assign variant'
    });
  }
});

/**
 * POST /api/ab-tests/impression
 * Track an impression
 */
router.post('/impression', async (req, res) => {
  try {
    const {
      testId,
      variantId,
      userId,
      sessionId,
      metadata
    } = req.body;

    if (!testId || !variantId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: testId, variantId'
      });
    }

    // Extract request metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    const referrer = req.headers.referer || req.headers.referrer;

    const impressionId = await req.abTestingService.trackImpression({
      testId,
      variantId,
      userId: userId || req.cookies?.userId,
      sessionId: sessionId || req.sessionID || req.cookies?.sessionId,
      userAgent,
      ipAddress,
      referrer,
      pageUrl: req.body.pageUrl,
      deviceType: req.body.deviceType,
      browser: req.body.browser,
      country: req.body.country,
      metadata
    });

    // Send to analytics
    const test = await req.abTestingService.getTest(testId);
    const variant = test?.variants?.find(v => v.variant_id === variantId);

    if (test && variant) {
      await req.analytics.trackImpression({
        testId,
        variantId,
        userId: userId || req.cookies?.userId,
        sessionId: sessionId || req.sessionID || req.cookies?.sessionId,
        testName: test.name,
        variantName: variant.name,
        metadata
      }).catch(err => console.error('Analytics error:', err));
    }

    res.json({
      success: true,
      impressionId
    });
  } catch (error) {
    console.error('Error tracking impression:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track impression'
    });
  }
});

/**
 * POST /api/ab-tests/conversion
 * Track a conversion
 */
router.post('/conversion', async (req, res) => {
  try {
    const {
      testId,
      variantId,
      userId,
      sessionId,
      impressionId,
      conversionType,
      conversionValue,
      metadata
    } = req.body;

    if (!testId || !variantId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: testId, variantId'
      });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const conversionId = await req.abTestingService.trackConversion({
      testId,
      variantId,
      userId: userId || req.cookies?.userId,
      sessionId: sessionId || req.sessionID || req.cookies?.sessionId,
      impressionId,
      conversionType: conversionType || 'default',
      conversionValue: conversionValue || 0,
      userAgent,
      ipAddress,
      pageUrl: req.body.pageUrl,
      metadata
    });

    // Send to analytics
    const test = await req.abTestingService.getTest(testId);
    const variant = test?.variants?.find(v => v.variant_id === variantId);

    if (test && variant) {
      await req.analytics.trackConversion({
        testId,
        variantId,
        userId: userId || req.cookies?.userId,
        sessionId: sessionId || req.sessionID || req.cookies?.sessionId,
        testName: test.name,
        variantName: variant.name,
        conversionType: conversionType || 'default',
        conversionValue: conversionValue || 0,
        metadata
      }).catch(err => console.error('Analytics error:', err));
    }

    res.json({
      success: true,
      conversionId
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track conversion'
    });
  }
});

/**
 * GET /api/ab-tests/:testId/results
 * Get test results with statistics
 */
router.get('/:testId/results', async (req, res) => {
  try {
    // Calculate latest statistics
    await req.abTestingService.calculateStatistics(req.params.testId);

    // Get results
    const results = await req.abTestingService.getTestResults(req.params.testId);

    if (!results) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
});

/**
 * POST /api/ab-tests/:testId/declare-winner
 * Manually declare a winner
 */
router.post('/:testId/declare-winner', async (req, res) => {
  try {
    const { variantId } = req.body;

    if (!variantId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: variantId'
      });
    }

    const test = await req.abTestingService.declareWinner(
      req.params.testId,
      variantId,
      'manual',
      req.user?.id || 'system'
    );

    // Get results for analytics
    const results = await req.abTestingService.getTestResults(req.params.testId);
    const winnerResult = results?.results?.find(r => r.variant_id === variantId);

    // Send to analytics
    await req.analytics.trackWinnerDeclared({
      testId: req.params.testId,
      winnerVariantId: variantId,
      testName: test.name,
      method: 'manual',
      uplift: winnerResult?.uplift_vs_control || 0
    }).catch(err => console.error('Analytics error:', err));

    res.json({
      success: true,
      test,
      results
    });
  } catch (error) {
    console.error('Error declaring winner:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to declare winner'
    });
  }
});

/**
 * GET /api/ab-tests/:testId/events
 * Get test audit log
 */
router.get('/:testId/events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = await req.abTestingService.getTestEvents(req.params.testId, limit);

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

/**
 * GET /api/ab-tests/analytics/status
 * Get analytics integration status
 */
router.get('/analytics/status', (req, res) => {
  const status = req.analytics.getStatus();
  res.json({
    success: true,
    status
  });
});

/**
 * Error handling middleware
 */
router.use((error, req, res, next) => {
  console.error('A/B Testing API Error:', error);
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

module.exports = router;
