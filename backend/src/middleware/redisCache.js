const { createRedisConnection } = require('../lib/redis');
const { logger } = require('../lib/logger');

/**
 * Redis response caching middleware for Express
 * Caches GET requests with configurable TTL
 */
class RedisCacheMiddleware {
  constructor(options = {}) {
    this.ttl = options.ttl || 300; // Default 5 minutes
    this.prefix = options.prefix || 'api-cache:';
    this.enabled = process.env.NODE_ENV !== 'test';
    this.client = this.enabled ? createRedisConnection() : null;
    
    if (this.client && this.enabled) {
      this.client.connect().catch(err => {
        logger.error('[redis-cache] Connection failed', err);
        this.enabled = false;
      });
    }
  }

  generateKey(req) {
    // Include query params and path in cache key
    const query = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString() 
      : '';
    return `${this.prefix}${req.path}${query}`;
  }

  middleware() {
    return async (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET' || !this.enabled) {
        return next();
      }

      const cacheKey = this.generateKey(req);

      try {
        // Try to get cached response
        const cached = await this.client.get(cacheKey);
        
        if (cached) {
          logger.debug(`[redis-cache] HIT: ${cacheKey}`);
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Cache-Key', cacheKey);
          
          const data = JSON.parse(cached);
          return res.status(data.status || 200).json(data.body);
        }

        logger.debug(`[redis-cache] MISS: ${cacheKey}`);
        res.setHeader('X-Cache', 'MISS');

        // Intercept res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = async (body) => {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const cacheData = {
                status: res.statusCode,
                body: body,
                timestamp: Date.now()
              };
              
              await this.client.setex(
                cacheKey,
                this.ttl,
                JSON.stringify(cacheData)
              );
              
              logger.debug(`[redis-cache] CACHED: ${cacheKey} (TTL: ${this.ttl}s)`);
            } catch (err) {
              logger.error('[redis-cache] Failed to cache response', err);
            }
          }
          
          return originalJson(body);
        };

        next();
      } catch (error) {
        logger.error('[redis-cache] Error', error);
        // Don't break the request on cache errors
        next();
      }
    };
  }

  /**
   * Clear cache for specific pattern
   */
  async clear(pattern = '*') {
    if (!this.enabled) return 0;
    
    try {
      const keys = await this.client.keys(`${this.prefix}${pattern}`);
      if (keys.length > 0) {
        const deleted = await this.client.del(...keys);
        logger.info(`[redis-cache] Cleared ${deleted} keys matching ${pattern}`);
        return deleted;
      }
      return 0;
    } catch (error) {
      logger.error('[redis-cache] Clear failed', error);
      return 0;
    }
  }

  async close() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

// Factory function for easy middleware creation
function createCacheMiddleware(options) {
  const cache = new RedisCacheMiddleware(options);
  return cache.middleware();
}

// Export both class and factory
module.exports = {
  RedisCacheMiddleware,
  createCacheMiddleware
};
