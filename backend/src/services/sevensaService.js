const { randomUUID, createHash } = require('crypto');
const config = require('../config');
const { createDurableQueue } = require('../lib/durableQueue');
const { logger } = require('../lib/logger');

const DEFAULT_RETRY_DELAY_MS = 15000;
const DEFAULT_MAX_ATTEMPTS = 5;

let lastSubmitSuccess = null;
let lastSubmitError = null;

function getSettings() {
  return config.integrations?.sevensa || {};
}

function isConfigured() {
  return Boolean(getSettings().submitUrl);
}

function resolveRetryDelay() {
  const settings = getSettings();
  const parsed = Number(settings.retryDelayMs);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_RETRY_DELAY_MS;
}

function resolveMaxAttempts() {
  const settings = getSettings();
  const parsed = Number(settings.maxAttempts);
  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : DEFAULT_MAX_ATTEMPTS;
}

async function deliver(payload) {
  const submitUrl = getSettings().submitUrl;
  if (!submitUrl) {
    throw new Error('Sevensa submit URL is not configured');
  }

  const response = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MisterDJ-Sevensa/1.0'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let text = '';
    try {
      text = await response.text();
    } catch (error) {
      text = error.message;
    }

    throw new Error(`Sevensa responded with ${response.status}${text ? `: ${text}` : ''}`);
  }
}

function buildDedupeKey(payload) {
  const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return `sevensa:${hash}`;
}

const queue = createDurableQueue(
  'sevensa-sync',
  async (job) => {
    try {
      await deliver(job.data.payload);
      lastSubmitSuccess = {
        at: new Date(),
        jobId: job.id,
        attempts: job.attemptsMade + 1
      };
      lastSubmitError = null;
      return { status: 'delivered' };
    } catch (error) {
      lastSubmitError = {
        at: new Date(),
        jobId: job.id,
        message: error.message,
        attempts: job.attemptsMade + 1
      };
      logger.error({ err: error, jobId: job.id }, 'Sevensa delivery failed');
      throw error;
    }
  },
  {
    concurrency: 5
  }
);

function computeQueueSize(counts) {
  return (counts.waiting || 0) + (counts.delayed || 0);
}

async function enqueue(payload, meta = {}) {
  const dedupeKey = meta.dedupeKey || buildDedupeKey(payload);
  await queue.addJob(
    {
      id: meta.id || randomUUID(),
      payload,
      meta
    },
    {
      dedupeKey,
      attempts: resolveMaxAttempts(),
      backoff: { type: 'exponential', delay: resolveRetryDelay() }
    }
  );
  const metrics = await queue.getMetrics();
  return computeQueueSize(metrics.counts);
}

async function tryImmediateDelivery(payload, meta = {}) {
  if (!isConfigured()) {
    const queueSize = await enqueue(payload, meta);
    return { delivered: false, queued: true, reason: 'not-configured', queueSize };
  }

  try {
    await deliver(payload);
    lastSubmitSuccess = {
      at: new Date(),
      jobId: meta.id || null,
      attempts: 1
    };
    const metrics = await queue.getMetrics();
    return { delivered: true, queued: false, queueSize: computeQueueSize(metrics.counts) };
  } catch (error) {
    lastSubmitError = {
      at: new Date(),
      jobId: meta.id || null,
      message: error.message,
      attempts: 1
    };
    logger.warn({ err: error }, 'Sevensa delivery deferred to queue');
    const queueSize = await enqueue(payload, meta);
    return { delivered: false, queued: true, reason: 'delivery-failed', queueSize, lastError: error.message };
  }
}

function mapLeadToPayload(lead) {
  const fields = Object.entries({
    firstname: lead.firstName,
    lastname: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    event_date: lead.eventDate,
    event_type: lead.eventType,
    budget: lead.budget
  })
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([name, value]) => ({ name, value }));

  const context = {
    pageUri: lead.pageUri || null,
    pageName: lead.pageName || null
  };

  return {
    fields,
    context,
    legalConsentOptions: lead.legalConsentOptions || null
  };
}

async function submitLead(lead, meta = {}) {
  const payload = mapLeadToPayload(lead);
  return tryImmediateDelivery(payload, meta);
}

async function flushQueue(limit = 50) {
  const configured = isConfigured();
  const metricsBefore = await queue.getMetrics();
  if (!configured) {
    return {
      configured: false,
      attempted: 0,
      delivered: 0,
      remaining: computeQueueSize(metricsBefore.counts)
    };
  }

  const jobs = await queue.queue.getJobs(['failed', 'waiting', 'delayed'], 0, limit - 1, true);
  let attempted = 0;
  let delivered = 0;

  for (const job of jobs) {
    attempted += 1;
    try {
      if (job.failedReason) {
        await job.retry();
      } else {
        await job.promote();
      }
      const result = await job.waitUntilFinished(queue.queueEvents, { timeout: 10000 }).catch(() => null);
      if (result && result.status === 'delivered') {
        delivered += 1;
      }
    } catch (error) {
      logger.error({ err: error, jobId: job.id }, 'Failed to flush Sevensa job');
      await job.waitUntilFinished(queue.queueEvents, { timeout: 500 }).catch(() => null);
    }
  }

  const metrics = await queue.getMetrics();
  return {
    configured: true,
    attempted,
    delivered,
    remaining: computeQueueSize(metrics.counts)
  };
}

async function getStatus() {
  const configured = isConfigured();
  const metrics = await queue.getMetrics();
  const nextJobs = await queue.queue.getJobs(['waiting', 'delayed'], 0, 0, true);
  const nextJob = nextJobs[0] || null;
  const deadLetterCounts = await queue.deadLetterQueue.getJobCounts('waiting', 'delayed', 'failed');

  return {
    configured,
    queueSize: computeQueueSize(metrics.counts),
    activeJobs: metrics.counts.active,
    metrics: {
      retryAgeP95: metrics.retryAgeP95,
      counts: metrics.counts
    },
    deadLetterCount:
      (deadLetterCounts.waiting || 0) + (deadLetterCounts.delayed || 0) + (deadLetterCounts.failed || 0),
    lastSubmitSuccess,
    lastSubmitError,
    nextInQueue: nextJob
      ? {
          enqueuedAt: new Date(nextJob.timestamp),
          attempts: nextJob.attemptsMade,
          dedupeKey: nextJob.id
        }
      : null
  };
}

async function replayDeadLetters(limit = 20) {
  const jobs = await queue.deadLetterQueue.getJobs(['waiting', 'delayed'], 0, limit - 1, true);
  let replayed = 0;

  for (const job of jobs) {
    try {
      await enqueue(job.data.data.payload, job.data.data.meta);
      await job.remove();
      replayed += 1;
    } catch (error) {
      logger.error({ err: error, jobId: job.id }, 'Failed to replay Sevensa dead-letter job');
    }
  }

  return { replayed };
}

async function reset() {
  await Promise.all([
    queue.queue.drain(true),
    queue.deadLetterQueue.drain(true)
  ]);
  lastSubmitError = null;
  lastSubmitSuccess = null;
}

module.exports = {
  submitLead,
  flushQueue,
  replayDeadLetters,
  getStatus,
  reset
};
