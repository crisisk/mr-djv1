const express = require('express');
const { validateAvailabilityRequest } = require('../lib/validation/availabilitySchema');
const availabilityService = require('../services/availabilityService');

const router = express.Router();

router.post('/check', async (req, res, next) => {
  const { error, value, details } = validateAvailabilityRequest(req.body);

  if (error) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details
    });
  }

  try {
    const { sevensaResult } = await availabilityService.submitAvailabilityRequest(value);

    const delivered = Boolean(sevensaResult.delivered);
    const queued = Boolean(sevensaResult.queued);

    const message = delivered
      ? 'Beschikbaarheid gecontroleerd! We nemen contact op via e-mail.'
      : 'We hebben je aanvraag ontvangen. Een specialist neemt binnen 24 uur contact op.';

    res.status(delivered ? 200 : 202).json({
      success: delivered,
      queued,
      message,
      sevensa: {
        delivered,
        queued,
        queueSize: sevensaResult.queueSize,
        reason: sevensaResult.reason || null,
        lastError: sevensaResult.lastError || null
      }
    });
  } catch (submissionError) {
    next(submissionError);
  }
});

module.exports = router;
