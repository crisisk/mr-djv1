const express = require('express');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const { saveContact } = require('../services/contactService');
const contactSchema = require('../lib/validation/contactSchema');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { logger } = require('../lib/logger');

const router = express.Router();
const requireCaptchaToken = config.integrations?.hcaptcha?.enabled;
const contactSecurity = config.contactForm || {};
const contactLogger = logger.child({ route: 'contact' });

const rateLimiter = createRateLimiter({
  windowMs: contactSecurity.rateLimit?.windowMs,
  limit: contactSecurity.rateLimit?.max
});

const ipThrottleWindowMs = contactSecurity.ipThrottle?.windowMs ?? 60 * 60 * 1000;
const ipThrottleMax = contactSecurity.ipThrottle?.max ?? 50;
const ipBlockDurationMs = contactSecurity.ipThrottle?.blockDurationMs ?? 30 * 60 * 1000;

const ipThrottleStore = new Map();

function pruneEntry(entry, now) {
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < ipThrottleWindowMs);
}

function ipThrottle(req, res, next) {
  if (!ipThrottleMax || ipThrottleMax <= 0) {
    next();
    return;
  }

  const identifier = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipThrottleStore.get(identifier) || { timestamps: [], blockedUntil: 0 };

  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    if (!res.headersSent) {
      res.set('Retry-After', String(retryAfter));
    }
    contactLogger.warn({ identifier, retryAfter, reason: 'ip-throttle-blocked' }, 'Contact IP throttled');
    res.status(429).json({
      error: 'Too many submissions from this IP',
      retryAfter,
      throttled: true
    });
    return;
  }

  pruneEntry(entry, now);
  entry.timestamps.push(now);

  if (entry.timestamps.length > ipThrottleMax) {
    entry.blockedUntil = now + ipBlockDurationMs;
    ipThrottleStore.set(identifier, entry);
    const retryAfter = Math.ceil(ipBlockDurationMs / 1000);
    if (!res.headersSent) {
      res.set('Retry-After', String(retryAfter));
    }
    contactLogger.warn({ identifier, retryAfter, reason: 'ip-throttle-window' }, 'Contact IP throttled');
    res.status(429).json({
      error: 'Too many submissions from this IP',
      retryAfter,
      throttled: true
    });
    return;
  }

  ipThrottleStore.set(identifier, entry);
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [identifier, entry] of ipThrottleStore.entries()) {
    pruneEntry(entry, now);
    if (!entry.timestamps.length && (!entry.blockedUntil || entry.blockedUntil <= now)) {
      ipThrottleStore.delete(identifier);
    }
  }
}, Math.max(ipThrottleWindowMs, 60 * 1000)).unref();

const defaultBlockedAgents = [
  'curl',
  'wget',
  'python-requests',
  'httpclient',
  'libwww',
  'scrapy'
];
const defaultSuspiciousAgents = ['bot', 'spider', 'crawler', 'httpunit', 'java', 'headless'];

const blockedAgentPatterns = new Set(
  [...defaultBlockedAgents, ...(contactSecurity.bot?.blockedAgents || [])].map((agent) =>
    agent.toLowerCase()
  )
);

const suspiciousAgentPatterns = new Set(
  [...defaultSuspiciousAgents, ...(contactSecurity.bot?.suspiciousAgents || [])].map((agent) =>
    agent.toLowerCase()
  )
);

function detectAutomation(req, res, next) {
  const userAgentRaw = req.get('user-agent') || '';
  const userAgent = userAgentRaw.toLowerCase();
  const referer = (req.get('referer') || '').toLowerCase();

  const blockedMatch = Array.from(blockedAgentPatterns).find((pattern) =>
    pattern && userAgent.includes(pattern)
  );

  if (blockedMatch) {
    contactLogger.warn(
      { userAgent: userAgentRaw, reason: 'blocked-agent', pattern: blockedMatch },
      'Blocked automated client on contact endpoint'
    );
    res.status(403).json({
      error: 'Automated submissions are not permitted',
      reason: 'blocked-user-agent'
    });
    return;
  }

  const suspiciousMatch =
    !userAgentRaw ||
    Array.from(suspiciousAgentPatterns).some((pattern) => pattern && userAgent.includes(pattern));

  if (suspiciousMatch && !referer) {
    req.suspectedBot = true;
    contactLogger.info(
      { userAgent: userAgentRaw, reason: 'suspicious-agent' },
      'Suspicious automation detected on contact endpoint'
    );
  }

  next();
}

function ensureCaptchaPresence(req, res, next) {
  if (!requireCaptchaToken) {
    next();
    return;
  }

  const token = typeof req.body?.hCaptchaToken === 'string' ? req.body.hCaptchaToken.trim() : '';
  if (!token) {
    contactLogger.warn({ ip: req.ip, reason: 'missing-captcha' }, 'Missing hCaptcha token');
    res.status(400).json({
      error: 'Captcha validatie is vereist',
      field: 'hCaptchaToken'
    });
    return;
  }

  next();
}

const validations = [
  body('name').trim().notEmpty().withMessage('Naam is vereist'),
  body('email').trim().isEmail().withMessage('Ongeldig e-mailadres'),
  body('phone').trim().isLength({ min: 6 }).withMessage('Telefoonnummer is te kort'),
  body('message').optional().trim().isLength({ max: 2000 }).withMessage('Bericht is te lang'),
  body('eventType')
    .trim()
    .notEmpty()
    .withMessage('Type evenement is vereist')
    .isLength({ max: 255 }),
  body('eventDate').optional().trim().isISO8601().withMessage('Ongeldige datum'),
  body('packageId').optional().trim(),
  body('hCaptchaToken')
    .if(() => requireCaptchaToken)
    .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
    .notEmpty()
    .withMessage('hCaptcha validatie is vereist')
];

router.post('/', rateLimiter, ipThrottle, detectAutomation, ensureCaptchaPresence, validations, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }

  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      packageId: req.body.packageId
    };

    const contactRecord = await saveContact(payload, {
      captchaToken: req.body.hCaptchaToken,
      remoteIp: req.ip
    });

    const eventDateCandidate = contactRecord.eventDate || payload.eventDate || null;
    const eventDateIso = (() => {
      if (!eventDateCandidate) {
        return null;
      }

      const date = eventDateCandidate instanceof Date ? eventDateCandidate : new Date(eventDateCandidate);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    })();

    const rentGuySync = contactRecord.rentGuySync || {};
    const sevensaSync = contactRecord.sevensaSync || {};
    const partnerIncidents = [];

    if (!rentGuySync.delivered) {
      partnerIncidents.push('rentguy');
    }

    if (!sevensaSync.delivered) {
      partnerIncidents.push('sevensa');
    }

    const httpStatus = partnerIncidents.length ? 202 : 200;
    const message = partnerIncidents.length
      ? 'Bedankt voor je bericht! Door onderhoud bij onze partners verwerken we je aanvraag zodra de koppelingen weer beschikbaar zijn.'
      : 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.';

    if (partnerIncidents.length) {
      contactLogger.warn(
        {
          contactId: contactRecord.id,
          partnerIncidents,
          rentGuySync,
          sevensaSync,
          suspectedBot: Boolean(req.suspectedBot)
        },
        'Contact lead deferred due to partner availability'
      );
    } else {
      contactLogger.info(
        {
          contactId: contactRecord.id,
          suspectedBot: Boolean(req.suspectedBot)
        },
        'Contact lead processed successfully'
      );
    }

    res.status(httpStatus).json({
      success: true,
      message,
      contactId: contactRecord.id,
      status: contactRecord.status,
      persisted: contactRecord.persisted,
      eventType: contactRecord.eventType || payload.eventType || null,
      eventDate: eventDateIso,
      requestedPackage: contactRecord.packageId || payload.packageId || null,
      submittedAt: contactRecord.createdAt,
      processingStatus: partnerIncidents.length ? 'queued' : 'delivered',
      partnerIncidents,
      rentGuySync,
      sevensaSync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
