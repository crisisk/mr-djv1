const express = require('express');
const config = require('../config');
const db = require('../lib/db');
const contactService = require('../services/contactService');
const callbackRequestService = require('../services/callbackRequestService');
const bookingService = require('../services/bookingService');
const rentGuyService = require('../services/rentGuyService');
const redisService = require('../services/redisService');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  const dbStatus = db.getStatus();
  const contactStatus = contactService.ping();
  const callbackStatus = callbackRequestService.ping();
  const bookingStatus = bookingService.ping();

  try {
    const [rentGuyStatus, redisStatus] = await Promise.all([
      rentGuyService.ping(),
      redisService.ping()
    ]);

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
            ok: contactStatus.ok,
            strategy: contactStatus.storageStrategy,
            fallbackQueueSize: contactStatus.fallbackQueueSize
          },
          callbackRequests: {
            ok: callbackStatus.ok,
            strategy: callbackStatus.storageStrategy,
            fallbackQueueSize: callbackStatus.fallbackQueueSize
          },
          bookings: {
            ok: bookingStatus.ok,
            strategy: bookingStatus.storageStrategy,
            fallbackQueueSize: bookingStatus.fallbackQueueSize
          }
        },
        cache: {
          redis: redisStatus
        },
        integrations: {
          rentGuy: rentGuyStatus,
          personalization: {
            automationWebhookConfigured: Boolean(config.personalization?.automationWebhook)
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
