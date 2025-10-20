const express = require('express');
const config = require('../config');
const rateLimiter = require('../middleware/rateLimiter');
const healthRouter = require('./health');
const packagesRouter = require('./packages');
const contactRouter = require('./contact');
const callbackRequestsRouter = require('./callbackRequests');
const bookingsRouter = require('./bookings');
const bookingStepsRouter = require('./bookingSteps');
const reviewsRouter = require('./reviews');
const feedbackRouter = require('./feedback');
const integrationsRouter = require('./integrations');
const personalizationRouter = require('./personalization');
const dashboardRouter = require('./dashboard');
const metricsRouter = require('./metrics');
const featureFlags = require('../lib/featureFlags');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const endpoints = {
      health: '/health',
      contact: '/contact',
      callbackRequest: '/callback-request',
      bookings: '/bookings',
      packages: '/packages',
      reviews: '/reviews',
      feedback: '/feedback',
      integrations: {
        rentGuy: '/integrations/rentguy/status',
        sevensa: '/integrations/sevensa/status',
        crmExport: '/integrations/crm/export'
      },
      metrics: '/metrics/queues',
      personalization: {
        keyword: '/personalization/keyword',
        events: '/personalization/events'
      }
    };

    if (config.dashboard.enabled) {
      endpoints.dashboard = '/dashboard';
    }

    res.json({
      message: 'Mister DJ API',
      version: config.version,
      endpoints,
      featureFlags: {
        active: await featureFlags.getActive()
      }
    });
  } catch (error) {
    next(error);
  }
});

router.use('/health', healthRouter);
router.use('/packages', packagesRouter);
router.use('/contact', rateLimiter, contactRouter);
router.use('/callback-request', rateLimiter, callbackRequestsRouter);
router.use('/bookings', rateLimiter, bookingsRouter);
router.use('/booking-steps', rateLimiter, bookingStepsRouter);
router.use('/reviews', reviewsRouter);
router.use('/feedback', rateLimiter, feedbackRouter);
router.use('/integrations', integrationsRouter);
router.use('/personalization', featureFlags.guard('personalization'), personalizationRouter);
router.use('/metrics', metricsRouter);

if (config.dashboard.enabled) {
  router.use('/dashboard', dashboardRouter);
}

module.exports = router;
