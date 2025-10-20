const express = require('express');
const { body, validationResult } = require('express-validator');
const { createBooking, getRecentBookings } = require('../services/bookingService');

const router = express.Router();

const bookingValidations = [
  body('name').trim().notEmpty().withMessage('Naam is vereist'),
  body('email').trim().isEmail().withMessage('Ongeldig e-mailadres'),
  body('phone').trim().isLength({ min: 6 }).withMessage('Telefoonnummer is vereist'),
  body('eventType').trim().notEmpty().withMessage('Type evenement is vereist'),
  body('eventDate').optional().trim().isISO8601().withMessage('Ongeldige datum'),
  body('message').optional().trim().isLength({ max: 4000 }).withMessage('Bericht is te lang'),
  body('packageId').optional().trim().isLength({ max: 255 })
];

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

router.post('/', bookingValidations, async (req, res, next) => {
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
    const booking = await createBooking({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      message: req.body.message,
      packageId: req.body.packageId,
      personalization: typeof req.body.personalization === 'object' ? req.body.personalization : undefined,
      personalizationContext:
        typeof req.body.personalizationContext === 'object'
          ? req.body.personalizationContext
          : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Bedankt voor je boeking! We nemen binnen 24 uur contact op.',
      bookingId: booking.id,
      status: booking.status,
      persisted: booking.persisted,
      rentGuySync: booking.rentGuySync,
      mailDelivery: booking.mailDelivery,
      personalization: booking.personalization
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
