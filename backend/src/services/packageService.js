const db = require('../lib/db');

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

async function getPackages() {
  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, price, duration, description, features, popular
         FROM packages
         WHERE active IS DISTINCT FROM FALSE
         ORDER BY price ASC`
      );

      if (result) {
        const packages = result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          price: Number(row.price),
          duration: row.duration,
          description: row.description,
          features: Array.isArray(row.features) ? row.features : row.features ? row.features : [],
          popular: row.popular
        }));

        return {
          packages,
          source: 'database'
        };
      }
    } catch (error) {
      console.error('[packageService] Failed to load packages from database:', error.message);
    }
  }

  return {
    packages: fallbackPackages,
    source: 'static'
  };
}

module.exports = {
  getPackages
};
