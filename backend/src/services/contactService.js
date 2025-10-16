const { randomUUID } = require('crypto');
const db = require('../lib/db');

const inMemoryContacts = new Map();

function normalizeEventDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function saveContact(payload) {
  const timestamp = new Date();
  const eventDate = normalizeEventDate(payload.eventDate);

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
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

      const row = result.rows[0];
      return {
        id: row.id,
        status: row.status,
        createdAt: row.createdAt,
        eventType: row.eventType || payload.eventType || null,
        eventDate: row.eventDate || eventDate,
        packageId: row.packageId || payload.packageId || null,
        persisted: true
      };
    } catch (error) {
      console.error('[contactService] Database insert failed:', error.message);
    }
  }

  const id = randomUUID();
  const record = {
    id,
    status: 'pending',
    createdAt: timestamp,
    persisted: false,
    eventType: payload.eventType || null,
    eventDate,
    packageId: payload.packageId || null
  };

  inMemoryContacts.set(id, {
    ...payload,
    ...record
  });

  return record;
}

function getContactServiceStatus() {
  const status = db.getStatus();
  return {
    databaseConnected: status.connected,
    storageStrategy: status.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryContacts.size,
    lastError: status.lastError
  };
}

function resetInMemoryStore() {
  inMemoryContacts.clear();
}

module.exports = {
  saveContact,
  getContactServiceStatus,
  resetInMemoryStore
};
