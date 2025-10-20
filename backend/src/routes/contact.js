const express = require('express');
const { validationResult, matchedData } = require('express-validator');
const { saveContact } = require('../services/contactService');
const contactSchema = require('../lib/validation/contactSchema');

const router = express.Router();

router.post('/', contactSchema, async (req, res, next) => {
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
    const payload = matchedData(req, { locations: ['body'], includeOptionals: true });

    const contactRecord = await saveContact({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      eventType: payload.eventType,
      eventDate: payload.eventDate,
      packageId: payload.packageId
    });

    const eventDateIso = contactRecord.eventDate
      ? new Date(contactRecord.eventDate).toISOString()
      : payload.eventDate || null;

    res.status(201).json({
      success: true,
      message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
      contactId: contactRecord.id,
      status: contactRecord.status,
      persisted: contactRecord.persisted,
      eventType: contactRecord.eventType || payload.eventType,
      eventDate: eventDateIso,
      requestedPackage: contactRecord.packageId || payload.packageId || null,
      submittedAt: contactRecord.createdAt,
      rentGuySync: contactRecord.rentGuySync,
      sevensaSync: contactRecord.sevensaSync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
