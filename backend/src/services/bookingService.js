const { randomUUID } = require('crypto');
const db = require('../lib/db');
const rentGuyService = require('./rentGuyService');

const inMemoryBookings = new Map();

async function createBooking(payload) {
  const timestamp = new Date();
  let result;

  if (db.isConfigured()) {
    try {
      const queryResult = await db.runQuery(
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

      const row = queryResult.rows[0];
      result = {
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
        persisted: true,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        eventType: payload.eventType,
        eventDate: payload.eventDate ? new Date(payload.eventDate) : null,
        packageId: payload.packageId || null,
        message: payload.message || null
      };
    } catch (error) {
      console.error('[bookingService] Database insert failed:', error.message);
    }
  }

  if (!result) {
    const id = randomUUID();
    const record = {
      id,
      status: 'pending',
      createdAt: timestamp,
      persisted: false,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      eventType: payload.eventType,
      eventDate: payload.eventDate ? new Date(payload.eventDate) : null,
      packageId: payload.packageId || null,
      message: payload.message || null
    };

    inMemoryBookings.set(id, record);
    result = record;
  }

  const rentGuySync = await rentGuyService.syncBooking(
    {
      id: result.id,
      status: result.status,
      createdAt: result.createdAt,
      persisted: result.persisted,
      name: result.name,
      email: result.email,
      phone: result.phone,
      eventType: result.eventType,
      eventDate: result.eventDate,
      packageId: result.packageId,
      message: result.message
    },
    {
      source: 'booking-flow'
    }
  );

  return {
    id: result.id,
    status: result.status,
    createdAt: result.createdAt,
    persisted: result.persisted,
    rentGuySync
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

function ping() {
  const status = getBookingServiceStatus();
  return {
    ok: true,
    databaseConnected: status.databaseConnected,
    storageStrategy: status.storageStrategy,
    fallbackQueueSize: status.fallbackQueueSize
  };
}

module.exports = {
  createBooking,
  getRecentBookings,
  resetInMemoryStore,
  getBookingServiceStatus,
  ping
};
