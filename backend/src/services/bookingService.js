const { randomUUID } = require('crypto');
const db = require('../lib/db');
const rentGuyService = require('./rentGuyService');

/**
 * @typedef {Object} BookingPayload
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} eventType
 * @property {string|Date|null} [eventDate]
 * @property {string|null} [packageId]
 * @property {string|null} [message]
 */

/**
 * @typedef {Object} RentGuySyncResult
 * @property {boolean} delivered
 * @property {boolean} queued
 * @property {number} [queueSize]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} BookingRecord
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} eventType
 * @property {Date|null} eventDate
 * @property {string|null} packageId
 * @property {string|null} message
 */

/**
 * @typedef {Object} CreateBookingResult
 * @property {string} id
 * @property {string} status
 * @property {Date} createdAt
 * @property {boolean} persisted
 * @property {RentGuySyncResult} rentGuySync
 */

const inMemoryBookings = new Map();

const DEFAULT_TIMEZONE = 'Europe/Amsterdam';

function zonedDateTimeToUtc({ year, month, day, hour = 0, minute = 0, second = 0 }, timeZone) {
  const baseline = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const parts = formatter.formatToParts(baseline).filter((part) => part.type !== 'literal');
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const zonedUtc = Date.UTC(
    Number(partMap.year),
    Number(partMap.month) - 1,
    Number(partMap.day),
    Number(partMap.hour),
    Number(partMap.minute),
    Number(partMap.second)
  );
  const offset = zonedUtc - baseline.getTime();
  return new Date(baseline.getTime() - offset);
}

function parseZonedDate(value, timeZone = DEFAULT_TIMEZONE) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (typeof value === 'number') {
    return new Date(value);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const isoTimezoneMatch = /([zZ]|[+\-]\d{2}:?\d{2})$/.test(trimmed);
  if (isoTimezoneMatch) {
    const direct = new Date(trimmed);
    return Number.isNaN(direct.getTime()) ? null : direct;
  }

  const partsMatch = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!partsMatch) {
    const fallback = new Date(trimmed);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, year, month, day, hour = '00', minute = '00', second = '00'] = partsMatch;
  return zonedDateTimeToUtc(
    {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute),
      second: Number(second)
    },
    timeZone
  );
}

function normalizeEventDate(input, defaultTimeZone = DEFAULT_TIMEZONE) {
  if (!input) {
    return { start: null, end: null, timeZone: defaultTimeZone };
  }

  if (typeof input === 'string' || input instanceof Date || typeof input === 'number') {
    return {
      start: parseZonedDate(input, defaultTimeZone),
      end: null,
      timeZone: defaultTimeZone
    };
  }

  if (typeof input === 'object') {
    const timeZone = input.timezone || input.timeZone || defaultTimeZone;
    const startSource = input.start ?? input.date ?? input.from ?? null;
    const endSource = input.end ?? input.until ?? input.to ?? null;
    return {
      start: parseZonedDate(startSource, timeZone),
      end: parseZonedDate(endSource, timeZone),
      timeZone
    };
  }

  return { start: null, end: null, timeZone: defaultTimeZone };
}

async function createBooking(payload) {
  const timestamp = new Date();
  let result;

  const normalizedEventDate = normalizeEventDate(payload.eventDate);
  const eventDateForStorage = normalizedEventDate.start;

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
          eventDateForStorage,
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
        eventDate: eventDateForStorage,
        eventEndDate: normalizedEventDate.end,
        eventTimeZone: normalizedEventDate.timeZone,
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
      eventDate: eventDateForStorage,
      eventEndDate: normalizedEventDate.end,
      eventTimeZone: normalizedEventDate.timeZone,
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
      eventEndDate: result.eventEndDate,
      eventTimeZone: result.eventTimeZone,
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
    eventDate: result.eventDate,
    eventEndDate: result.eventEndDate,
    eventTimeZone: result.eventTimeZone,
    rentGuySync
  };
}

/**
 * Fetches the most recent bookings, falling back to the in-memory store.
 *
 * @param {number} [limit=10]
 * @returns {Promise<{persisted: boolean, bookings: Array<BookingRecord>}>}
 */
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

/**
 * Clears the in-memory booking cache (used in tests).
 *
 * @returns {void}
 */
function resetInMemoryStore() {
  inMemoryBookings.clear();
}

/**
 * Provides diagnostics about the current booking persistence strategy.
 *
 * @returns {{
 *   databaseConnected: boolean,
 *   storageStrategy: 'postgres'|'in-memory',
 *   fallbackQueueSize: number,
 *   lastError: string|null
 * }}
 */
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
  updateBooking,
  deleteBooking,
  resetInMemoryStore,
  getBookingServiceStatus,
  ping
};
