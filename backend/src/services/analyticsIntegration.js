/**
 * Analytics Integration Service
 *
 * Integrates A/B testing events with external analytics platforms:
 * - Google Analytics 4 (GA4) Measurement Protocol
 * - Custom event tracking
 * - Real-time conversion funnel analytics
 * - Cross-platform tracking
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class AnalyticsIntegration {
  constructor(config = {}) {
    this.config = {
      ga4MeasurementId: config.ga4MeasurementId || process.env.GA4_MEASUREMENT_ID,
      ga4ApiSecret: config.ga4ApiSecret || process.env.GA4_API_SECRET,
      customWebhookUrl: config.customWebhookUrl || process.env.ANALYTICS_WEBHOOK_URL,
      debugMode: config.debugMode || process.env.ANALYTICS_DEBUG === 'true',
      enabled: config.enabled !== false
    };

    this.ga4Endpoint = this.config.debugMode
      ? 'https://www.google-analytics.com/debug/mp/collect'
      : 'https://www.google-analytics.com/mp/collect';
  }

  /**
   * Track A/B test impression
   */
  async trackImpression({
    testId,
    variantId,
    userId,
    sessionId,
    testName,
    variantName,
    metadata = {}
  }) {
    if (!this.config.enabled) return;

    const event = {
      name: 'ab_test_impression',
      params: {
        test_id: testId,
        variant_id: variantId,
        test_name: testName,
        variant_name: variantName,
        session_id: sessionId,
        ...metadata
      }
    };

    await Promise.all([
      this.sendToGA4(event, userId, sessionId),
      this.sendToCustomWebhook({
        event_type: 'impression',
        test_id: testId,
        variant_id: variantId,
        user_id: userId,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    ]);
  }

  /**
   * Track A/B test conversion
   */
  async trackConversion({
    testId,
    variantId,
    userId,
    sessionId,
    testName,
    variantName,
    conversionType,
    conversionValue = 0,
    metadata = {}
  }) {
    if (!this.config.enabled) return;

    const event = {
      name: 'ab_test_conversion',
      params: {
        test_id: testId,
        variant_id: variantId,
        test_name: testName,
        variant_name: variantName,
        conversion_type: conversionType,
        value: conversionValue,
        session_id: sessionId,
        currency: 'EUR',
        ...metadata
      }
    };

    await Promise.all([
      this.sendToGA4(event, userId, sessionId),
      this.sendToCustomWebhook({
        event_type: 'conversion',
        test_id: testId,
        variant_id: variantId,
        conversion_type: conversionType,
        conversion_value: conversionValue,
        user_id: userId,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    ]);
  }

  /**
   * Track test winner declaration
   */
  async trackWinnerDeclared({
    testId,
    winnerVariantId,
    testName,
    method,
    uplift,
    metadata = {}
  }) {
    if (!this.config.enabled) return;

    const event = {
      name: 'ab_test_winner',
      params: {
        test_id: testId,
        winner_variant_id: winnerVariantId,
        test_name: testName,
        selection_method: method,
        uplift_percentage: uplift,
        ...metadata
      }
    };

    await Promise.all([
      this.sendToGA4(event, null, null),
      this.sendToCustomWebhook({
        event_type: 'winner_declared',
        test_id: testId,
        winner_variant_id: winnerVariantId,
        method,
        uplift,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    ]);
  }

  /**
   * Send event to Google Analytics 4
   */
  async sendToGA4(event, userId, sessionId) {
    if (!this.config.ga4MeasurementId || !this.config.ga4ApiSecret) {
      return;
    }

    const payload = {
      client_id: userId || sessionId || this.generateClientId(),
      events: [
        {
          name: event.name,
          params: {
            engagement_time_msec: 100,
            ...event.params
          }
        }
      ]
    };

    if (userId) {
      payload.user_id = userId;
    }

    const url = `${this.ga4Endpoint}?measurement_id=${this.config.ga4MeasurementId}&api_secret=${this.config.ga4ApiSecret}`;

    try {
      await this.makeHttpRequest(url, 'POST', payload);
    } catch (error) {
      console.error('GA4 tracking error:', error.message);
    }
  }

  /**
   * Send event to custom webhook
   */
  async sendToCustomWebhook(data) {
    if (!this.config.customWebhookUrl) {
      return;
    }

    try {
      await this.makeHttpRequest(this.config.customWebhookUrl, 'POST', data);
    } catch (error) {
      console.error('Custom webhook error:', error.message);
    }
  }

  /**
   * Make HTTP request
   */
  makeHttpRequest(url, method, data) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const postData = JSON.stringify(data);

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 5000
      };

      const req = client.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Generate client ID (fallback)
   */
  generateClientId() {
    return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Track conversion funnel step
   */
  async trackFunnelStep({
    testId,
    variantId,
    userId,
    sessionId,
    stepName,
    stepIndex,
    metadata = {}
  }) {
    if (!this.config.enabled) return;

    const event = {
      name: 'ab_test_funnel_step',
      params: {
        test_id: testId,
        variant_id: variantId,
        funnel_step: stepName,
        funnel_index: stepIndex,
        session_id: sessionId,
        ...metadata
      }
    };

    await this.sendToGA4(event, userId, sessionId);
  }

  /**
   * Track page view with A/B test context
   */
  async trackPageView({
    testId,
    variantId,
    userId,
    sessionId,
    pageUrl,
    pageTitle,
    metadata = {}
  }) {
    if (!this.config.enabled) return;

    const event = {
      name: 'page_view',
      params: {
        page_location: pageUrl,
        page_title: pageTitle,
        ab_test_id: testId,
        ab_variant_id: variantId,
        session_id: sessionId,
        ...metadata
      }
    };

    await this.sendToGA4(event, userId, sessionId);
  }

  /**
   * Batch track multiple events
   */
  async batchTrack(events) {
    if (!this.config.enabled || !events.length) return;

    const promises = events.map(event => {
      switch (event.type) {
        case 'impression':
          return this.trackImpression(event.data);
        case 'conversion':
          return this.trackConversion(event.data);
        case 'funnel_step':
          return this.trackFunnelStep(event.data);
        case 'page_view':
          return this.trackPageView(event.data);
        default:
          return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Create custom event for n8n or other automation
   */
  async sendCustomEvent(eventName, eventData) {
    if (!this.config.enabled) return;

    const event = {
      name: eventName,
      params: eventData
    };

    await Promise.all([
      this.sendToGA4(event, eventData.user_id, eventData.session_id),
      this.sendToCustomWebhook({
        event_type: eventName,
        timestamp: new Date().toISOString(),
        ...eventData
      })
    ]);
  }

  /**
   * Get analytics configuration status
   */
  getStatus() {
    return {
      enabled: this.config.enabled,
      ga4_configured: Boolean(this.config.ga4MeasurementId && this.config.ga4ApiSecret),
      webhook_configured: Boolean(this.config.customWebhookUrl),
      debug_mode: this.config.debugMode
    };
  }
}

module.exports = AnalyticsIntegration;
