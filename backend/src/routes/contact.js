const express = require('express');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const { saveContact } = require('../services/contactService');

const router = express.Router();
const requireCaptchaToken = config.integrations?.hcaptcha?.enabled;

const validations = [
  body('name').trim().notEmpty().withMessage('Naam is vereist'),
  body('email').trim().isEmail().withMessage('Ongeldig e-mailadres'),
  body('phone').trim().isLength({ min: 6 }).withMessage('Telefoonnummer is te kort'),
  body('message').optional().trim().isLength({ max: 2000 }).withMessage('Bericht is te lang'),
  body('eventType')
    .trim()
    .notEmpty()
    .withMessage('Type evenement is vereist')
    .isLength({ max: 255 }),
  body('eventDate').optional().trim().isISO8601().withMessage('Ongeldige datum'),
  body('packageId').optional().trim(),
  body('hCaptchaToken')
    .if(() => requireCaptchaToken)
    .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
    .notEmpty()
    .withMessage('hCaptcha validatie is vereist')
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
    const contactRecord = await saveContact(
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        eventType: req.body.eventType,
        eventDate: req.body.eventDate,
        packageId: req.body.packageId
      },
      {
        captchaToken: req.body.hCaptchaToken,
        remoteIp: req.ip
      }
    );

    const eventDateIso = contactRecord.eventDate
      ? new Date(contactRecord.eventDate).toISOString()
      : req.body.eventDate || null;

    res.status(201).json({
      success: true,
      message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
      contactId: contactRecord.id,
      status: contactRecord.status,
      persisted: contactRecord.persisted,
      eventType: contactRecord.eventType || req.body.eventType,
      eventDate: eventDateIso,
      requestedPackage: contactRecord.packageId || req.body.packageId || null,
      submittedAt: contactRecord.createdAt,
      rentGuySync: contactRecord.rentGuySync,
      sevensaSync: contactRecord.sevensaSync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
