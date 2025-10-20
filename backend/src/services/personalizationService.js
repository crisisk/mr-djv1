const fs = require('fs/promises');
const path = require('path');
const cache = require('../lib/cache');
const config = require('../config');
const { createDurableQueue } = require('../lib/durableQueue');
const db = require('../lib/db');
const { logger } = require('../lib/logger');
const rentGuyService = require('./rentGuyService');

/**
 * @typedef {Object} PersonalizationVariant
 * @property {string} id
 * @property {string} label
 * @property {Array<string>} [keywords]
 * @property {Array<string>} [intentTags]
 * @property {Array<string>} [keywordsNormalized]
 * @property {Array<string>} [intentTagsNormalized]
 * @property {string} [labelNormalized]
 * @property {Object} [hero]
 * @property {Object} [cro]
 * @property {Object} [features]
 * @property {Object} [testimonials]
 * @property {Object} [pricing]
 * @property {Object} [leadCapture]
 * @property {Object} [automation]
 */

/**
 * @typedef {Object} PersonalizationConfig
 * @property {Array<PersonalizationVariant>} variants
 * @property {PersonalizationVariant|null} defaultVariant
 * @property {string|null} defaultVariantId
 */

/**
 * @typedef {Object} CityEntry
 * @property {string} slug
 * @property {string} city
 * @property {string} intro
 * @property {Array<Object>} [cases]
 * @property {Array<string>} [venues]
 * @property {Array<Object>} [faqs]
 * @property {string} [normalizedCity]
 * @property {Set.<string>} [tokens]
 */

/**
 * @typedef {Object} PersonalizationContext
 * @property {Array<string>} [keywords]
 * @property {string} [keyword]
 * @property {string} [utmTerm]
 * @property {string} [search]
 * @property {string} [query]
 * @property {string} [personaHint]
 * @property {Array<string>} [additionalHints]
 * @property {string} [landing]
 * @property {string} [utmCampaign]
 * @property {string} [utmSource]
 * @property {string} [referrer]
 */

/**
 * @typedef {Object} VariantSelectionMeta
 * @property {string} variantId
 * @property {string} matchType
 * @property {Array<string>} matchedKeywords
 * @property {Array<string>} keywordInput
 * @property {Array<string>} normalizedKeywords
 * @property {boolean} automationTriggered
 * @property {string|null} experimentId
 * @property {string|null} city
 */

/**
 * @typedef {Object} VariantSelection
 * @property {PersonalizationVariant} variant
 * @property {VariantSelectionMeta} meta
 */

/**
 * @typedef {Object} PersonalizationEvent
 * @property {string} id
 * @property {string} type
 * @property {string} variantId
 * @property {string|null} keyword
 * @property {Object<string, *>} payload
 * @property {Object<string, *>} context
 * @property {string} createdAt
 * @property {boolean} automationTriggered
 */

/**
 * @typedef {Object} ExposureLogEntry
 * @property {string} id
 * @property {string} variantId
 * @property {string} matchType
 * @property {Array<string>} matchedKeywords
 * @property {Array<string>} keywordInput
 * @property {string|null} landing
 * @property {string|null} utmCampaign
 * @property {string|null} utmSource
 * @property {string|null} city
 * @property {string} createdAt
 */

const VARIANT_CACHE_KEY = 'personalization:variants';
const VARIANT_CACHE_TTL = 5 * 60 * 1000;
const CITY_CACHE_KEY = 'personalization:cities';
const LOG_LIMIT = 200;

const variantsFilePath = path.join(__dirname, '../../..', 'content', 'personalization', 'keyword-variants.json');
const citiesFilePath = path.join(__dirname, '../../..', 'content', 'local-seo', 'cities.json');

const exposureLog = [];
const eventLog = [];
const automationRetryStore = new Map();

const automationQueue = createDurableQueue(
  'personalization-automation-webhook',
  async (job) => {
    const { payload, retryId } = job.data;
    const attempts = job.attemptsMade + 1;

    try {
      await deliverAutomationWebhook(payload);
      await markAutomationRetrySuccess(retryId, attempts);
      return { status: 'delivered' };
    } catch (error) {
      await markAutomationRetryFailure(retryId, attempts, error);
      throw error;
    }
  },
  {
    concurrency: 3
  }
);

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function pushLog(store, entry) {
  store.push(entry);
  if (store.length > LOG_LIMIT) {
    store.splice(0, store.length - LOG_LIMIT);
  }
}

function normalize(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cloneVariant(variant) {
  if (typeof structuredClone === 'function') {
    return structuredClone(variant);
  }

  return JSON.parse(JSON.stringify(variant));
}

/**
 * Loads personalization variant definitions from disk (with caching).
 *
 * @param {boolean} [force=false]
 * @returns {Promise<PersonalizationConfig>}
 */
async function loadVariantsConfig(force = false) {
  if (!force) {
    const cached = await cache.get(VARIANT_CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  const file = await fs.readFile(variantsFilePath, 'utf8');
  const parsed = JSON.parse(file);

  const variants = parsed.variants.map((variant) => ({
    ...variant,
    keywordsNormalized: Array.isArray(variant.keywords)
      ? variant.keywords.map(normalize).filter(Boolean)
      : [],
    intentTagsNormalized: Array.isArray(variant.intentTags)
      ? variant.intentTags.map(normalize).filter(Boolean)
      : [],
    labelNormalized: normalize(variant.label)
  }));

  const defaultVariant = variants.find((variant) => variant.id === parsed.defaultVariantId) || variants[0];

  const configObject = {
    variants,
    defaultVariant,
    defaultVariantId: defaultVariant ? defaultVariant.id : null
  };

  await cache.set(VARIANT_CACHE_KEY, configObject, VARIANT_CACHE_TTL);
  return configObject;
}

/**
 * Loads known city entries to support location-based personalization.
 *
 * @param {boolean} [force=false]
 * @returns {Promise<Array<CityEntry>>}
 */
async function loadCities(force = false) {
  if (!force) {
    const cached = await cache.get(CITY_CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  const file = await fs.readFile(citiesFilePath, 'utf8');
  const parsed = JSON.parse(file);

  const cities = parsed.map((city) => {
    const normalizedCity = normalize(city.city);
    const slugTokens = city.slug
      ? city.slug
          .split('-')
          .map((part) => normalize(part))
          .filter((token) => token && token.length > 2 && token !== 'dj')
      : [];
    const extraTokens = normalizedCity
      .replace(/['’]/g, ' ')
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token && token.length > 2);
    const tokens = new Set([normalizedCity, ...slugTokens, ...extraTokens]);

    return {
      ...city,
      normalizedCity,
      tokens
    };
  });

  await cache.set(CITY_CACHE_KEY, cities, VARIANT_CACHE_TTL);
  return cities;
}

function extractKeywordData({
  keywords = [],
  keyword,
  utmTerm,
  search,
  query,
  personaHint,
  additionalHints = [],
  landing,
  utmCampaign,
  utmSource,
  referrer
} = {}) {
  const collected = [];
  const append = (value) => {
    if (typeof value === 'string' && value.trim()) {
      collected.push(value.trim());
    }
  };

  if (Array.isArray(keywords)) {
    keywords.forEach(append);
  }

  append(keyword);
  append(utmTerm);
  append(search);
  append(query);
  append(personaHint);

  if (Array.isArray(additionalHints)) {
    additionalHints.forEach(append);
  }

  if (utmCampaign) {
    append(utmCampaign.replace(/[+_]/g, ' '));
  }

  if (utmSource) {
    append(utmSource.replace(/[+_]/g, ' '));
  }

  if (landing) {
    landing
      .split(/[\/?#]/)
      .map((segment) => segment.replace(/[-_]/g, ' '))
      .forEach(append);
  }

  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      append(refUrl.hostname.replace(/^www\./, '').replace(/[-_]/g, ' '));
      if (refUrl.searchParams.has('q')) {
        append(refUrl.searchParams.get('q'));
      }
    } catch (_error) {
      append(referrer.replace(/[-_]/g, ' '));
    }
  }

  const raw = Array.from(new Set(collected));
  const normalizedPhrases = raw.map((value) => normalize(value)).filter(Boolean);
  const tokenized = normalizedPhrases
    .flatMap((phrase) => phrase.split(' '))
    .filter(Boolean);

  const normalized = Array.from(new Set([...normalizedPhrases, ...tokenized]));

  return {
    raw,
    normalized
  };
}

function deriveIntentHints(keywordData, { utmCampaign, utmSource, personaHint, landing } = {}) {
  const hints = new Set(keywordData.normalized);

  [utmCampaign, utmSource, personaHint, landing]
    .map((value) => normalize(value))
    .filter(Boolean)
    .forEach((normalizedValue) => {
      hints.add(normalizedValue);
      normalizedValue
        .split(' ')
        .filter(Boolean)
        .forEach((token) => hints.add(token));
    });

  return hints;
}

function scoreManualVariant(variant, keywordData, hints) {
  let score = 0;
  const matched = new Set();

  for (const keyword of variant.keywordsNormalized || []) {
    if (keywordData.normalized.includes(keyword)) {
      score += 40;
      matched.add(keyword);
    } else if (keywordData.normalized.some((candidate) => candidate.includes(keyword) || keyword.includes(candidate))) {
      score += 25;
      matched.add(keyword);
    }
  }

  for (const tag of variant.intentTagsNormalized || []) {
    if (hints.has(tag)) {
      score += 20;
      matched.add(tag);
    }
  }

  if (variant.labelNormalized && keywordData.normalized.some((candidate) => variant.labelNormalized.includes(candidate))) {
    score += 5;
  }

  return { score, matchedKeywords: Array.from(matched) };
}

async function matchManualVariant(configObject, keywordData, hints) {
  let bestMatch = null;

  for (const variant of configObject.variants) {
    if (variant.id === configObject.defaultVariantId) {
      continue;
    }

    const { score, matchedKeywords } = scoreManualVariant(variant, keywordData, hints);

    if (score > 0) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = {
          variant,
          score,
          matchedKeywords
        };
      }
    }
  }

  return bestMatch;
}

function buildCityVariant(city, baseVariant) {
  const variant = cloneVariant(baseVariant);
  const firstCase = Array.isArray(city.cases) && city.cases.length ? city.cases[0] : null;
  const venues = Array.isArray(city.venues) ? city.venues : [];

  variant.id = `city_${city.slug}`;
  variant.label = `Lokale intent ${city.city}`;

  variant.hero = {
    ...variant.hero,
    eyebrow: `DJ in ${city.city}`,
    title: `DJ + Sax in ${city.city} met lokale crew & live beleving`,
    subtitle: city.intro || variant.hero?.subtitle,
    badges: Array.from(
      new Set([
        `Lokale crew ${city.city}`,
        ...(variant.hero?.badges || [])
      ])
    ).slice(0, 3),
    socialProof:
      (firstCase && `${firstCase.title}: ${firstCase.result}`) ||
      `Succesvolle events op locaties zoals ${venues.slice(0, 3).join(', ')}`,
    metrics: Array.isArray(variant.hero?.metrics)
      ? variant.hero.metrics.map((metric, index) => {
          if (index === 0) {
            return {
              label: `Events in ${city.city}`,
              value: firstCase?.result || '50+'
            };
          }

          if (index === 1 && venues.length) {
            return {
              label: 'Bekende locaties',
              value: venues.slice(0, 2).join(' & ')
            };
          }

          return metric;
        })
      : [
          { label: `Events in ${city.city}`, value: firstCase?.result || '50+' },
          { label: 'Bekende locaties', value: venues.slice(0, 2).join(' & ') },
          { label: 'Gem. rating', value: '9,6' }
        ],
    ctaPrimaryText: variant.hero?.ctaPrimaryText || 'Check beschikbaarheid',
    ctaSecondaryText: variant.hero?.ctaSecondaryText || 'Bekijk cases'
  };

  variant.features = {
    title: `Waarom Mister DJ in ${city.city}?`,
    caption: 'Automatisch samengesteld op basis van keyword-intent en lokale data.',
    items: [
      {
        title: `Locatiekennis ${city.city}`,
        icon: '📍',
        description: venues.length
          ? `Wij kennen logistiek en geluidslimieten van ${venues.slice(0, 3).join(', ')}.`
          : 'We kennen de locaties en leveranciers in de regio door en door.'
      },
      {
        title: 'Lokale successen',
        icon: '🏆',
        description: firstCase
          ? `${firstCase.title}: ${firstCase.result} (${firstCase.venue}).`
          : 'Recente events in de regio met topwaarderingen en volle dansvloeren.'
      },
      {
        title: 'Smart playlists',
        icon: '🧠',
        description: `Keyword-engine koppelt ${city.city}-inspiratie aan jullie Spotify-favorieten.`
      }
    ]
  };

  const baseValueDrivers = Array.isArray(variant.cro?.valueDrivers) ? variant.cro.valueDrivers : [];

  variant.cro = {
    experimentId: variant.cro?.experimentId || 'city-intent-v1',
    urgency: `Nog 2 prime weekendslots beschikbaar in ${city.city} – claim je datum binnen 48 uur.`,
    valueDrivers: [
      `Gratis locatiebezoek in ${city.city}`,
      venues.length ? `Netwerk van leveranciers (${venues.slice(0, 2).join(', ')})` : 'Lokale leveranciers direct beschikbaar',
      ...baseValueDrivers.slice(0, 1)
    ],
    guarantee:
      variant.cro?.guarantee || 'Failover crew en backup-equipment staan stand-by voor ieder event.'
  };

  variant.testimonials = {
    headline: `Ervaringen uit ${city.city}`,
    subheadline: city.intro || variant.testimonials?.subheadline,
    highlightCategory: variant.testimonials?.highlightCategory || 'bruiloft',
    testimonialIds: variant.testimonials?.testimonialIds || [],
    mediaTiles: venues.slice(0, 3)
  };

  variant.pricing = {
    ...variant.pricing,
    headline: `Veelgevraagde pakketten in ${city.city}`,
    subheadline: `Inclusief reistijd, load-in plan en lokale crew voor ${city.city}.`,
    valueEmphasis: Array.from(
      new Set([
        `Lokale crew in ${city.city}`,
        ...((variant.pricing && variant.pricing.valueEmphasis) || [])
      ])
    ).slice(0, 4)
  };

  variant.leadCapture = {
    ...variant.leadCapture,
    formHeadline: `Zeker van jullie datum in ${city.city}?`,
    formCopy: `Binnen 12 uur een voorstel met leveranciers en draaiboek voor ${city.city}.`,
    successMessage: variant.leadCapture?.successMessage || 'We nemen snel contact op.'
  };

  variant.automation = {
    flows: ['n8n-city-personalization'],
    payload: {
      city: city.city,
      slug: city.slug
    }
  };

  return variant;
}

async function matchCityVariant(keywordData, baseVariant) {
  const cities = await loadCities();

  for (const city of cities) {
    const match = keywordData.normalized.some((token) => {
      if (city.tokens.has(token)) {
        return true;
      }

      if (token.length <= 2) {
        return false;
      }

      return token.includes(city.normalizedCity) || city.normalizedCity.includes(token);
    });

    if (match) {
      const matchedKeywords = keywordData.normalized.filter((token) => {
        if (city.tokens.has(token)) {
          return true;
        }

        if (token.length <= 2) {
          return false;
        }

        return token.includes(city.normalizedCity) || city.normalizedCity.includes(token);
      });

      return {
        variant: buildCityVariant(city, baseVariant),
        matchedKeywords,
        city,
        score: 60 + matchedKeywords.length * 10
      };
    }
  }

  return null;
}

function clonePayload(payload) {
  if (payload === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (error) {
    logger.warn({ err: error }, 'Failed to clone automation payload for retry state');
    return payload;
  }
}

function createAutomationRetryEntry(payload, errorMessage = null) {
  const createdAt = new Date().toISOString();
  return {
    id: createId('auto_retry'),
    status: 'queued',
    attempts: 0,
    payload: clonePayload(payload),
    lastError: errorMessage,
    createdAt,
    updatedAt: createdAt,
    deliveredAt: null
  };
}

async function persistAutomationRetryEntry(entry) {
  const snapshot = {
    ...entry,
    payload: clonePayload(entry.payload)
  };
  automationRetryStore.set(entry.id, snapshot);

  if (typeof db?.isConfigured === 'function' && db.isConfigured()) {
    try {
      await db.runQuery(
        `INSERT INTO personalization_automation_retries
          (id, status, attempts, payload, last_error, created_at, updated_at, delivered_at)
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          attempts = EXCLUDED.attempts,
          payload = EXCLUDED.payload,
          last_error = EXCLUDED.last_error,
          updated_at = EXCLUDED.updated_at,
          delivered_at = EXCLUDED.delivered_at`,
        [
          entry.id,
          entry.status,
          entry.attempts,
          JSON.stringify(entry.payload ?? null),
          entry.lastError || null,
          entry.createdAt,
          entry.updatedAt,
          entry.deliveredAt
        ]
      );
    } catch (error) {
      logger.warn({ err: error, retryId: entry.id }, 'Failed to persist automation retry state');
    }
  }
}

async function markAutomationRetrySuccess(retryId, attempts) {
  if (!retryId) {
    return;
  }

  const entry = automationRetryStore.get(retryId);
  if (!entry) {
    return;
  }

  const updatedAt = new Date().toISOString();
  const deliveredEntry = {
    ...entry,
    status: 'delivered',
    attempts,
    lastError: null,
    updatedAt,
    deliveredAt: updatedAt
  };
  await persistAutomationRetryEntry(deliveredEntry);
}

async function markAutomationRetryFailure(retryId, attempts, error) {
  if (!retryId) {
    return;
  }

  const existing = automationRetryStore.get(retryId) || createAutomationRetryEntry({}, error?.message);
  const updatedEntry = {
    ...existing,
    attempts,
    status: 'retrying',
    lastError: error?.message || existing.lastError || 'unknown-error',
    updatedAt: new Date().toISOString()
  };
  await persistAutomationRetryEntry(updatedEntry);
}

async function deliverAutomationWebhook(payload) {
  const webhookUrl = config.personalization?.automationWebhook;
  if (!webhookUrl) {
    throw new Error('Automation webhook is not configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let text = '';
    try {
      text = await response.text();
    } catch (error) {
      text = error.message;
    }
    throw new Error(`n8n webhook returned ${response.status}${text ? `: ${text}` : ''}`);
  }
}

async function queueAutomationRetry(payload, errorMessage) {
  const entry = createAutomationRetryEntry(payload, errorMessage);
  await persistAutomationRetryEntry(entry);
  await automationQueue.addJob(
    {
      payload: clonePayload(payload),
      retryId: entry.id
    },
    {
      backoff: { type: 'exponential', delay: 5000 },
      attempts: 5
    }
  );
  return entry;
}

async function notifyAutomation(payload) {
  const deliveries = [];
  const webhookUrl = config.personalization?.automationWebhook;

  if (webhookUrl) {
    deliveries.push(
      deliverAutomationWebhook(payload)
        .then(() => true)
        .catch(async (error) => {
          console.error('[personalizationService] Failed to trigger n8n webhook:', error.message);
          try {
            const entry = await queueAutomationRetry(payload, error.message);
            console.warn('[personalizationService] Queued automation webhook retry', entry.id);
          } catch (queueError) {
            console.error(
              '[personalizationService] Failed to persist automation webhook retry:',
              queueError.message
            );
          }
          return false;
        })
    );
  }

  deliveries.push(
    rentGuyService
      .syncPersonalizationEvent(payload, { source: 'personalization-pipeline' })
      .then((result) => Boolean(result?.delivered || result?.queued))
      .catch((error) => {
        console.error('[personalizationService] Failed to queue event for RentGuy:', error.message);
        return false;
      })
  );

  const results = await Promise.all(deliveries);
  return results.some(Boolean);
}

/**
 * Selects the best-fit personalization variant for an incoming request.
 *
 * @param {PersonalizationContext} [context]
 * @returns {Promise<VariantSelection>}
 */
async function getVariantForRequest(context = {}) {
  const configObject = await loadVariantsConfig();
  const keywordData = extractKeywordData(context);
  const hints = deriveIntentHints(keywordData, context);

  const manualMatch = await matchManualVariant(configObject, keywordData, hints);
  const cityMatch = await matchCityVariant(keywordData, configObject.defaultVariant || {});
  let matchType = 'default';
  let matchedKeywords = [];
  let variant;

  if (cityMatch) {
    variant = cityMatch.variant;
    matchType = 'city';
    matchedKeywords = cityMatch.matchedKeywords;
  } else if (manualMatch) {
    variant = cloneVariant(manualMatch.variant);
    matchType = 'manual';
    matchedKeywords = manualMatch.matchedKeywords;
  }

  if (!variant) {
    variant = cloneVariant(configObject.defaultVariant || {});
  }

  const exposureEntry = {
    id: createId('exp'),
    createdAt: new Date().toISOString(),
    variantId: variant.id,
    matchType,
    matchedKeywords,
    keywordInput: keywordData.raw,
    landing: context.landing || null,
    utmCampaign: context.utmCampaign || null,
    utmSource: context.utmSource || null,
    city: cityMatch && matchType === 'city' ? cityMatch.city.city : null
  };

  pushLog(exposureLog, exposureEntry);

  const automationPayload = {
    type: 'personalization_variant_served',
    variantId: variant.id,
    matchType,
    matchedKeywords,
    keywordInput: keywordData.raw,
    landing: context.landing || null,
    utmCampaign: context.utmCampaign || null,
    utmSource: context.utmSource || null,
    city: cityMatch && matchType === 'city' ? cityMatch.city.city : null,
    timestamp: exposureEntry.createdAt
  };

  const automationTriggered = await notifyAutomation(automationPayload);

  return {
    variant,
    meta: {
      variantId: variant.id,
      matchType,
      matchedKeywords,
      keywordInput: keywordData.raw,
      normalizedKeywords: keywordData.normalized,
      automationTriggered,
      experimentId: variant.cro?.experimentId || null,
      city: cityMatch ? cityMatch.city.city : null
    }
  };
}

/**
 * Records engagement events for analytics and triggers downstream automations.
 *
 * @param {Object} params
 * @param {string} params.type
 * @param {string} params.variantId
 * @param {string|null} [params.keyword]
 * @param {Object<string, *>} [params.payload]
 * @param {Object<string, *>} [params.context]
 * @returns {Promise<PersonalizationEvent>}
 */
async function recordEvent({ type, variantId, keyword, payload = {}, context = {} }) {
  const entry = {
    id: createId('evt'),
    type,
    variantId,
    keyword: keyword || null,
    payload,
    context,
    createdAt: new Date().toISOString()
  };

  pushLog(eventLog, entry);

  entry.automationTriggered = await notifyAutomation({
    type: 'personalization_event',
    variantId,
    eventType: type,
    keyword: keyword || null,
    payload,
    context,
    timestamp: entry.createdAt
  });

  return entry;
}

/**
 * Returns a snapshot of the in-memory exposure log.
 *
 * @returns {Array<ExposureLogEntry>}
 */
function getExposureLog() {
  return [...exposureLog];
}

/**
 * Returns a snapshot of the in-memory event log.
 *
 * @returns {Array<PersonalizationEvent>}
 */
function getEventLog() {
  return [...eventLog];
}

/**
 * Clears the exposure and event logs.
 *
 * @returns {void}
 */
function resetLogs() {
  exposureLog.splice(0, exposureLog.length);
  eventLog.splice(0, eventLog.length);
}

async function resetCache() {
  await Promise.all([cache.del(VARIANT_CACHE_KEY), cache.del(CITY_CACHE_KEY)]);
}

function ping() {
  return {
    ok: true,
    automationWebhookConfigured: Boolean(config.personalization?.automationWebhook),
    rentGuyConfigured: Boolean(config.integrations?.rentGuy?.enabled),
    variantsCached: Boolean(cache.get(VARIANT_CACHE_KEY))
  };
}

module.exports = {
  getVariantForRequest,
  recordEvent,
  getExposureLog,
  getEventLog,
  getAutomationRetryState,
  flushAutomationQueue,
  resetAutomationQueue,
  resetLogs,
  resetCache,
  loadVariantsConfig,
  loadCities,
  ping
};
