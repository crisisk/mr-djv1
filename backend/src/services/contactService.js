const { randomUUID } = require('crypto');
const db = require('../lib/db');

const inMemoryContacts = new Map();

async function saveContact(payload) {
  const timestamp = new Date();

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `INSERT INTO contacts (name, email, phone, message, status, created_at)
         VALUES ($1, $2, $3, $4, 'new', $5)
         RETURNING id, status, created_at`,
        [payload.name, payload.email, payload.phone, payload.message, timestamp]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
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
    persisted: false
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
