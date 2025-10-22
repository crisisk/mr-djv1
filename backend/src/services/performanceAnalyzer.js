/**
 * CRO Performance Analyzer
 * Analyzes conversion rates, engagement, and performance across dimensions
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceAnalyzer {
  constructor(config = null) {
    this.config = config || require('../../config/cro-config.json');
  }

  /**
   * Analyze performance across all dimensions
   */
  async analyzeComprehensive(testData, eventData) {
    return {
      overall: this.analyzeOverall(testData, eventData),
      byVariant: this.analyzeByVariant(testData, eventData),
      byDevice: this.analyzeByDevice(eventData),
      byGeography: this.analyzeByGeography(eventData),
      byEventType: this.analyzeByEventType(eventData),
      byTimeOfDay: this.analyzeByTimeOfDay(eventData),
      byDayOfWeek: this.analyzeByDayOfWeek(eventData),
      engagement: this.analyzeEngagement(eventData),
      timeToConversion: this.analyzeTimeToConversion(eventData)
    };
  }

  /**
   * Analyze overall performance
   */
  analyzeOverall(testData, eventData) {
    const totalImpressions = eventData.filter(e => e.event_type === 'impression').length;
    const totalConversions = eventData.filter(e => e.event_type === 'conversion').length;
    const uniqueUsers = new Set(eventData.map(e => e.user_id || e.session_id)).size;

    return {
      totalImpressions,
      totalConversions,
      uniqueUsers,
      overallConversionRate: this.calculateRate(totalConversions, totalImpressions),
      avgEngagementScore: this.calculateAverageEngagement(eventData)
    };
  }

  /**
   * Analyze performance by variant
   */
  analyzeByVariant(testData, eventData) {
    const variantPerformance = {};

    for (const test of testData) {
      for (const variant of test.variants) {
        const variantEvents = eventData.filter(e => e.variant_id === variant.id);
        const impressions = variantEvents.filter(e => e.event_type === 'impression').length;
        const conversions = variantEvents.filter(e => e.event_type === 'conversion').length;

        variantPerformance[variant.id] = {
          testId: test.id,
          testName: test.name,
          variantId: variant.id,
          variantName: variant.name,
          impressions,
          conversions,
          conversionRate: this.calculateRate(conversions, impressions),
          engagementMetrics: this.calculateEngagementMetrics(variantEvents),
          confidence: this.calculateConfidence(conversions, impressions)
        };
      }
    }

    return variantPerformance;
  }

  /**
   * Analyze performance by device type
   */
  analyzeByDevice(eventData) {
    const devices = ['mobile', 'tablet', 'desktop'];
    const devicePerformance = {};

    for (const device of devices) {
      const deviceEvents = eventData.filter(e => e.device_type === device);
      const impressions = deviceEvents.filter(e => e.event_type === 'impression').length;
      const conversions = deviceEvents.filter(e => e.event_type === 'conversion').length;

      devicePerformance[device] = {
        impressions,
        conversions,
        conversionRate: this.calculateRate(conversions, impressions),
        engagementScore: this.calculateAverageEngagement(deviceEvents),
        avgTimeOnPage: this.calculateAvgTimeOnPage(deviceEvents),
        avgScrollDepth: this.calculateAvgScrollDepth(deviceEvents)
      };
    }

    return devicePerformance;
  }

  /**
   * Analyze performance by geography (city)
   */
  analyzeByGeography(eventData) {
    const citiesMap = {};

    for (const event of eventData) {
      if (!event.city) continue;

      if (!citiesMap[event.city]) {
        citiesMap[event.city] = {
          impressions: 0,
          conversions: 0,
          events: []
        };
      }

      citiesMap[event.city].events.push(event);
      if (event.event_type === 'impression') {
        citiesMap[event.city].impressions++;
      } else if (event.event_type === 'conversion') {
        citiesMap[event.city].conversions++;
      }
    }

    const cityPerformance = {};
    for (const [city, data] of Object.entries(citiesMap)) {
      cityPerformance[city] = {
        impressions: data.impressions,
        conversions: data.conversions,
        conversionRate: this.calculateRate(data.conversions, data.impressions),
        engagementScore: this.calculateAverageEngagement(data.events)
      };
    }

    // Sort by impressions
    return Object.entries(cityPerformance)
      .sort(([, a], [, b]) => b.impressions - a.impressions)
      .reduce((acc, [city, data]) => {
        acc[city] = data;
        return acc;
      }, {});
  }

  /**
   * Analyze performance by event type (wedding vs corporate vs party)
   */
  analyzeByEventType(eventData) {
    const eventTypes = {};

    for (const event of eventData) {
      const type = event.event_category || 'unknown';

      if (!eventTypes[type]) {
        eventTypes[type] = {
          impressions: 0,
          conversions: 0,
          events: []
        };
      }

      eventTypes[type].events.push(event);
      if (event.event_type === 'impression') {
        eventTypes[type].impressions++;
      } else if (event.event_type === 'conversion') {
        eventTypes[type].conversions++;
      }
    }

    const performance = {};
    for (const [type, data] of Object.entries(eventTypes)) {
      performance[type] = {
        impressions: data.impressions,
        conversions: data.conversions,
        conversionRate: this.calculateRate(data.conversions, data.impressions),
        engagementScore: this.calculateAverageEngagement(data.events)
      };
    }

    return performance;
  }

  /**
   * Analyze performance by time of day
   */
  analyzeByTimeOfDay(eventData) {
    const hours = {};

    for (const event of eventData) {
      if (!event.timestamp) continue;

      const hour = new Date(event.timestamp).getHours();
      const timeSlot = this.getTimeSlot(hour);

      if (!hours[timeSlot]) {
        hours[timeSlot] = {
          impressions: 0,
          conversions: 0,
          events: []
        };
      }

      hours[timeSlot].events.push(event);
      if (event.event_type === 'impression') {
        hours[timeSlot].impressions++;
      } else if (event.event_type === 'conversion') {
        hours[timeSlot].conversions++;
      }
    }

    const performance = {};
    for (const [slot, data] of Object.entries(hours)) {
      performance[slot] = {
        impressions: data.impressions,
        conversions: data.conversions,
        conversionRate: this.calculateRate(data.conversions, data.impressions),
        engagementScore: this.calculateAverageEngagement(data.events)
      };
    }

    return performance;
  }

  /**
   * Analyze performance by day of week
   */
  analyzeByDayOfWeek(eventData) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayPerformance = {};

    for (const day of days) {
      dayPerformance[day] = {
        impressions: 0,
        conversions: 0,
        events: []
      };
    }

    for (const event of eventData) {
      if (!event.timestamp) continue;

      const dayName = days[new Date(event.timestamp).getDay()];

      dayPerformance[dayName].events.push(event);
      if (event.event_type === 'impression') {
        dayPerformance[dayName].impressions++;
      } else if (event.event_type === 'conversion') {
        dayPerformance[dayName].conversions++;
      }
    }

    const performance = {};
    for (const [day, data] of Object.entries(dayPerformance)) {
      performance[day] = {
        impressions: data.impressions,
        conversions: data.conversions,
        conversionRate: this.calculateRate(data.conversions, data.impressions),
        engagementScore: this.calculateAverageEngagement(data.events)
      };
    }

    return performance;
  }

  /**
   * Analyze engagement metrics
   */
  analyzeEngagement(eventData) {
    const metrics = {
      scrollDepth: {
        avg: 0,
        distribution: { '25%': 0, '50%': 0, '75%': 0, '100%': 0 }
      },
      timeOnPage: {
        avg: 0,
        distribution: { '<10s': 0, '10-30s': 0, '30-60s': 0, '60s+': 0 }
      },
      videoEngagement: {
        plays: 0,
        completions: 0,
        completionRate: 0
      },
      galleryInteractions: 0,
      ctaClicks: {
        phone: 0,
        whatsapp: 0,
        email: 0,
        form: 0
      }
    };

    let scrollDepthSum = 0;
    let timeOnPageSum = 0;
    let scrollCount = 0;
    let timeCount = 0;

    for (const event of eventData) {
      // Scroll depth
      if (event.scroll_depth) {
        scrollDepthSum += event.scroll_depth;
        scrollCount++;

        if (event.scroll_depth >= 0.25 && event.scroll_depth < 0.5) metrics.scrollDepth.distribution['25%']++;
        else if (event.scroll_depth >= 0.5 && event.scroll_depth < 0.75) metrics.scrollDepth.distribution['50%']++;
        else if (event.scroll_depth >= 0.75 && event.scroll_depth < 1.0) metrics.scrollDepth.distribution['75%']++;
        else if (event.scroll_depth >= 1.0) metrics.scrollDepth.distribution['100%']++;
      }

      // Time on page
      if (event.time_on_page) {
        timeOnPageSum += event.time_on_page;
        timeCount++;

        if (event.time_on_page < 10) metrics.timeOnPage.distribution['<10s']++;
        else if (event.time_on_page < 30) metrics.timeOnPage.distribution['10-30s']++;
        else if (event.time_on_page < 60) metrics.timeOnPage.distribution['30-60s']++;
        else metrics.timeOnPage.distribution['60s+']++;
      }

      // Video engagement
      if (event.event_type === 'video_play') metrics.videoEngagement.plays++;
      if (event.event_type === 'video_complete') metrics.videoEngagement.completions++;

      // Gallery
      if (event.event_type === 'gallery_interaction') metrics.galleryInteractions++;

      // CTA clicks
      if (event.event_type === 'phone_click') metrics.ctaClicks.phone++;
      if (event.event_type === 'whatsapp_click') metrics.ctaClicks.whatsapp++;
      if (event.event_type === 'email_click') metrics.ctaClicks.email++;
      if (event.event_type === 'contact_form_submit') metrics.ctaClicks.form++;
    }

    metrics.scrollDepth.avg = scrollCount > 0 ? (scrollDepthSum / scrollCount * 100).toFixed(2) : 0;
    metrics.timeOnPage.avg = timeCount > 0 ? (timeOnPageSum / timeCount).toFixed(2) : 0;
    metrics.videoEngagement.completionRate = metrics.videoEngagement.plays > 0
      ? ((metrics.videoEngagement.completions / metrics.videoEngagement.plays) * 100).toFixed(2)
      : 0;

    return metrics;
  }

  /**
   * Analyze time to conversion
   */
  analyzeTimeToConversion(eventData) {
    const conversions = eventData.filter(e => e.event_type === 'conversion');
    const timesToConversion = [];

    for (const conversion of conversions) {
      // Find first impression for this user
      const userImpressions = eventData.filter(e =>
        e.event_type === 'impression' &&
        (e.user_id === conversion.user_id || e.session_id === conversion.session_id) &&
        new Date(e.timestamp) < new Date(conversion.timestamp)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      if (userImpressions.length > 0) {
        const firstImpression = userImpressions[0];
        const timeToConversion = (new Date(conversion.timestamp) - new Date(firstImpression.timestamp)) / 1000; // seconds
        timesToConversion.push(timeToConversion);
      }
    }

    if (timesToConversion.length === 0) {
      return {
        avg: 0,
        median: 0,
        distribution: {}
      };
    }

    const sorted = timesToConversion.sort((a, b) => a - b);
    const avg = timesToConversion.reduce((sum, t) => sum + t, 0) / timesToConversion.length;
    const median = sorted[Math.floor(sorted.length / 2)];

    const distribution = {
      '<1min': 0,
      '1-5min': 0,
      '5-15min': 0,
      '15-60min': 0,
      '1hr+': 0
    };

    for (const time of timesToConversion) {
      const minutes = time / 60;
      if (minutes < 1) distribution['<1min']++;
      else if (minutes < 5) distribution['1-5min']++;
      else if (minutes < 15) distribution['5-15min']++;
      else if (minutes < 60) distribution['15-60min']++;
      else distribution['1hr+']++;
    }

    return {
      avg: (avg / 60).toFixed(2) + ' min',
      median: (median / 60).toFixed(2) + ' min',
      distribution
    };
  }

  /**
   * Helper: Calculate conversion rate
   */
  calculateRate(conversions, impressions) {
    if (impressions === 0) return '0.00%';
    return ((conversions / impressions) * 100).toFixed(2) + '%';
  }

  /**
   * Helper: Calculate engagement metrics for events
   */
  calculateEngagementMetrics(events) {
    const metrics = {};

    for (const goal of this.config.optimization_goals) {
      const count = events.filter(e => e.event_type === goal.name).length;
      metrics[goal.name] = count;
    }

    return metrics;
  }

  /**
   * Helper: Calculate average engagement score
   */
  calculateAverageEngagement(events) {
    let totalScore = 0;
    const impressions = events.filter(e => e.event_type === 'impression').length;

    if (impressions === 0) return 0;

    for (const goal of this.config.optimization_goals) {
      const count = events.filter(e => e.event_type === goal.name).length;
      totalScore += (count / impressions) * goal.weight;
    }

    return totalScore.toFixed(2);
  }

  /**
   * Helper: Calculate confidence interval
   */
  calculateConfidence(conversions, impressions) {
    if (impressions === 0) return { lower: 0, upper: 0 };

    const rate = conversions / impressions;
    const se = Math.sqrt((rate * (1 - rate)) / impressions);
    const z = 1.96; // 95% confidence

    return {
      lower: ((rate - z * se) * 100).toFixed(2) + '%',
      upper: ((rate + z * se) * 100).toFixed(2) + '%'
    };
  }

  /**
   * Helper: Get time slot from hour
   */
  getTimeSlot(hour) {
    if (hour >= 0 && hour < 6) return 'Night (0-6)';
    if (hour >= 6 && hour < 12) return 'Morning (6-12)';
    if (hour >= 12 && hour < 18) return 'Afternoon (12-18)';
    return 'Evening (18-24)';
  }

  /**
   * Helper: Calculate average time on page
   */
  calculateAvgTimeOnPage(events) {
    const times = events.filter(e => e.time_on_page).map(e => e.time_on_page);
    if (times.length === 0) return 0;
    return (times.reduce((sum, t) => sum + t, 0) / times.length).toFixed(2);
  }

  /**
   * Helper: Calculate average scroll depth
   */
  calculateAvgScrollDepth(events) {
    const depths = events.filter(e => e.scroll_depth).map(e => e.scroll_depth);
    if (depths.length === 0) return 0;
    return ((depths.reduce((sum, d) => sum + d, 0) / depths.length) * 100).toFixed(2);
  }
}

module.exports = PerformanceAnalyzer;
