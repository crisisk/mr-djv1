const { randomUUID } = require('crypto');
const config = require('../config');

const DEFAULT_RETRY_DELAY_MS = 15000;
const DEFAULT_MAX_ATTEMPTS = 5;
const WORKER_INTERVAL_MS = 5000;

const queue = [];
const deadLetterQueue = [];
let worker = null;

function getSettings() {
  return config.integrations?.hubSpot || {};
}

function resolveRetryDelay(attempt) {
  const settings = getSettings();
  const baseDelay = Number.isFinite(settings.retryDelayMs)
    ? Math.max(1000, settings.retryDelayMs)
    : DEFAULT_RETRY_DELAY_MS;
  const cappedAttempts = Math.max(1, Math.min(attempt, 6));
  const delay = baseDelay * Math.pow(2, cappedAttempts - 1);
  return Math.min(delay, baseDelay * 10);
}

function resolveMaxAttempts() {
  const settings = getSettings();
  const parsed = Number(settings.maxAttempts);
  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : DEFAULT_MAX_ATTEMPTS;
}

function isConfigured() {
  return Boolean(getSettings().submitUrl);
}

function createQueueEntry(payload, meta = {}) {
  return {
    id: randomUUID(),
    payload,
    meta,
    attempts: 0,
    enqueuedAt: new Date(),
    nextAttemptAt: Date.now(),
    lastAttemptAt: null,
    lastError: null,
    lastResponseStatus: null
  };
}

async function deliver(entry) {
  const submitUrl = getSettings().submitUrl;
  if (!submitUrl) {
    throw new Error('HubSpot submit URL is not configured');
  }

  entry.attempts += 1;
  entry.lastAttemptAt = new Date();

  const response = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MisterDJ-HubSpot/1.0'
    },
    body: JSON.stringify(entry.payload)
  });

  entry.lastResponseStatus = response.status;

  if (!response.ok) {
    let text = '';
    try {
      text = await response.text();
    } catch (error) {
      text = error.message;
    }

    throw new Error(`HubSpot responded with ${response.status}${text ? `: ${text}` : ''}`);
  }

  entry.lastError = null;
  return true;
}

function queueEntry(entry, reason) {
  entry.reason = reason;
  queue.push(entry);
  scheduleRetry(entry);
  ensureWorker();
  return {
    delivered: false,
    queued: true,
    reason,
    queueSize: queue.length,
    lastError: entry.lastError
  };
}

function scheduleRetry(entry) {
  entry.nextAttemptAt = Date.now() + (entry.attempts === 0 ? 0 : resolveRetryDelay(entry.attempts));
}

async function processQueue({ force = false } = {}) {
  if (!queue.length) {
    return { attempted: 0, delivered: 0, remaining: 0 };
  }

  let attempted = 0;
  let delivered = 0;
  const now = Date.now();

  for (let index = 0; index < queue.length; ) {
    const entry = queue[index];
    if (!force && entry.nextAttemptAt > now) {
      index += 1;
      continue;
    }

    attempted += 1;

    try {
      await deliver(entry);
      queue.splice(index, 1);
      delivered += 1;
    } catch (error) {
      entry.lastError = error.message;
      const maxAttempts = resolveMaxAttempts();
      if (entry.attempts >= maxAttempts) {
        queue.splice(index, 1);
        deadLetterQueue.push({ ...entry, droppedAt: new Date(), maxAttempts });
      } else {
        scheduleRetry(entry);
        index += 1;
      }
    }
  }

  return { attempted, delivered, remaining: queue.length };
}

async function flushQueue(limit = queue.length) {
  if (!isConfigured() || queue.length === 0) {
    return {
      configured: isConfigured(),
      attempted: 0,
      delivered: 0,
      remaining: queue.length
    };
  }

  let attempted = 0;
  let delivered = 0;

  for (let index = 0; index < queue.length && attempted < limit; ) {
    const entry = queue[index];
    attempted += 1;
    try {
      await deliver(entry);
      queue.splice(index, 1);
      delivered += 1;
    } catch (error) {
      entry.lastError = error.message;
      scheduleRetry(entry);
      index += 1;
    }
  }

  return {
    configured: true,
    attempted,
    delivered,
    remaining: queue.length
  };
}

function ensureWorker() {
  if (worker) {
    return;
  }

  worker = setInterval(() => {
    processQueue().catch((error) => {
      console.error('[hubspotService] Failed to process queue:', error.message);
    });
  }, WORKER_INTERVAL_MS).unref?.();
}

function stopWorker() {
  if (worker) {
    clearInterval(worker);
    worker = null;
  }
}

function mapLeadToPayload(lead) {
  const fields = Object.entries({
    firstname: lead.firstName,
    lastname: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    event_type: lead.eventType,
    event_date: lead.eventDate,
    package_id: lead.packageId,
    message: lead.message,
    source: lead.source,
    lead_id: lead.id
  })
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([name, value]) => ({ name, value }));

  const context = {
    pageUri: lead.pageUri || lead.meta?.pageUri || undefined,
    pageName: lead.pageName || lead.meta?.pageName || undefined,
    hutk: lead.meta?.hubspotUserToken || undefined,
    ipAddress: lead.meta?.ipAddress || undefined
  };

  return {
    fields,
    context,
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: 'Mister DJ verwerkt deze gegevens om contact op te nemen en een offerte op te stellen.',
        communications: [
          {
            value: true,
            subscriptionTypeId: 999,
            text: 'Ik ga akkoord met opvolging door Mister DJ.'
          }
        ]
      }
    }
  };
}

async function submitLead(lead, meta = {}) {
  const entry = createQueueEntry(mapLeadToPayload(lead), { ...meta, leadId: lead.id });

  if (!isConfigured()) {
    entry.lastError = 'not-configured';
    return queueEntry(entry, 'not-configured');
  }

  try {
    await deliver(entry);
    return { delivered: true, queued: false, queueSize: queue.length };
  } catch (error) {
    entry.lastError = error.message;
    return queueEntry(entry, 'delivery-failed');
  }
}

function getStatus() {
  const nextInQueue = queue[0]
    ? {
        id: queue[0].id,
        attempts: queue[0].attempts,
        nextAttemptAt: new Date(queue[0].nextAttemptAt).toISOString(),
        lastError: queue[0].lastError,
        lastResponseStatus: queue[0].lastResponseStatus
      }
    : null;

  return {
    configured: isConfigured(),
    queueSize: queue.length,
    deadLetterCount: deadLetterQueue.length,
    lastDeadLetter: deadLetterQueue.at(-1) || null,
    nextInQueue
  };
}

function reset() {
  stopWorker();
  queue.splice(0, queue.length);
  deadLetterQueue.splice(0, deadLetterQueue.length);
}

ensureWorker();

module.exports = {
  submitLead,
  flushQueue,
  processQueue,
  getStatus,
  reset,
  __testing: {
    queue,
    deadLetterQueue,
    stopWorker,
    ensureWorker
  }
};
