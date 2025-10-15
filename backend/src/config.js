const managedEnv = require('./lib/managedEnv');

managedEnv.loadToProcessEnv();
require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_MANAGED_KEYS = [
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
];

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
    dashboard: {
      enabled: dashboardEnabled,
      username: dashboardEnabled ? process.env.CONFIG_DASHBOARD_USER : null,
      password: dashboardEnabled ? process.env.CONFIG_DASHBOARD_PASS : null,
      allowedIps: dashboardAllowedIps,
      managedKeys,
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
