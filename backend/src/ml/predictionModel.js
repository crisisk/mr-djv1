/**
 * CRO ML Prediction Model
 * Simple machine learning model for predicting performance and making recommendations
 */

const fs = require('fs').promises;
const path = require('path');

class PredictionModel {
  constructor() {
    this.modelDataPath = path.join(__dirname, '../../../data/cro/model-data.json');
    this.features = [
      'image_aspect_ratio',
      'has_people',
      'event_type',
      'video_duration',
      'time_of_day',
      'day_of_week',
      'device_type',
      'is_mobile'
    ];
  }

  /**
   * Train model on historical data
   */
  async train(historicalTests, historicalEvents) {
    console.log('[ML] Training prediction model...');

    // Extract features and outcomes
    const trainingData = this.prepareTrainingData(historicalTests, historicalEvents);

    // Build simple decision rules (decision tree approach)
    const rules = this.buildDecisionRules(trainingData);

    // Calculate feature importance
    const featureImportance = this.calculateFeatureImportance(trainingData);

    // Save model
    const model = {
      rules,
      featureImportance,
      trainedAt: new Date().toISOString(),
      sampleSize: trainingData.length
    };

    await this.saveModel(model);

    console.log('[ML] Model trained successfully');
    return model;
  }

  /**
   * Prepare training data from historical tests
   */
  prepareTrainingData(tests, events) {
    const data = [];

    for (const test of tests) {
      if (test.status !== 'completed' || !test.winner) continue;

      for (const variant of test.variants) {
        const variantEvents = events.filter(e => e.test_id === test.id && e.variant_id === variant.id);

        if (variantEvents.length === 0) continue;

        const features = this.extractFeatures(variant, variantEvents, test);
        const outcome = {
          isWinner: variant.id === test.winner,
          conversionRate: this.calculateConversionRate(variantEvents),
          engagementScore: this.calculateEngagementScore(variantEvents)
        };

        data.push({ features, outcome, variant, test });
      }
    }

    return data;
  }

  /**
   * Extract features from variant and events
   */
  extractFeatures(variant, events, test) {
    const features = {};

    // Image/Video features
    if (variant.config?.asset) {
      const asset = variant.config.asset;

      if (asset.dimensions) {
        features.image_aspect_ratio = asset.dimensions.width / asset.dimensions.height;
      }

      features.event_type = asset.subcategory || test.type;
      features.has_people = asset.subcategory === 'parties' || asset.subcategory === 'weddings';
    }

    if (variant.config?.type === 'video' && variant.config?.asset?.duration) {
      features.video_duration = variant.config.asset.duration;
      features.is_video = true;
    } else {
      features.is_video = false;
    }

    // Temporal features
    const timeDistribution = this.analyzeTimeDistribution(events);
    features.peak_time_of_day = timeDistribution.peakTime;
    features.peak_day_of_week = timeDistribution.peakDay;

    // Device features
    const deviceDistribution = this.analyzeDeviceDistribution(events);
    features.mobile_percentage = deviceDistribution.mobile;
    features.desktop_percentage = deviceDistribution.desktop;

    return features;
  }

  /**
   * Build decision rules from training data
   */
  buildDecisionRules(trainingData) {
    const rules = [];

    // Rule: Video duration impact
    const videoData = trainingData.filter(d => d.features.is_video);
    if (videoData.length > 5) {
      const shortVideos = videoData.filter(d => d.features.video_duration <= 20);
      const longVideos = videoData.filter(d => d.features.video_duration > 20);

      const shortConvRate = this.averageConversionRate(shortVideos);
      const longConvRate = this.averageConversionRate(longVideos);

      rules.push({
        rule: 'optimal_video_duration',
        condition: shortConvRate > longConvRate ? 'short' : 'long',
        confidence: Math.abs(shortConvRate - longConvRate) / Math.max(shortConvRate, longConvRate),
        recommendation: shortConvRate > longConvRate
          ? 'Use videos under 20 seconds for better conversion'
          : 'Longer videos (>20s) perform better',
        data: {
          shortVideos: { count: shortVideos.length, avgConvRate: shortConvRate },
          longVideos: { count: longVideos.length, avgConvRate: longConvRate }
        }
      });
    }

    // Rule: Image aspect ratio impact
    const imageData = trainingData.filter(d => !d.features.is_video && d.features.image_aspect_ratio);
    if (imageData.length > 5) {
      const landscape = imageData.filter(d => d.features.image_aspect_ratio > 1.5);
      const standard = imageData.filter(d => d.features.image_aspect_ratio <= 1.5);

      const landscapeConvRate = this.averageConversionRate(landscape);
      const standardConvRate = this.averageConversionRate(standard);

      rules.push({
        rule: 'optimal_image_aspect_ratio',
        condition: landscapeConvRate > standardConvRate ? 'landscape' : 'standard',
        confidence: Math.abs(landscapeConvRate - standardConvRate) / Math.max(landscapeConvRate, standardConvRate),
        recommendation: landscapeConvRate > standardConvRate
          ? 'Wide landscape images (>1.5 ratio) convert better'
          : 'Standard aspect ratio images perform better',
        data: {
          landscape: { count: landscape.length, avgConvRate: landscapeConvRate },
          standard: { count: standard.length, avgConvRate: standardConvRate }
        }
      });
    }

    // Rule: Event type impact
    const eventTypes = ['weddings', 'parties', 'corporate'];
    const eventTypePerformance = {};

    for (const eventType of eventTypes) {
      const typeData = trainingData.filter(d => d.features.event_type === eventType);
      if (typeData.length > 0) {
        eventTypePerformance[eventType] = {
          count: typeData.length,
          avgConvRate: this.averageConversionRate(typeData),
          avgEngagement: this.averageEngagement(typeData)
        };
      }
    }

    if (Object.keys(eventTypePerformance).length > 1) {
      const bestType = Object.entries(eventTypePerformance)
        .sort(([, a], [, b]) => b.avgConvRate - a.avgConvRate)[0];

      rules.push({
        rule: 'optimal_event_type',
        condition: bestType[0],
        confidence: 0.7,
        recommendation: `${bestType[0]} content performs best for conversions`,
        data: eventTypePerformance
      });
    }

    // Rule: Mobile vs Desktop performance
    const mobileHeavy = trainingData.filter(d => d.features.mobile_percentage > 60);
    const desktopHeavy = trainingData.filter(d => d.features.desktop_percentage > 60);

    if (mobileHeavy.length > 3 && desktopHeavy.length > 3) {
      const mobileConvRate = this.averageConversionRate(mobileHeavy);
      const desktopConvRate = this.averageConversionRate(desktopHeavy);

      rules.push({
        rule: 'device_optimization',
        condition: mobileConvRate > desktopConvRate ? 'mobile_first' : 'desktop_first',
        confidence: Math.abs(mobileConvRate - desktopConvRate) / Math.max(mobileConvRate, desktopConvRate),
        recommendation: mobileConvRate > desktopConvRate
          ? 'Optimize for mobile users - they convert better'
          : 'Desktop users show higher conversion rates',
        data: {
          mobile: { count: mobileHeavy.length, avgConvRate: mobileConvRate },
          desktop: { count: desktopHeavy.length, avgConvRate: desktopConvRate }
        }
      });
    }

    // Rule: Best time of day
    const timeSlots = this.groupByTimeSlot(trainingData);
    if (Object.keys(timeSlots).length > 1) {
      const bestTime = Object.entries(timeSlots)
        .sort(([, a], [, b]) => b.avgConvRate - a.avgConvRate)[0];

      rules.push({
        rule: 'optimal_time_of_day',
        condition: bestTime[0],
        confidence: 0.6,
        recommendation: `${bestTime[0]} shows best conversion performance`,
        data: timeSlots
      });
    }

    return rules;
  }

  /**
   * Calculate feature importance
   */
  calculateFeatureImportance(trainingData) {
    const importance = {};

    for (const feature of this.features) {
      // Simple variance-based importance
      const values = trainingData
        .map(d => d.features[feature])
        .filter(v => v !== undefined && v !== null);

      if (values.length < 2) {
        importance[feature] = 0;
        continue;
      }

      // Calculate correlation with conversion rate
      const correlation = this.calculateCorrelation(
        values,
        trainingData.map(d => d.outcome.conversionRate)
      );

      importance[feature] = Math.abs(correlation);
    }

    // Normalize
    const total = Object.values(importance).reduce((sum, v) => sum + v, 0);
    if (total > 0) {
      for (const feature in importance) {
        importance[feature] = (importance[feature] / total * 100).toFixed(2);
      }
    }

    return importance;
  }

  /**
   * Predict performance for a variant
   */
  async predict(variantConfig) {
    const model = await this.loadModel();
    if (!model) {
      return {
        prediction: 'unknown',
        confidence: 0,
        reason: 'Model not trained yet'
      };
    }

    // Extract features from variant config
    const features = this.extractFeaturesFromConfig(variantConfig);

    // Apply decision rules
    const predictions = [];

    for (const rule of model.rules) {
      const ruleApplies = this.checkRule(rule, features);
      if (ruleApplies) {
        predictions.push({
          rule: rule.rule,
          recommendation: rule.recommendation,
          confidence: rule.confidence
        });
      }
    }

    // Calculate overall prediction
    const avgConfidence = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      : 0;

    return {
      predictions,
      overallConfidence: (avgConfidence * 100).toFixed(2) + '%',
      featureImportance: model.featureImportance,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recommendations for content creation
   */
  async getContentRecommendations() {
    const model = await this.loadModel();
    if (!model) {
      return {
        recommendations: [],
        message: 'Model not trained yet'
      };
    }

    const recommendations = model.rules.map(rule => ({
      category: rule.rule,
      recommendation: rule.recommendation,
      confidence: (rule.confidence * 100).toFixed(0) + '%',
      priority: this.getPriority(rule.confidence)
    }));

    return {
      recommendations: recommendations.sort((a, b) =>
        parseFloat(b.confidence) - parseFloat(a.confidence)
      ),
      featureImportance: model.featureImportance,
      trainedAt: model.trainedAt,
      sampleSize: model.sampleSize
    };
  }

  /**
   * Predict optimal variant for specific conditions
   */
  async predictOptimalVariant(conditions) {
    const model = await this.loadModel();
    if (!model) return null;

    // Apply rules based on conditions
    const scores = {};

    for (const rule of model.rules) {
      if (this.ruleMatchesConditions(rule, conditions)) {
        scores[rule.condition] = (scores[rule.condition] || 0) + rule.confidence;
      }
    }

    // Return highest scoring condition
    const optimal = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0];

    return optimal ? {
      recommendation: optimal[0],
      confidence: (optimal[1] * 100).toFixed(2) + '%',
      conditions
    } : null;
  }

  // Helper methods

  extractFeaturesFromConfig(config) {
    const features = {};

    if (config.asset?.dimensions) {
      features.image_aspect_ratio = config.asset.dimensions.width / config.asset.dimensions.height;
    }

    if (config.type === 'video' && config.asset?.duration) {
      features.video_duration = config.asset.duration;
      features.is_video = true;
    }

    features.event_type = config.asset?.subcategory;

    return features;
  }

  checkRule(rule, features) {
    switch (rule.rule) {
      case 'optimal_video_duration':
        return features.is_video === true;

      case 'optimal_image_aspect_ratio':
        return !features.is_video && features.image_aspect_ratio;

      case 'optimal_event_type':
        return features.event_type !== undefined;

      default:
        return true;
    }
  }

  ruleMatchesConditions(rule, conditions) {
    if (conditions.device && rule.rule === 'device_optimization') {
      return (conditions.device === 'mobile' && rule.condition === 'mobile_first') ||
             (conditions.device === 'desktop' && rule.condition === 'desktop_first');
    }

    if (conditions.timeOfDay && rule.rule === 'optimal_time_of_day') {
      return conditions.timeOfDay === rule.condition;
    }

    if (conditions.eventType && rule.rule === 'optimal_event_type') {
      return conditions.eventType === rule.condition;
    }

    return false;
  }

  calculateConversionRate(events) {
    const impressions = events.filter(e => e.event_type === 'impression').length;
    const conversions = events.filter(e => e.event_type === 'conversion').length;
    return impressions > 0 ? conversions / impressions : 0;
  }

  calculateEngagementScore(events) {
    // Simplified engagement score
    const impressions = events.filter(e => e.event_type === 'impression').length;
    if (impressions === 0) return 0;

    let score = 0;
    score += events.filter(e => e.event_type === 'video_play').length * 20;
    score += events.filter(e => e.event_type === 'scroll_depth_75').length * 10;
    score += events.filter(e => e.event_type === 'gallery_interaction').length * 15;

    return score / impressions;
  }

  averageConversionRate(data) {
    if (data.length === 0) return 0;
    return data.reduce((sum, d) => sum + d.outcome.conversionRate, 0) / data.length;
  }

  averageEngagement(data) {
    if (data.length === 0) return 0;
    return data.reduce((sum, d) => sum + d.outcome.engagementScore, 0) / data.length;
  }

  analyzeTimeDistribution(events) {
    const hours = {};

    for (const event of events) {
      if (!event.timestamp) continue;
      const hour = new Date(event.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    }

    const peakHour = Object.entries(hours).sort(([, a], [, b]) => b - a)[0];
    const peakTime = peakHour ? this.getTimeSlot(parseInt(peakHour[0])) : 'unknown';

    const days = {};
    for (const event of events) {
      if (!event.timestamp) continue;
      const day = new Date(event.timestamp).getDay();
      days[day] = (days[day] || 0) + 1;
    }

    const peakDayNum = Object.entries(days).sort(([, a], [, b]) => b - a)[0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDay = peakDayNum ? dayNames[parseInt(peakDayNum[0])] : 'unknown';

    return { peakTime, peakDay };
  }

  analyzeDeviceDistribution(events) {
    const total = events.length;
    if (total === 0) return { mobile: 0, desktop: 0, tablet: 0 };

    const mobile = events.filter(e => e.device_type === 'mobile').length;
    const desktop = events.filter(e => e.device_type === 'desktop').length;
    const tablet = events.filter(e => e.device_type === 'tablet').length;

    return {
      mobile: (mobile / total * 100).toFixed(2),
      desktop: (desktop / total * 100).toFixed(2),
      tablet: (tablet / total * 100).toFixed(2)
    };
  }

  getTimeSlot(hour) {
    if (hour >= 0 && hour < 6) return 'Night';
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Evening';
  }

  groupByTimeSlot(trainingData) {
    const slots = {};

    for (const data of trainingData) {
      const slot = data.features.peak_time_of_day;
      if (!slot) continue;

      if (!slots[slot]) {
        slots[slot] = [];
      }

      slots[slot].push(data);
    }

    const result = {};
    for (const [slot, data] of Object.entries(slots)) {
      result[slot] = {
        count: data.length,
        avgConvRate: this.averageConversionRate(data),
        avgEngagement: this.averageEngagement(data)
      };
    }

    return result;
  }

  calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const numX = x.map(v => typeof v === 'number' ? v : 0);
    const numY = y.slice(0, n);

    const meanX = numX.reduce((a, b) => a + b, 0) / n;
    const meanY = numY.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const dx = numX[i] - meanX;
      const dy = numY[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }

    const denominator = Math.sqrt(denX * denY);
    return denominator === 0 ? 0 : num / denominator;
  }

  getPriority(confidence) {
    if (confidence > 0.7) return 'high';
    if (confidence > 0.4) return 'medium';
    return 'low';
  }

  async saveModel(model) {
    const dir = path.dirname(this.modelDataPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.modelDataPath, JSON.stringify(model, null, 2));
  }

  async loadModel() {
    try {
      const data = await fs.readFile(this.modelDataPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}

module.exports = PredictionModel;
