const express = require('express');
const { validationResult } = require('express-validator');
const { saveCallbackRequest } = require('../services/callbackRequestService');
const { callbackRequestSchema } = require('../lib/validation/callbackRequestSchema');

const router = express.Router();

router.post('/', callbackRequestSchema, async (req, res, next) => {
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
    const callbackRequest = await saveCallbackRequest({
      name: req.body.name,
      phone: req.body.phone,
      eventType: req.body.eventType
    });

    res.status(201).json({
      success: true,
      message: 'Bedankt! We bellen je zo snel mogelijk terug.',
      callbackId: callbackRequest.id,
      status: callbackRequest.status,
      persisted: callbackRequest.persisted,
      eventType: callbackRequest.eventType,
      phone: callbackRequest.phone,
      submittedAt: callbackRequest.createdAt,
      rentGuySync: callbackRequest.rentGuySync,
      sevensaSync: callbackRequest.sevensaSync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
