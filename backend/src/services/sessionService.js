const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const DEFAULT_SELECTIONS = Object.freeze({
  date: null,
  location: null,
  eventType: null,
  package: null,
  pricing: null
});

const sessions = new Map();

const structuredCloneFn =
  typeof globalThis.structuredClone === 'function'
    ? globalThis.structuredClone.bind(globalThis)
    : undefined;

function cloneValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (structuredCloneFn) {
    return structuredCloneFn(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function createDefaultSelections() {
  return {
    date: DEFAULT_SELECTIONS.date,
    location: DEFAULT_SELECTIONS.location,
    eventType: DEFAULT_SELECTIONS.eventType,
    package: DEFAULT_SELECTIONS.package,
    pricing: DEFAULT_SELECTIONS.pricing
  };
}

function normalisePackage(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'object') {
    return null;
  }

  const result = {};

  for (const [key, raw] of Object.entries(value)) {
    if (raw === undefined) {
      continue;
    }

    if (typeof raw === 'string') {
      result[key] = raw.trim();
    } else {
      result[key] = raw;
    }
  }

  return result;
}

function normalisePricing(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'object') {
    return null;
  }

  const result = {};

  for (const [key, raw] of Object.entries(value)) {
    if (raw === undefined) {
      continue;
    }

    if (typeof raw === 'string') {
      result[key] = raw.trim();
      continue;
    }

    if (Array.isArray(raw) && key === 'breakdown') {
      result.breakdown = raw
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const cloned = {};
          for (const [innerKey, innerValue] of Object.entries(item)) {
            if (innerValue === undefined) {
              continue;
            }

            if (typeof innerValue === 'string') {
              cloned[innerKey] = innerValue.trim();
            } else {
              cloned[innerKey] = innerValue;
            }
          }
          return cloned;
        });
      continue;
    }

    result[key] = raw;
  }

  return result;
}

function normaliseSelections(updates) {
  const source = updates && typeof updates === 'object' ? updates : {};
  const result = {};

  if (Object.prototype.hasOwnProperty.call(source, 'date')) {
    const value = source.date;
    if (value === null || value === undefined) {
      result.date = null;
    } else {
      const trimmed = String(value).trim();
      result.date = trimmed.length > 0 ? trimmed : null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(source, 'location')) {
    const value = source.location;
    if (value === null || value === undefined) {
      result.location = null;
    } else {
      const trimmed = String(value).trim();
      result.location = trimmed.length > 0 ? trimmed : null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(source, 'eventType')) {
    const value = source.eventType;
    if (value === null || value === undefined) {
      result.eventType = null;
    } else {
      const trimmed = String(value).trim();
      result.eventType = trimmed.length > 0 ? trimmed : null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(source, 'package')) {
    result.package = normalisePackage(source.package ?? null);
  }

  if (Object.prototype.hasOwnProperty.call(source, 'pricing')) {
    result.pricing = normalisePricing(source.pricing ?? null);
  }

  return result;
}

function ensureEntry(sessionId) {
  const now = Date.now();
  const existing = sessions.get(sessionId);

  if (existing && existing.expiresAt > now) {
    return existing;
  }

  const entry = {
    data: createDefaultSelections(),
    expiresAt: now + SESSION_TTL_MS
  };

  sessions.set(sessionId, entry);
  return entry;
}

function mergeSelections(current, updates) {
  const merged = { ...current };
  const normalised = normaliseSelections(updates);

  for (const [key, value] of Object.entries(normalised)) {
    if (key === 'package' || key === 'pricing') {
      merged[key] = value === undefined ? merged[key] : cloneValue(value);
    } else {
      merged[key] = value === undefined ? merged[key] : value;
    }
  }

  return merged;
}

function getSelections(sessionId) {
  const entry = ensureEntry(sessionId);
  return cloneValue(entry.data);
}

function updateSelections(sessionId, updates) {
  const entry = ensureEntry(sessionId);
  entry.data = mergeSelections(entry.data, updates);
  entry.expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(sessionId, entry);
  return cloneValue(entry.data);
}

function resetSessions() {
  sessions.clear();
}

function getDefaultSelections() {
  return createDefaultSelections();
}

module.exports = {
  SESSION_TTL_MS,
  getSelections,
  updateSelections,
  getDefaultSelections,
  resetSessions
};
