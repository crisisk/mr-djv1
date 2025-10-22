/**
 * CRO Dashboard Routes
 * API endpoints for the CRO dashboard
 */

const express = require('express');
const router = express.Router();
const CROOrchestrator = require('../services/croOrchestrator');
const PerformanceAnalyzer = require('../services/performanceAnalyzer');
const VariantGenerator = require('../services/variantGenerator');
const PredictionModel = require('../ml/predictionModel');
const fs = require('fs').promises;
const path = require('path');

const orchestrator = new CROOrchestrator();
const performanceAnalyzer = new PerformanceAnalyzer();
const variantGenerator = new VariantGenerator();
const predictionModel = new PredictionModel();

/**
 * GET /api/cro/overview
 * Overall CRO system statistics
 */
router.get('/overview', async (req, res) => {
  try {
    const status = await orchestrator.getStatus();
    const tests = await orchestrator.loadActiveTests();
    const events = await orchestrator.loadEvents();
    const archive = await orchestrator.loadArchive();

    // Calculate overall metrics
    const totalImpressions = events.filter(e => e.event_type === 'impression').length;
    const totalConversions = events.filter(e => e.event_type === 'conversion').length;
    const overallConversionRate = totalImpressions > 0
      ? ((totalConversions / totalImpressions) * 100).toFixed(2) + '%'
      : '0.00%';

    // Calculate improvement from winners
    const winners = archive.archivedTests.filter(t => t.winner);
    let totalImprovement = 0;
    for (const test of winners) {
      if (test.decision?.analysis?.effectSize) {
        totalImprovement += test.decision.analysis.effectSize;
      }
    }
    const avgImprovement = winners.length > 0
      ? ((totalImprovement / winners.length) * 100).toFixed(2) + '%'
      : '0.00%';

    res.json({
      status: 'success',
      data: {
        system: status,
        metrics: {
          overallConversionRate,
          totalImpressions,
          totalConversions,
          avgImprovementPerTest: avgImprovement,
          testsCompleted: winners.length
        },
        activeTests: tests.filter(t => t.status === 'active').length,
        pendingDecisions: tests.filter(t => t.status === 'pending_review').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching CRO overview:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/cro/active-tests
 * List all currently running tests with real-time metrics
 */
router.get('/active-tests', async (req, res) => {
  try {
    const tests = await orchestrator.loadActiveTests();
    const events = await orchestrator.loadEvents();

    const activeTests = tests
      .filter(t => t.status === 'active')
      .map(test => {
        const testEvents = events.filter(e => e.test_id === test.id);
        const variantMetrics = {};

        for (const variant of test.variants) {
          const variantEvents = testEvents.filter(e => e.variant_id === variant.id);
          const impressions = variantEvents.filter(e => e.event_type === 'impression').length;
          const conversions = variantEvents.filter(e => e.event_type === 'conversion').length;

          variantMetrics[variant.id] = {
            name: variant.name,
            impressions,
            conversions,
            conversionRate: impressions > 0
              ? ((conversions / impressions) * 100).toFixed(2) + '%'
              : '0.00%',
            trafficAllocation: variant.trafficAllocation?.toFixed(1) + '%' || 'N/A'
          };
        }

        // Calculate test age
        const ageMs = Date.now() - new Date(test.startDate).getTime();
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const ageHours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return {
          id: test.id,
          name: test.name,
          type: test.type,
          hypothesis: test.hypothesis,
          startDate: test.startDate,
          age: `${ageDays}d ${ageHours}h`,
          targetPage: test.targetPage,
          variants: variantMetrics,
          totalImpressions: testEvents.filter(e => e.event_type === 'impression').length,
          status: 'active'
        };
      });

    res.json({
      status: 'success',
      data: {
        tests: activeTests,
        count: activeTests.length
      }
    });
  } catch (error) {
    console.error('Error fetching active tests:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/cro/recent-winners
 * Recently completed tests with winners
 */
router.get('/recent-winners', async (req, res) => {
  try {
    const archive = await orchestrator.loadArchive();
    const limit = parseInt(req.query.limit) || 10;

    const winners = archive.archivedTests
      .filter(t => t.winner)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit)
      .map(test => ({
        id: test.id,
        name: test.name,
        type: test.type,
        winner: test.winner,
        winnerName: test.variants.find(v => v.id === test.winner)?.name || 'Unknown',
        improvement: test.decision?.analysis?.effectSize
          ? (test.decision.analysis.effectSize * 100).toFixed(2) + '%'
          : 'N/A',
        confidence: test.decision?.confidence || 'N/A',
        completedAt: test.completedAt,
        duration: this.calculateDuration(test.startDate, test.completedAt),
        totalImpressions: test.eventsCount
      }));

    res.json({
      status: 'success',
      data: {
        winners,
        count: winners.length
      }
    });
  } catch (error) {
    console.error('Error fetching recent winners:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/cro/asset-performance
 * Performance analytics by asset
 */
router.get('/asset-performance', async (req, res) => {
  try {
    const archive = await orchestrator.loadArchive();
    const events = await orchestrator.loadEvents();

    // Aggregate performance by asset
    const assetPerformance = {};

    for (const test of archive.archivedTests) {
      for (const variant of test.variants) {
        if (!variant.config?.asset) continue;

        const assetId = variant.config.asset.id;
        const testEvents = events.filter(e => e.test_id === test.id && e.variant_id === variant.id);

        if (!assetPerformance[assetId]) {
          assetPerformance[assetId] = {
            assetId,
            assetType: variant.config.type,
            category: variant.config.asset.category,
            subcategory: variant.config.asset.subcategory,
            testsUsedIn: 0,
            timesWon: 0,
            totalImpressions: 0,
            totalConversions: 0,
            avgConversionRate: 0
          };
        }

        const impressions = testEvents.filter(e => e.event_type === 'impression').length;
        const conversions = testEvents.filter(e => e.event_type === 'conversion').length;

        assetPerformance[assetId].testsUsedIn++;
        assetPerformance[assetId].totalImpressions += impressions;
        assetPerformance[assetId].totalConversions += conversions;

        if (variant.id === test.winner) {
          assetPerformance[assetId].timesWon++;
        }
      }
    }

    // Calculate average conversion rates
    for (const asset of Object.values(assetPerformance)) {
      asset.avgConversionRate = asset.totalImpressions > 0
        ? ((asset.totalConversions / asset.totalImpressions) * 100).toFixed(2) + '%'
        : '0.00%';
      asset.winRate = asset.testsUsedIn > 0
        ? ((asset.timesWon / asset.testsUsedIn) * 100).toFixed(2) + '%'
        : '0.00%';
    }

    // Sort by performance
    const sorted = Object.values(assetPerformance)
      .sort((a, b) => parseFloat(b.avgConversionRate) - parseFloat(a.avgConversionRate));

    res.json({
      status: 'success',
      data: {
        assets: sorted,
        count: sorted.length
      }
    });
  } catch (error) {
    console.error('Error fetching asset performance:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/cro/recommendations
 * AI-powered recommendations for next tests
 */
router.get('/recommendations', async (req, res) => {
  try {
    // Get ML model recommendations
    const contentRecs = await predictionModel.getContentRecommendations();

    // Get variant generator hypotheses
    const hypotheses = await variantGenerator.generateTestHypotheses();

    // Get current performance to prioritize
    const tests = await orchestrator.loadActiveTests();

    res.json({
      status: 'success',
      data: {
        mlRecommendations: contentRecs.recommendations || [],
        suggestedTests: hypotheses.slice(0, 5).map(h => ({
          type: h.type,
          hypothesis: h.hypothesis,
          priority: h.priority,
          expectedImpact: h.expectedImpact,
          reasoning: h.reasoning,
          variantsCount: h.variants.length
        })),
        featureImportance: contentRecs.featureImportance,
        modelInfo: {
          trainedAt: contentRecs.trainedAt,
          sampleSize: contentRecs.sampleSize
        }
      }
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/cro/performance-analysis
 * Detailed performance analysis across dimensions
 */
router.get('/performance-analysis', async (req, res) => {
  try {
    const tests = await orchestrator.loadActiveTests();
    const events = await orchestrator.loadEvents();

    const analysis = await performanceAnalyzer.analyzeComprehensive(tests, events);

    res.json({
      status: 'success',
      data: analysis
    });
  } catch (error) {
    console.error('Error fetching performance analysis:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/tests
 * Manually create a new test
 */
router.post('/tests', async (req, res) => {
  try {
    const testConfig = req.body;

    // Validate required fields
    if (!testConfig.name || !testConfig.variants || testConfig.variants.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Test must have a name and at least 2 variants'
      });
    }

    const test = await orchestrator.createTest(testConfig);

    res.json({
      status: 'success',
      data: { test },
      message: 'Test created successfully'
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/tests/:testId/end
 * Manually end a test
 */
router.post('/tests/:testId/end', async (req, res) => {
  try {
    const { testId } = req.params;
    const { winnerId } = req.body;

    const test = await orchestrator.endTest(testId, winnerId);

    res.json({
      status: 'success',
      data: { test },
      message: 'Test ended successfully'
    });
  } catch (error) {
    console.error('Error ending test:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/events
 * Record a tracking event
 */
router.post('/events', async (req, res) => {
  try {
    const event = req.body;

    // Validate required fields
    if (!event.test_id || !event.variant_id || !event.event_type) {
      return res.status(400).json({
        status: 'error',
        message: 'Event must have test_id, variant_id, and event_type'
      });
    }

    await orchestrator.recordEvent(event);

    res.json({
      status: 'success',
      message: 'Event recorded successfully'
    });
  } catch (error) {
    console.error('Error recording event:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/orchestrate
 * Manually trigger orchestration cycle
 */
router.post('/orchestrate', async (req, res) => {
  try {
    const result = await orchestrator.orchestrate();

    res.json({
      status: 'success',
      data: result,
      message: 'Orchestration completed successfully'
    });
  } catch (error) {
    console.error('Error during orchestration:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/ml/train
 * Train ML model on historical data
 */
router.post('/ml/train', async (req, res) => {
  try {
    const archive = await orchestrator.loadArchive();
    const events = await orchestrator.loadEvents();

    const model = await predictionModel.train(archive.archivedTests, events);

    res.json({
      status: 'success',
      data: { model },
      message: 'Model trained successfully'
    });
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * POST /api/cro/ml/predict
 * Get prediction for a variant configuration
 */
router.post('/ml/predict', async (req, res) => {
  try {
    const variantConfig = req.body;

    const prediction = await predictionModel.predict(variantConfig);

    res.json({
      status: 'success',
      data: prediction
    });
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Helper function
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}d ${hours}h`;
}

module.exports = router;
