const fs = require('fs/promises');
const path = require('path');
const cache = require('../lib/cache');

const CACHE_KEY = 'support:configuration';
const CACHE_TTL_MS = 5 * 60 * 1000;
const FALLBACK_UPDATED_AT = '2024-10-01T09:00:00.000Z';
const DEFAULT_LOCALE = 'en';
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const FALLBACK_CONFIG = Object.freeze({
  channels: [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      value: 'support@misterdj.com',
      href: 'mailto:support@misterdj.com',
      description: 'We reply within one business day on business hours.'
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone',
      value: '+31 (0)20 123 4567',
      href: 'tel:+31201234567',
      description: 'Urgent request? Call us for an immediate response.'
    },
    {
      id: 'whatsapp',
      type: 'chat',
      label: 'WhatsApp',
      value: '+31 6 1234 5678',
      href: 'https://wa.me/31612345678',
      description: 'Send us a voice note or text and we will get back within the hour.'
    }
  ],
  availability: {
    timezone: 'Europe/Amsterdam',
    windows: [
      {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start: '09:00',
        end: '18:00',
        note: 'Core support team online.'
      },
      {
        days: ['saturday'],
        start: '10:00',
        end: '14:00',
        note: 'On-call crew for live events.'
      }
    ],
    note: 'Outside these hours we monitor inboxes for urgent event-day issues.'
  },
  messages: {
    en: {
      headline: 'Need help planning your event?',
      body: 'Our specialists are ready via email, phone or WhatsApp. Reach out and we will reply shortly.',
      availabilityNote: 'Average response time: under 1 hour on business days.'
    },
    nl: {
      headline: 'Hulp nodig met je eventplanning?',
      body: 'Ons supportteam staat klaar via e-mail, telefoon of WhatsApp. Laat iets van je horen en we reageren snel.',
      availabilityNote: 'Gemiddelde reactietijd: binnen één uur op werkdagen.'
    }
  },
  metadata: {
    source: 'fallback',
    updatedAt: FALLBACK_UPDATED_AT
  }
});

let lastKnownGood = cloneConfig(FALLBACK_CONFIG);

function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}

function normaliseLocale(locale) {
  if (!locale || typeof locale !== 'string') {
    return DEFAULT_LOCALE;
  }

  const trimmed = locale.trim();
  if (!trimmed) {
    return DEFAULT_LOCALE;
  }

  return trimmed.toLowerCase().split(/[_.-]/)[0];
}

function sanitiseChannel(channel, index) {
  if (!channel || typeof channel !== 'object') {
    return null;
  }

  const value = typeof channel.value === 'string' ? channel.value.trim() : '';
  if (!value) {
    return null;
  }

  const type = typeof channel.type === 'string' && channel.type.trim() ? channel.type.trim() : 'other';
  const label = typeof channel.label === 'string' && channel.label.trim()
    ? channel.label.trim()
    : type.charAt(0).toUpperCase() + type.slice(1);
  const href = typeof channel.href === 'string' && channel.href.trim()
    ? channel.href.trim()
    : type === 'email'
      ? `mailto:${value}`
      : type === 'phone'
        ? `tel:${value.replace(/[^+\d]/g, '')}`
        : undefined;
  const numericPriority = Number(channel.priority);
  const description = typeof channel.description === 'string' && channel.description.trim()
    ? channel.description.trim()
    : undefined;

  return {
    id: typeof channel.id === 'string' && channel.id.trim() ? channel.id.trim() : `${type}-${index}`,
    type,
    label,
    value,
    href,
    description,
    priority: Number.isFinite(numericPriority) ? numericPriority : undefined
  };
}

function sanitiseAvailabilityWindow(window) {
  if (!window || typeof window !== 'object') {
    return null;
  }

  const days = Array.isArray(window.days)
    ? window.days
        .map((day) => (typeof day === 'string' ? day.trim().toLowerCase() : ''))
        .filter((day) => DAY_ORDER.includes(day))
    : [];

  if (!days.length) {
    return null;
  }

  const start = typeof window.start === 'string' && window.start.trim() ? window.start.trim() : null;
  const end = typeof window.end === 'string' && window.end.trim() ? window.end.trim() : null;

  if (!start || !end) {
    return null;
  }

  const note = typeof window.note === 'string' && window.note.trim() ? window.note.trim() : undefined;

  return { days, start, end, note };
}

function sanitiseAvailability(availability = {}) {
  const fallbackAvailability = FALLBACK_CONFIG.availability;
  const timezone = typeof availability.timezone === 'string' && availability.timezone.trim()
    ? availability.timezone.trim()
    : fallbackAvailability.timezone;

  const fallbackWindows = fallbackAvailability.windows
    .map((window) => sanitiseAvailabilityWindow(window))
    .filter(Boolean);

  const windowsSource = Array.isArray(availability.windows) ? availability.windows : fallbackAvailability.windows;
  const windows = windowsSource
    .map((window) => sanitiseAvailabilityWindow(window))
    .filter(Boolean);

  const note = typeof availability.note === 'string' && availability.note.trim()
    ? availability.note.trim()
    : fallbackAvailability.note;

  return {
    timezone,
    windows: windows.length ? windows : fallbackWindows,
    note
  };
}

function sanitiseMessage(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const headline = typeof value.headline === 'string' && value.headline.trim() ? value.headline.trim() : null;
  const body = typeof value.body === 'string' && value.body.trim() ? value.body.trim() : null;

  if (!headline || !body) {
    return null;
  }

  const availabilityNote = typeof value.availabilityNote === 'string' && value.availabilityNote.trim()
    ? value.availabilityNote.trim()
    : undefined;
  const ctaLabel = typeof value.ctaLabel === 'string' && value.ctaLabel.trim() ? value.ctaLabel.trim() : undefined;
  const ctaHref = typeof value.ctaHref === 'string' && value.ctaHref.trim() ? value.ctaHref.trim() : undefined;

  return { headline, body, availabilityNote, ctaLabel, ctaHref };
}

function sanitiseMessages(messages = {}) {
  const result = { ...FALLBACK_CONFIG.messages };

  if (!messages || typeof messages !== 'object') {
    return result;
  }

  for (const [localeKey, messageValue] of Object.entries(messages)) {
    const sanitised = sanitiseMessage(messageValue);
    if (!sanitised) {
      continue;
    }

    const normalisedLocale = normaliseLocale(localeKey);
    result[normalisedLocale] = sanitised;
  }

  return result;
}

function sanitiseConfig(rawConfig = {}, source) {
  const channelsSource = Array.isArray(rawConfig.channels) ? rawConfig.channels : FALLBACK_CONFIG.channels;
  let channels = channelsSource
    .map((channel, index) => sanitiseChannel(channel, index))
    .filter(Boolean);

  if (!channels.length) {
    channels = FALLBACK_CONFIG.channels.map((channel, index) => sanitiseChannel(channel, index)).filter(Boolean);
  }

  const availability = sanitiseAvailability(rawConfig.availability);
  const messages = sanitiseMessages(rawConfig.messages);

  const explicitUpdatedAt = typeof rawConfig.updatedAt === 'string' && rawConfig.updatedAt.trim()
    ? rawConfig.updatedAt.trim()
    : null;
  const metadata = {
    source: typeof rawConfig?.metadata?.source === 'string' && rawConfig.metadata.source.trim()
      ? rawConfig.metadata.source.trim()
      : source || 'fallback',
    updatedAt: typeof rawConfig?.metadata?.updatedAt === 'string' && rawConfig.metadata.updatedAt.trim()
      ? rawConfig.metadata.updatedAt.trim()
      : explicitUpdatedAt || new Date().toISOString()
  };

  return { channels, availability, messages, metadata };
}

async function readConfigFromFile(filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const contents = await fs.readFile(absolutePath, 'utf8');
  const parsed = JSON.parse(contents);
  return sanitiseConfig(parsed, `file:${path.relative(process.cwd(), absolutePath)}`);
}

async function readConfigFromEnv() {
  const payload = process.env.SUPPORT_CONFIG_JSON;
  if (!payload) {
    return null;
  }

  const parsed = JSON.parse(payload);
  return sanitiseConfig(parsed, 'env:SUPPORT_CONFIG_JSON');
}

async function loadConfiguration() {
  if (process.env.SUPPORT_CONFIG_PATH) {
    return readConfigFromFile(process.env.SUPPORT_CONFIG_PATH);
  }

  const envConfig = await readConfigFromEnv();
  if (envConfig) {
    return envConfig;
  }

  return cloneConfig(FALLBACK_CONFIG);
}

function buildResponse(config, locale, context) {
  const availableLocales = Object.keys(config.messages || {});
  const requestedLocale = normaliseLocale(locale);
  const defaultLocale = availableLocales.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : availableLocales[0] || DEFAULT_LOCALE;
  const resolvedLocale = availableLocales.includes(requestedLocale) ? requestedLocale : defaultLocale;
  const message = config.messages[resolvedLocale] || config.messages[defaultLocale] || FALLBACK_CONFIG.messages[DEFAULT_LOCALE];

  return {
    channels: config.channels,
    availability: config.availability,
    message,
    locale: resolvedLocale,
    locales: availableLocales,
    metadata: {
      updatedAt: config.metadata?.updatedAt || null,
      source: config.metadata?.source || 'fallback',
      cacheStatus: context.cacheStatus,
      stale: Boolean(context.stale),
      error: context.error || null
    }
  };
}

async function getSupportConfiguration(locale) {
  const cached = await cache.get(CACHE_KEY);
  if (cached) {
    lastKnownGood = cached;
    return buildResponse(cached, locale, {
      cacheStatus: 'hit',
      stale: Boolean(cached?.metadata?.stale)
    });
  }

  try {
    const configuration = await loadConfiguration();
    lastKnownGood = configuration;
    await cache.set(CACHE_KEY, configuration, CACHE_TTL_MS);
    return buildResponse(configuration, locale, {
      cacheStatus: 'miss',
      stale: false
    });
  } catch (error) {
    const fallback = lastKnownGood || cloneConfig(FALLBACK_CONFIG);
    const response = buildResponse(fallback, locale, {
      cacheStatus: cached ? 'stale-hit' : 'fallback',
      stale: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (!cached) {
      await cache.set(CACHE_KEY, fallback, 60 * 1000);
    }

    return response;
  }
}

async function refreshSupportConfiguration(locale) {
  await cache.del(CACHE_KEY);
  return getSupportConfiguration(locale);
}

async function resetSupportConfigurationCache() {
  await cache.del(CACHE_KEY);
  lastKnownGood = cloneConfig(FALLBACK_CONFIG);
}

module.exports = {
  getSupportConfiguration,
  refreshSupportConfiguration,
  resetSupportConfigurationCache
};
