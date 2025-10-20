const fs = require('fs/promises');
const path = require('path');
const config = require('../config');
const { createLogger } = require('../lib/logger');

const logger = createLogger({ component: 'mailService' });

const TEMPLATE_CACHE = new Map();
const DEFAULT_CTAS = {
  booking: 'https://misterdj.nl/bedankt'
};

function getTemplatePath(templateName) {
  return path.join(__dirname, '../../app/templates', templateName);
}

async function loadTemplate(templateName) {
  if (TEMPLATE_CACHE.has(templateName)) {
    return TEMPLATE_CACHE.get(templateName);
  }

  const file = await fs.readFile(getTemplatePath(templateName), 'utf8');
  TEMPLATE_CACHE.set(templateName, file);
  return file;
}

function getTokenValue(tokens, key) {
  if (!key.includes('.')) {
    return tokens[key];
  }

  return key.split('.').reduce((value, segment) => {
    if (value && typeof value === 'object' && segment in value) {
      return value[segment];
    }

    return undefined;
  }, tokens);
}

function renderTemplateString(template, tokens) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, tokenKey) => {
    const value = getTokenValue(tokens, tokenKey.trim());
    if (value === undefined || value === null) {
      return '';
    }

    return String(value);
  });
}

function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<(?:br|br\/)\s*>/gi, '\n')
    .replace(/<\/(?:p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isConfigured() {
  return Boolean(
    config.mail?.provider &&
      config.mail?.apiKey &&
      config.mail?.from &&
      typeof config.mail.provider === 'string'
  );
}

function getDefaultCta(id) {
  return DEFAULT_CTAS[id] || DEFAULT_CTAS.booking;
}

async function sendViaPostmark({ to, subject, html, text, metadata, replyTo }) {
  const endpoint = 'https://api.postmarkapp.com/email';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Postmark-Server-Token': config.mail.apiKey
  };

  const body = {
    From: config.mail.from,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    MessageStream: config.mail.stream || 'outbound',
    Metadata: metadata
  };

  if (replyTo || config.mail.replyTo) {
    body.ReplyTo = replyTo || config.mail.replyTo;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(json?.Message || `Postmark responded with ${response.status}`);
    error.provider = 'postmark';
    error.status = response.status;
    error.body = json;
    throw error;
  }

  return {
    delivered: true,
    queued: false,
    provider: 'postmark',
    messageId: json.MessageID || json.MessageId || null
  };
}

async function deliverMail({ to, subject, html, text, metadata, replyTo }) {
  if (!isConfigured()) {
    return {
      delivered: false,
      queued: false,
      skipped: true,
      reason: 'mail-not-configured'
    };
  }

  const provider = config.mail.provider?.toLowerCase();

  switch (provider) {
    case 'postmark':
      return sendViaPostmark({ to, subject, html, text, metadata, replyTo });
    default:
      logger.warn({ provider }, 'Unsupported mail provider configured');
      return {
        delivered: false,
        queued: false,
        skipped: true,
        reason: 'unsupported-provider'
      };
  }
}

async function sendBookingConfirmation({ to, tokens = {}, meta = {} }) {
  if (!to) {
    throw new Error('Recipient address is required for booking confirmation');
  }

  const template = await loadTemplate('bookingConfirmation.html');
  const enrichedTokens = {
    ctaUrl: tokens.ctaUrl || getDefaultCta('booking'),
    ...tokens
  };
  const html = renderTemplateString(template, enrichedTokens);
  const text = enrichedTokens.textBody || htmlToText(html);
  const subject =
    enrichedTokens.emailSubjectText ||
    enrichedTokens.emailSubject ||
    'Bevestiging van jullie boeking bij Mister DJ';
  const metadata = {
    bookingId: meta.bookingId || tokens.bookingReference || null,
    eventType: meta.eventType || null,
    packageId: meta.packageId || null,
    matchType: meta.matchType || tokens.personalizationMatchType || null,
    variantId: meta.variantId || null
  };

  try {
    const result = await deliverMail({
      to,
      subject,
      html,
      text,
      metadata,
      replyTo: tokens.replyToAddress
    });

    if (!result.delivered) {
      logger.info({
        event: 'mail.send.skipped',
        reason: result.reason || 'unknown',
        provider: config.mail?.provider || null,
        bookingId: metadata.bookingId
      });
    } else {
      logger.info({
        event: 'mail.send.success',
        provider: result.provider,
        bookingId: metadata.bookingId,
        messageId: result.messageId || null
      });
    }

    return {
      ...result,
      htmlPreview: result.delivered ? undefined : html,
      textPreview: result.delivered ? undefined : text
    };
  } catch (error) {
    logger.error({
      event: 'mail.send.error',
      err: error,
      provider: config.mail?.provider || null,
      bookingId: metadata.bookingId
    }, 'Failed to send booking confirmation');

    return {
      delivered: false,
      queued: false,
      error: error.message,
      provider: error.provider || config.mail?.provider || null
    };
  }
}

module.exports = {
  sendBookingConfirmation,
  htmlToText,
  renderTemplateString,
  isConfigured
};
