const db = require('../lib/db');

const STEP_DEFINITIONS = {
  'event-details': {
    required: [
      { field: 'eventType', message: 'Kies een type evenement.' },
      { field: 'eventDate', message: 'Selecteer een datum.' }
    ],
    validators: [ensureValidDate('eventDate')]
  },
  'package-selection': {
    required: [{ field: 'packageId', message: 'Selecteer een pakket.' }]
  },
  'contact-details': {
    required: [
      { field: 'name', message: 'Naam is vereist.' },
      { field: 'email', message: 'Voer een geldig e-mailadres in.' },
      { field: 'phone', message: 'Telefoonnummer is vereist.' }
    ],
    validators: [ensureEmail('email'), ensurePhone('phone')]
  },
  review: {
    required: [{ field: 'confirmation', message: 'Bevestig dat de gegevens kloppen.' }],
    validators: [ensureBooleanTrue('confirmation', 'Bevestig dat de gegevens kloppen.')]
  }
};

const inMemoryProgress = new Map();

function ensureValidDate(field) {
  return (payload, errors) => {
    const value = getValue(payload, field);
    if (value === null || value === undefined || value === '') {
      return;
    }

    const trimmed = typeof value === 'string' ? value.trim() : value;
    if (trimmed instanceof Date && !Number.isNaN(trimmed.getTime())) {
      return;
    }

    if (typeof trimmed === 'string') {
      const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
        if (!Number.isNaN(date.getTime())) {
          return;
        }
      }
    }

    errors.push({ field, message: 'Ongeldige datum.' });
  };
}

function ensureEmail(field) {
  return (payload, errors) => {
    const value = getValue(payload, field);
    if (!value) {
      return;
    }

    const trimmed = String(value).trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) {
      errors.push({ field, message: 'Voer een geldig e-mailadres in.' });
    }
  };
}

function ensurePhone(field) {
  return (payload, errors) => {
    const value = getValue(payload, field);
    if (!value) {
      return;
    }

    const trimmed = String(value).trim();
    const digits = trimmed.replace(/\D+/g, '');
    if (digits.length < 6) {
      errors.push({ field, message: 'Voer een geldig telefoonnummer in.' });
    }
  };
}

function ensureBooleanTrue(field, message) {
  return (payload, errors) => {
    const value = getValue(payload, field);
    if (value !== true) {
      errors.push({ field, message });
    }
  };
}

function getValue(payload, field) {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  if (!field.includes('.')) {
    return payload[field];
  }

  return field.split('.').reduce((current, segment) => {
    if (current && typeof current === 'object') {
      return current[segment];
    }
    return undefined;
  }, payload);
}

function normalizeStringValue(value) {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed || '';
}

function sanitizePayload(payload) {
  if (payload === null || payload === undefined) {
    return {};
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => sanitizePayload(item))
      .filter((item) => item !== undefined);
  }

  if (payload instanceof Date) {
    return payload.toISOString();
  }

  if (typeof payload === 'object') {
    return Object.keys(payload).reduce((acc, key) => {
      const value = payload[key];
      if (value === undefined) {
        return acc;
      }

      if (value === null) {
        acc[key] = null;
        return acc;
      }

      if (Array.isArray(value)) {
        acc[key] = value
          .map((item) => sanitizePayload(item))
          .filter((item) => item !== undefined);
        return acc;
      }

      if (value instanceof Date) {
        acc[key] = value.toISOString();
        return acc;
      }

      switch (typeof value) {
        case 'string':
          acc[key] = normalizeStringValue(value);
          break;
        case 'number':
        case 'boolean':
          acc[key] = value;
          break;
        case 'object':
          acc[key] = sanitizePayload(value);
          break;
        default:
          break;
      }

      return acc;
    }, {});
  }

  if (['string', 'number', 'boolean'].includes(typeof payload)) {
    return normalizeStringValue(payload);
  }

  return undefined;
}

function validateStepPayload(stepId, payload = {}) {
  const definition = STEP_DEFINITIONS[stepId];

  if (!definition) {
    return {
      valid: false,
      errors: [
        {
          field: 'stepId',
          message: `Onbekende stap: ${stepId}`
        }
      ],
      normalizedPayload: {}
    };
  }

  const normalizedPayload = sanitizePayload(payload);
  const errors = [];

  const requirements = definition.required || [];
  for (const requirement of requirements) {
    const field = typeof requirement === 'string' ? requirement : requirement.field;
    const message = typeof requirement === 'string' ? 'Dit veld is verplicht.' : requirement.message;
    const value = getValue(normalizedPayload, field);
    const hasValue = !(value === undefined || value === null || (typeof value === 'string' && value.trim() === ''));
    if (!hasValue) {
      errors.push({ field, message });
    }
  }

  if (Array.isArray(definition.validators)) {
    for (const validator of definition.validators) {
      validator(normalizedPayload, errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    normalizedPayload
  };
}

function getInMemoryKey(flowId, stepId) {
  return `${flowId}:${stepId}`;
}

async function persistStepProgress(flowId, stepId, payload, { isComplete = true } = {}) {
  const normalizedFlowId = String(flowId).trim();
  const normalizedStepId = String(stepId).trim();
  const now = new Date();

  if (!normalizedFlowId || !normalizedStepId) {
    throw new Error('FlowId en stepId zijn verplicht.');
  }

  if (db.isConfigured()) {
    const result = await db.runQuery(
      `INSERT INTO booking_step_progress (flow_id, step_id, is_complete, payload, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (flow_id, step_id)
       DO UPDATE SET is_complete = EXCLUDED.is_complete,
                     payload = EXCLUDED.payload,
                     updated_at = EXCLUDED.updated_at
       RETURNING flow_id, step_id, is_complete, payload, created_at, updated_at`,
      [normalizedFlowId, normalizedStepId, isComplete, payload, now]
    );

    return {
      persisted: true,
      record: transformRow(result.rows[0])
    };
  }

  const key = getInMemoryKey(normalizedFlowId, normalizedStepId);
  const existing = inMemoryProgress.get(key);
  const record = {
    flowId: normalizedFlowId,
    stepId: normalizedStepId,
    isComplete,
    payload,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };
  inMemoryProgress.set(key, record);

  return {
    persisted: false,
    record
  };
}

function transformRow(row) {
  if (!row) {
    return null;
  }

  return {
    flowId: row.flow_id,
    stepId: row.step_id,
    isComplete: row.is_complete,
    payload: row.payload || {},
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at
  };
}

async function getFlowProgress(flowId) {
  if (!flowId) {
    return [];
  }

  if (db.isConfigured()) {
    const result = await db.runQuery(
      `SELECT flow_id, step_id, is_complete, payload, created_at, updated_at
       FROM booking_step_progress
       WHERE flow_id = $1
       ORDER BY updated_at ASC`,
      [flowId]
    );

    return result.rows.map(transformRow);
  }

  const progress = [];
  for (const record of inMemoryProgress.values()) {
    if (record.flowId === flowId) {
      progress.push({
        flowId: record.flowId,
        stepId: record.stepId,
        isComplete: record.isComplete,
        payload: record.payload,
        createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
        updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
      });
    }
  }

  progress.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  return progress;
}

function resetInMemoryStore() {
  inMemoryProgress.clear();
}

module.exports = {
  STEP_DEFINITIONS,
  validateStepPayload,
  persistStepProgress,
  getFlowProgress,
  resetInMemoryStore
};
