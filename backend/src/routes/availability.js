const express = require('express');
const { getAvailability, AvailabilityValidationError } = require('../services/availabilityService');

const router = express.Router();

router.get('/', (req, res, next) => {
  const { startDate, endDate, location } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: 'startDate en endDate query parameters zijn verplicht.',
    });
  }

  try {
    const availability = getAvailability({ startDate, endDate, location });
    res.json(availability);
  } catch (error) {
    if (error instanceof AvailabilityValidationError) {
      return res.status(400).json({
        error: error.message,
        details: error.details ?? null,
      });
    }

    next(error);
  }
});

module.exports = router;
