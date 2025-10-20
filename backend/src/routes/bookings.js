const express = require('express');
const { body, param, validationResult } = require('express-validator');
const {
  createBooking,
  getRecentBookings,
  updateBooking,
  deleteBooking
} = require('../services/bookingService');

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

const updateValidations = [
  param('id').trim().notEmpty().withMessage('Boeking ID is vereist'),
  body('name').optional().trim().notEmpty().withMessage('Naam mag niet leeg zijn'),
  body('email').optional().trim().isEmail().withMessage('Ongeldig e-mailadres'),
  body('phone').optional().trim().isLength({ min: 6 }).withMessage('Telefoonnummer is ongeldig'),
  body('eventType').optional().trim().notEmpty().withMessage('Type evenement is vereist'),
  body('eventDate').optional().trim().isISO8601().withMessage('Ongeldige datum'),
  body('message').optional().trim().isLength({ max: 4000 }).withMessage('Bericht is te lang'),
  body('packageId').optional().trim().isLength({ max: 255 }),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Ongeldige status')
];

const deleteValidations = [
  param('id').trim().notEmpty().withMessage('Boeking ID is vereist')
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
      packageId: req.body.packageId
    });

    res.status(201).json({
      success: true,
      message: 'Bedankt voor je boeking! We nemen binnen 24 uur contact op.',
      bookingId: booking.id,
      status: booking.status,
      persisted: booking.persisted,
      rentGuySync: booking.rentGuySync
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
    const booking = await updateBooking(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      message: req.body.message,
      packageId: req.body.packageId,
      status: req.body.status
    });

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
