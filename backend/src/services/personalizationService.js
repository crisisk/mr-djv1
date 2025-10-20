const fs = require('fs/promises');
const path = require('path');
const cache = require('../lib/cache');
const config = require('../config');
const rentGuyService = require('./rentGuyService');

const VARIANT_CACHE_KEY = 'personalization:variants';
const VARIANT_CACHE_TTL = 5 * 60 * 1000;
const CITY_CACHE_KEY = 'personalization:cities';
const LOG_LIMIT = 200;

const variantsFilePath = path.join(__dirname, '../../..', 'content', 'personalization', 'keyword-variants.json');
const citiesFilePath = path.join(__dirname, '../../..', 'content', 'local-seo', 'cities.json');

const exposureLog = [];
const eventLog = [];

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

async function loadVariantsConfig(force = false) {
  if (!force) {
    const cached = cache.get(VARIANT_CACHE_KEY);
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

  cache.set(VARIANT_CACHE_KEY, configObject, VARIANT_CACHE_TTL);
  return configObject;
}

async function loadCities(force = false) {
  if (!force) {
    const cached = cache.get(CITY_CACHE_KEY);
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

  cache.set(CITY_CACHE_KEY, cities, VARIANT_CACHE_TTL);
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

async function notifyAutomation(payload) {
  const deliveries = [];
  const webhookUrl = config.personalization?.automationWebhook;

  if (webhookUrl) {
    deliveries.push(
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          if (!response.ok) {
            console.error('[personalizationService] n8n webhook returned', response.status);
            return false;
          }

          return true;
        })
        .catch((error) => {
          console.error('[personalizationService] Failed to trigger n8n webhook:', error.message);
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

function getExposureLog() {
  return [...exposureLog];
}

function getEventLog() {
  return [...eventLog];
}

function resetLogs() {
  exposureLog.splice(0, exposureLog.length);
  eventLog.splice(0, eventLog.length);
}

function resetCache() {
  cache.del(VARIANT_CACHE_KEY);
  cache.del(CITY_CACHE_KEY);
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
  resetLogs,
  resetCache,
  loadVariantsConfig,
  loadCities,
  ping
};
