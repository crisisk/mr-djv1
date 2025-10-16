const managedEnv = require('./lib/managedEnv');

managedEnv.loadToProcessEnv();
require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RENTGUY_TIMEOUT_MS = 5000;
const DEFAULT_HUBSPOT_RETRY_DELAY_MS = 15000;
const DEFAULT_HUBSPOT_MAX_ATTEMPTS = 5;
const DEFAULT_SECTION_CONFIG = [
  {
    id: 'application',
    label: 'Applicatie instellingen',
    description:
      'Basisconfiguratie voor runtime gedrag, databaseverbindingen en rate limiting voor de API.',
    keys: [
      'NODE_ENV',
      'HOST',
      'PORT',
      'SERVICE_NAME',
      'LOG_FORMAT',
      'CORS_ORIGIN',
      'RATE_LIMIT_WINDOW_MS',
      'RATE_LIMIT_MAX',
      'DATABASE_URL',
      'REDIS_URL',
      'PGSSLMODE'
    ]
  },
  {
    id: 'mail',
    label: 'E-mailintegratie',
    description:
      'Credentials, afzender en templaten voor transactionele mails richting klanten en interne teams.',
    keys: [
      'MAIL_PROVIDER',
      'MAIL_API_KEY',
      'MAIL_FROM_ADDRESS',
      'MAIL_REPLY_TO',
      'MAIL_TEMPLATES_CONTACT',
      'MAIL_TEMPLATES_BOOKING'
    ]
  },
  {
    id: 'rentguy',
    label: 'RentGuy integratie',
    description:
      'API-parameters voor de synchronisatie van leads en boekingen richting de RentGuy applicatie.',
    keys: ['RENTGUY_API_BASE_URL', 'RENTGUY_API_KEY', 'RENTGUY_WORKSPACE_ID', 'RENTGUY_TIMEOUT_MS']
  },
  {
    id: 'automation',
    label: 'Automation & CRM',
    description:
      'Instellingen voor HubSpot submit URL, retry-logica en queue-monitoring richting n8n en RentGuy.',
    keys: ['HUBSPOT_SUBMIT_URL', 'HUBSPOT_QUEUE_RETRY_DELAY_MS', 'HUBSPOT_QUEUE_MAX_ATTEMPTS']
  },
  {
    id: 'personalization',
    label: 'Personalization & CRO',
    description:
      'Webhook en toggles voor keyword-gedreven personalisatie, CRO-analytics en n8n automatiseringen.',
    keys: ['N8N_PERSONALIZATION_WEBHOOK_URL']
  }
];

const DEFAULT_MANAGED_KEYS = Array.from(
  new Set(DEFAULT_SECTION_CONFIG.flatMap((section) => section.keys))
);

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCorsOrigin(value) {
  if (!value) {
    return '*';
  }

  const entries = parseList(value);

  if (!entries.length) {
    return '*';
  }

  return entries.length === 1 ? entries[0] : entries;
}

function buildDashboardSections(managedKeys) {
  const managedKeySet = new Set(managedKeys);
  const sections = [];

  for (const section of DEFAULT_SECTION_CONFIG) {
    const keys = section.keys.filter((key) => managedKeySet.has(key));
    if (keys.length) {
      sections.push({
        id: section.id,
        label: section.label,
        description: section.description,
        keys
      });
    }
  }

  const groupedKeys = new Set(sections.flatMap((section) => section.keys));
  const leftovers = managedKeys.filter((key) => !groupedKeys.has(key));

  if (leftovers.length) {
    sections.push({
      id: 'custom',
      label: 'Overige variabelen',
      description: 'Handmatig geconfigureerde variabelen die buiten de standaardsecties vallen.',
      keys: leftovers
    });
  }

  return sections;
}

function buildConfig() {
  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);
  const dashboardAllowedIps = parseList(process.env.CONFIG_DASHBOARD_ALLOWED_IPS);
  const configuredDashboardKeys = parseList(process.env.CONFIG_DASHBOARD_KEYS);
  const managedKeys = configuredDashboardKeys.length ? configuredDashboardKeys : DEFAULT_MANAGED_KEYS;
  const dashboardEnabled =
    process.env.CONFIG_DASHBOARD_ENABLED !== 'false' &&
    Boolean(process.env.CONFIG_DASHBOARD_USER) &&
    Boolean(process.env.CONFIG_DASHBOARD_PASS);

  return {
    env: process.env.NODE_ENV || 'development',
    port: parseNumber(process.env.PORT, DEFAULT_PORT),
    host: process.env.HOST || DEFAULT_HOST,
    cors: {
      origin: corsOrigin,
      credentials: corsOrigin !== '*'
    },
    logging: process.env.LOG_FORMAT || (process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
    rateLimit: {
      windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT_WINDOW),
      max: parseNumber(process.env.RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX)
    },
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    serviceName: process.env.SERVICE_NAME || 'mr-dj-backend',
    version: process.env.npm_package_version || '1.0.0',
    integrations: {
      rentGuy: {
        enabled: Boolean(process.env.RENTGUY_API_BASE_URL && process.env.RENTGUY_API_KEY),
        baseUrl: process.env.RENTGUY_API_BASE_URL || null,
        workspaceId: process.env.RENTGUY_WORKSPACE_ID || null,
        timeoutMs: parseNumber(process.env.RENTGUY_TIMEOUT_MS, DEFAULT_RENTGUY_TIMEOUT_MS)
      },
      hubSpot: {
        enabled: Boolean(process.env.HUBSPOT_SUBMIT_URL),
        submitUrl: process.env.HUBSPOT_SUBMIT_URL || null,
        retryDelayMs: parseNumber(
          process.env.HUBSPOT_QUEUE_RETRY_DELAY_MS,
          DEFAULT_HUBSPOT_RETRY_DELAY_MS
        ),
        maxAttempts: parseNumber(
          process.env.HUBSPOT_QUEUE_MAX_ATTEMPTS,
          DEFAULT_HUBSPOT_MAX_ATTEMPTS
        )
      }
    },
    personalization: {
      automationWebhook: process.env.N8N_PERSONALIZATION_WEBHOOK_URL || null
    },
    dashboard: {
      enabled: dashboardEnabled,
      username: dashboardEnabled ? process.env.CONFIG_DASHBOARD_USER : null,
      password: dashboardEnabled ? process.env.CONFIG_DASHBOARD_PASS : null,
      allowedIps: dashboardAllowedIps,
      managedKeys,
      sections: buildDashboardSections(managedKeys),
      storePath: managedEnv.getStorePath()
    }
  };
}

const config = buildConfig();

function reload() {
  managedEnv.loadToProcessEnv();
  require('dotenv').config({ override: false });
  const next = buildConfig();

  for (const [key, value] of Object.entries(next)) {
    if (Array.isArray(value)) {
      config[key] = [...value];
    } else if (value && typeof value === 'object') {
      config[key] = { ...value };
    } else {
      config[key] = value;
    }
  }

  for (const existingKey of Object.keys(config)) {
    if (!(existingKey in next) && existingKey !== 'reload') {
      delete config[existingKey];
    }
  }

  return config;
}

config.reload = reload;

module.exports = config;
