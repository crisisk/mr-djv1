const express = require('express');
const { query, body, validationResult } = require('express-validator');
const {
  getVariantForRequest,
  recordEvent
} = require('../services/personalizationService');
const { validationError } = require('../lib/httpError');

const router = express.Router();

function collectArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

const keywordValidations = [
  query('keyword').optional().isString().trim(),
  query('keywords').optional().isString().trim(),
  query('utm_term').optional().isString().trim(),
  query('utm_campaign').optional().isString().trim(),
  query('utm_source').optional().isString().trim(),
  query('campaign').optional().isString().trim(),
  query('source').optional().isString().trim(),
  query('landing').optional().isString().trim(),
  query('referrer').optional().isString().trim(),
  query('persona').optional().isString().trim(),
  query('intent').optional().isString().trim()
];

const eventValidations = [
  body('type')
    .isString()
    .trim()
    .isIn(['impression', 'cta_click', 'conversion', 'journey_step', 'form_start', 'form_submit'])
    .withMessage('type must be a known CRO event type'),
  body('variantId').isString().trim().notEmpty(),
  body('keyword').optional().isString().trim(),
  body('payload').optional().isObject(),
  body('context').optional().isObject()
];

function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return next(validationError(details));
  }

  return next();
}

router.get('/keyword', keywordValidations, handleValidation, async (req, res, next) => {
  try {
    const keywordList = [
      ...collectArray(req.query.keyword),
      ...collectArray(req.query.keywords?.split?.(',') || [])
    ].filter(Boolean);

    const intentHints = [
      ...collectArray(req.query.intent),
      ...collectArray(req.query.persona)
    ].filter(Boolean);

    const result = await getVariantForRequest({
      keywords: keywordList,
      keyword: req.query.keyword,
      utmTerm: req.query.utm_term,
      search: req.query.search,
      query: req.query.q,
      personaHint: req.query.persona,
      additionalHints: intentHints,
      landing: req.query.landing,
      utmCampaign: req.query.utm_campaign || req.query.campaign,
      utmSource: req.query.utm_source || req.query.source,
      referrer: req.query.referrer
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/events', eventValidations, handleValidation, async (req, res, next) => {
  try {
    const entry = await recordEvent({
      type: req.body.type,
      variantId: req.body.variantId,
      keyword: req.body.keyword,
      payload: req.body.payload || {},
      context: req.body.context || {}
    });

    res.status(201).json({
      success: true,
      event: entry
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
