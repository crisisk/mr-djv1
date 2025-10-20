const { randomUUID, createHash } = require('crypto');
const config = require('../config');
const { createDurableQueue } = require('../lib/durableQueue');
const { logger } = require('../lib/logger');

/**
 * @typedef {Object} SevensaDeliveryMeta
 * @property {string} [id]
 * @property {string} [dedupeKey]
 */

/**
 * @typedef {Object} SevensaDeliveryResult
 * @property {boolean} delivered
 * @property {boolean} queued
 * @property {number} queueSize
 * @property {string} [reason]
 * @property {string} [lastError]
 */

/**
 * @typedef {Object} SevensaLead
 * @property {string} id
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [company]
 * @property {string} [message]
 * @property {string} [eventDate]
 * @property {string} [eventType]
 * @property {string|number} [budget]
 * @property {string} [pageUri]
 * @property {string} [pageName]
 * @property {string} [source]
 * @property {boolean} [persisted]
 * @property {Array<Object>|null} [legalConsentOptions]
 */

const DEFAULT_RETRY_DELAY_MS = 15000;
const DEFAULT_MAX_ATTEMPTS = 5;

let lastSubmitSuccess = null;
let lastSubmitError = null;

function getSettings() {
  return config.integrations?.sevensa || {};
}

function isConfigured() {
  const settings = getSettings();
  if (!settings.enabled) {
    return false;
  }

  return Boolean(settings.submitUrl);
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

/**
 * Adds a payload to the durable queue, deduplicating when possible.
 *
 * @param {Object<string, *>} payload
 * @param {SevensaDeliveryMeta} [meta]
 * @returns {Promise<number>} queue size after enqueueing
 */
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

/**
 * Attempts to deliver immediately and falls back to the queue when unavailable.
 *
 * @param {Object<string, *>} payload
 * @param {SevensaDeliveryMeta} [meta]
 * @returns {Promise<SevensaDeliveryResult>}
 */
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

/**
 * Converts a lead object into the Sevensa webhook payload structure.
 *
 * @param {SevensaLead} lead
 * @returns {{ fields: Array<{ name: string, value: string }>, context: { pageUri: string|null, pageName: string|null }, legalConsentOptions: Array<Object>|null }}
 */
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

/**
 * Sends a lead to Sevensa, queueing if the webhook fails.
 *
 * @param {SevensaLead} lead
 * @param {SevensaDeliveryMeta} [meta]
 * @returns {Promise<SevensaDeliveryResult>}
 */
async function submitLead(lead, meta = {}) {
  const payload = mapLeadToPayload(lead);
  const enrichedMeta = { ...meta };
  if (lead?.id && !enrichedMeta.id) {
    enrichedMeta.id = lead.id;
  }
  return tryImmediateDelivery(payload, enrichedMeta);
}

/**
 * Drains queued Sevensa jobs by retrying them immediately.
 *
 * @param {number} [limit=50]
 * @returns {Promise<{ configured: boolean, attempted: number, delivered: number, remaining: number }>}
 */
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

function toIsoString(value) {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString();
}

function mapFieldsToRecord(fields = []) {
  return fields.reduce((acc, field) => {
    if (!field || !field.name) {
      return acc;
    }

    acc[field.name] = field.value ?? '';
    return acc;
  }, {});
}

function buildCrmRecord(entry) {
  const { job, state, source } = entry;
  const jobPayload = job?.data && job.data.payload ? job.data : job?.data?.data ? job.data.data : job?.data || {};
  const jobMeta = jobPayload.meta || {};
  const payload = jobPayload.payload || {};
  const fieldMap = mapFieldsToRecord(payload.fields);
  const context = payload.context || {};
  const jobAttempts = job?.attemptsMade ?? job?.data?.attemptsMade ?? 0;
  const lastError = job?.failedReason || job?.data?.failedReason || '';
  const queuedAt = (() => {
    if (job?.timestamp) {
      return toIsoString(job.timestamp);
    }
    if (job?.data?.failedAt) {
      return toIsoString(job.data.failedAt);
    }
    return '';
  })();

  return {
    lead_id: jobPayload.id || job?.id || job?.data?.jobId || '',
    queue_status: state,
    queued_at: queuedAt,
    attempts: jobAttempts,
    last_error: lastError,
    firstname: fieldMap.firstname || '',
    lastname: fieldMap.lastname || '',
    email: fieldMap.email || '',
    phone: fieldMap.phone || '',
    company: fieldMap.company || '',
    message: fieldMap.message || '',
    event_date: fieldMap.event_date || '',
    event_type: fieldMap.event_type || '',
    budget: fieldMap.budget || '',
    page_uri: context.pageUri || '',
    page_name: context.pageName || '',
    source: source || jobMeta.source || ''
  };
}

async function collectQueueEntries(limit) {
  const states = ['waiting', 'delayed', 'failed'];
  const entries = [];
  const seenIds = new Set();

  for (const state of states) {
    if (entries.length >= limit) {
      break;
    }

    const jobs = await queue.queue.getJobs([state], 0, limit - 1, true);
    for (const job of jobs) {
      const identifier = job?.id || job?.data?.jobId || job?.data?.id;
      if (seenIds.has(identifier)) {
        continue;
      }
      entries.push({ job, state, source: job?.data?.meta?.source || job?.data?.source || null });
      if (identifier) {
        seenIds.add(identifier);
      }
      if (entries.length >= limit) {
        break;
      }
    }
  }

  return entries;
}

async function collectDeadLetterEntries(limit, seenIds) {
  const jobs = await queue.deadLetterQueue.getJobs(['waiting', 'delayed', 'failed'], 0, limit - 1, true);
  const entries = [];

  for (const job of jobs) {
    const identifier = job?.data?.jobId || job?.data?.data?.id;
    if (identifier && seenIds.has(identifier)) {
      continue;
    }
    entries.push({ job, state: 'dead-letter', source: job?.data?.data?.meta?.source || null });
    if (identifier) {
      seenIds.add(identifier);
    }
    if (entries.length >= limit) {
      break;
    }
  }

  return entries;
}

async function getCrmExportRows({ limit = 500 } = {}) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 500;
  const queueEntries = await collectQueueEntries(safeLimit);
  const seenIds = new Set(queueEntries.map((entry) => entry.job?.id || entry.job?.data?.jobId || entry.job?.data?.id));
  const deadLetterEntries = await collectDeadLetterEntries(safeLimit, seenIds);
  const combined = queueEntries.concat(deadLetterEntries).slice(0, safeLimit);

  return combined.map((entry) => buildCrmRecord(entry));
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

async function ping() {
  const configured = isConfigured();
  try {
    const metrics = await queue.getMetrics();
    return {
      ok: true,
      configured,
      queueSize: computeQueueSize(metrics.counts),
      retryAgeP95: metrics.retryAgeP95,
      lastSubmitSuccess,
      lastSubmitError
    };
  } catch (error) {
    return {
      ok: false,
      configured,
      error: error.message,
      lastSubmitSuccess,
      lastSubmitError
    };
  }
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

/**
 * Empties all queues and resets diagnostics (for tests).
 *
 * @returns {Promise<void>}
 */
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
  getCrmExportRows,
  getStatus,
  reset,
  ping
};
