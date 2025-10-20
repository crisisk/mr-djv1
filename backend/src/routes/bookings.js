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

router.put('/:id', updateValidations, async (req, res, next) => {
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
    const updateFields = [
      'name',
      'email',
      'phone',
      'eventType',
      'eventDate',
      'message',
      'packageId',
      'status'
    ];

    const updates = updateFields.reduce((acc, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    const booking = await updateBooking(req.params.id, updates);

    if (!booking) {
      return res.status(404).json({ error: 'Boeking niet gevonden' });
    }

    res.json({
      success: true,
      message: 'Boeking bijgewerkt.',
      booking: {
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        persisted: booking.persisted,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        packageId: booking.packageId,
        message: booking.message
      },
      rentGuySync: booking.rentGuySync
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', deleteValidations, async (req, res, next) => {
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
    const removed = await deleteBooking(req.params.id);

    if (!removed) {
      return res.status(404).json({ error: 'Boeking niet gevonden' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
