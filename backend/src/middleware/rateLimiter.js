const config = require('../config');
const { logger } = require('../lib/logger');

const requests = new Map();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of requests.entries()) {
    if (now - entry.startTime > config.rateLimit.windowMs) {
      requests.delete(key);
    }
  }
}

setInterval(cleanup, config.rateLimit.windowMs).unref();

function rateLimiter(req, res, next) {
  const identifier = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const max = config.rateLimit.max;

  const entry = requests.get(identifier) || { count: 0, startTime: now };

  const requestLogger = logger.child({
    middleware: 'rateLimiter',
    method: req.method,
    path: req.originalUrl,
    identifier
  });

  requestLogger.debug('Processing rate limit window', {
    count: entry.count,
    startTime: entry.startTime
  });

  if (now - entry.startTime > windowMs) {
    entry.count = 0;
    entry.startTime = now;
  }

  entry.count += 1;
  requests.set(identifier, entry);

  if (entry.count > max) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - entry.startTime)) / 1000);
    requestLogger.warn('Rate limit exceeded', { retryAfterSeconds });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: retryAfterSeconds
    });
    return;
  }

  requestLogger.debug('Rate limit check passed');
  next();
}

module.exports = rateLimiter;
