const db = require('../lib/db');
const cache = require('../lib/cache');

const fallbackPackages = [
  {
    id: 'bronze',
    name: 'Brons Pakket',
    price: 795,
    duration: '4 uur',
    description: 'Ideaal voor kleinere events met complete basis setup.',
    features: [
      'Professionele DJ',
      'Geluidssysteem',
      'Basisverlichting',
      'Muziekvoorkeuren formulier',
      '100% Dansgarantie'
    ]
  },
  {
    id: 'silver',
    name: 'Zilver Pakket',
    price: 995,
    duration: '5 uur',
    description: 'Meest gekozen pakket met premium licht en geluid.',
    features: [
      'Professionele DJ',
      'Premium geluidssysteem',
      'LED verlichting',
      'Rookmachine',
      'Muziekvoorkeuren formulier',
      'Persoonlijk intakegesprek',
      '100% Dansgarantie'
    ],
    popular: true
  },
  {
    id: 'gold',
    name: 'Goud Pakket',
    price: 1295,
    duration: '6 uur',
    description: 'Voor high-end events met maximale impact.',
    features: [
      'Professionele DJ',
      'Premium geluidssysteem',
      'Moving head verlichting',
      'Rookmachine',
      'DJ booth met logo',
      'Muziekvoorkeuren formulier',
      'Persoonlijk intakegesprek (Premium)',
      'Saxofonist (optioneel)',
      '100% Dansgarantie'
    ]
  }
];

const CACHE_KEY = 'packages-service';
const CACHE_TTL = 5 * 60 * 1000;

function mapDatabasePackages(result) {
  if (!result) return null;
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: Number(row.price),
    duration: row.duration,
    description: row.description,
    features: Array.isArray(row.features)
      ? row.features
      : row.features
        ? row.features
        : [],
    popular: row.popular
  }));
}

async function getPackages({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return { ...cached, cacheStatus: 'hit' };
    }
  }

  let response = {
    packages: fallbackPackages,
    source: 'static'
  };

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, price, duration, description, features, popular
         FROM packages
         WHERE active IS DISTINCT FROM FALSE
         ORDER BY price ASC`
      );

      const packages = mapDatabasePackages(result);
      if (packages && packages.length > 0) {
        response = {
          packages,
          source: 'database'
        };
      }
    } catch (error) {
      console.error('[packageService] Failed to load packages from database:', error.message);
    }
  }

  cache.set(CACHE_KEY, response, CACHE_TTL);
  return { ...response, cacheStatus: 'refreshed' };
}

function resetCache() {
  cache.del(CACHE_KEY);
}

module.exports = {
  getPackages,
  resetCache
};
