const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');
const observabilityService = require('../services/observabilityService');
const contactService = require('../services/contactService');

const router = express.Router();

async function trackServiceCall(serviceName, fn) {
  const start = process.hrtime.bigint();
  try {
    return await fn();
  } finally {
    const durationNs = process.hrtime.bigint() - start;
    const latencyMs = Number(durationNs) / 1e6;
    observabilityService.recordRequestMetric(serviceName, latencyMs);
  }
}

router.get('/queues', async (_req, res, next) => {
  try {
    const [rentGuy, sevensa] = await Promise.all([
      trackServiceCall('rentguy', () => rentGuyService.getStatus()),
      trackServiceCall('sevensa', () => sevensaService.getStatus())
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
      requestMetrics: observabilityService.getRequestMetricsSummary(),
      generatedAt: new Date().toISOString()
    };

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.get('/contact-backlog', (_req, res) => {
  const snapshot = contactService.getFallbackQueueSnapshot(100);
  res.json({
    generatedAt: new Date().toISOString(),
    queueSize: snapshot.queueSize,
    queue: snapshot.items,
    metrics: snapshot.metrics
  });
});

module.exports = router;
