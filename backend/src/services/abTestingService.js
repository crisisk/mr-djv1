/**
 * A/B Testing Service
 *
 * Comprehensive service for managing A/B tests with:
 * - Variant management and user bucketing
 * - Impression and conversion tracking
 * - Statistical significance calculation (Chi-square test)
 * - Automated winner selection
 * - Real-time performance analytics
 */

const crypto = require('crypto');

class ABTestingService {
  constructor(db) {
    this.db = db;
    this.MIN_SAMPLE_SIZE = 100;
    this.DEFAULT_CONFIDENCE_LEVEL = 0.95;
  }

  /**
   * Create a new A/B test
   */
  async createTest({
    testId,
    name,
    description,
    type,
    goal,
    minSampleSize = this.MIN_SAMPLE_SIZE,
    confidenceLevel = this.DEFAULT_CONFIDENCE_LEVEL,
    trafficAllocation = 1.0,
    createdBy,
    metadata = {}
  }) {
    const query = `
      INSERT INTO ab_tests (
        test_id, name, description, type, status, goal,
        min_sample_size, confidence_level, traffic_allocation,
        created_by, metadata
      )
      VALUES ($1, $2, $3, $4, 'draft', $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      testId,
      name,
      description,
      type,
      goal,
      minSampleSize,
      confidenceLevel,
      trafficAllocation,
      createdBy,
      JSON.stringify(metadata)
    ];

    const result = await this.db.query(query, values);

    // Log event
    await this.logEvent(testId, 'test_created', { name, type, goal }, createdBy);

    return result.rows[0];
  }

  /**
   * Add a variant to a test
   */
  async addVariant({
    testId,
    variantId,
    name,
    description,
    assetUrl,
    assetType,
    config = {},
    weight = 50,
    isControl = false
  }) {
    const query = `
      INSERT INTO ab_variants (
        test_id, variant_id, name, description,
        asset_url, asset_type, config, weight, is_control
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      testId,
      variantId,
      name,
      description,
      assetUrl,
      assetType,
      JSON.stringify(config),
      weight,
      isControl
    ];

    const result = await this.db.query(query, values);

    // Initialize results entry for this variant
    await this.db.query(
      'INSERT INTO ab_results (test_id, variant_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [testId, variantId]
    );

    await this.logEvent(testId, 'variant_added', { variantId, name }, null);

    return result.rows[0];
  }

  /**
   * Activate a test (start running it)
   */
  async activateTest(testId, activatedBy) {
    const query = `
      UPDATE ab_tests
      SET status = 'active', started_at = CURRENT_TIMESTAMP
      WHERE test_id = $1 AND status = 'draft'
      RETURNING *
    `;

    const result = await this.db.query(query, [testId]);

    if (result.rows.length === 0) {
      throw new Error('Test not found or already active');
    }

    await this.logEvent(testId, 'test_activated', {}, activatedBy);

    return result.rows[0];
  }

  /**
   * Pause a running test
   */
  async pauseTest(testId, pausedBy) {
    const query = `
      UPDATE ab_tests
      SET status = 'paused'
      WHERE test_id = $1 AND status = 'active'
      RETURNING *
    `;

    const result = await this.db.query(query, [testId]);

    if (result.rows.length === 0) {
      throw new Error('Test not found or not active');
    }

    await this.logEvent(testId, 'test_paused', {}, pausedBy);

    return result.rows[0];
  }

  /**
   * Complete a test
   */
  async completeTest(testId, completedBy) {
    const query = `
      UPDATE ab_tests
      SET status = 'completed', ended_at = CURRENT_TIMESTAMP
      WHERE test_id = $1 AND status IN ('active', 'paused')
      RETURNING *
    `;

    const result = await this.db.query(query, [testId]);

    if (result.rows.length === 0) {
      throw new Error('Test not found or already completed');
    }

    await this.logEvent(testId, 'test_completed', {}, completedBy);

    return result.rows[0];
  }

  /**
   * Get active tests
   */
  async getActiveTests() {
    const query = `
      SELECT t.*,
             json_agg(
               json_build_object(
                 'variant_id', v.variant_id,
                 'name', v.name,
                 'description', v.description,
                 'asset_url', v.asset_url,
                 'asset_type', v.asset_type,
                 'config', v.config,
                 'weight', v.weight,
                 'is_control', v.is_control
               ) ORDER BY v.variant_id
             ) as variants
      FROM ab_tests t
      LEFT JOIN ab_variants v ON t.test_id = v.test_id
      WHERE t.status = 'active'
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;

    const result = await this.db.query(query);
    return result.rows;
  }

  /**
   * Get test by ID with all details
   */
  async getTest(testId) {
    const query = `
      SELECT t.*,
             json_agg(
               json_build_object(
                 'variant_id', v.variant_id,
                 'name', v.name,
                 'description', v.description,
                 'asset_url', v.asset_url,
                 'asset_type', v.asset_type,
                 'config', v.config,
                 'weight', v.weight,
                 'is_control', v.is_control
               ) ORDER BY v.variant_id
             ) as variants
      FROM ab_tests t
      LEFT JOIN ab_variants v ON t.test_id = v.test_id
      WHERE t.test_id = $1
      GROUP BY t.id
    `;

    const result = await this.db.query(query, [testId]);
    return result.rows[0] || null;
  }

  /**
   * Assign user to a variant (consistent bucketing)
   * Uses hash-based assignment for consistency
   */
  async assignUserToVariant(testId, userId, sessionId) {
    // Check if user already has an assignment
    const existingQuery = `
      SELECT variant_id FROM ab_user_assignments
      WHERE test_id = $1 AND (user_id = $2 OR session_id = $3)
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY assigned_at DESC
      LIMIT 1
    `;

    const existing = await this.db.query(existingQuery, [testId, userId, sessionId]);

    if (existing.rows.length > 0) {
      return existing.rows[0].variant_id;
    }

    // Get test variants with weights
    const variantsQuery = `
      SELECT variant_id, weight FROM ab_variants
      WHERE test_id = $1
      ORDER BY variant_id
    `;

    const variants = await this.db.query(variantsQuery, [testId]);

    if (variants.rows.length === 0) {
      throw new Error('No variants found for test');
    }

    // Use consistent hashing to assign variant
    const variantId = this.hashBasedSelection(
      userId || sessionId,
      testId,
      variants.rows
    );

    // Store assignment
    const assignQuery = `
      INSERT INTO ab_user_assignments (test_id, user_id, session_id, variant_id, expires_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP + INTERVAL '30 days')
      ON CONFLICT (test_id, user_id, session_id)
      DO UPDATE SET variant_id = $4, assigned_at = CURRENT_TIMESTAMP
      RETURNING variant_id
    `;

    const result = await this.db.query(assignQuery, [testId, userId, sessionId, variantId]);
    return result.rows[0].variant_id;
  }

  /**
   * Hash-based variant selection (consistent bucketing)
   */
  hashBasedSelection(identifier, testId, variants) {
    // Create a hash of the identifier + testId for consistency
    const hash = crypto
      .createHash('md5')
      .update(`${identifier}-${testId}`)
      .digest('hex');

    // Convert hash to number (0-100)
    const hashValue = parseInt(hash.substring(0, 8), 16) % 100;

    // Calculate cumulative weights
    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (hashValue < cumulative) {
        return variant.variant_id;
      }
    }

    // Fallback to first variant
    return variants[0].variant_id;
  }

  /**
   * Track an impression
   */
  async trackImpression({
    testId,
    variantId,
    userId,
    sessionId,
    userAgent,
    ipAddress,
    referrer,
    pageUrl,
    deviceType,
    browser,
    country,
    metadata = {}
  }) {
    const query = `
      INSERT INTO ab_impressions (
        test_id, variant_id, user_id, session_id,
        user_agent, ip_address, referrer, page_url,
        device_type, browser, country, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;

    const values = [
      testId,
      variantId,
      userId,
      sessionId,
      userAgent,
      ipAddress,
      referrer,
      pageUrl,
      deviceType,
      browser,
      country,
      JSON.stringify(metadata)
    ];

    const result = await this.db.query(query, values);

    // Update aggregated results
    await this.updateResults(testId, variantId);

    return result.rows[0].id;
  }

  /**
   * Track a conversion
   */
  async trackConversion({
    testId,
    variantId,
    userId,
    sessionId,
    impressionId,
    conversionType,
    conversionValue = 0,
    userAgent,
    ipAddress,
    pageUrl,
    metadata = {}
  }) {
    // Calculate time to conversion if impression exists
    let timeToConversion = null;
    if (impressionId) {
      const impressionQuery = `
        SELECT created_at FROM ab_impressions WHERE id = $1
      `;
      const impression = await this.db.query(impressionQuery, [impressionId]);
      if (impression.rows.length > 0) {
        const impressionTime = new Date(impression.rows[0].created_at);
        const now = new Date();
        timeToConversion = Math.floor((now - impressionTime) / 1000); // seconds
      }
    }

    const query = `
      INSERT INTO ab_conversions (
        test_id, variant_id, user_id, session_id, impression_id,
        conversion_type, conversion_value, time_to_conversion,
        user_agent, ip_address, page_url, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;

    const values = [
      testId,
      variantId,
      userId,
      sessionId,
      impressionId,
      conversionType,
      conversionValue,
      timeToConversion,
      userAgent,
      ipAddress,
      pageUrl,
      JSON.stringify(metadata)
    ];

    const result = await this.db.query(query, values);

    // Update aggregated results
    await this.updateResults(testId, variantId);

    // Check if test should auto-declare winner
    await this.checkAndDeclareWinner(testId);

    return result.rows[0].id;
  }

  /**
   * Update aggregated results for a variant
   */
  async updateResults(testId, variantId) {
    const query = `
      WITH stats AS (
        SELECT
          COUNT(DISTINCT i.id) as impressions,
          COUNT(DISTINCT c.id) as conversions,
          COALESCE(SUM(c.conversion_value), 0) as total_value,
          COALESCE(AVG(c.time_to_conversion), 0) as avg_time
        FROM ab_impressions i
        LEFT JOIN ab_conversions c ON i.test_id = c.test_id
          AND i.variant_id = c.variant_id
          AND i.user_id = c.user_id
        WHERE i.test_id = $1 AND i.variant_id = $2
      )
      UPDATE ab_results r
      SET
        impressions = s.impressions,
        conversions = s.conversions,
        conversion_rate = CASE
          WHEN s.impressions > 0 THEN s.conversions::numeric / s.impressions::numeric
          ELSE 0
        END,
        total_value = s.total_value,
        avg_value = CASE
          WHEN s.conversions > 0 THEN s.total_value / s.conversions
          ELSE 0
        END,
        avg_time_to_conversion = s.avg_time,
        last_calculated_at = CURRENT_TIMESTAMP
      FROM stats s
      WHERE r.test_id = $1 AND r.variant_id = $2
    `;

    await this.db.query(query, [testId, variantId]);
  }

  /**
   * Calculate statistical significance using Chi-square test
   */
  async calculateStatistics(testId) {
    // Get all variant results
    const query = `
      SELECT variant_id, impressions, conversions, conversion_rate, is_control
      FROM ab_results
      WHERE test_id = $1
      ORDER BY variant_id
    `;

    const results = await this.db.query(query, [testId]);
    const variants = results.rows;

    if (variants.length < 2) {
      return null;
    }

    // Find control variant
    const controlQuery = `
      SELECT v.variant_id FROM ab_variants v
      WHERE v.test_id = $1 AND v.is_control = true
      LIMIT 1
    `;
    const controlResult = await this.db.query(controlQuery, [testId]);
    const controlVariantId = controlResult.rows[0]?.variant_id || variants[0].variant_id;

    const control = variants.find(v => v.variant_id === controlVariantId);

    // Calculate Chi-square for each variant vs control
    for (const variant of variants) {
      if (variant.variant_id === controlVariantId) continue;

      const chiSquare = this.calculateChiSquare(
        control.impressions,
        control.conversions,
        variant.impressions,
        variant.conversions
      );

      const pValue = this.chiSquareToPValue(chiSquare.statistic, 1);
      const isSignificant = pValue < (1 - 0.95); // 95% confidence

      // Calculate uplift vs control
      const uplift = control.conversion_rate > 0
        ? ((variant.conversion_rate - control.conversion_rate) / control.conversion_rate) * 100
        : 0;

      // Calculate confidence intervals (Wilson score interval)
      const ci = this.calculateConfidenceInterval(
        variant.conversions,
        variant.impressions,
        0.95
      );

      // Update results
      const updateQuery = `
        UPDATE ab_results
        SET
          chi_square_statistic = $1,
          p_value = $2,
          is_significant = $3,
          uplift_vs_control = $4,
          confidence_interval_lower = $5,
          confidence_interval_upper = $6,
          last_calculated_at = CURRENT_TIMESTAMP
        WHERE test_id = $7 AND variant_id = $8
      `;

      await this.db.query(updateQuery, [
        chiSquare.statistic,
        pValue,
        isSignificant,
        uplift,
        ci.lower,
        ci.upper,
        testId,
        variant.variant_id
      ]);
    }

    return await this.getTestResults(testId);
  }

  /**
   * Calculate Chi-square statistic
   */
  calculateChiSquare(n1, c1, n2, c2) {
    const total = n1 + n2;
    const totalConversions = c1 + c2;
    const totalNonConversions = (n1 - c1) + (n2 - c2);

    const expected11 = (n1 * totalConversions) / total;
    const expected12 = (n1 * totalNonConversions) / total;
    const expected21 = (n2 * totalConversions) / total;
    const expected22 = (n2 * totalNonConversions) / total;

    const chiSquare =
      Math.pow(c1 - expected11, 2) / expected11 +
      Math.pow((n1 - c1) - expected12, 2) / expected12 +
      Math.pow(c2 - expected21, 2) / expected21 +
      Math.pow((n2 - c2) - expected22, 2) / expected22;

    return {
      statistic: chiSquare,
      degreesOfFreedom: 1
    };
  }

  /**
   * Convert Chi-square statistic to p-value (approximate)
   */
  chiSquareToPValue(chiSquare, df) {
    // Simplified approximation for df=1
    // For production, consider using a statistics library
    if (df === 1) {
      // Using complementary error function approximation
      const z = Math.sqrt(chiSquare);
      return 2 * (1 - this.normalCDF(z));
    }
    return 0.05; // fallback
  }

  /**
   * Normal cumulative distribution function (approximation)
   */
  normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  /**
   * Calculate Wilson score confidence interval
   */
  calculateConfidenceInterval(conversions, impressions, confidenceLevel) {
    if (impressions === 0) {
      return { lower: 0, upper: 0 };
    }

    const p = conversions / impressions;
    const n = impressions;
    const z = 1.96; // 95% confidence

    const denominator = 1 + (z * z) / n;
    const center = (p + (z * z) / (2 * n)) / denominator;
    const margin = (z / denominator) * Math.sqrt((p * (1 - p) / n) + (z * z) / (4 * n * n));

    return {
      lower: Math.max(0, center - margin),
      upper: Math.min(1, center + margin)
    };
  }

  /**
   * Get test results with statistics
   */
  async getTestResults(testId) {
    const query = `
      SELECT
        t.test_id,
        t.name,
        t.status,
        t.goal,
        t.min_sample_size,
        t.confidence_level,
        t.winner_variant_id,
        json_agg(
          json_build_object(
            'variant_id', r.variant_id,
            'variant_name', v.name,
            'is_control', v.is_control,
            'impressions', r.impressions,
            'conversions', r.conversions,
            'conversion_rate', r.conversion_rate,
            'total_value', r.total_value,
            'avg_value', r.avg_value,
            'uplift_vs_control', r.uplift_vs_control,
            'is_significant', r.is_significant,
            'p_value', r.p_value,
            'confidence_interval_lower', r.confidence_interval_lower,
            'confidence_interval_upper', r.confidence_interval_upper,
            'last_calculated_at', r.last_calculated_at
          ) ORDER BY r.variant_id
        ) as results
      FROM ab_tests t
      JOIN ab_results r ON t.test_id = r.test_id
      JOIN ab_variants v ON r.test_id = v.test_id AND r.variant_id = v.variant_id
      WHERE t.test_id = $1
      GROUP BY t.id
    `;

    const result = await this.db.query(query, [testId]);
    return result.rows[0] || null;
  }

  /**
   * Check if test should auto-declare winner
   */
  async checkAndDeclareWinner(testId) {
    const test = await this.getTest(testId);

    if (!test || test.status !== 'active' || test.winner_variant_id) {
      return null;
    }

    // Calculate statistics
    await this.calculateStatistics(testId);

    // Get results
    const results = await this.getTestResults(testId);

    if (!results || !results.results) {
      return null;
    }

    // Check if minimum sample size is reached
    const hasMinSamples = results.results.every(
      r => r.impressions >= test.min_sample_size
    );

    if (!hasMinSamples) {
      return null;
    }

    // Find significant winner
    const significantVariants = results.results.filter(
      r => r.is_significant && r.uplift_vs_control > 0
    );

    if (significantVariants.length === 0) {
      return null;
    }

    // Choose best performing significant variant
    const winner = significantVariants.reduce((best, current) => {
      return current.conversion_rate > best.conversion_rate ? current : best;
    });

    // Declare winner
    return await this.declareWinner(testId, winner.variant_id, 'automatic');
  }

  /**
   * Manually declare a winner
   */
  async declareWinner(testId, variantId, method = 'manual', declaredBy = null) {
    const query = `
      UPDATE ab_tests
      SET
        winner_variant_id = $1,
        winner_selected_at = CURRENT_TIMESTAMP,
        winner_selection_method = $2,
        status = 'completed',
        ended_at = CURRENT_TIMESTAMP
      WHERE test_id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [variantId, method, testId]);

    await this.logEvent(testId, 'winner_declared', {
      variantId,
      method,
      declaredBy
    }, declaredBy);

    return result.rows[0];
  }

  /**
   * Log an event
   */
  async logEvent(testId, eventType, eventData, triggeredBy) {
    const query = `
      INSERT INTO ab_events (test_id, event_type, event_data, triggered_by)
      VALUES ($1, $2, $3, $4)
    `;

    await this.db.query(query, [
      testId,
      eventType,
      JSON.stringify(eventData),
      triggeredBy
    ]);
  }

  /**
   * Get test events (audit log)
   */
  async getTestEvents(testId, limit = 50) {
    const query = `
      SELECT * FROM ab_events
      WHERE test_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await this.db.query(query, [testId, limit]);
    return result.rows;
  }
}

module.exports = ABTestingService;
