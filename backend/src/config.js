const managedEnv = require('./lib/managedEnv');

managedEnv.loadToProcessEnv();
require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RENTGUY_TIMEOUT_MS = 5000;
const DEFAULT_SEVENSA_RETRY_DELAY_MS = 15000;
const DEFAULT_SEVENSA_MAX_ATTEMPTS = 5;
const DEFAULT_ALERT_THROTTLE_MS = 2 * 60 * 1000;
const DEFAULT_ALERT_QUEUE_THRESHOLDS = {
  warningBacklog: 25,
  criticalBacklog: 75,
  recoveryBacklog: 5,
  warningRetryAgeMs: 5 * 60 * 1000,
  criticalRetryAgeMs: 15 * 60 * 1000,
  recoveryRetryAgeMs: 2 * 60 * 1000,
  deadLetterWarning: 1
};
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
      'REDIS_TLS',
      'REDIS_NAMESPACE',
      'REDIS_TLS_REJECT_UNAUTHORIZED',
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
    id: 'content-automation',
    label: 'Automation & CRM',
    description:
      'Instellingen voor Sevensa submit URL, retry-logica en queue-monitoring richting n8n en RentGuy.',
    keys: ['SEVENSA_SUBMIT_URL', 'SEVENSA_QUEUE_RETRY_DELAY_MS', 'SEVENSA_QUEUE_MAX_ATTEMPTS']
  },
  {
    id: 'personalization',
    label: 'Personalization & CRO',
    description:
      'Webhook en toggles voor keyword-gedreven personalisatie, CRO-analytics en n8n automatiseringen.',
    keys: ['N8N_PERSONALIZATION_WEBHOOK_URL', 'FEATURE_PERSONALIZATION']
  },
  {
    id: 'automation',
    label: 'Content automatisering',
    description:
      'SEO keyword ingest, LLM-configuratie en reviewkanalen voor de interne city page generator.',
    keys: [
      'FEATURE_AUTOMATION',
      'SEO_AUTOMATION_API_URL',
      'SEO_AUTOMATION_API_KEY',
      'SEO_AUTOMATION_KEYWORDSET_ID',
      'SEO_AUTOMATION_REGION',
      'SEO_AUTOMATION_THEME_KEYWORDS',
      'SEO_AUTOMATION_APPROVAL_EMAIL',
      'CITY_AUTOMATION_LLM_PROVIDER',
      'CITY_AUTOMATION_LLM_MODEL',
      'CITY_AUTOMATION_LLM_API_KEY',
      'CITY_AUTOMATION_DRY_RUN'
    ]
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
  const alertWebhooks = parseList(process.env.ALERT_WEBHOOK_URLS);

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
    redis: {
      url: process.env.REDIS_URL || null,
      tls: process.env.REDIS_TLS === 'true',
      namespace: process.env.REDIS_NAMESPACE || 'mr-dj',
      tlsRejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false'
    },
    serviceName: process.env.SERVICE_NAME || 'mr-dj-backend',
    version: process.env.npm_package_version || '1.0.0',
    integrations: {
      rentGuy: {
        enabled: Boolean(process.env.RENTGUY_API_BASE_URL && process.env.RENTGUY_API_KEY),
        baseUrl: process.env.RENTGUY_API_BASE_URL || null,
        workspaceId: process.env.RENTGUY_WORKSPACE_ID || null,
        timeoutMs: parseNumber(process.env.RENTGUY_TIMEOUT_MS, DEFAULT_RENTGUY_TIMEOUT_MS)
      },
      sevensa: {
        enabled: Boolean(process.env.SEVENSA_SUBMIT_URL),
        submitUrl: process.env.SEVENSA_SUBMIT_URL || null,
        retryDelayMs: parseNumber(
          process.env.SEVENSA_QUEUE_RETRY_DELAY_MS,
          DEFAULT_SEVENSA_RETRY_DELAY_MS
        ),
        maxAttempts: parseNumber(
          process.env.SEVENSA_QUEUE_MAX_ATTEMPTS,
          DEFAULT_SEVENSA_MAX_ATTEMPTS
        )
      }
    },
    personalization: {
      automationWebhook: process.env.N8N_PERSONALIZATION_WEBHOOK_URL || null
    },
    automation: {
      seo: {
        apiUrl: process.env.SEO_AUTOMATION_API_URL || null,
        keywordSetId: process.env.SEO_AUTOMATION_KEYWORDSET_ID || null,
        region: process.env.SEO_AUTOMATION_REGION || 'Noord-Brabant',
        themeKeywords: parseList(process.env.SEO_AUTOMATION_THEME_KEYWORDS)
      },
      llm: {
        provider: process.env.CITY_AUTOMATION_LLM_PROVIDER || 'template',
        model: process.env.CITY_AUTOMATION_LLM_MODEL || 'gpt-4.1-mini',
        apiKeyConfigured: Boolean(process.env.CITY_AUTOMATION_LLM_API_KEY || process.env.OPENAI_API_KEY)
      },
      approvals: {
        email: process.env.SEO_AUTOMATION_APPROVAL_EMAIL || null
      },
      dryRun: process.env.CITY_AUTOMATION_DRY_RUN === 'true'
    },
    alerts: {
      webhooks: alertWebhooks,
      throttleMs: parseNumber(process.env.ALERT_THROTTLE_MS, DEFAULT_ALERT_THROTTLE_MS),
      queue: {
        warningBacklog: parseNumber(
          process.env.ALERT_QUEUE_WARNING_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.warningBacklog
        ),
        criticalBacklog: parseNumber(
          process.env.ALERT_QUEUE_CRITICAL_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.criticalBacklog
        ),
        recoveryBacklog: parseNumber(
          process.env.ALERT_QUEUE_RECOVERY_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.recoveryBacklog
        ),
        warningRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_WARNING_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.warningRetryAgeMs
        ),
        criticalRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_CRITICAL_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.criticalRetryAgeMs
        ),
        recoveryRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_RECOVERY_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.recoveryRetryAgeMs
        ),
        deadLetterWarning: parseNumber(
          process.env.ALERT_QUEUE_DEAD_LETTER_WARNING,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.deadLetterWarning
        )
      }
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
