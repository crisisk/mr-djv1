const { randomUUID } = require('crypto');
const db = require('../lib/db');
const config = require('../config');

const inMemorySurveys = new Map();

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getResponseBaseUrl() {
  return config.feedback?.responseBaseUrl || null;
}

function buildResponseUrl(token) {
  const base = getResponseBaseUrl();
  if (!base) {
    return null;
  }

  try {
    const url = new URL(base);
    const prefix = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
    url.pathname = `${prefix}/${token}`.replace(/\/+/, '/');
    return url.toString();
  } catch (error) {
    const sanitizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${sanitizedBase}/${token}`;
  }
}

function mapRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    contactId: row.contactId || null,
    contactSource: row.contactSource || null,
    email: row.email,
    name: row.name,
    eventType: row.eventType || null,
    eventDate: row.eventDate ? new Date(row.eventDate) : null,
    packageId: row.packageId || null,
    responseToken: row.responseToken,
    responseUrl: row.responseUrl || buildResponseUrl(row.responseToken),
    status: row.status,
    rating: typeof row.rating === 'number' ? row.rating : null,
    reviewText: row.reviewText || null,
    wouldRecommend: typeof row.wouldRecommend === 'boolean' ? row.wouldRecommend : null,
    approved: Boolean(row.approved),
    sentAt: row.sentAt ? new Date(row.sentAt) : null,
    submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
    createdAt: row.createdAt ? new Date(row.createdAt) : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    lastError: row.lastError || null
  };
}

function toStoreRecord(record) {
  const clone = { ...record };
  inMemorySurveys.set(record.responseToken, clone);
  return clone;
}

function getFromStoreByToken(token) {
  const existing = inMemorySurveys.get(token);
  return existing ? { ...existing } : null;
}

function setStoreRecord(record) {
  if (!record || !record.responseToken) {
    return record;
  }

  inMemorySurveys.set(record.responseToken, { ...record });
  return record;
}

async function insertSurvey(record) {
  if (!db.isConfigured()) {
    return toStoreRecord(record);
  }

  const result = await db.runQuery(
    `INSERT INTO survey_feedback (
       id,
       contact_id,
       contact_source,
       email,
       name,
       event_type,
       event_date,
       package_id,
       response_token,
       response_url,
       status,
       created_at,
       updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
     RETURNING
       id,
       contact_id AS "contactId",
       contact_source AS "contactSource",
       email,
       name,
       event_type AS "eventType",
       event_date AS "eventDate",
       package_id AS "packageId",
       response_token AS "responseToken",
       response_url AS "responseUrl",
       status,
       rating,
       review_text AS "reviewText",
       would_recommend AS "wouldRecommend",
       approved,
       sent_at AS "sentAt",
       submitted_at AS "submittedAt",
       created_at AS "createdAt",
       updated_at AS "updatedAt",
       last_error AS "lastError"
    `,
    [
      record.id,
      record.contactId,
      record.contactSource,
      record.email,
      record.name,
      record.eventType,
      record.eventDate,
      record.packageId,
      record.responseToken,
      record.responseUrl,
      record.status,
      record.createdAt
    ]
  );

  return mapRow(result.rows[0]);
}

async function updateSurveyStatus(token, fields) {
  if (!db.isConfigured()) {
    const current = getFromStoreByToken(token);
    if (!current) {
      return null;
    }
    const updated = {
      ...current,
      ...fields,
      updatedAt: fields.updatedAt || new Date()
    };
    setStoreRecord(updated);
    return updated;
  }

  const entries = { ...fields };
  const columns = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(entries)) {
    let column;
    switch (key) {
      case 'status':
        column = 'status';
        break;
      case 'sentAt':
        column = 'sent_at';
        break;
      case 'submittedAt':
        column = 'submitted_at';
        break;
      case 'rating':
        column = 'rating';
        break;
      case 'reviewText':
        column = 'review_text';
        break;
      case 'wouldRecommend':
        column = 'would_recommend';
        break;
      case 'lastError':
        column = 'last_error';
        break;
      case 'name':
        column = 'name';
        break;
      case 'eventType':
        column = 'event_type';
        break;
      case 'eventDate':
        column = 'event_date';
        break;
      case 'packageId':
        column = 'package_id';
        break;
      case 'approved':
        column = 'approved';
        break;
      case 'email':
        column = 'email';
        break;
      default:
        column = null;
        break;
    }

    if (column) {
      columns.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    }
  }

  const now = new Date();
  columns.push(`updated_at = $${index}`);
  values.push(fields.updatedAt || now);
  index += 1;

  values.push(token);

  const result = await db.runQuery(
    `UPDATE survey_feedback
       SET ${columns.join(', ')}
     WHERE response_token = $${index}
     RETURNING
       id,
       contact_id AS "contactId",
       contact_source AS "contactSource",
       email,
       name,
       event_type AS "eventType",
       event_date AS "eventDate",
       package_id AS "packageId",
       response_token AS "responseToken",
       response_url AS "responseUrl",
       status,
       rating,
       review_text AS "reviewText",
       would_recommend AS "wouldRecommend",
       approved,
       sent_at AS "sentAt",
       submitted_at AS "submittedAt",
       created_at AS "createdAt",
       updated_at AS "updatedAt",
       last_error AS "lastError"
    `,
    values
  );

  return mapRow(result.rows[0]);
}

async function createSurveyInvite(contact, { source = 'contact-service', sync = {} } = {}) {
  const now = new Date();
  const responseToken = randomUUID().replace(/-/g, '');
  const record = {
    id: randomUUID(),
    contactId: contact?.id != null ? String(contact.id) : null,
    contactSource: source,
    email: contact?.email,
    name: contact?.name || contact?.email || 'Mister DJ klant',
    eventType: contact?.eventType || null,
    eventDate: normalizeDate(contact?.eventDate),
    packageId: contact?.packageId || null,
    responseToken,
    responseUrl: buildResponseUrl(responseToken),
    status: 'pending',
    rating: null,
    reviewText: null,
    wouldRecommend: null,
    approved: false,
    sentAt: null,
    submittedAt: null,
    createdAt: now,
    updatedAt: now,
    lastError: null
  };

  const stored = await insertSurvey(record);

  return {
    survey: stored,
    sync
  };
}

async function deliverSurveyInvite(invitePayload) {
  const webhookUrl = config.feedback?.automationWebhook;
  if (!webhookUrl) {
    return {
      delivered: false,
      reason: 'webhook-not-configured',
      survey: invitePayload.survey
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: invitePayload.contact,
        sync: invitePayload.sync,
        survey: {
          id: invitePayload.survey.id,
          responseToken: invitePayload.survey.responseToken,
          responseUrl: invitePayload.survey.responseUrl,
          email: invitePayload.survey.email,
          name: invitePayload.survey.name,
          status: invitePayload.survey.status
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`n8n webhook returned ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }

    const updated = await updateSurveyStatus(invitePayload.survey.responseToken, {
      status: 'sent',
      sentAt: new Date(),
      lastError: null
    });

    return {
      delivered: true,
      survey: updated
    };
  } catch (error) {
    console.error('[surveyService] Failed to trigger survey automation:', error.message);
    await updateSurveyStatus(invitePayload.survey.responseToken, {
      lastError: error.message
    });
    return {
      delivered: false,
      reason: error.message,
      survey: invitePayload.survey
    };
  }
}

async function queueSurveyInvite(contact, sync = {}) {
  if (!contact?.email) {
    return {
      survey: null,
      automation: { delivered: false, reason: 'missing-email' }
    };
  }

  const invite = await createSurveyInvite(contact, { sync });
  const automation = await deliverSurveyInvite({
    contact,
    sync,
    survey: invite.survey
  });

  return {
    survey: automation.survey || invite.survey,
    automation
  };
}

async function submitSurveyResponse(payload) {
  const token = payload?.token?.trim();
  if (!token) {
    const error = new Error('Survey token is vereist');
    error.status = 404;
    throw error;
  }

  const now = new Date();
  const fields = {
    status: 'submitted',
    submittedAt: now,
    rating: payload.rating,
    reviewText: payload.reviewText || null,
    wouldRecommend: typeof payload.wouldRecommend === 'boolean' ? payload.wouldRecommend : null,
    name: payload.name || undefined,
    eventType: payload.eventType || undefined,
    eventDate: normalizeDate(payload.eventDate) || undefined,
    packageId: payload.packageId || undefined,
    lastError: null
  };

  if (!db.isConfigured()) {
    const existing = getFromStoreByToken(token);
    if (!existing) {
      const error = new Error('Ongeldige of verlopen survey link');
      error.status = 404;
      throw error;
    }
    const updated = {
      ...existing,
      ...fields,
      updatedAt: now
    };
    setStoreRecord(updated);
    return updated;
  }

  const result = await db.runQuery(
    `UPDATE survey_feedback
       SET rating = $2,
           review_text = $3,
           name = COALESCE(NULLIF($4, ''), name),
           event_type = COALESCE(NULLIF($5, ''), event_type),
           event_date = COALESCE($6::date, event_date),
           package_id = COALESCE(NULLIF($7, ''), package_id),
           would_recommend = COALESCE($8, would_recommend),
           status = 'submitted',
           submitted_at = $9,
           updated_at = $9,
           last_error = NULL
     WHERE response_token = $1
     RETURNING
       id,
       contact_id AS "contactId",
       contact_source AS "contactSource",
       email,
       name,
       event_type AS "eventType",
       event_date AS "eventDate",
       package_id AS "packageId",
       response_token AS "responseToken",
       response_url AS "responseUrl",
       status,
       rating,
       review_text AS "reviewText",
       would_recommend AS "wouldRecommend",
       approved,
       sent_at AS "sentAt",
       submitted_at AS "submittedAt",
       created_at AS "createdAt",
       updated_at AS "updatedAt",
       last_error AS "lastError"
    `,
    [
      token,
      payload.rating,
      payload.reviewText || null,
      payload.name || null,
      payload.eventType || null,
      normalizeDate(payload.eventDate),
      payload.packageId || null,
      typeof payload.wouldRecommend === 'boolean' ? payload.wouldRecommend : null,
      now
    ]
  );

  if (!result || result.rowCount === 0) {
    const error = new Error('Ongeldige of verlopen survey link');
    error.status = 404;
    throw error;
  }

  return mapRow(result.rows[0]);
}

async function approveSurveyResponses({ tokens = [], ids = [] } = {}) {
  const uniqueTokens = Array.from(new Set(tokens.filter(Boolean).map((token) => token.trim())));
  const uniqueIds = Array.from(new Set(ids.filter(Boolean).map((value) => value.trim())));

  if (!uniqueTokens.length && !uniqueIds.length) {
    return { updated: 0, approvedIds: [], approvedTokens: [] };
  }

  if (!db.isConfigured()) {
    const approved = [];
    for (const record of inMemorySurveys.values()) {
      if (record.status !== 'submitted' || record.approved) {
        continue;
      }
      if (uniqueTokens.includes(record.responseToken) || uniqueIds.includes(record.id)) {
        record.approved = true;
        record.updatedAt = new Date();
        approved.push(record.responseToken);
      }
    }
    return {
      updated: approved.length,
      approvedIds: Array.from(inMemorySurveys.values())
        .filter((entry) => approved.includes(entry.responseToken))
        .map((entry) => entry.id),
      approvedTokens: approved
    };
  }

  const filters = [];
  const values = [];
  let index = 1;

  if (uniqueTokens.length) {
    filters.push(`response_token = ANY($${index}::text[])`);
    values.push(uniqueTokens);
    index += 1;
  }

  if (uniqueIds.length) {
    filters.push(`id = ANY($${index}::text[])`);
    values.push(uniqueIds);
    index += 1;
  }

  const now = new Date();
  const whereClause = filters.length > 1 ? `(${filters.join(' OR ')})` : filters[0];

  values.push(now);

  const result = await db.runQuery(
    `UPDATE survey_feedback
       SET approved = TRUE,
           updated_at = $${index}
     WHERE status = 'submitted'
       AND approved = FALSE
       AND ${whereClause}
     RETURNING id, response_token AS "responseToken"`,
    values
  );

  return {
    updated: result?.rowCount || 0,
    approvedIds: result ? result.rows.map((row) => row.id) : [],
    approvedTokens: result ? result.rows.map((row) => row.responseToken) : []
  };
}

async function getApprovedFeedback(limit = 12) {
  if (!db.isConfigured()) {
    const responses = Array.from(inMemorySurveys.values())
      .filter((entry) => entry.approved && entry.status === 'submitted')
      .sort((a, b) => {
        const dateA = a.submittedAt ? a.submittedAt.getTime() : 0;
        const dateB = b.submittedAt ? b.submittedAt.getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        eventType: entry.eventType,
        rating: entry.rating,
        reviewText: entry.reviewText,
        createdAt: entry.submittedAt || entry.createdAt,
        source: 'survey'
      }));

    return responses;
  }

  const result = await db.runQuery(
    `SELECT
       id,
       name,
       event_type AS "eventType",
       rating,
       review_text AS "reviewText",
       submitted_at AS "submittedAt",
       created_at AS "createdAt"
     FROM survey_feedback
     WHERE approved = TRUE
       AND status = 'submitted'
     ORDER BY submitted_at DESC NULLS LAST, created_at DESC
     LIMIT $1`,
    [limit]
  );

  if (!result || !Array.isArray(result.rows)) {
    return [];
  }

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    eventType: row.eventType,
    rating: row.rating,
    reviewText: row.reviewText,
    createdAt: row.submittedAt || row.createdAt,
    source: 'survey'
  }));
}

function resetInMemoryStore() {
  inMemorySurveys.clear();
}

module.exports = {
  queueSurveyInvite,
  createSurveyInvite,
  submitSurveyResponse,
  approveSurveyResponses,
  getApprovedFeedback,
  resetInMemoryStore,
  buildResponseUrl
};
