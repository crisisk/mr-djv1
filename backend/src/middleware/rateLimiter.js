const rateLimit = require('express-rate-limit');
const config = require('../config');

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs ?? config.rateLimit.windowMs;
  const limit = options.limit ?? options.max ?? config.rateLimit.max;

  return rateLimit({
    windowMs,
    limit,
    max: limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown',
    handler: (req, res, _next, { statusCode, windowMs: handlerWindowMs }) => {
      const msBeforeNext = req.rateLimit?.msBeforeNext;
      const retryAfterSeconds = msBeforeNext
        ? Math.ceil(msBeforeNext / 1000)
        : Math.ceil((handlerWindowMs || windowMs) / 1000);

      if (typeof res.set === 'function' && !res.headersSent) {
        res.set('Retry-After', String(retryAfterSeconds));
      }

      res.status(statusCode || 429).json({
        error: 'Too many requests',
        retryAfter: retryAfterSeconds
      });
    }
  });
}

const rateLimiter = createRateLimiter();

module.exports = rateLimiter;
module.exports.createRateLimiter = createRateLimiter;
