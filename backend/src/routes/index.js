const express = require('express');
const config = require('../config');
const healthRouter = require('./health');
const packagesRouter = require('./packages');
const contactRouter = require('./contact');
const callbackRequestsRouter = require('./callbackRequests');
const bookingsRouter = require('./bookings');
const reviewsRouter = require('./reviews');
const integrationsRouter = require('./integrations');
const personalizationRouter = require('./personalization');
const dashboardRouter = require('./dashboard');
const metricsRouter = require('./metrics');

const router = express.Router();

router.get('/', (_req, res) => {
  const endpoints = {
    health: '/health',
    contact: '/contact',
    callbackRequest: '/callback-request',
    bookings: '/bookings',
    packages: '/packages',
    reviews: '/reviews',
    integrations: {
      rentGuy: '/integrations/rentguy/status',
      sevensa: '/integrations/sevensa/status'
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
    endpoints
  });
});

router.use('/health', healthRouter);
router.use('/packages', packagesRouter);
router.use('/contact', contactRouter);
router.use('/callback-request', callbackRequestsRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/integrations', integrationsRouter);
router.use('/personalization', personalizationRouter);
router.use('/metrics', metricsRouter);

if (config.dashboard.enabled) {
  router.use('/dashboard', dashboardRouter);
}

module.exports = router;
