const express = require('express');
const config = require('../config');
const db = require('../lib/db');
const { getContactServiceStatus } = require('../services/contactService');
const { getCallbackRequestServiceStatus } = require('../services/callbackRequestService');
const { getBookingServiceStatus } = require('../services/bookingService');
const { getStatus: getRentGuyStatus } = require('../services/rentGuyService');
const { createResponse } = require('../lib/response');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  const dbStatus = db.getStatus();
  const contactStatus = getContactServiceStatus();
  const callbackStatus = getCallbackRequestServiceStatus();
  const bookingStatus = getBookingServiceStatus();
  try {
    const rentGuyStatus = await getRentGuyStatus();

    const data = {
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
          callbackRequests: {
            strategy: callbackStatus.storageStrategy,
            fallbackQueueSize: callbackStatus.fallbackQueueSize
          },
          bookings: {
            strategy: bookingStatus.storageStrategy,
            fallbackQueueSize: bookingStatus.fallbackQueueSize
          }
        },
        integrations: {
          rentGuy: rentGuyStatus,
          personalization: {
            automationWebhookConfigured: Boolean(config.personalization?.automationWebhook)
          }
        }
      }
    };

    res.json(createResponse(data));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
