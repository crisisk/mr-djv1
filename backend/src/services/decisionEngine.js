/**
 * CRO Decision Engine
 * Automated decision-making for A/B test winners using statistical analysis
 */

const fs = require('fs').promises;
const path = require('path');

class DecisionEngine {
  constructor(config = null) {
    this.config = config || require('../../config/cro-config.json');
  }

  /**
   * Evaluate all active tests and make decisions
   */
  async evaluateTests(tests, testMetrics) {
    const decisions = [];

    for (const test of tests) {
      if (test.status !== 'active') continue;

      const decision = await this.evaluateTest(test, testMetrics[test.id]);
      if (decision) {
        decisions.push(decision);
      }
    }

    return decisions;
  }

  /**
   * Evaluate a single test
   */
  async evaluateTest(test, metrics) {
    // Check if test meets minimum requirements
    const readiness = this.checkTestReadiness(test, metrics);
    if (!readiness.ready) {
      return {
        testId: test.id,
        action: 'continue',
        reason: readiness.reason,
        metrics: this.calculateBasicMetrics(metrics)
      };
    }

    // Perform statistical analysis
    const analysis = this.performStatisticalAnalysis(metrics);

    // Make decision based on analysis
    const decision = this.makeDecision(test, analysis);

    return {
      testId: test.id,
      testName: test.name,
      action: decision.action,
      winner: decision.winner,
      confidence: decision.confidence,
      analysis: analysis,
      recommendation: decision.recommendation,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if test has sufficient data for decision
   */
  checkTestReadiness(test, metrics) {
    const minSampleSize = this.config.automation.min_sample_size;
    const maxDuration = this.config.automation.test_duration_max_days;

    // Check minimum impressions per variant
    for (const variant of test.variants) {
      const variantMetrics = metrics[variant.id];
      if (!variantMetrics || variantMetrics.impressions < minSampleSize) {
        return {
          ready: false,
          reason: `Variant ${variant.id} has insufficient impressions (${variantMetrics?.impressions || 0}/${minSampleSize})`
        };
      }
    }

    // Check test duration
    const testAge = this.getTestAgeDays(test.startDate);
    if (testAge > maxDuration) {
      return {
        ready: true,
        reason: `Maximum test duration reached (${testAge}/${maxDuration} days)`,
        forceDecision: true
      };
    }

    return { ready: true };
  }

  /**
   * Perform statistical analysis on test variants
   */
  performStatisticalAnalysis(metrics) {
    const variants = Object.keys(metrics);

    // Calculate conversion rates and confidence intervals
    const variantStats = variants.map(variantId => {
      const m = metrics[variantId];
      const conversionRate = m.conversions / m.impressions;
      const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / m.impressions);
      const z = 1.96; // 95% confidence

      return {
        variantId,
        impressions: m.impressions,
        conversions: m.conversions,
        conversionRate,
        standardError,
        confidenceInterval: {
          lower: conversionRate - (z * standardError),
          upper: conversionRate + (z * standardError)
        },
        metrics: m
      };
    });

    // Sort by conversion rate
    variantStats.sort((a, b) => b.conversionRate - a.conversionRate);

    // Perform Chi-square test between top 2 variants
    const chiSquare = this.chiSquareTest(
      variantStats[0].conversions,
      variantStats[0].impressions,
      variantStats[1].conversions,
      variantStats[1].impressions
    );

    // Calculate effect size (relative difference)
    const effectSize = (variantStats[0].conversionRate - variantStats[1].conversionRate) /
                       variantStats[1].conversionRate;

    return {
      variants: variantStats,
      chiSquare,
      effectSize,
      isSignificant: chiSquare.pValue < this.config.statistical_settings.significance_level,
      meetsEffectSize: Math.abs(effectSize) >= this.config.statistical_settings.minimum_effect_size
    };
  }

  /**
   * Chi-square test for independence
   */
  chiSquareTest(conversions1, impressions1, conversions2, impressions2) {
    const n1 = impressions1;
    const n2 = impressions2;
    const x1 = conversions1;
    const x2 = conversions2;

    // Calculate expected values
    const pooledRate = (x1 + x2) / (n1 + n2);
    const expected1 = n1 * pooledRate;
    const expected2 = n2 * pooledRate;

    // Chi-square statistic
    const chiSquare =
      Math.pow(x1 - expected1, 2) / expected1 +
      Math.pow((n1 - x1) - (n1 - expected1), 2) / (n1 - expected1) +
      Math.pow(x2 - expected2, 2) / expected2 +
      Math.pow((n2 - x2) - (n2 - expected2), 2) / (n2 - expected2);

    // Calculate p-value (approximation for df=1)
    const pValue = this.chiSquareToPValue(chiSquare, 1);

    return {
      statistic: chiSquare,
      pValue,
      degreesOfFreedom: 1
    };
  }

  /**
   * Convert chi-square statistic to p-value (approximation)
   */
  chiSquareToPValue(chiSquare, df) {
    // Simplified approximation for df=1
    if (df === 1) {
      // Using normal approximation
      const z = Math.sqrt(chiSquare);
      return 2 * (1 - this.normalCDF(z));
    }
    return 0.05; // Default fallback
  }

  /**
   * Normal cumulative distribution function
   */
  normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  /**
   * Make decision based on analysis
   */
  makeDecision(test, analysis) {
    const { variants, isSignificant, meetsEffectSize, chiSquare, effectSize } = analysis;
    const autoDeclaration = this.config.automation.auto_declare_winners;

    // Winner is variant with highest conversion rate
    const winner = variants[0];
    const runnerUp = variants[1];

    // Calculate confidence level
    const confidence = (1 - chiSquare.pValue) * 100;

    // Decision logic
    if (isSignificant && meetsEffectSize) {
      return {
        action: autoDeclaration ? 'declare_winner' : 'recommend_winner',
        winner: winner.variantId,
        confidence: confidence.toFixed(2),
        recommendation: `Variant ${winner.variantId} shows statistically significant improvement of ${(effectSize * 100).toFixed(2)}% over ${runnerUp.variantId}`,
        details: {
          winnerRate: (winner.conversionRate * 100).toFixed(2) + '%',
          runnerUpRate: (runnerUp.conversionRate * 100).toFixed(2) + '%',
          improvement: (effectSize * 100).toFixed(2) + '%',
          pValue: chiSquare.pValue.toFixed(4)
        }
      };
    } else if (isSignificant && !meetsEffectSize) {
      return {
        action: 'continue',
        winner: null,
        confidence: confidence.toFixed(2),
        recommendation: `Test is statistically significant but effect size (${(effectSize * 100).toFixed(2)}%) is below threshold (${(this.config.statistical_settings.minimum_effect_size * 100)}%). Consider continuing test or declaring no meaningful difference.`,
        details: {
          winnerRate: (winner.conversionRate * 100).toFixed(2) + '%',
          runnerUpRate: (runnerUp.conversionRate * 100).toFixed(2) + '%',
          improvement: (effectSize * 100).toFixed(2) + '%'
        }
      };
    } else if (!isSignificant && meetsEffectSize) {
      return {
        action: 'continue',
        winner: null,
        confidence: confidence.toFixed(2),
        recommendation: `Large effect size detected (${(effectSize * 100).toFixed(2)}%) but not statistically significant yet. Continue test to gather more data.`,
        details: {
          winnerRate: (winner.conversionRate * 100).toFixed(2) + '%',
          runnerUpRate: (runnerUp.conversionRate * 100).toFixed(2) + '%',
          improvement: (effectSize * 100).toFixed(2) + '%',
          pValue: chiSquare.pValue.toFixed(4)
        }
      };
    } else {
      return {
        action: 'continue',
        winner: null,
        confidence: confidence.toFixed(2),
        recommendation: 'No significant difference detected. Continue test or consider declaring no winner.',
        details: {
          winnerRate: (winner.conversionRate * 100).toFixed(2) + '%',
          runnerUpRate: (runnerUp.conversionRate * 100).toFixed(2) + '%',
          improvement: (effectSize * 100).toFixed(2) + '%'
        }
      };
    }
  }

  /**
   * Calculate basic metrics for a test
   */
  calculateBasicMetrics(metrics) {
    const summary = {};

    for (const [variantId, data] of Object.entries(metrics)) {
      summary[variantId] = {
        impressions: data.impressions,
        conversions: data.conversions,
        conversionRate: ((data.conversions / data.impressions) * 100).toFixed(2) + '%',
        engagementScore: this.calculateEngagementScore(data)
      };
    }

    return summary;
  }

  /**
   * Calculate engagement score based on multiple metrics
   */
  calculateEngagementScore(metrics) {
    const goals = this.config.optimization_goals;
    let totalScore = 0;
    let totalWeight = 0;

    for (const goal of goals) {
      const metricValue = metrics[goal.name] || 0;
      const normalized = metricValue / metrics.impressions;
      totalScore += normalized * goal.weight;
      totalWeight += goal.weight;
    }

    return totalWeight > 0 ? (totalScore / totalWeight * 100).toFixed(2) : 0;
  }

  /**
   * Get test age in days
   */
  getTestAgeDays(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate required sample size for test
   */
  calculateRequiredSampleSize(baselineRate, minimumDetectableEffect, alpha = 0.05, power = 0.8) {
    // Simplified sample size calculation
    const p1 = baselineRate;
    const p2 = baselineRate * (1 + minimumDetectableEffect);
    const pAvg = (p1 + p2) / 2;

    const z_alpha = 1.96; // For alpha = 0.05 (two-tailed)
    const z_beta = 0.84;  // For power = 0.8

    const numerator = Math.pow(z_alpha * Math.sqrt(2 * pAvg * (1 - pAvg)) +
                              z_beta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
    const denominator = Math.pow(p2 - p1, 2);

    return Math.ceil(numerator / denominator);
  }

  /**
   * Calculate smart traffic allocation
   * Reduces traffic to underperforming variants while maintaining statistical validity
   */
  calculateTrafficAllocation(variants, metrics) {
    if (!this.config.smart_allocation.enabled) {
      // Equal allocation
      const allocation = 100 / variants.length;
      return variants.reduce((acc, v) => {
        acc[v.id] = allocation;
        return acc;
      }, {});
    }

    const variantStats = variants.map(v => {
      const m = metrics[v.id];
      return {
        id: v.id,
        conversionRate: m.conversions / m.impressions,
        impressions: m.impressions
      };
    });

    // Sort by performance
    variantStats.sort((a, b) => b.conversionRate - a.conversionRate);

    // Allocate more traffic to better performers
    const minAllocation = this.config.smart_allocation.min_traffic_to_loser;
    const bestPerformer = variantStats[0];

    const allocation = {};
    let remainingTraffic = 100;

    // Give minimum to all losers
    for (let i = 1; i < variantStats.length; i++) {
      allocation[variantStats[i].id] = minAllocation;
      remainingTraffic -= minAllocation;
    }

    // Give remaining to winner
    allocation[bestPerformer.id] = remainingTraffic;

    return allocation;
  }
}

module.exports = DecisionEngine;
