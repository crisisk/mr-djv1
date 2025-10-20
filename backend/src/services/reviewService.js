const db = require('../lib/db');
const cache = require('../lib/cache');

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} name
 * @property {string} eventType
 * @property {string} category
 * @property {number} rating
 * @property {string} reviewText
 * @property {string} [createdAt]
 */

const ALLOWED_CATEGORIES = ['bruiloft', 'bedrijfsfeest', 'private'];
const CATEGORY_KEYWORDS = [
  { matchers: ['bedrijfs', 'corporate', 'business'], category: 'bedrijfsfeest' },
  { matchers: ['jubile', 'verjaardag', 'private'], category: 'private' },
];

const normalizeCategory = (value = '', eventType = '') => {
  const source = `${value} ${eventType}`.trim().toLowerCase();
  if (!source) return 'bruiloft';

  if (ALLOWED_CATEGORIES.includes(source)) {
    return source;
  }

  for (const { matchers, category } of CATEGORY_KEYWORDS) {
    if (matchers.some((keyword) => source.includes(keyword))) {
      return category;
    }
  }

  return 'bruiloft';
};

const normalizeReview = (review) => {
  if (!review) return review;
  const eventType = review.eventType || review.event_type || '';
  const category = normalizeCategory(review.category, eventType);

  return {
    ...review,
    eventType,
    category,
  };
};

const fallbackReviews = [
  {
    id: 'sarah-tom',
    name: 'Sarah & Tom',
    eventType: 'Bruiloft 2024',
    category: 'bruiloft',
    rating: 5,
    reviewText:
      'Mister DJ maakte onze bruiloft onvergetelijk! De dansvloer was de hele avond vol en de muziekkeuze was perfect. Onze gasten praten er nog steeds over!',
    moderationState: 'approved'
  },
  {
    id: 'mark-van-der-berg',
    name: 'Mark van der Berg',
    eventType: 'Corporate Event 2024',
    category: 'bedrijfsfeest',
    rating: 5,
    reviewText:
      'Professioneel, betrouwbaar en geweldig in het lezen van het publiek. Ons bedrijfsfeest was een groot succes dankzij Mister DJ!',
    moderationState: 'approved'
  },
  {
    id: 'linda-janssen',
    name: 'Linda Janssen',
    eventType: '50 Jaar Jubileum 2024',
    category: 'private',
    rating: 5,
    reviewText:
      'Van begin tot eind perfect geregeld. De 100% dansgarantie is geen loze belofte - iedereen stond op de dansvloer!',
    moderationState: 'approved'
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
    const cached = await cache.get(CACHE_KEY);
    if (cached) {
      return { ...cached, cacheStatus: 'hit' };
    }
  }

  let response = {
    reviews: fallbackReviews.map(normalizeReview),
    source: 'static'
  };

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, event_type AS "eventType", category, rating, review_text AS "reviewText", created_at AS "createdAt", approved
         FROM reviews
         WHERE approved = TRUE
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      if (result && Array.isArray(result.rows) && result.rows.length > 0) {
        response = {
          reviews: result.rows.map((row) => {
            const { approved, ...rest } = row;
            return {
              ...rest,
              moderationState: approved ? 'approved' : 'pending'
            };
          }),
          source: 'database'
        };
      }
    } catch (error) {
      console.error('[reviewService] Failed to load reviews from database:', error.message);
    }
  }

  const normalizedResponse = {
    ...response,
    reviews: response.reviews.map(normalizeReview)
  };

  await cache.set(CACHE_KEY, normalizedResponse, CACHE_TTL);
  return { ...normalizedResponse, cacheStatus: 'refreshed' };
}

async function resetCache() {
  await cache.del(CACHE_KEY);
}

function ping() {
  return {
    ok: true,
    cacheWarm: Boolean(cache.get(CACHE_KEY)),
    databaseConfigured: db.isConfigured()
  };
}

module.exports = {
  getApprovedReviews,
  resetCache,
  ping
};
