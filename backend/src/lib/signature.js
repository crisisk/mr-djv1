const crypto = require('crypto');

const DEFAULT_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

class SignatureVerificationError extends Error {
  constructor(message, code = 'invalid_signature', statusCode = 401) {
    super(message);
    this.name = 'SignatureVerificationError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function toBuffer(payload) {
  if (Buffer.isBuffer(payload)) {
    return payload;
  }

  if (typeof payload === 'string') {
    return Buffer.from(payload, 'utf8');
  }

  if (payload === null || payload === undefined) {
    return Buffer.alloc(0);
  }

  if (typeof payload === 'object') {
    return Buffer.from(JSON.stringify(payload), 'utf8');
  }

  return Buffer.from(String(payload), 'utf8');
}

function parseSignatureHeader(header) {
  if (!header || typeof header !== 'string') {
    throw new SignatureVerificationError('Missing signature header', 'missing_signature');
  }

  const parts = header.split(',').map((part) => part.trim()).filter(Boolean);
  const parsed = {};

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!key || !value) {
      continue;
    }

    parsed[key] = value;
  }

  if (!parsed.t) {
    throw new SignatureVerificationError('Missing signature timestamp', 'missing_timestamp');
  }

  if (!parsed.v1) {
    throw new SignatureVerificationError('Missing signature digest', 'missing_digest');
  }

  return parsed;
}

function computeDigest({ secret, payload, timestamp }) {
  const payloadBuffer = toBuffer(payload);
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${payloadBuffer.toString('utf8')}`).digest('hex');
}

function timingSafeEqual(expected, actual) {
  try {
    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(actual, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (_error) {
    return false;
  }
}

function assertValidSignature({
  header,
  payload,
  secrets,
  toleranceMs = DEFAULT_TOLERANCE_MS,
  now = Date.now()
}) {
  if (!Array.isArray(secrets) || secrets.length === 0) {
    throw new SignatureVerificationError('No webhook secrets configured', 'missing_secret', 503);
  }

  const { t: timestamp, v1: digest } = parseSignatureHeader(header);
  const timestampMs = Number(timestamp) * 1000;

  if (!Number.isFinite(timestampMs)) {
    throw new SignatureVerificationError('Invalid signature timestamp', 'invalid_timestamp');
  }

  if (toleranceMs && Math.abs(now - timestampMs) > toleranceMs) {
    throw new SignatureVerificationError('Signature timestamp outside tolerance', 'timestamp_out_of_range');
  }

  const payloadBuffer = toBuffer(payload);
  const payloadString = payloadBuffer.toString('utf8');

  for (const secret of secrets) {
    if (!secret) {
      continue;
    }

    const expectedDigest = computeDigest({ secret, payload: payloadString, timestamp });

    if (timingSafeEqual(expectedDigest, digest)) {
      return { valid: true, secret };
    }
  }

  throw new SignatureVerificationError('Signature verification failed', 'signature_mismatch');
}

function createSignatureHeader({ secret, payload, timestamp = Math.floor(Date.now() / 1000) }) {
  const payloadBuffer = toBuffer(payload);
  const digest = computeDigest({ secret, payload: payloadBuffer.toString('utf8'), timestamp });
  return `t=${timestamp},v1=${digest}`;
}

module.exports = {
  SignatureVerificationError,
  assertValidSignature,
  createSignatureHeader
};
