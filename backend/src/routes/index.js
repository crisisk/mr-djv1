const express = require('express');
const config = require('../config');
const healthRouter = require('./health');
const packagesRouter = require('./packages');
const contactRouter = require('./contact');
const bookingsRouter = require('./bookings');
const reviewsRouter = require('./reviews');
const integrationsRouter = require('./integrations');
const personalizationRouter = require('./personalization');
const dashboardRouter = require('./dashboard');

const router = express.Router();

router.get('/', (_req, res) => {
  const endpoints = {
    health: '/health',
    contact: '/contact',
    bookings: '/bookings',
    packages: '/packages',
    reviews: '/reviews',
    integrations: {
      rentGuy: '/integrations/rentguy/status',
      sevensa: '/integrations/sevensa/status'
    },
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
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/integrations', integrationsRouter);
router.use('/personalization', personalizationRouter);

if (config.dashboard.enabled) {
  router.use('/dashboard', dashboardRouter);
}

module.exports = router;
