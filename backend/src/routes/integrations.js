const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');
const config = require('../config');
const { logger } = require('../lib/logger');
const { assertValidSignature, SignatureVerificationError } = require('../lib/signature');

const router = express.Router();

const WEBHOOK_SIGNATURE_HEADER = 'x-mrdj-signature';

function getRawPayload(req) {
  if (Buffer.isBuffer(req.rawBody)) {
    return req.rawBody;
  }

  if (req.body && Object.keys(req.body).length) {
    return Buffer.from(JSON.stringify(req.body), 'utf8');
  }

  return Buffer.alloc(0);
}

function verifyWebhookRequest(req, secrets) {
  const header = req.get(WEBHOOK_SIGNATURE_HEADER);
  return assertValidSignature({ header, payload: getRawPayload(req), secrets });
}

router.get('/rentguy/status', async (_req, res, next) => {
  try {
    const status = await rentGuyService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.get('/sevensa/status', async (_req, res, next) => {
  try {
    const status = await sevensaService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.post('/rentguy/webhook', async (req, res, next) => {
  try {
    const secrets = config.integrations?.rentGuy?.webhookSecrets || [];
    const verification = verifyWebhookRequest(req, secrets);

    logger.info(
      {
        source: 'rentguy-webhook',
        matchedSecretIndex: secrets.findIndex((secret) => secret === verification.secret),
        eventType: req.body?.type || req.body?.event || 'unknown'
      },
      'Received authenticated RentGuy webhook'
    );

    res.status(204).end();
  } catch (error) {
    if (error instanceof SignatureVerificationError) {
      logger.warn({ err: error, source: 'rentguy-webhook' }, 'Rejected RentGuy webhook');
      res.status(error.statusCode || 401).json({ error: 'Invalid webhook signature', code: error.code });
      return;
    }

    next(error);
  }
});

router.post('/personalization/webhook', async (req, res, next) => {
  try {
    const secrets = config.personalization?.incomingWebhookSecrets || [];
    const verification = verifyWebhookRequest(req, secrets);

    logger.info(
      {
        source: 'personalization-webhook',
        matchedSecretIndex: secrets.findIndex((secret) => secret === verification.secret),
        eventType: req.body?.type || req.body?.event || 'unknown'
      },
      'Received authenticated personalization webhook'
    );

    res.status(204).end();
  } catch (error) {
    if (error instanceof SignatureVerificationError) {
      logger.warn({ err: error, source: 'personalization-webhook' }, 'Rejected personalization webhook');
      res.status(error.statusCode || 401).json({ error: 'Invalid webhook signature', code: error.code });
      return;
    }

    next(error);
  }
});

module.exports = router;
