const { randomUUID } = require('crypto');
const db = require('../lib/db');
const config = require('../config');
const rentGuyService = require('./rentGuyService');
const sevensaService = require('./sevensaService');
const surveyService = require('./surveyService');

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
      console.error('[contactService] Database insert failed:', error.message);
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

    result = record;
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

  let surveyAutomation = {
    survey: null,
    automation: { delivered: false, reason: 'not-requested' }
  };

  try {
    surveyAutomation = await surveyService.queueSurveyInvite(
      {
        id: result.id,
        email: result.email,
        name: result.name,
        eventType: result.eventType,
        eventDate: result.eventDate,
        packageId: result.packageId,
        source: 'contact-service'
      },
      {
        rentGuy: rentGuySync,
        sevensa: sevensaSync
      }
    );
  } catch (error) {
    console.error('[contactService] Failed to enqueue survey invite:', error.message);
    surveyAutomation = {
      survey: null,
      automation: { delivered: false, reason: error.message }
    };
  }

  return {
    ...result,
    rentGuySync,
    sevensaSync,
    surveyAutomation
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
    lastError: status.lastError
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
}

module.exports = {
  saveContact,
  getContactServiceStatus,
  resetInMemoryStore,
  ping
};
