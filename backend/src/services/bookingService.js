const { randomUUID } = require('crypto');
const db = require('../lib/db');

const inMemoryBookings = new Map();

async function createBooking(payload) {
  const timestamp = new Date();

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `INSERT INTO bookings (name, email, phone, event_type, event_date, message, package_id, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $8)
         RETURNING id, status, created_at`,
        [
          payload.name,
          payload.email,
          payload.phone,
          payload.eventType,
          payload.eventDate ? new Date(payload.eventDate) : null,
          payload.message,
          payload.packageId || null,
          timestamp
        ]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
        persisted: true
      };
    } catch (error) {
      console.error('[bookingService] Database insert failed:', error.message);
    }
  }

  const id = randomUUID();
  const record = {
    id,
    status: 'pending',
    createdAt: timestamp,
    persisted: false,
    ...payload
  };

  inMemoryBookings.set(id, record);

  return {
    id,
    status: record.status,
    createdAt: record.createdAt,
    persisted: false
  };
}

async function getRecentBookings(limit = 10) {
  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, email, phone, event_type AS "eventType", event_date AS "eventDate", package_id AS "packageId", status, created_at AS "createdAt"
         FROM bookings
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      if (result) {
        return {
          persisted: true,
          bookings: result.rows
        };
      }
    } catch (error) {
      console.error('[bookingService] Failed to fetch bookings from database:', error.message);
    }
  }

  const bookings = Array.from(inMemoryBookings.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map(({ id, status, createdAt, name, email, phone, eventType, eventDate, packageId }) => ({
      id,
      status,
      createdAt,
      name,
      email,
      phone,
      eventType,
      eventDate,
      packageId
    }));

  return {
    persisted: false,
    bookings
  };
}

function resetInMemoryStore() {
  inMemoryBookings.clear();
}

function getBookingServiceStatus() {
  const dbStatus = db.getStatus();

  return {
    databaseConnected: dbStatus.connected,
    storageStrategy: dbStatus.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryBookings.size,
    lastError: dbStatus.lastError
  };
}

module.exports = {
  createBooking,
  getRecentBookings,
  resetInMemoryStore,
  getBookingServiceStatus
};
