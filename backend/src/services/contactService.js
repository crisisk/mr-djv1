const { randomUUID } = require('crypto');
const db = require('../lib/db');
const config = require('../config');
const { logger } = require('../lib/logger');
const rentGuyService = require('./rentGuyService');
const sevensaService = require('./sevensaService');

/**
 * @typedef {Object} ContactPayload
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string|null} [message]
 * @property {string|null} [eventType]
 * @property {string|Date|null} [eventDate]
 * @property {string|null} [packageId]
 */

/**
 * @typedef {Object} ContactRecord
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {string|null} eventType
 * @property {Date|null} eventDate
 * @property {string|null} packageId
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string|null} message
 */

/**
 * @typedef {Object} RentGuySyncResult
 * @property {boolean} delivered
 * @property {boolean} queued
 * @property {number} [queueSize]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} SevensaSyncResult
 * @property {boolean} delivered
 * @property {boolean} queued
 * @property {number} [queueSize]
 * @property {string} [reason]
 * @property {string} [lastError]
 */

/**
 * @typedef {Object} SaveContactResult
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {string|null} eventType
 * @property {Date|null} eventDate
 * @property {string|null} packageId
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string|null} message
 * @property {RentGuySyncResult} rentGuySync
 * @property {SevensaSyncResult} sevensaSync
 */

const inMemoryContacts = new Map();
const queueMetrics = {
  totalEnqueued: 0,
  totalFlushed: 0,
  lastEnqueuedAt: null,
  lastFlushAttemptAt: null,
  lastFlushSuccessAt: null,
  lastFlushError: null,
  lastFlushCount: 0,
  consecutiveFailures: 0,
  lastFlushDurationMs: null
};
let flushInProgress = false;
const HCAPTCHA_DEFAULT_VERIFY_URL = 'https://hcaptcha.com/siteverify';

function getCaptchaSettings() {
  return config.integrations?.hcaptcha || {};
}

function createCaptchaError(message, publicMessage, status = 400, details) {
  const error = new Error(message);
  error.status = status;
  error.publicMessage = publicMessage;
  if (details) {
    error.details = details;
  }
  return error;
}

async function verifyCaptchaToken(token, remoteIp) {
  const settings = getCaptchaSettings();
  if (!settings.enabled) {
    return { skipped: true };
  }

  const trimmedToken = typeof token === 'string' ? token.trim() : '';
  if (!trimmedToken) {
    throw createCaptchaError('Missing hCaptcha token', 'Captcha validatie is vereist.');
  }

  if (!settings.secretKey) {
    console.warn('[contactService] hCaptcha ingeschakeld maar secret ontbreekt. Verificatie overgeslagen.');
    return { skipped: true, reason: 'missing-secret' };
  }

  const verifyUrl = settings.verifyUrl || HCAPTCHA_DEFAULT_VERIFY_URL;
  const params = new URLSearchParams();
  params.set('secret', settings.secretKey);
  params.set('response', trimmedToken);
  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  let response;
  try {
    response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
  } catch (error) {
    console.error('[contactService] hCaptcha verificatie mislukt (netwerk):', error.message);
    throw createCaptchaError(
      `hCaptcha verification request failed: ${error.message}`,
      'Captcha validatie is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
      503
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('[contactService] hCaptcha verificatie antwoord ongeldig:', response.status, body);
    throw createCaptchaError(
      `hCaptcha verification failed with status ${response.status}`,
      'Captcha validatie is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
      503
    );
  }

  let verification;
  try {
    verification = await response.json();
  } catch (error) {
    console.error('[contactService] hCaptcha gaf een ongeldig JSON antwoord:', error.message);
    throw createCaptchaError(
      'Invalid hCaptcha verification payload',
      'Captcha validatie is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
      503
    );
  }

  if (!verification.success) {
    const errorCodes = verification['error-codes'] || [];
    console.warn('[contactService] hCaptcha token niet geverifieerd:', errorCodes);
    throw createCaptchaError(
      `hCaptcha verification failed: ${errorCodes.join(', ') || 'unknown-error'}`,
      'Captcha validatie is mislukt. Probeer het opnieuw.',
      400,
      { errorCodes }
    );
  }

  return { skipped: false, verification };
}

/**
 * Normalizes incoming event dates into valid Date objects when possible.
 *
 * @param {string|Date|null|undefined} value
 * @returns {Date|null}
 */
function normalizeEventDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function saveContact(payload, options = {}) {
  await verifyCaptchaToken(options.captchaToken, options.remoteIp);

  const timestamp = new Date();
  const eventDate = normalizeEventDate(payload.eventDate);
  let result;

  if (db.isConfigured()) {
    try {
      const queryResult = await db.runQuery(
        `INSERT INTO contacts (name, email, phone, message, event_type, event_date, package_id, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', $8)
         RETURNING id, status, created_at AS "createdAt", event_type AS "eventType", event_date AS "eventDate", package_id AS "packageId"`,
        [
          payload.name,
          payload.email,
          payload.phone,
          payload.message,
          payload.eventType || null,
          eventDate,
          payload.packageId || null,
          timestamp
        ]
      );

      const row = queryResult.rows[0];
      result = {
        id: row.id,
        status: row.status,
        createdAt: row.createdAt,
        eventType: row.eventType || payload.eventType || null,
        eventDate: row.eventDate || eventDate,
        packageId: row.packageId || payload.packageId || null,
        persisted: true,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message || null
      };
    } catch (error) {
      logger.error(
        {
          event: 'contact.database.insert-error',
          err: error
        },
        'Database insert failed for contact submission'
      );
    }
  }

  if (!result) {
    const id = randomUUID();
    const record = {
      id,
      status: 'pending',
      createdAt: timestamp,
      queuedAt: timestamp,
      queueReason: db.isConfigured() ? 'insert-failed' : 'database-not-configured',
      persisted: false,
      eventType: payload.eventType || null,
      eventDate,
      packageId: payload.packageId || null,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message || null
    };

    inMemoryContacts.set(id, {
      ...payload,
      ...record
    });

    queueMetrics.totalEnqueued += 1;
    queueMetrics.lastEnqueuedAt = timestamp;
    logger.warn(
      {
        event: 'contact.queue.enqueue',
        contactId: id,
        queueSize: inMemoryContacts.size,
        reason: record.queueReason
      },
      'Database unavailable, contact stored in in-memory queue'
    );

    result = {
      ...record,
      queued: true,
      storageStrategy: 'in-memory'
    };
  }

  const rentGuySync = await rentGuyService.syncLead(
    {
      id: result.id,
      status: result.status,
      eventType: result.eventType,
      eventDate: result.eventDate,
      packageId: result.packageId,
      name: result.name,
      email: result.email,
      phone: result.phone,
      message: result.message,
      persisted: result.persisted
    },
    {
      source: 'contact-form'
    }
  );

  const [firstName, ...lastNameParts] = (payload.name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const lastName = lastNameParts.length ? lastNameParts.join(' ') : undefined;
  const eventDateIso = (() => {
    if (!result.eventDate) {
      return null;
    }

    const date = result.eventDate instanceof Date ? result.eventDate : new Date(result.eventDate);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  })();

  const sevensaSync = await sevensaService.submitLead(
    {
      id: result.id,
      firstName: firstName || undefined,
      lastName,
      email: result.email,
      phone: result.phone,
      eventType: result.eventType,
      eventDate: eventDateIso,
      packageId: result.packageId,
      message: result.message,
      source: 'contact-form',
      persisted: result.persisted
    },
    { source: 'contact-form' }
  );

  return {
    ...result,
    rentGuySync,
    sevensaSync,
    queued: Boolean(result.queued),
    storageStrategy: result.storageStrategy || 'postgres'
  };
}

async function persistQueuedContact(record) {
  const queryResult = await db.runQuery(
    `INSERT INTO contacts (name, email, phone, message, event_type, event_date, package_id, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', $8)
     RETURNING id, status, created_at AS "createdAt", event_type AS "eventType", event_date AS "eventDate", package_id AS "packageId"`,
    [
      record.name,
      record.email,
      record.phone,
      record.message,
      record.eventType || null,
      record.eventDate,
      record.packageId || null,
      record.createdAt
    ]
  );

  return queryResult?.rows?.[0];
}

function serializeDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function flushQueuedContacts({ force = false } = {}) {
  if (flushInProgress) {
    return { flushed: 0, queueSize: inMemoryContacts.size, inProgress: true };
  }

  if (!inMemoryContacts.size) {
    return { flushed: 0, queueSize: 0 };
  }

  if (!db.isConfigured()) {
    queueMetrics.lastFlushAttemptAt = new Date();
    queueMetrics.lastFlushError = 'database-not-configured';
    logger.debug(
      {
        event: 'contact.queue.flush-skipped',
        reason: 'database-not-configured',
        queueSize: inMemoryContacts.size
      },
      'Skipping contact queue flush; database not configured'
    );
    return { flushed: 0, queueSize: inMemoryContacts.size, skipped: true, reason: 'database-not-configured' };
  }

  const status = typeof db.getStatus === 'function' ? db.getStatus() : { connected: true };
  if (!status.connected && !force) {
    queueMetrics.lastFlushAttemptAt = new Date();
    queueMetrics.lastFlushError = status.lastError || 'database-offline';
    logger.debug(
      {
        event: 'contact.queue.flush-skipped',
        reason: queueMetrics.lastFlushError,
        queueSize: inMemoryContacts.size
      },
      'Skipping contact queue flush; database offline'
    );
    return {
      flushed: 0,
      queueSize: inMemoryContacts.size,
      skipped: true,
      reason: queueMetrics.lastFlushError
    };
  }

  const startedAt = Date.now();
  let flushed = 0;
  flushInProgress = true;
  queueMetrics.lastFlushAttemptAt = new Date();

  try {
    const entries = Array.from(inMemoryContacts.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (const entry of entries) {
      try {
        await persistQueuedContact(entry);
        inMemoryContacts.delete(entry.id);
        flushed += 1;
      } catch (error) {
        queueMetrics.lastFlushError = error.message;
        queueMetrics.consecutiveFailures += 1;
        logger.error(
          {
            event: 'contact.queue.flush-error',
            contactId: entry.id,
            queueSize: inMemoryContacts.size,
            err: error
          },
          'Failed to persist queued contact'
        );
        return {
          flushed,
          queueSize: inMemoryContacts.size,
          error: error.message
        };
      }
    }

    queueMetrics.totalFlushed += flushed;
    queueMetrics.lastFlushSuccessAt = new Date();
    queueMetrics.lastFlushError = null;
    queueMetrics.consecutiveFailures = 0;
    queueMetrics.lastFlushCount = flushed;
    queueMetrics.lastFlushDurationMs = Date.now() - startedAt;

    if (flushed > 0) {
      logger.info(
        {
          event: 'contact.queue.flush-complete',
          flushed,
          queueSize: inMemoryContacts.size,
          durationMs: queueMetrics.lastFlushDurationMs
        },
        'Persisted queued contacts to the database'
      );
    }

    return { flushed, queueSize: inMemoryContacts.size };
  } finally {
    flushInProgress = false;
  }
}

function getFallbackQueueSnapshot(limit = 50) {
  const items = Array.from(inMemoryContacts.values())
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, limit)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      eventType: entry.eventType,
      packageId: entry.packageId,
      queuedAt: serializeDate(entry.queuedAt || entry.createdAt),
      queueReason: entry.queueReason || null
    }));

  return {
    queueSize: inMemoryContacts.size,
    items,
    metrics: {
      ...queueMetrics,
      lastEnqueuedAt: serializeDate(queueMetrics.lastEnqueuedAt),
      lastFlushAttemptAt: serializeDate(queueMetrics.lastFlushAttemptAt),
      lastFlushSuccessAt: serializeDate(queueMetrics.lastFlushSuccessAt)
    }
  };
}

function getQueueMetrics() {
  return {
    ...queueMetrics,
    lastEnqueuedAt: serializeDate(queueMetrics.lastEnqueuedAt),
    lastFlushAttemptAt: serializeDate(queueMetrics.lastFlushAttemptAt),
    lastFlushSuccessAt: serializeDate(queueMetrics.lastFlushSuccessAt)
  };
}

/**
 * Summarizes the contact service health and storage strategy.
 *
 * @returns {{
 *   databaseConnected: boolean,
 *   storageStrategy: 'postgres'|'in-memory',
 *   fallbackQueueSize: number,
 *   lastError: string|null
 * }}
 */
function getContactServiceStatus() {
  const status = db.getStatus();
  return {
    databaseConnected: status.connected,
    storageStrategy: status.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryContacts.size,
    lastError: status.lastError,
    queueMetrics: getQueueMetrics()
  };
}

function ping() {
  const status = getContactServiceStatus();
  return {
    ok: true,
    databaseConnected: status.databaseConnected,
    storageStrategy: status.storageStrategy,
    fallbackQueueSize: status.fallbackQueueSize
  };
}

function resetInMemoryStore() {
  inMemoryContacts.clear();
  queueMetrics.totalEnqueued = 0;
  queueMetrics.totalFlushed = 0;
  queueMetrics.lastEnqueuedAt = null;
  queueMetrics.lastFlushAttemptAt = null;
  queueMetrics.lastFlushSuccessAt = null;
  queueMetrics.lastFlushError = null;
  queueMetrics.lastFlushCount = 0;
  queueMetrics.consecutiveFailures = 0;
  queueMetrics.lastFlushDurationMs = null;
  flushInProgress = false;
}

module.exports = {
  saveContact,
  getContactServiceStatus,
  resetInMemoryStore,
  ping,
  flushQueuedContacts,
  getFallbackQueueSnapshot,
  getQueueMetrics
};
