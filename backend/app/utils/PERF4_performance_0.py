// cloudflare-setup.js
const cloudflare = require('cloudflare');

class CloudflareSetup {
    constructor(apiToken, zoneId) {
        // Initialize Cloudflare client with API credentials
        this.cf = new cloudflare({
            token: apiToken
        });
        this.zoneId = zoneId;
    }

    /**
     * Initialize basic CDN configuration
     * @returns {Promise<Object>} Setup result
     */
    async initializeBasicSetup() {
        try {
            // Basic security settings
            await this.setupSecurityRules();
            // Cache optimization
            await this.setupCacheRules();
            // Performance optimization
            await this.setupPerformanceRules();

            return { success: true, message: 'CDN setup completed successfully' };
        } catch (error) {
            console.error('CDN setup failed:', error);
            throw new Error(`CDN setup failed: ${error.message}`);
        }
    }

    /**
     * Configure security settings
     * @private
     */
    async setupSecurityRules() {
        try {
            await this.cf.zoneSettings.edit(this.zoneId, {
                ssl: 'strict',
                always_use_https: 'on',
                security_level: 'medium',
                browser_check: 'on',
                email_obfuscation: 'on',
                hotlink_protection: 'on'
            });
        } catch (error) {
            throw new Error(`Security setup failed: ${error.message}`);
        }
    }

    /**
     * Configure cache rules
     * @private
     */
    async setupCacheRules() {
        try {
            // Set up browser cache TTL
            await this.cf.zoneSettings.edit(this.zoneId, {
                browser_cache_ttl: 14400, // 4 hours
                cache_level: 'aggressive',
                development_mode: 'off'
            });

            // Create cache rules for static content
            await this.cf.zoneCacheSettings.edit(this.zoneId, {
                path: '/*.{jpg,jpeg,png,gif,ico,css,js}',
                cache_level: 'cache_everything',
                edge_cache_ttl: 86400, // 24 hours
                browser_cache_ttl: 43200 // 12 hours
            });
        } catch (error) {
            throw new Error(`Cache setup failed: ${error.message}`);
        }
    }

    /**
     * Configure performance rules
     * @private
     */
    async setupPerformanceRules() {
        try {
            await this.cf.zoneSettings.edit(this.zoneId, {
                minify: {
                    css: 'on',
                    html: 'on',
                    js: 'on'
                },
                brotli: 'on',
                early_hints: 'on',
                rocket_loader: 'on',
                mobile_redirect: {
                    status: 'off'
                }
            });
        } catch (error) {
            throw new Error(`Performance setup failed: ${error.message}`);
        }
    }

    /**
     * Monitor CDN performance
     * @returns {Promise<Object>} Performance metrics
     */
    async getPerformanceMetrics() {
        try {
            const analytics = await this.cf.zoneAnalytics.dashboard({
                zoneId: this.zoneId,
                since: -43200 // Last 12 hours
            });

            return {
                requests: analytics.requests.all,
                bandwidth: analytics.bandwidth.all,
                cachedRequests: analytics.requests.cached,
                cacheRate: analytics.requests.cached / analytics.requests.all * 100
            };
        } catch (error) {
            throw new Error(`Failed to fetch metrics: ${error.message}`);
        }
    }
}

// Usage example
async function setupCloudflare() {
    const cdnSetup = new CloudflareSetup(
        'your-api-token',
        'your-zone-id'
    );

    try {
        // Initialize CDN
        await cdnSetup.initializeBasicSetup();

        // Monitor performance
        const metrics = await cdnSetup.getPerformanceMetrics();
        console.log('CDN Performance Metrics:', metrics);
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

// Configuration validation
function validateConfig(config) {
    const requiredFields = ['apiToken', 'zoneId', 'domain'];
    for (const field of requiredFields) {
        if (!config[field]) {
            throw new Error(`Missing required configuration: ${field}`);
        }
    }
}

module.exports = {
    CloudflareSetup,
    validateConfig
};
