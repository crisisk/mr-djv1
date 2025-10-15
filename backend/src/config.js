require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX = 100;

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseCorsOrigin(value) {
  if (!value) {
    return '*';
  }

  const entries = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!entries.length) {
    return '*';
  }

  return entries.length === 1 ? entries[0] : entries;
}

const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);

module.exports = {
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
  version: process.env.npm_package_version || '1.0.0'
};
