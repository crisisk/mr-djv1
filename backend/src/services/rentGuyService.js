const { randomUUID } = require('crypto');

const DEFAULT_TIMEOUT_MS = 5000;

const queue = [];
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

function createQueueEntry(resource, payload, meta = {}) {
  return {
    id: randomUUID(),
    resource,
    payload,
    meta,
    attempts: 0,
    enqueuedAt: new Date(),
    lastAttemptAt: null,
    lastError: null
  };
}

async function deliver(entry) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('RentGuy base URL is not configured');
  }

  entry.attempts += 1;
  entry.lastAttemptAt = new Date();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const response = await fetch(`${baseUrl}/${entry.resource}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(entry.payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`RentGuy responded with ${response.status}${text ? `: ${text}` : ''}`);
    }

    entry.lastError = null;
    lastSyncSuccess = {
      at: new Date(),
      resource: entry.resource,
      attempts: entry.attempts
    };

    return true;
  } catch (error) {
    entry.lastError = error.message;
    lastSyncError = {
      at: new Date(),
      resource: entry.resource,
      message: error.message,
      attempts: entry.attempts
    };
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function enqueue(entry) {
  queue.push(entry);
  return {
    delivered: false,
    queued: true,
    queueSize: queue.length,
    reason: entry.lastError ? 'delivery-failed' : 'not-configured',
    lastError: entry.lastError
  };
}

async function sendOrQueue(resource, payload, meta) {
  const entry = createQueueEntry(resource, payload, meta);

  if (!isConfigured()) {
    return enqueue(entry);
  }

  try {
    await deliver(entry);
    return {
      delivered: true,
      queued: false,
      queueSize: queue.length
    };
  } catch (_error) {
    return enqueue(entry);
  }
}

function mapBookingPayload(booking) {
  return {
    bookingId: booking.id,
    status: booking.status,
    eventType: booking.eventType,
    eventDate: normalizeDate(booking.eventDate),
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
  return sendOrQueue('bookings', mapBookingPayload(booking), meta);
}

async function syncLead(lead, meta = {}) {
  return sendOrQueue('leads', mapLeadPayload(lead), meta);
}

async function syncPersonalizationEvent(event, meta = {}) {
  return sendOrQueue('personalization-events', event, meta);
}

async function flushQueue(limit = queue.length) {
  const configured = isConfigured();

  if (!configured || queue.length === 0) {
    return {
      configured,
      attempted: 0,
      delivered: 0,
      remaining: queue.length
    };
  }

  let attempted = 0;
  let deliveredCount = 0;

  for (let index = 0; index < queue.length && attempted < limit; ) {
    const entry = queue[index];
    attempted += 1;

    try {
      await deliver(entry);
      queue.splice(index, 1);
      deliveredCount += 1;
    } catch (_error) {
      index += 1;
    }
  }

  return {
    configured: true,
    attempted,
    delivered: deliveredCount,
    remaining: queue.length
  };
}

function getStatus() {
  return {
    configured: isConfigured(),
    workspaceId: getWorkspaceId(),
    queueSize: queue.length,
    lastSyncSuccess,
    lastSyncError,
    nextInQueue: queue[0]
      ? {
          resource: queue[0].resource,
          enqueuedAt: queue[0].enqueuedAt,
          attempts: queue[0].attempts,
          lastError: queue[0].lastError
        }
      : null
  };
}

function reset() {
  queue.splice(0, queue.length);
  lastSyncSuccess = null;
  lastSyncError = null;
}

module.exports = {
  syncBooking,
  syncLead,
  syncPersonalizationEvent,
  flushQueue,
  getStatus,
  reset
};
