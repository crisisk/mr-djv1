const { Pool } = require('pg');
const { randomUUID } = require('crypto');
const config = require('../config');

let pool;
let databaseConnected = false;
let connectionErrorLogged = false;

if (config.databaseUrl) {
  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
  });

  pool
    .connect()
    .then((client) => {
      databaseConnected = true;
      client.release();
    })
    .catch((error) => {
      databaseConnected = false;
      if (!connectionErrorLogged) {
        console.warn('[contactService] Failed to establish initial database connection:', error.message);
        connectionErrorLogged = true;
      }
    });
}

const inMemoryContacts = new Map();

async function saveContact(payload) {
  const timestamp = new Date();

  if (pool) {
    try {
      const result = await pool.query(
        `INSERT INTO contacts (name, email, phone, message, status, created_at)
         VALUES ($1, $2, $3, $4, 'new', $5)
         RETURNING id, status, created_at`,
        [payload.name, payload.email, payload.phone, payload.message, timestamp]
      );

      const row = result.rows[0];
      databaseConnected = true;
      connectionErrorLogged = false;
      return {
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
        persisted: true
      };
    } catch (error) {
      console.error('[contactService] Database insert failed:', error.message);
      databaseConnected = false;
      connectionErrorLogged = true;
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
  return {
    databaseConnected,
    storageStrategy: databaseConnected ? 'postgres' : 'in-memory'
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
