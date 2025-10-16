const express = require('express');
const config = require('../config');
const db = require('../lib/db');
const { getContactServiceStatus } = require('../services/contactService');
const { getBookingServiceStatus } = require('../services/bookingService');

const router = express.Router();

router.get('/', (_req, res) => {
  const dbStatus = db.getStatus();
  const contactStatus = getContactServiceStatus();
  const bookingStatus = getBookingServiceStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: config.serviceName,
    version: config.version,
    environment: config.env,
    uptime: process.uptime(),
    dependencies: {
      database: {
        configured: dbStatus.configured,
        connected: dbStatus.connected,
        lastError: dbStatus.lastError,
        lastSuccessfulAt: dbStatus.lastSuccessfulAt,
        lastFailureAt: dbStatus.lastFailureAt
      },
      storage: {
        contact: {
          strategy: contactStatus.storageStrategy,
          fallbackQueueSize: contactStatus.fallbackQueueSize
        },
        bookings: {
          strategy: bookingStatus.storageStrategy,
          fallbackQueueSize: bookingStatus.fallbackQueueSize
        }
      }
    }
  });
});

module.exports = router;
