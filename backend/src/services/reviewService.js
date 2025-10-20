const db = require('../lib/db');
const cache = require('../lib/cache');

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} name
 * @property {string} eventType
 * @property {number} rating
 * @property {string} reviewText
 * @property {string} [createdAt]
 */

const fallbackReviews = [
  {
    id: 'sarah-tom',
    name: 'Sarah & Tom',
    eventType: 'Bruiloft 2024',
    rating: 5,
    reviewText:
      'Mister DJ maakte onze bruiloft onvergetelijk! De dansvloer was de hele avond vol en de muziekkeuze was perfect. Onze gasten praten er nog steeds over!'
  },
  {
    id: 'mark-van-der-berg',
    name: 'Mark van der Berg',
    eventType: 'Corporate Event 2024',
    rating: 5,
    reviewText:
      'Professioneel, betrouwbaar en geweldig in het lezen van het publiek. Ons bedrijfsfeest was een groot succes dankzij Mister DJ!'
  },
  {
    id: 'linda-janssen',
    name: 'Linda Janssen',
    eventType: '50 Jaar Jubileum 2024',
    rating: 5,
    reviewText:
      'Van begin tot eind perfect geregeld. De 100% dansgarantie is geen loze belofte - iedereen stond op de dansvloer!'
  }
];

const CACHE_KEY = 'reviews-service';
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Retrieves approved reviews with caching and fallback data.
 *
 * @param {number} [limit=12]
 * @param {Object} [options]
 * @param {boolean} [options.forceRefresh]
 * @returns {Promise<{ reviews: Array<Review>, source: string, cacheStatus: string }>}
 */
async function getApprovedReviews(limit = 12, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return { ...cached, cacheStatus: 'hit' };
    }
  }

  let response = {
    reviews: fallbackReviews,
    source: 'static'
  };

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, event_type AS "eventType", rating, review_text AS "reviewText", created_at AS "createdAt"
         FROM reviews
         WHERE approved = TRUE
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      if (result && Array.isArray(result.rows) && result.rows.length > 0) {
        response = {
          reviews: result.rows,
          source: 'database'
        };
      }
    } catch (error) {
      console.error('[reviewService] Failed to load reviews from database:', error.message);
    }
  }

  cache.set(CACHE_KEY, response, CACHE_TTL);
  return { ...response, cacheStatus: 'refreshed' };
}

/**
 * Clears the review cache to force a refresh on next call.
 *
 * @returns {void}
 */
function resetCache() {
  cache.del(CACHE_KEY);
}

module.exports = {
  getApprovedReviews,
  resetCache
};
