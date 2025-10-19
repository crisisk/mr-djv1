const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');

const router = express.Router();

router.get('/queues', async (_req, res, next) => {
  try {
    const [rentGuy, sevensa] = await Promise.all([
      rentGuyService.getStatus(),
      sevensaService.getStatus()
    ]);

    const payload = {
      queues: {
        rentguy: {
          configured: rentGuy.configured,
          queueSize: rentGuy.queueSize,
          activeJobs: rentGuy.activeJobs,
          retryAgeP95: rentGuy.metrics.retryAgeP95,
          counts: rentGuy.metrics.counts,
          deadLetterCount: rentGuy.deadLetterCount
        },
        sevensa: {
          configured: sevensa.configured,
          queueSize: sevensa.queueSize,
          activeJobs: sevensa.activeJobs,
          retryAgeP95: sevensa.metrics.retryAgeP95,
          counts: sevensa.metrics.counts,
          deadLetterCount: sevensa.deadLetterCount
        }
      },
      generatedAt: new Date().toISOString()
    };

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
