const express = require('express');
const { body, validationResult } = require('express-validator');
const { calculateQuote, PricingError } = require('../services/pricingService');

const router = express.Router();

const validations = [
  body('packageId').trim().notEmpty().withMessage('packageId is vereist'),
  body('location')
    .optional({ nullable: true })
    .isString()
    .bail()
    .isLength({ max: 255 })
    .withMessage('location mag maximaal 255 tekens zijn')
    .trim(),
  body('extras')
    .optional({ nullable: true })
    .isArray({ max: 12 })
    .withMessage('extras moet een array zijn'),
  body('extras.*')
    .optional()
    .isString()
    .withMessage('Alle extras moeten een string identifier hebben')
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('extra identifiers moeten tussen 1 en 120 tekens zijn')
];

router.post('/quote', validations, async (req, res, next) => {
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
    const quote = await calculateQuote({
      packageId: req.body.packageId,
      location: req.body.location,
      extras: req.body.extras
    });

    res.json(quote);
  } catch (error) {
    if (error instanceof PricingError) {
      return res.status(error.statusCode).json({
        error: error.publicMessage,
        details: error.details
      });
    }

    next(error);
  }
});

module.exports = router;
