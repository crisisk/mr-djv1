const crypto = require('crypto');
const express = require('express');
const Joi = require('joi');
const {
  SESSION_TTL_MS,
  getSelections,
  updateSelections,
  getDefaultSelections
} = require('../services/sessionService');

const router = express.Router();

const SESSION_COOKIE_NAME = 'mr-dj-session';

const selectionsSchema = Joi.object({
  date: Joi.string().trim().allow(null, ''),
  location: Joi.string().trim().allow(null, ''),
  eventType: Joi.string().trim().allow(null, ''),
  package: Joi.object({
    id: Joi.alternatives(Joi.string().allow('', null), Joi.number()).optional(),
    name: Joi.string().allow('', null).optional(),
    slug: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().allow(null).optional(),
    currency: Joi.string().allow('', null).optional()
  })
    .unknown(true)
    .allow(null),
  pricing: Joi.object({
    total: Joi.number().allow(null).optional(),
    currency: Joi.string().allow('', null).optional(),
    formattedTotal: Joi.string().allow('', null).optional(),
    breakdown: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().allow('', null).optional(),
          amount: Joi.number().allow(null).optional(),
          formattedAmount: Joi.string().allow('', null).optional()
        }).unknown(true)
      )
      .optional()
  })
    .unknown(true)
    .allow(null)
})
  .min(1)
  .messages({
    'object.base': 'Selecties moeten een object zijn',
    'object.min': 'Selecties mogen niet leeg zijn'
  });

const updatePayloadSchema = Joi.object({
  selections: selectionsSchema.required()
})
  .required()
  .messages({ 'any.required': 'Selecties zijn verplicht' });

function parseCookies(header) {
  if (!header || typeof header !== 'string') {
    return {};
  }

  return header.split(';').reduce((acc, part) => {
    const [name, ...rest] = part.trim().split('=');
    if (!name) {
      return acc;
    }

    const value = rest.join('=');

    try {
      acc[name] = decodeURIComponent(value);
    } catch (_error) {
      acc[name] = value;
    }

    return acc;
  }, {});
}

function createSessionId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return crypto.randomBytes(16).toString('hex');
}

function getOrCreateSessionId(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  let sessionId = cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    sessionId = createSessionId();
  }

  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    maxAge: SESSION_TTL_MS,
    path: '/'
  });

  return sessionId;
}

router.get('/', (req, res, next) => {
  try {
    const sessionId = getOrCreateSessionId(req, res);
    const selections = getSelections(sessionId);

    res.json({ selections });
  } catch (error) {
    next(error);
  }
});

router.patch('/', (req, res, next) => {
  const { error, value } = updatePayloadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details: error.details.map((detail) => ({
        field: detail.path.join('.') || 'selections',
        message: detail.message
      }))
    });
  }

  try {
    const sessionId = getOrCreateSessionId(req, res);
    const selections = updateSelections(sessionId, value.selections);

    res.json({ selections });
  } catch (updateError) {
    next(updateError);
  }
});

router.delete('/', (req, res, next) => {
  try {
    const sessionId = getOrCreateSessionId(req, res);
    const defaultSelections = getDefaultSelections();
    updateSelections(sessionId, defaultSelections);
    res.json({ selections: defaultSelections });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
