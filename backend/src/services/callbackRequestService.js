const { randomUUID } = require('crypto');
const db = require('../lib/db');
const rentGuyService = require('./rentGuyService');
const sevensaService = require('./sevensaService');

const inMemoryCallbackRequests = new Map();

function normalizeString(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function normalizeEventType(value) {
  const normalized = normalizeString(value);
  return normalized || null;
}

async function persistCallbackRequest(payload, timestamp) {
  if (!db.isConfigured()) {
    return null;
  }

  try {
    const result = await db.runQuery(
      `INSERT INTO callback_requests (name, phone, event_type, status, created_at)
       VALUES ($1, $2, $3, 'new', $4)
       RETURNING id, status, created_at AS "createdAt", event_type AS "eventType"`,
      [payload.name, payload.phone, payload.eventType, timestamp]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      eventType: row.eventType || payload.eventType,
      persisted: true,
      name: payload.name,
      phone: payload.phone
    };
  } catch (error) {
    console.error('[callbackRequestService] Database insert failed:', error.message);
    return null;
  }
}

async function saveCallbackRequest(input) {
  const timestamp = new Date();
  const name = normalizeString(input.name);
  const phone = normalizeString(input.phone);
  const eventType = normalizeEventType(input.eventType);

  const payload = {
    name,
    phone,
    eventType
  };

  let record = await persistCallbackRequest(payload, timestamp);

  if (!record) {
    const id = randomUUID();
    record = {
      id,
      status: 'pending',
      createdAt: timestamp,
      persisted: false,
      eventType,
      name,
      phone
    };

    inMemoryCallbackRequests.set(id, record);
  }

  const rentGuySync = await rentGuyService.syncLead(
    {
      id: record.id,
      status: record.status,
      eventType: record.eventType,
      eventDate: null,
      packageId: null,
      name: record.name,
      email: null,
      phone: record.phone,
      message: null,
      persisted: record.persisted
    },
    { source: 'callback-request' }
  );

  const [firstName, ...rest] = record.name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const lastName = rest.length ? rest.join(' ') : undefined;

  const sevensaSync = await sevensaService.submitLead(
    {
      id: record.id,
      firstName: firstName || undefined,
      lastName,
      phone: record.phone,
      eventType: record.eventType,
      message: null,
      source: 'callback-request',
      persisted: record.persisted
    },
    { source: 'callback-request' }
  );

  return {
    ...record,
    rentGuySync,
    sevensaSync
  };
}

function getCallbackRequestServiceStatus() {
  const status = db.getStatus();
  return {
    databaseConnected: status.connected,
    storageStrategy: status.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryCallbackRequests.size,
    lastError: status.lastError
  };
}

function resetInMemoryStore() {
  inMemoryCallbackRequests.clear();
}

module.exports = {
  saveCallbackRequest,
  getCallbackRequestServiceStatus,
  resetInMemoryStore
};
