const express = require('express');
const { createBooking, getRecentBookings } = require('../services/bookingService');
const { validateBooking } = require('../lib/validation/bookingSchema');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await getRecentBookings();
    res.json({
      bookings: result.bookings,
      persisted: result.persisted
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { error, value, details } = validateBooking(req.body);

  if (error) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details
    });
  }

  try {
    const booking = await createBooking(value);

    res.status(201).json({
      success: true,
      message: 'Bedankt voor je boeking! We nemen binnen 24 uur contact op.',
      bookingId: booking.id,
      status: booking.status,
      persisted: booking.persisted,
      rentGuySync: booking.rentGuySync,
      eventType: value.eventType,
      requestedPackage: value.packageId || null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
