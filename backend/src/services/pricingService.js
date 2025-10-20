const fs = require('fs/promises');
const path = require('path');
const { getPackages } = require('./packageService');

/**
 * @typedef {Object} PricingPackage
 * @property {string} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} PricingExtra
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string|null} description
 */

/**
 * @typedef {Object} PricingTotals
 * @property {number} base
 * @property {number} extras
 * @property {number} travel
 * @property {number} grandTotal
 */

/**
 * @typedef {Object} PricingLocation
 * @property {string|null} input
 * @property {string} zone
 * @property {string} label
 * @property {number} travelFee
 */

/**
 * @typedef {Object} PricingQuote
 * @property {string} currency
 * @property {PricingPackage} package
 * @property {PricingExtra[]} extras
 * @property {PricingLocation} location
 * @property {PricingTotals} totals
 * @property {string} updatedAt
 */

const ADDONS_DIR = path.join(__dirname, '../../..', 'content', 'addons');

const fallbackExtras = [
  {
    id: 'photobooth',
    name: 'Photobooth',
    price: 400,
    description: 'Professionele photobooth met onbeperkte prints en digitale galerij'
  },
  {
    id: 'led-vloer',
    name: 'LED Dansvloer',
    price: 550,
    description: 'Verlichte LED dansvloer inclusief installatie en bediening'
  },
  {
    id: 'sparkulars',
    name: 'Sparkulars',
    price: 325,
    description: 'Koud vuurwerk effect voor spectaculaire momenten'
  }
];

/**
 * @typedef {Object} TravelZone
 * @property {string} id
 * @property {string} label
 * @property {number} fee
 * @property {RegExp[]} patterns
 */

/** @type {TravelZone[]} */
const TRAVEL_ZONES = [
  {
    id: 'local',
    label: 'Regio Noord-Brabant & Limburg',
    fee: 0,
    patterns: [
      /eindhoven/i,
      /tilburg/i,
      /den\s*bosch/i,
      /s-hertogenbosch/i,
      /helmond/i,
      /weert/i,
      /venlo/i,
      /roermond/i,
      /maastricht/i,
      /sittard/i,
      /heerlen/i
    ]
  },
  {
    id: 'randstad',
    label: 'Randstad & centraal Nederland',
    fee: 150,
    patterns: [
      /amsterdam/i,
      /rotterdam/i,
      /utrecht/i,
      /den\s*haag/i,
      /haarlem/i,
      /leiden/i,
      /apeldoorn/i,
      /amersfoort/i,
      /zwolle/i
    ]
  },
  {
    id: 'north-east',
    label: 'Noord & Oost Nederland',
    fee: 225,
    patterns: [
      /groningen/i,
      /leeuwarden/i,
      /assen/i,
      /emmen/i,
      /heerenveen/i,
      /meppel/i,
      /lemmer/i
    ]
  }
];

const DEFAULT_TRAVEL_FEE = 175;

let extrasCache = null;

class PricingError extends Error {
  /**
   * @param {string} message
   * @param {{ statusCode?: number, publicMessage?: string, details?: Record<string, any> }} [options]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'PricingError';
    this.statusCode = options.statusCode ?? 400;
    this.publicMessage = options.publicMessage ?? message;
    this.details = options.details ?? null;
  }
}

const normaliseId = (value) => value.toLowerCase().replace(/\s+/g, '-');

const loadExtrasFromContent = async () => {
  try {
    const files = await fs.readdir(ADDONS_DIR);
    const extras = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      try {
        const content = await fs.readFile(path.join(ADDONS_DIR, file), 'utf8');
        const parsed = JSON.parse(content);
        const id = parsed.id || file.replace(/\.json$/, '');
        extras.push({
          id: normaliseId(id),
          name: parsed.title || parsed.name || id,
          price: Number(parsed.price) || 0,
          description: parsed.description || null
        });
      } catch (error) {
        console.warn('[pricingService] Failed to parse addon content', file, error.message);
      }
    }

    return extras.length > 0 ? extras : null;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('[pricingService] Failed to load addons from content directory:', error.message);
    }
    return null;
  }
};

/**
 * @returns {Promise<PricingExtra[]>}
 */
async function getAvailableExtras() {
  if (extrasCache) {
    return extrasCache;
  }

  const extras = await loadExtrasFromContent();
  extrasCache = extras && extras.length ? extras : fallbackExtras;
  return extrasCache;
}

function resetExtrasCache() {
  extrasCache = null;
}

/**
 * @param {string|undefined|null} locationInput
 * @returns {PricingLocation}
 */
function resolveLocation(locationInput) {
  const sanitized = typeof locationInput === 'string' ? locationInput.trim() : '';

  if (!sanitized) {
    return {
      input: null,
      zone: 'unspecified',
      label: 'Locatie nog onbekend',
      travelFee: 0
    };
  }

  const normalized = sanitized.toLowerCase();
  for (const zone of TRAVEL_ZONES) {
    if (zone.patterns.some((pattern) => pattern.test(normalized))) {
      return {
        input: sanitized,
        zone: zone.id,
        label: zone.label,
        travelFee: zone.fee
      };
    }
  }

  return {
    input: sanitized,
    zone: 'nationwide',
    label: 'Nationaal tarief',
    travelFee: DEFAULT_TRAVEL_FEE
  };
}

/**
 * @param {{ packageId: string, location?: string|null, extras?: string[] }} options
 * @returns {Promise<PricingQuote>}
 */
async function calculateQuote(options) {
  const packageId = typeof options.packageId === 'string' ? options.packageId.trim() : '';
  if (!packageId) {
    throw new PricingError('Geen pakket geselecteerd.', {
      statusCode: 422,
      publicMessage: 'Selecteer een pakket om een prijs te berekenen.'
    });
  }

  const { packages } = await getPackages();
  const selectedPackage = packages.find((pkg) => pkg.id === packageId);

  if (!selectedPackage) {
    throw new PricingError('Onbekend pakket geselecteerd.', {
      statusCode: 404,
      publicMessage: 'Het gekozen pakket bestaat niet of is niet beschikbaar.',
      details: { packageId }
    });
  }

  const extras = await getAvailableExtras();
  const extrasMap = new Map(extras.map((extra) => [extra.id, extra]));

  const extrasInput = Array.isArray(options.extras) ? options.extras : [];
  const selectedExtras = [];
  const seen = new Set();

  for (const rawExtraId of extrasInput) {
    if (typeof rawExtraId !== 'string') {
      throw new PricingError('Onbekende extra geselecteerd.', {
        statusCode: 400,
        publicMessage: 'Alle extra opties moeten een geldige identifier hebben.'
      });
    }

    const extraId = rawExtraId.trim().toLowerCase();
    if (!extraId || seen.has(extraId)) {
      continue;
    }

    const extra = extrasMap.get(extraId);
    if (!extra) {
      throw new PricingError('Onbekende extra geselecteerd.', {
        statusCode: 404,
        publicMessage: 'Een van de geselecteerde extra opties is niet beschikbaar.',
        details: { extraId }
      });
    }

    selectedExtras.push(extra);
    seen.add(extraId);
  }

  const basePrice = Number(selectedPackage.price) || 0;
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const location = resolveLocation(options.location);
  const grandTotal = basePrice + extrasTotal + location.travelFee;

  return {
    currency: 'EUR',
    package: {
      id: selectedPackage.id,
      name: selectedPackage.name,
      price: basePrice
    },
    extras: selectedExtras.map((extra) => ({
      id: extra.id,
      name: extra.name,
      price: Number(extra.price) || 0,
      description: extra.description
    })),
    location,
    totals: {
      base: basePrice,
      extras: extrasTotal,
      travel: location.travelFee,
      grandTotal
    },
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  calculateQuote,
  getAvailableExtras,
  resetExtrasCache,
  PricingError
};
