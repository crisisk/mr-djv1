const Joi = require('joi');
const managedEnv = require('./lib/managedEnv');

managedEnv.loadToProcessEnv();
require('dotenv').config();
const featureFlags = require('./lib/featureFlags');

function logStructured(level, message, meta = {}) {
  const payload = JSON.stringify({ level, message, ...meta });

  if (level === 'error') {
    console.error(payload);
    return;
  }

  if (level === 'info') {
    console.info(payload);
    return;
  }

  console.warn(payload);
}

function hasValue(value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string()
    .uri({ allowRelative: false })
    .required()
    .messages({
      'any.required': 'DATABASE_URL is required to establish a database connection.',
      'string.uri': 'DATABASE_URL must be a valid connection string.'
    }),
  RENTGUY_API_BASE_URL: Joi.string()
    .uri({ allowRelative: false })
    .required()
    .messages({
      'any.required': 'RENTGUY_API_BASE_URL is required for the RentGuy integration.',
      'string.uri': 'RENTGUY_API_BASE_URL must be a valid URL.'
    }),
  RENTGUY_API_KEY: Joi.string().min(1).required().messages({
    'any.required': 'RENTGUY_API_KEY is required for the RentGuy integration.'
  }),
  SEVENSA_SUBMIT_URL: Joi.string()
    .uri({ allowRelative: false })
    .required()
    .messages({
      'any.required': 'SEVENSA_SUBMIT_URL is required for Sevensa automation.',
      'string.uri': 'SEVENSA_SUBMIT_URL must be a valid URL.'
    }),
  N8N_PERSONALIZATION_WEBHOOK_URL: Joi.string()
    .uri({ allowRelative: false })
    .required()
    .messages({
      'any.required': 'N8N_PERSONALIZATION_WEBHOOK_URL is required for personalization automation.',
      'string.uri': 'N8N_PERSONALIZATION_WEBHOOK_URL must be a valid URL.'
    }),
  SEO_AUTOMATION_API_URL: Joi.string()
    .uri({ allowRelative: false })
    .required()
    .messages({
      'any.required': 'SEO_AUTOMATION_API_URL is required for automation workflows.',
      'string.uri': 'SEO_AUTOMATION_API_URL must be a valid URL.'
    }),
  SEO_AUTOMATION_API_KEY: Joi.string().min(1).required().messages({
    'any.required': 'SEO_AUTOMATION_API_KEY is required for automation workflows.'
  }),
  SEO_AUTOMATION_KEYWORDSET_ID: Joi.string().min(1).required().messages({
    'any.required': 'SEO_AUTOMATION_KEYWORDSET_ID is required for automation workflows.'
  }),
  CITY_AUTOMATION_LLM_PROVIDER: Joi.string().min(1).required().messages({
    'any.required': 'CITY_AUTOMATION_LLM_PROVIDER is required for the city automation workflow.'
  }),
  CITY_AUTOMATION_LLM_MODEL: Joi.string().min(1).required().messages({
    'any.required': 'CITY_AUTOMATION_LLM_MODEL is required for the city automation workflow.'
  }),
  CITY_AUTOMATION_LLM_API_KEY: Joi.string().allow('', null),
  OPENAI_API_KEY: Joi.string().allow('', null),
  CONFIG_DASHBOARD_ENABLED: Joi.string().valid('true', 'false').optional(),
  CONFIG_DASHBOARD_USER: Joi.string().allow('', null),
  CONFIG_DASHBOARD_PASS: Joi.string().allow('', null)
})
  .custom((value, helpers) => {
    const dashboardEnabled = value.CONFIG_DASHBOARD_ENABLED === 'true';
    const dashboardUserProvided = hasValue(value.CONFIG_DASHBOARD_USER);
    const dashboardPassProvided = hasValue(value.CONFIG_DASHBOARD_PASS);

    if ((dashboardEnabled || dashboardUserProvided || dashboardPassProvided) && !dashboardUserProvided) {
      return helpers.error('any.custom', {
        message: 'CONFIG_DASHBOARD_USER is required when enabling the configuration dashboard.'
      });
    }

    if ((dashboardEnabled || dashboardUserProvided || dashboardPassProvided) && !dashboardPassProvided) {
      return helpers.error('any.custom', {
        message: 'CONFIG_DASHBOARD_PASS is required when enabling the configuration dashboard.'
      });
    }

    if (!hasValue(value.CITY_AUTOMATION_LLM_API_KEY) && !hasValue(value.OPENAI_API_KEY)) {
      return helpers.error('any.custom', {
        message: 'Provide CITY_AUTOMATION_LLM_API_KEY or OPENAI_API_KEY for city content automation.'
      });
    }

    return value;
  })
  .prefs({ abortEarly: false, allowUnknown: true });

function validateEnvironment(env = process.env) {
  const { error } = envValidationSchema.validate(env);

  if (!error) {
    return;
  }

  const details = error.details.map((detail) => ({
    message: detail.context && detail.context.message ? detail.context.message : detail.message,
    path: detail.path.join('.'),
    type: detail.type
  }));

  logStructured('error', 'Environment validation failed', { errors: details });

  const errorMessage = details.map((detail) => detail.message).join(' ');
  throw new Error(`Environment validation failed: ${errorMessage}`);
}

validateEnvironment();

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
const DEFAULT_HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify';
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
    id: 'security',
    label: 'Beveiliging',
    description: 'Instellingen voor hCaptcha-validatie van formulieren en spam-preventie.',
    keys: ['HCAPTCHA_SITE_KEY', 'HCAPTCHA_SECRET_KEY', 'HCAPTCHA_VERIFY_URL']
  },
  {
    id: 'rentguy',
    label: 'RentGuy integratie',
    description:
      'API-parameters voor de synchronisatie van leads en boekingen richting de RentGuy applicatie.',
    keys: [
      'RENTGUY_API_BASE_URL',
      'RENTGUY_API_KEY',
      'RENTGUY_WORKSPACE_ID',
      'RENTGUY_TIMEOUT_MS',
      'RENTGUY_WEBHOOK_SECRETS'
    ]
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
    keys: ['N8N_PERSONALIZATION_WEBHOOK_URL', 'PERSONALIZATION_WEBHOOK_SECRETS']
  },
  {
    id: 'feedback',
    label: 'Feedback & surveys',
    description: 'Surveyautomatisering en post-event klantfeedback workflows.',
    keys: ['N8N_SURVEY_WEBHOOK_URL', 'SURVEY_RESPONSE_BASE_URL']
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

const DEFAULT_MANAGED_KEYS = Array.from(new Set(DEFAULT_SECTION_CONFIG.flatMap((section) => section.keys)));

function createDefaultTracker() {
  const entries = [];

  return {
    record(key, fallback, reason) {
      entries.push({ key, fallback, reason });
    },
    flush() {
      for (const entry of entries) {
        logStructured('warn', 'Configuration default applied', {
          configKey: entry.key,
          defaultValue: entry.fallback,
          reason: entry.reason
        });
      }
    }
  };
}

function withDefault(value, fallback, key, tracker, reason = 'missing') {
  if (hasValue(value)) {
    return value;
  }

  tracker.record(key, fallback, reason);
  return fallback;
}

function parseNumber(value, fallback, key, tracker) {
  if (hasValue(value)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }

    tracker.record(key, fallback, 'invalid');
    return fallback;
  }

  tracker.record(key, fallback, 'missing');
  return fallback;
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

function parseKeyValueMap(value) {
  if (!value) {
    return {};
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [key, ...rest] = entry.split(':');
      const mapValue = rest.join(':').trim();
      if (key && mapValue) {
        acc[key.trim()] = mapValue;
      }
      return acc;
    }, {});
}

function parseCorsOrigin(value, tracker) {
  if (!value) {
    tracker.record('CORS_ORIGIN', '*', 'missing');
    return '*';
  }

  const entries = parseList(value);

  if (!entries.length) {
    tracker.record('CORS_ORIGIN', '*', 'empty');
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
  const tracker = createDefaultTracker();

  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN, tracker);
  const dashboardAllowedIps = parseList(process.env.CONFIG_DASHBOARD_ALLOWED_IPS);
  const configuredDashboardKeys = parseList(process.env.CONFIG_DASHBOARD_KEYS);
  const managedKeys = configuredDashboardKeys.length ? configuredDashboardKeys : DEFAULT_MANAGED_KEYS;
  const rentGuyConfigured = Boolean(process.env.RENTGUY_API_BASE_URL && process.env.RENTGUY_API_KEY);
  const sevensaConfigured = Boolean(process.env.SEVENSA_SUBMIT_URL);
  const rentGuyFlagEnabled = featureFlags.isEnabled('rentguy-integration');
  const sevensaFlagEnabled = featureFlags.isEnabled('sevensa-integration');
  const dashboardEnabled =
    process.env.CONFIG_DASHBOARD_ENABLED !== 'false' &&
    Boolean(process.env.CONFIG_DASHBOARD_USER) &&
    Boolean(process.env.CONFIG_DASHBOARD_PASS);
  const alertWebhooks = parseList(process.env.ALERT_WEBHOOK_URLS);

  const configObject = {
    env: withDefault(process.env.NODE_ENV, 'development', 'NODE_ENV', tracker),
    port: parseNumber(process.env.PORT, DEFAULT_PORT, 'PORT', tracker),
    host: withDefault(process.env.HOST, DEFAULT_HOST, 'HOST', tracker),
    cors: {
      origin: corsOrigin,
      credentials: corsOrigin !== '*'
    },
    logging: hasValue(process.env.LOG_FORMAT)
      ? process.env.LOG_FORMAT
      : (tracker.record(
          'LOG_FORMAT',
          process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
          'missing'
        ),
        process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
    rateLimit: {
      windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT_WINDOW, 'RATE_LIMIT_WINDOW_MS', tracker),
      max: parseNumber(process.env.RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX, 'RATE_LIMIT_MAX', tracker)
    },
    databaseUrl: process.env.DATABASE_URL,
    mail: {
      provider: process.env.MAIL_PROVIDER || null,
      apiKey: process.env.MAIL_API_KEY || null,
      from: process.env.MAIL_FROM_ADDRESS || null,
      replyTo: process.env.MAIL_REPLY_TO || null,
      stream: process.env.MAIL_STREAM || null,
      templates: {
        contact: parseKeyValueMap(process.env.MAIL_TEMPLATES_CONTACT),
        booking: parseKeyValueMap(process.env.MAIL_TEMPLATES_BOOKING)
      }
    },
    redis: {
      url: process.env.REDIS_URL || null,
      tls: process.env.REDIS_TLS === 'true',
      namespace: withDefault(process.env.REDIS_NAMESPACE, 'mr-dj', 'REDIS_NAMESPACE', tracker),
      tlsRejectUnauthorized:
        process.env.REDIS_TLS_REJECT_UNAUTHORIZED === undefined
          ? (tracker.record('REDIS_TLS_REJECT_UNAUTHORIZED', true, 'missing'), true)
          : process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false'
    },
    serviceName: withDefault(process.env.SERVICE_NAME, 'mr-dj-backend', 'SERVICE_NAME', tracker),
    version: withDefault(process.env.npm_package_version, '1.0.0', 'npm_package_version', tracker),
    integrations: {
      rentGuy: {
        enabled: rentGuyConfigured && rentGuyFlagEnabled,
        baseUrl: process.env.RENTGUY_API_BASE_URL || null,
        workspaceId: process.env.RENTGUY_WORKSPACE_ID || null,
        timeoutMs: parseNumber(
          process.env.RENTGUY_TIMEOUT_MS,
          DEFAULT_RENTGUY_TIMEOUT_MS,
          'RENTGUY_TIMEOUT_MS',
          tracker
        ),
        webhookSecrets: parseList(process.env.RENTGUY_WEBHOOK_SECRETS)
      },
      sevensa: {
        enabled: sevensaConfigured && sevensaFlagEnabled,
        submitUrl: process.env.SEVENSA_SUBMIT_URL || null,
        retryDelayMs: parseNumber(
          process.env.SEVENSA_QUEUE_RETRY_DELAY_MS,
          DEFAULT_SEVENSA_RETRY_DELAY_MS,
          'SEVENSA_QUEUE_RETRY_DELAY_MS',
          tracker
        ),
        maxAttempts: parseNumber(
          process.env.SEVENSA_QUEUE_MAX_ATTEMPTS,
          DEFAULT_SEVENSA_MAX_ATTEMPTS,
          'SEVENSA_QUEUE_MAX_ATTEMPTS',
          tracker
        )
      },
      hcaptcha: {
        enabled: Boolean(process.env.HCAPTCHA_SECRET_KEY),
        siteKey: process.env.HCAPTCHA_SITE_KEY || null,
        secretKey: process.env.HCAPTCHA_SECRET_KEY || null,
        verifyUrl: hasValue(process.env.HCAPTCHA_VERIFY_URL)
          ? process.env.HCAPTCHA_VERIFY_URL
          : (tracker.record('HCAPTCHA_VERIFY_URL', DEFAULT_HCAPTCHA_VERIFY_URL, 'missing'),
            DEFAULT_HCAPTCHA_VERIFY_URL)
      }
    },
    personalization: {
      automationWebhook: process.env.N8N_PERSONALIZATION_WEBHOOK_URL || null,
      incomingWebhookSecrets: parseList(process.env.PERSONALIZATION_WEBHOOK_SECRETS)
    },
    feedback: {
      automationWebhook: process.env.N8N_SURVEY_WEBHOOK_URL || null,
      responseBaseUrl: process.env.SURVEY_RESPONSE_BASE_URL || null
    },
    automation: {
      seo: {
        apiUrl: process.env.SEO_AUTOMATION_API_URL || null,
        keywordSetId: process.env.SEO_AUTOMATION_KEYWORDSET_ID || null,
        region: withDefault(
          process.env.SEO_AUTOMATION_REGION,
          'Noord-Brabant',
          'SEO_AUTOMATION_REGION',
          tracker
        ),
        themeKeywords: parseList(process.env.SEO_AUTOMATION_THEME_KEYWORDS)
      },
      llm: {
        provider: withDefault(
          process.env.CITY_AUTOMATION_LLM_PROVIDER,
          'template',
          'CITY_AUTOMATION_LLM_PROVIDER',
          tracker
        ),
        model: withDefault(
          process.env.CITY_AUTOMATION_LLM_MODEL,
          'gpt-4.1-mini',
          'CITY_AUTOMATION_LLM_MODEL',
          tracker
        ),
        apiKeyConfigured: Boolean(process.env.CITY_AUTOMATION_LLM_API_KEY || process.env.OPENAI_API_KEY)
      },
      approvals: {
        email: process.env.SEO_AUTOMATION_APPROVAL_EMAIL || null
      },
      dryRun: process.env.CITY_AUTOMATION_DRY_RUN === 'true'
    },
    alerts: {
      webhooks: alertWebhooks,
      throttleMs: parseNumber(
        process.env.ALERT_THROTTLE_MS,
        DEFAULT_ALERT_THROTTLE_MS,
        'ALERT_THROTTLE_MS',
        tracker
      ),
      queue: {
        warningBacklog: parseNumber(
          process.env.ALERT_QUEUE_WARNING_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.warningBacklog,
          'ALERT_QUEUE_WARNING_BACKLOG',
          tracker
        ),
        criticalBacklog: parseNumber(
          process.env.ALERT_QUEUE_CRITICAL_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.criticalBacklog,
          'ALERT_QUEUE_CRITICAL_BACKLOG',
          tracker
        ),
        recoveryBacklog: parseNumber(
          process.env.ALERT_QUEUE_RECOVERY_BACKLOG,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.recoveryBacklog,
          'ALERT_QUEUE_RECOVERY_BACKLOG',
          tracker
        ),
        warningRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_WARNING_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.warningRetryAgeMs,
          'ALERT_QUEUE_WARNING_RETRY_AGE_MS',
          tracker
        ),
        criticalRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_CRITICAL_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.criticalRetryAgeMs,
          'ALERT_QUEUE_CRITICAL_RETRY_AGE_MS',
          tracker
        ),
        recoveryRetryAgeMs: parseNumber(
          process.env.ALERT_QUEUE_RECOVERY_RETRY_AGE_MS,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.recoveryRetryAgeMs,
          'ALERT_QUEUE_RECOVERY_RETRY_AGE_MS',
          tracker
        ),
        deadLetterWarning: parseNumber(
          process.env.ALERT_QUEUE_DEAD_LETTER_WARNING,
          DEFAULT_ALERT_QUEUE_THRESHOLDS.deadLetterWarning,
          'ALERT_QUEUE_DEAD_LETTER_WARNING',
          tracker
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

  tracker.flush();
  return configObject;
}

const config = buildConfig();

function reload() {
  managedEnv.loadToProcessEnv();
  require('dotenv').config({ override: false });
  featureFlags.clearCache();
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
