/**
 * CRO Orchestrator
 * Main orchestration service for automated A/B testing and optimization
 */

const fs = require('fs').promises;
const path = require('path');
const DecisionEngine = require('./decisionEngine');
const PerformanceAnalyzer = require('./performanceAnalyzer');
const VariantGenerator = require('./variantGenerator');

class CROOrchestrator {
  constructor(config = null) {
    this.config = config || require('../../config/cro-config.json');
    this.decisionEngine = new DecisionEngine(this.config);
    this.performanceAnalyzer = new PerformanceAnalyzer(this.config);
    this.variantGenerator = new VariantGenerator(this.config);

    this.dataDir = path.join(__dirname, '../../../data/cro');
    this.testsFile = path.join(this.dataDir, 'active-tests.json');
    this.archiveFile = path.join(this.dataDir, 'test-archive.json');
    this.eventsFile = path.join(this.dataDir, 'test-events.json');
  }

  /**
   * Initialize data directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      // Create files if they don't exist
      try {
        await fs.access(this.testsFile);
      } catch {
        await fs.writeFile(this.testsFile, JSON.stringify({ tests: [] }, null, 2));
      }

      try {
        await fs.access(this.archiveFile);
      } catch {
        await fs.writeFile(this.archiveFile, JSON.stringify({ archivedTests: [] }, null, 2));
      }

      try {
        await fs.access(this.eventsFile);
      } catch {
        await fs.writeFile(this.eventsFile, JSON.stringify({ events: [] }, null, 2));
      }
    } catch (error) {
      console.error('Error initializing CRO Orchestrator:', error);
    }
  }

  /**
   * Main orchestration loop - run this periodically (e.g., hourly)
   */
  async orchestrate() {
    await this.initialize();

    console.log('[CRO] Starting orchestration cycle...');

    // 1. Load current tests and events
    const tests = await this.loadActiveTests();
    const events = await this.loadEvents();

    // 2. Calculate metrics for each test
    const testMetrics = this.calculateTestMetrics(tests, events);

    // 3. Evaluate tests and make decisions
    const decisions = await this.decisionEngine.evaluateTests(tests, testMetrics);

    // 4. Execute decisions
    for (const decision of decisions) {
      await this.executeDecision(decision, tests, events);
    }

    // 5. Check if we should start new tests
    if (this.config.automation.auto_start_new_tests) {
      await this.startNewTestsIfNeeded(tests);
    }

    // 6. Update traffic allocation for active tests
    await this.updateTrafficAllocations(tests, testMetrics);

    console.log('[CRO] Orchestration cycle complete');

    return {
      decisions,
      activeTests: tests.length,
      eventsProcessed: events.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate metrics for all tests
   */
  calculateTestMetrics(tests, events) {
    const metrics = {};

    for (const test of tests) {
      metrics[test.id] = {};

      for (const variant of test.variants) {
        const variantEvents = events.filter(e => e.test_id === test.id && e.variant_id === variant.id);

        metrics[test.id][variant.id] = {
          impressions: variantEvents.filter(e => e.event_type === 'impression').length,
          conversions: variantEvents.filter(e => e.event_type === 'conversion').length,
          ...this.calculateDetailedMetrics(variantEvents)
        };
      }
    }

    return metrics;
  }

  /**
   * Calculate detailed metrics from events
   */
  calculateDetailedMetrics(events) {
    const metrics = {};

    for (const goal of this.config.optimization_goals) {
      metrics[goal.name] = events.filter(e => e.event_type === goal.name).length;
    }

    return metrics;
  }

  /**
   * Execute a decision
   */
  async executeDecision(decision, tests, events) {
    console.log(`[CRO] Executing decision for test ${decision.testId}: ${decision.action}`);

    switch (decision.action) {
      case 'declare_winner':
        await this.declareWinner(decision, tests, events);
        break;

      case 'recommend_winner':
        await this.logRecommendation(decision);
        break;

      case 'continue':
        console.log(`[CRO] Test ${decision.testId} continues: ${decision.reason}`);
        break;

      default:
        console.log(`[CRO] Unknown action: ${decision.action}`);
    }
  }

  /**
   * Declare a winner and archive the test
   */
  async declareWinner(decision, tests, events) {
    const test = tests.find(t => t.id === decision.testId);
    if (!test) return;

    console.log(`[CRO] Winner declared for test ${test.name}: ${decision.winner}`);

    // Update test status
    test.status = 'completed';
    test.winner = decision.winner;
    test.completedAt = new Date().toISOString();
    test.decision = decision;

    // Archive test
    await this.archiveTest(test, events.filter(e => e.test_id === test.id));

    // Remove from active tests
    const activeTests = await this.loadActiveTests();
    const updatedTests = activeTests.filter(t => t.id !== test.id);
    await this.saveActiveTests(updatedTests);

    // Update production variant
    await this.updateProductionVariant(test, decision.winner);

    console.log(`[CRO] Test ${test.id} archived successfully`);
  }

  /**
   * Archive completed test
   */
  async archiveTest(test, testEvents) {
    const archive = await this.loadArchive();

    const archivedTest = {
      ...test,
      eventsCount: testEvents.length,
      analysis: await this.performanceAnalyzer.analyzeByVariant([test], testEvents)
    };

    archive.archivedTests.push(archivedTest);
    await fs.writeFile(this.archiveFile, JSON.stringify(archive, null, 2));
  }

  /**
   * Update production variant
   */
  async updateProductionVariant(test, winnerId) {
    const productionConfigFile = path.join(__dirname, '../../../data/cro/production-variants.json');

    let productionConfig = { variants: {} };
    try {
      const data = await fs.readFile(productionConfigFile, 'utf8');
      productionConfig = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    productionConfig.variants[test.targetPage] = {
      testId: test.id,
      variantId: winnerId,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(productionConfigFile, JSON.stringify(productionConfig, null, 2));
  }

  /**
   * Start new tests if under max concurrent limit
   */
  async startNewTestsIfNeeded(currentTests) {
    const activeCount = currentTests.filter(t => t.status === 'active').length;
    const maxConcurrent = this.config.automation.max_concurrent_tests;

    if (activeCount >= maxConcurrent) {
      console.log(`[CRO] Max concurrent tests reached (${activeCount}/${maxConcurrent})`);
      return;
    }

    const slotsAvailable = maxConcurrent - activeCount;
    console.log(`[CRO] ${slotsAvailable} test slots available`);

    // Generate new test hypotheses
    const hypotheses = await this.variantGenerator.generateTestHypotheses();

    // Start tests for top hypotheses
    for (let i = 0; i < Math.min(slotsAvailable, hypotheses.length); i++) {
      await this.startNewTest(hypotheses[i]);
    }
  }

  /**
   * Start a new test
   */
  async startNewTest(hypothesis) {
    const test = {
      id: this.generateTestId(),
      name: hypothesis.hypothesis,
      type: hypothesis.type,
      status: 'active',
      startDate: new Date().toISOString(),
      hypothesis: hypothesis.hypothesis,
      expectedImpact: hypothesis.expectedImpact,
      targetPage: this.getTargetPage(hypothesis.type),
      variants: hypothesis.variants.map((v, i) => ({
        id: `variant_${i}`,
        ...v,
        trafficAllocation: 100 / hypothesis.variants.length
      }))
    };

    const tests = await this.loadActiveTests();
    tests.push(test);
    await this.saveActiveTests(tests);

    console.log(`[CRO] New test started: ${test.name} (ID: ${test.id})`);

    return test;
  }

  /**
   * Update traffic allocations using smart allocation
   */
  async updateTrafficAllocations(tests, testMetrics) {
    if (!this.config.smart_allocation.enabled) return;

    for (const test of tests) {
      if (test.status !== 'active') continue;

      const metrics = testMetrics[test.id];
      if (!metrics) continue;

      // Calculate new allocations
      const allocations = this.decisionEngine.calculateTrafficAllocation(test.variants, metrics);

      // Update test
      for (const variant of test.variants) {
        variant.trafficAllocation = allocations[variant.id];
      }
    }

    await this.saveActiveTests(tests);
  }

  /**
   * Log recommendation for manual review
   */
  async logRecommendation(decision) {
    const recommendationsFile = path.join(this.dataDir, 'recommendations.json');

    let recommendations = { items: [] };
    try {
      const data = await fs.readFile(recommendationsFile, 'utf8');
      recommendations = JSON.parse(data);
    } catch {
      // File doesn't exist
    }

    recommendations.items.push({
      ...decision,
      timestamp: new Date().toISOString(),
      status: 'pending_review'
    });

    await fs.writeFile(recommendationsFile, JSON.stringify(recommendations, null, 2));
  }

  /**
   * Load active tests
   */
  async loadActiveTests() {
    try {
      const data = await fs.readFile(this.testsFile, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.tests || [];
    } catch {
      return [];
    }
  }

  /**
   * Save active tests
   */
  async saveActiveTests(tests) {
    await fs.writeFile(this.testsFile, JSON.stringify({ tests }, null, 2));
  }

  /**
   * Load test archive
   */
  async loadArchive() {
    try {
      const data = await fs.readFile(this.archiveFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return { archivedTests: [] };
    }
  }

  /**
   * Load events
   */
  async loadEvents() {
    try {
      const data = await fs.readFile(this.eventsFile, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.events || [];
    } catch {
      return [];
    }
  }

  /**
   * Record event (called by tracking system)
   */
  async recordEvent(event) {
    const events = await this.loadEvents();

    events.push({
      ...event,
      timestamp: new Date().toISOString(),
      id: this.generateEventId()
    });

    // Keep last 10000 events
    if (events.length > 10000) {
      events.shift();
    }

    await fs.writeFile(this.eventsFile, JSON.stringify({ events }, null, 2));
  }

  /**
   * Generate unique test ID
   */
  generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique event ID
   */
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get target page for test type
   */
  getTargetPage(testType) {
    const mapping = {
      'hero_content': 'homepage',
      'hero_video_length': 'homepage',
      'hero_event_type': 'homepage',
      'gallery_order': 'gallery',
      'gallery_grid': 'gallery',
      'cta_text': 'homepage',
      'cta_color': 'homepage',
      'cta_placement': 'homepage',
      'content_order': 'homepage',
      'form_placement': 'homepage',
      'testimonial_placement': 'homepage',
      'event_specific_landing': 'landing_page',
      'image_framing': 'homepage'
    };

    return mapping[testType] || 'homepage';
  }

  /**
   * Get system status
   */
  async getStatus() {
    const tests = await this.loadActiveTests();
    const events = await this.loadEvents();
    const archive = await this.loadArchive();

    return {
      activeTests: tests.filter(t => t.status === 'active').length,
      totalTests: tests.length,
      archivedTests: archive.archivedTests.length,
      totalEvents: events.length,
      config: {
        automationEnabled: this.config.automation.enabled,
        maxConcurrentTests: this.config.automation.max_concurrent_tests,
        autoDeclaration: this.config.automation.auto_declare_winners
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get test by ID
   */
  async getTest(testId) {
    const tests = await this.loadActiveTests();
    return tests.find(t => t.id === testId);
  }

  /**
   * Manually create a test
   */
  async createTest(testConfig) {
    const test = {
      id: this.generateTestId(),
      status: 'active',
      startDate: new Date().toISOString(),
      ...testConfig
    };

    const tests = await this.loadActiveTests();
    tests.push(test);
    await this.saveActiveTests(tests);

    return test;
  }

  /**
   * Manually end a test
   */
  async endTest(testId, winnerId = null) {
    const tests = await this.loadActiveTests();
    const test = tests.find(t => t.id === testId);

    if (!test) {
      throw new Error('Test not found');
    }

    if (winnerId) {
      const events = await this.loadEvents();
      await this.declareWinner(
        {
          testId,
          winner: winnerId,
          action: 'declare_winner',
          confidence: 'manual'
        },
        tests,
        events
      );
    } else {
      test.status = 'ended';
      test.completedAt = new Date().toISOString();
      await this.saveActiveTests(tests);
    }

    return test;
  }
}

module.exports = CROOrchestrator;
