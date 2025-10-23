const { createHash, randomUUID } = require('crypto');
const sevensaService = require('./sevensaService');

function buildDeduplicationKey(email, eventDate) {
  const hash = createHash('sha256').update(`${email}|${eventDate}`).digest('hex');
  return `availability:${hash}`;
}

function buildLegalConsentOptions({ marketingConsent, statisticsConsent }) {
  const timestamp = new Date().toISOString();
  return [
    {
      category: 'marketing',
      consented: Boolean(marketingConsent),
      updatedAt: timestamp
    },
    {
      category: 'statistics',
      consented: Boolean(statisticsConsent),
      updatedAt: timestamp
    }
  ];
}

async function submitAvailabilityRequest(payload) {
  const id = randomUUID();
  const dedupeKey = buildDeduplicationKey(payload.email, payload.eventDate);

  const legalConsentOptions = buildLegalConsentOptions(payload);

  const lead = {
    id,
    email: payload.email,
    eventDate: payload.eventDate,
    message: payload.message,
    pageUri: payload.pageUri,
    pageName: payload.pageName,
    legalConsentOptions
  };

  const sevensaResult = await sevensaService.submitLead(lead, {
    id,
    dedupeKey,
    queueReason: 'availability-check',
    source: 'availability-check'
  });

  return {
    sevensaResult,
    lead
  };
}

module.exports = {
  submitAvailabilityRequest
};
