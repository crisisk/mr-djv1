/**
 * Redis caching middleware voor performance optimization
 * Cacht GET requests voor specifieke routes
 */

const redis = require('redis');
const { logger } = require('../lib/logger');

let client = null;

// Initialize Redis client
async function initializeRedis() {
  if (client) return client;

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://mr-dj-redis:6379/0';
    client = redis.createClient({ url: redisUrl });

    client.on('error', (err) => {
      logger.error({ err }, 'Redis client error');
    });

    await client.connect();
    logger.info('Redis cache client connected');
    return client;
  } catch (error) {
    logger.warn({ err: error }, 'Redis connection failed, caching disabled');
    return null;
  }
}

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 */
function cacheMiddleware(duration = 3600) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      if (!client) {
        await initializeRedis();
      }

      if (!client) {
        return next(); // Redis not available, skip caching
      }

      const cachedResponse = await client.get(key);

      if (cachedResponse) {
        logger.debug({ key }, 'Cache hit');
        return res.json(JSON.parse(cachedResponse));
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        // Cache the response
        client.setEx(key, duration, JSON.stringify(data)).catch((err) => {
          logger.warn({ err, key }, 'Failed to cache response');
        });

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error({ err: error }, 'Cache middleware error');
      next();
    }
  };
}

/**
 * Clear cache for specific pattern
 */
async function clearCache(pattern = '*') {
  if (!client) return;

  try {
    const keys = await client.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await client.del(keys);
      logger.info({ count: keys.length, pattern }, 'Cache cleared');
    }
  } catch (error) {
    logger.error({ err: error, pattern }, 'Failed to clear cache');
  }
}

module.exports = {
  cacheMiddleware,
  clearCache,
  initializeRedis
};
