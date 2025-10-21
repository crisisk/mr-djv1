const crypto = require('crypto');
const config = require('../config');
const { logger } = require('../lib/logger');

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_BOOKING_TEMPLATE = process.env.WHATSAPP_BOOKING_TEMPLATE || 'mr_dj_booking_confirmation';
const DEFAULT_LANGUAGE_CODE = process.env.WHATSAPP_DEFAULT_LANGUAGE || 'en_US';

class WhatsappServiceError extends Error {
  constructor(message, { code = 'whatsapp_error', statusCode = 500 } = {}) {
    super(message);
    this.name = 'WhatsappServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class WhatsappNotConfiguredError extends WhatsappServiceError {
  constructor() {
    super('WhatsApp integration is not configured', {
      code: 'whatsapp_not_configured',
      statusCode: 503
    });
  }
}

function ensureConfigured() {
  if (!config.integrations?.whatsapp?.enabled) {
    throw new WhatsappNotConfiguredError();
  }
}

function getBaseUrl() {
  const raw = config.integrations?.whatsapp?.baseUrl || 'https://graph.facebook.com/v19.0/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function getTimeoutMs() {
  const configured = config.integrations?.whatsapp?.requestTimeoutMs;
  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_TIMEOUT_MS;
}

function createAppSecretProof(accessToken, appSecret) {
  if (!accessToken || !appSecret) {
    return null;
  }

  return crypto.createHmac('sha256', appSecret).update(accessToken).digest('hex');
}

function normalisePhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    return '';
  }

  const digits = phoneNumber.replace(/[^0-9+]/g, '');
  if (!digits.startsWith('+') && digits.length) {
    return `+${digits}`;
  }

  return digits;
}

async function deliver(payload) {
  ensureConfigured();

  const accessToken = config.integrations.whatsapp.accessToken;
  const phoneNumberId = config.integrations.whatsapp.phoneNumberId;
  const appSecret = config.integrations.whatsapp.appSecret;
  const url = new URL(`${phoneNumberId}/messages`, getBaseUrl());
  const appSecretProof = createAppSecretProof(accessToken, appSecret);
  if (appSecretProof) {
    url.searchParams.set('appsecret_proof', appSecretProof);
  }

  const controller = new AbortController();
  const timeoutMs = getTimeoutMs();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.error(
        {
          status: response.status,
          payloadType: payload?.type,
          body: text ? text.slice(0, 500) : undefined
        },
        'WhatsApp API responded with non-success status'
      );
      throw new WhatsappServiceError(
        `WhatsApp API responded with ${response.status}${text ? `: ${text}` : ''}`,
        { code: 'whatsapp_api_error', statusCode: response.status }
      );
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      logger.warn({ timeoutMs }, 'WhatsApp API request timed out');
      throw new WhatsappServiceError('WhatsApp API request timed out', {
        code: 'whatsapp_timeout',
        statusCode: 504
      });
    }

    if (error instanceof WhatsappServiceError) {
      throw error;
    }

    logger.error({ err: error }, 'WhatsApp API request failed');
    throw new WhatsappServiceError(error.message || 'WhatsApp API request failed');
  } finally {
    clearTimeout(timeout);
  }
}

async function sendTemplateMessage({ phoneNumber, templateName, languageCode, components }) {
  const to = normalisePhoneNumber(phoneNumber);
  if (!to) {
    throw new WhatsappServiceError('Invalid phone number provided', {
      code: 'invalid_phone_number',
      statusCode: 400
    });
  }

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName || DEFAULT_BOOKING_TEMPLATE,
      language: {
        code: languageCode || DEFAULT_LANGUAGE_CODE
      },
      components: components?.length ? components : undefined
    }
  };

  return deliver(payload);
}

async function sendTextMessage({ phoneNumber, message }) {
  const to = normalisePhoneNumber(phoneNumber);
  if (!to) {
    throw new WhatsappServiceError('Invalid phone number provided', {
      code: 'invalid_phone_number',
      statusCode: 400
    });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new WhatsappServiceError('Message body is required', {
      code: 'invalid_message',
      statusCode: 400
    });
  }

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: message.trim()
    }
  };

  return deliver(payload);
}

async function sendBookingConfirmation({ phoneNumber, bookingDetails }) {
  if (!bookingDetails || typeof bookingDetails !== 'object') {
    throw new WhatsappServiceError('Booking details are required', {
      code: 'invalid_booking_details',
      statusCode: 400
    });
  }

  const { eventDate, location } = bookingDetails;
  const parameters = [];

  if (eventDate) {
    parameters.push({ type: 'text', text: String(eventDate) });
  }

  if (location) {
    parameters.push({ type: 'text', text: String(location) });
  }

  const components = parameters.length
    ? [
        {
          type: 'body',
          parameters
        }
      ]
    : undefined;

  return sendTemplateMessage({
    phoneNumber,
    templateName: DEFAULT_BOOKING_TEMPLATE,
    languageCode: DEFAULT_LANGUAGE_CODE,
    components
  });
}

module.exports = {
  sendTemplateMessage,
  sendTextMessage,
  sendBookingConfirmation,
  WhatsappServiceError,
  WhatsappNotConfiguredError,
  createAppSecretProof,
  normalisePhoneNumber
};
