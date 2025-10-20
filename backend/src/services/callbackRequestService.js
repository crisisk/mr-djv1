const { randomUUID } = require('crypto');
const db = require('../lib/db');
const rentGuyService = require('./rentGuyService');
const sevensaService = require('./sevensaService');

/**
 * @typedef {Object} CallbackRequestPayload
 * @property {string} name
 * @property {string} phone
 * @property {string|null} [eventType]
 */

/**
 * @typedef {Object} CallbackRequestRecord
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {string|null} eventType
 * @property {string} name
 * @property {string} phone
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
 * @typedef {Object} SaveCallbackRequestResult
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {string|null} eventType
 * @property {string} name
 * @property {string} phone
 * @property {RentGuySyncResult} rentGuySync
 * @property {SevensaSyncResult} sevensaSync
 */

const inMemoryCallbackRequests = new Map();

/**
 * Stores a callback request, falling back to an in-memory queue and syncing with partners.
 *
 * @param {CallbackRequestPayload} payload
 * @returns {Promise<SaveCallbackRequestResult>}
 */
async function saveCallbackRequest(payload) {
  const timestamp = new Date();
  let result;

  if (db.isConfigured()) {
    try {
      const queryResult = await db.runQuery(
        `INSERT INTO callback_requests (name, phone, event_type, status, created_at)
         VALUES ($1, $2, $3, 'new', $4)
         RETURNING id, status, event_type AS "eventType", created_at AS "createdAt"`,
        [payload.name, payload.phone, payload.eventType || null, timestamp]
      );

      const row = queryResult.rows[0];
      result = {
        id: row.id,
        status: row.status,
        createdAt: row.createdAt,
        eventType: row.eventType || payload.eventType || null,
        persisted: true,
        name: payload.name,
        phone: payload.phone
      };
    } catch (error) {
      console.error('[callbackRequestService] Database insert failed:', error.message);
    }
  }

  if (!result) {
    const id = randomUUID();
    const record = {
      id,
      status: 'pending',
      createdAt: timestamp,
      persisted: false,
      eventType: payload.eventType || null,
      name: payload.name,
      phone: payload.phone
    };

    inMemoryCallbackRequests.set(id, record);
    result = record;
  }

  const rentGuySync = await rentGuyService.syncLead(
    {
      id: result.id,
      status: result.status,
      eventType: result.eventType,
      eventDate: null,
      packageId: null,
      name: result.name,
      email: null,
      phone: result.phone,
      message: 'Callback verzoek via quick form',
      persisted: result.persisted
    },
    { source: 'quick-callback-form' }
  );

  const [firstName, ...lastNameParts] = (result.name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const lastName = lastNameParts.length ? lastNameParts.join(' ') : undefined;

  const sevensaSync = await sevensaService.submitLead(
    {
      id: result.id,
      firstName: firstName || undefined,
      lastName,
      email: undefined,
      phone: result.phone,
      eventType: result.eventType,
      eventDate: null,
      message: 'Callback verzoek via quick form',
      source: 'quick-callback-form',
      persisted: result.persisted
    },
    { source: 'quick-callback-form' }
  );

  return {
    ...result,
    rentGuySync,
    sevensaSync
  };
}

/**
 * Returns the operational status for the callback request pipeline.
 *
 * @returns {{
 *   databaseConnected: boolean,
 *   storageStrategy: 'postgres'|'in-memory',
 *   fallbackQueueSize: number,
 *   lastError: string|null
 * }}
 */
function getCallbackRequestServiceStatus() {
  const status = db.getStatus();

  return {
    databaseConnected: status.connected,
    storageStrategy: status.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryCallbackRequests.size,
    lastError: status.lastError
  };
}

/**
 * Clears all pending callback requests stored in memory.
 *
 * @returns {void}
 */
function resetInMemoryStore() {
  inMemoryCallbackRequests.clear();
}

module.exports = {
  saveCallbackRequest,
  getCallbackRequestServiceStatus,
  resetInMemoryStore
};
