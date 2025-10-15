const express = require('express');
const config = require('../config');
const healthRouter = require('./health');
const packagesRouter = require('./packages');
const contactRouter = require('./contact');
const bookingsRouter = require('./bookings');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'Mister DJ API',
    version: config.version,
    endpoints: {
      health: '/health',
      bookings: '/bookings',
      contact: '/contact',
      packages: '/packages'
    }
  });
});

router.use('/health', healthRouter);
router.use('/packages', packagesRouter);
router.use('/contact', contactRouter);
router.use('/bookings', bookingsRouter);

module.exports = router;
