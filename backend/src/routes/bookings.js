const express = require('express');
const { body, validationResult } = require('express-validator');
const { createBooking, getRecentBookings } = require('../services/bookingService');
const { createResponse } = require('../lib/response');

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
    const data = {
      bookings: result.bookings
    };
    const meta = {
      persisted: result.persisted
    };

    res.json(createResponse(data, meta));
  } catch (error) {
    next(error);
  }
});

router.post('/', bookingValidations, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(422).json(
      createResponse(
        { details },
        { message: 'Validatie mislukt' },
        false
      )
    );
  }

  try {
    const booking = await createBooking({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      message: req.body.message,
      packageId: req.body.packageId
    });

    const data = {
      bookingId: booking.id,
      status: booking.status,
      persisted: booking.persisted,
      rentGuySync: booking.rentGuySync
    };
    const meta = {
      message: 'Bedankt voor je boeking! We nemen binnen 24 uur contact op.'
    };

    res.status(201).json(createResponse(data, meta));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
