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
        updatedAt: row.created_at,
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
      updatedAt: timestamp,
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

async function updateBooking(id, updates = {}) {
  const timestamp = new Date();
  let record = null;

  if (db.isConfigured()) {
    try {
      const columnMap = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        eventType: 'event_type',
        eventDate: 'event_date',
        message: 'message',
        packageId: 'package_id',
        status: 'status'
      };
      const assignments = [];
      const values = [];

      Object.entries(columnMap).forEach(([key, column]) => {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
          let value = updates[key];

          if (key === 'eventDate') {
            value = value ? new Date(value) : null;
          }

          if (key === 'packageId') {
            value = value || null;
          }

          assignments.push(`${column} = $${assignments.length + 2}`);
          values.push(value);
        }
      });

      const assignmentCount = assignments.length;
      const updatedAtPlaceholder = `$${assignmentCount + 2}`;
      const setClause = assignmentCount > 0 ? `${assignments.join(', ')}, updated_at = ${updatedAtPlaceholder}` : `updated_at = ${updatedAtPlaceholder}`;
      const query = `UPDATE bookings SET ${setClause} WHERE id = $1 RETURNING id, name, email, phone, event_type AS "eventType", event_date AS "eventDate", package_id AS "packageId", status, message, created_at AS "createdAt", updated_at AS "updatedAt"`;
      const dbResult = await db.runQuery(query, [id, ...values, timestamp]);

      if (dbResult && dbResult.rows.length > 0) {
        const row = dbResult.rows[0];
        record = {
          id: row.id,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          persisted: true,
          name: row.name,
          email: row.email,
          phone: row.phone,
          eventType: row.eventType,
          eventDate: row.eventDate ? new Date(row.eventDate) : null,
          packageId: row.packageId || null,
          message: row.message || null
        };
      }
    } catch (error) {
      console.error('[bookingService] Failed to update booking in database:', error.message);
    }
  }

  const existing = inMemoryBookings.get(id);
  if (existing) {
    const nextRecord = {
      ...existing,
      updatedAt: timestamp
    };

    if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
      nextRecord.name = updates.name;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'email')) {
      nextRecord.email = updates.email;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'phone')) {
      nextRecord.phone = updates.phone;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'eventType')) {
      nextRecord.eventType = updates.eventType;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'eventDate')) {
      nextRecord.eventDate = updates.eventDate ? new Date(updates.eventDate) : null;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'packageId')) {
      nextRecord.packageId = updates.packageId || null;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'message')) {
      nextRecord.message = updates.message || null;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
      nextRecord.status = updates.status;
    }

    inMemoryBookings.set(id, nextRecord);

    if (!record) {
      record = nextRecord;
    }
  }

  if (!record) {
    return null;
  }

  const rentGuySync = await rentGuyService.syncBooking(
    {
      id: record.id,
      status: record.status,
      createdAt: record.createdAt,
      persisted: record.persisted,
      name: record.name,
      email: record.email,
      phone: record.phone,
      eventType: record.eventType,
      eventDate: record.eventDate,
      packageId: record.packageId,
      message: record.message
    },
    {
      source: 'booking-flow',
      action: 'update'
    }
  );

  return {
    id: record.id,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt || timestamp,
    persisted: record.persisted,
    rentGuySync,
    name: record.name,
    email: record.email,
    phone: record.phone,
    eventType: record.eventType,
    eventDate: record.eventDate,
    packageId: record.packageId,
    message: record.message
  };
}

async function deleteBooking(id) {
  let removed = false;

  if (db.isConfigured()) {
    try {
      const result = await db.runQuery('DELETE FROM bookings WHERE id = $1', [id]);
      if (result && result.rowCount > 0) {
        removed = true;
      }
    } catch (error) {
      console.error('[bookingService] Failed to delete booking from database:', error.message);
    }
  }

  if (inMemoryBookings.delete(id)) {
    removed = true;
  }

  return removed;
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
  updateBooking,
  deleteBooking,
  resetInMemoryStore,
  getBookingServiceStatus
};
