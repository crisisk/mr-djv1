const fs = require('fs/promises');
const path = require('path');
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
      'Persoonlijk intakegesprek',
      'Saxofonist (optioneel)',
      '100% Dansgarantie'
    ]
  }
];

const CACHE_KEY = 'packages-service';
const CACHE_TTL = 5 * 60 * 1000;
const CONTENT_PACKAGES_DIR = path.join(__dirname, '../../..', 'content', 'pakketten');

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

  try {
    const files = await fs.readdir(CONTENT_PACKAGES_DIR);
    const packages = [];

    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }

      const content = await fs.readFile(path.join(CONTENT_PACKAGES_DIR, file), 'utf8');
      const parsed = JSON.parse(content);
      packages.push({
        id: parsed.id || parsed.title?.toLowerCase() || file.replace(/\.json$/, ''),
        name: parsed.title || parsed.name,
        price: Number(parsed.price) || 0,
        duration: parsed.duration || null,
        description: parsed.description || '',
        features: Array.isArray(parsed.features) ? parsed.features : [],
        popular: Boolean(parsed.popular),
        order: Number.isFinite(parsed.order) ? parsed.order : Number.MAX_SAFE_INTEGER
      });
    }

    if (packages.length) {
      const sortedPackages = packages
        .sort((a, b) => a.order - b.order)
        .map(({ order, ...pkg }) => pkg);
      response = {
        packages: sortedPackages,
        source: 'content'
      };
    }
  } catch (error) {
    console.error('[packageService] Failed to load packages from content directory:', error.message);
  }

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
