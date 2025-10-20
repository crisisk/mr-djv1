const { randomUUID, createHash } = require('crypto');
const { createDurableQueue } = require('../lib/durableQueue');
const { logger } = require('../lib/logger');

const DEFAULT_TIMEOUT_MS = 5000;

let lastSyncSuccess = null;
let lastSyncError = null;

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getBaseUrl() {
  const baseUrl = process.env.RENTGUY_API_BASE_URL;
  if (!baseUrl) {
    return null;
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function getApiKey() {
  return process.env.RENTGUY_API_KEY || null;
}

function getWorkspaceId() {
  return process.env.RENTGUY_WORKSPACE_ID || null;
}

function getTimeoutMs() {
  const parsed = Number(process.env.RENTGUY_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

function isConfigured() {
  return Boolean(getBaseUrl() && getApiKey());
}

function buildHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getApiKey()}`,
    'User-Agent': 'MisterDJ-Integration/1.0'
  };

  const workspaceId = getWorkspaceId();
  if (workspaceId) {
    headers['X-RentGuy-Workspace'] = workspaceId;
  }

  return headers;
}

async function deliver(resource, payload) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('RentGuy base URL is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const response = await fetch(`${baseUrl}/${resource}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`RentGuy responded with ${response.status}${text ? `: ${text}` : ''}`);
    }

    return true;
  } finally {
    clearTimeout(timeout);
  }
}

function buildDedupeKey(resource, payload) {
  const hash = createHash('sha256').update(`${resource}:${JSON.stringify(payload)}`).digest('hex');
  return `${resource}:${hash}`;
}

const queue = createDurableQueue(
  'rentguy-sync',
  async (job) => {
    const { resource, payload } = job.data;
    const attempts = job.attemptsMade + 1;

    try {
      await deliver(resource, payload);
      lastSyncSuccess = {
        at: new Date(),
        resource,
        attempts
      };
      return { status: 'delivered' };
    } catch (error) {
      lastSyncError = {
        at: new Date(),
        resource,
        message: error.message,
        attempts
      };
      logger.error({ err: error, jobId: job.id, resource }, 'RentGuy delivery failed');
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

async function enqueue(resource, payload, meta = {}) {
  const dedupeKey = meta.dedupeKey || buildDedupeKey(resource, payload);
  await queue.addJob(
    {
      id: meta.id || randomUUID(),
      resource,
      payload,
      meta
    },
    { dedupeKey }
  );
  const metrics = await queue.getMetrics();
  return computeQueueSize(metrics.counts);
}

async function tryImmediateDelivery(resource, payload, meta = {}) {
  if (!isConfigured()) {
    const queueSize = await enqueue(resource, payload, meta);
    return { delivered: false, queued: true, reason: 'not-configured', queueSize };
  }

  try {
    await deliver(resource, payload);
    lastSyncSuccess = {
      at: new Date(),
      resource,
      attempts: 1
    };
    const metrics = await queue.getMetrics();
    return { delivered: true, queued: false, queueSize: computeQueueSize(metrics.counts) };
  } catch (error) {
    lastSyncError = {
      at: new Date(),
      resource,
      message: error.message,
      attempts: 1
    };
    logger.warn({ err: error, resource }, 'RentGuy delivery deferred to queue');
    const queueSize = await enqueue(resource, payload, meta);
    return { delivered: false, queued: true, reason: 'delivery-failed', queueSize };
  }
}

function mapBookingPayload(booking) {
  return {
    bookingId: booking.id,
    status: booking.status,
    eventType: booking.eventType,
    eventDate: normalizeDate(booking.eventDate),
    eventEndDate: normalizeDate(booking.eventEndDate),
    eventTimeZone: booking.eventTimeZone || null,
    packageId: booking.packageId || null,
    contact: {
      name: booking.name,
      email: booking.email,
      phone: booking.phone
    },
    notes: booking.message || null,
    source: 'mister-dj-website',
    persisted: booking.persisted
  };
}

function mapLeadPayload(lead) {
  return {
    leadId: lead.id,
    status: lead.status,
    eventType: lead.eventType || null,
    eventDate: normalizeDate(lead.eventDate),
    packageId: lead.packageId || null,
    message: lead.message || null,
    source: 'mister-dj-website',
    contact: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone
    },
    persisted: lead.persisted
  };
}

async function syncBooking(booking, meta = {}) {
  return tryImmediateDelivery('bookings', mapBookingPayload(booking), meta);
}

async function syncLead(lead, meta = {}) {
  return tryImmediateDelivery('leads', mapLeadPayload(lead), meta);
}

async function syncPersonalizationEvent(event, meta = {}) {
  return tryImmediateDelivery('personalization-events', event, meta);
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

  const jobs = await queue.queue.getJobs(['delayed', 'waiting', 'failed'], 0, limit - 1, true);
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
      logger.error({ err: error, jobId: job.id }, 'Failed to flush rentguy job');
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
  const waitingJobs = await queue.queue.getJobs(['waiting', 'delayed'], 0, 0, true);
  const nextJob = waitingJobs[0] || null;
  const deadLetterCounts = await queue.deadLetterQueue.getJobCounts('waiting', 'delayed', 'failed');

  return {
    configured,
    workspaceId: getWorkspaceId(),
    queueSize: computeQueueSize(metrics.counts),
    activeJobs: metrics.counts.active,
    metrics: {
      retryAgeP95: metrics.retryAgeP95,
      counts: metrics.counts
    },
    deadLetterCount:
      (deadLetterCounts.waiting || 0) + (deadLetterCounts.delayed || 0) + (deadLetterCounts.failed || 0),
    lastSyncSuccess,
    lastSyncError,
    nextInQueue: nextJob
      ? {
          resource: nextJob.data.resource,
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
      await enqueue(job.data.data.resource, job.data.data.payload, job.data.data.meta);
      await job.remove();
      replayed += 1;
    } catch (error) {
      logger.error({ err: error, jobId: job.id }, 'Failed to replay dead-letter job');
    }
  }

  return { replayed };
}

async function reset() {
  await Promise.all([
    queue.queue.drain(true),
    queue.deadLetterQueue.drain(true)
  ]);
  lastSyncSuccess = null;
  lastSyncError = null;
}

module.exports = {
  syncBooking,
  syncLead,
  syncPersonalizationEvent,
  flushQueue,
  replayDeadLetters,
  getStatus,
  reset
};
