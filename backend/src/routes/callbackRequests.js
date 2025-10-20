const express = require('express');
const { body, validationResult } = require('express-validator');
const { saveCallbackRequest } = require('../services/callbackRequestService');

const router = express.Router();

const validations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Naam is vereist')
    .isLength({ max: 255 })
    .withMessage('Naam is te lang'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Telefoonnummer is vereist')
    .isLength({ min: 6, max: 50 })
    .withMessage('Telefoonnummer is ongeldig'),
  body('eventType')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Type evenement is te lang')
];

router.post('/', validations, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details: errors.array().map((err) => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const callbackRequest = await saveCallbackRequest({
      name: req.body.name,
      phone: req.body.phone,
      eventType: req.body.eventType || null
    });

    res.status(201).json({
      success: true,
      message: 'Bedankt! We bellen je zo snel mogelijk terug.',
      callbackId: callbackRequest.id,
      status: callbackRequest.status,
      persisted: callbackRequest.persisted,
      eventType: callbackRequest.eventType,
      submittedAt: callbackRequest.createdAt,
      rentGuySync: callbackRequest.rentGuySync,
      sevensaSync: callbackRequest.sevensaSync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
