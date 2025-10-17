const config = require('../config');

const LEVELS = {
  fatal: 10,
  error: 20,
  warn: 30,
  info: 40,
  debug: 50,
  trace: 60
};

const REDACT_PATHS = ['data.payload.contact.email', 'data.payload.contact.phone'];

const levelThreshold = LEVELS[(process.env.LOG_LEVEL || 'info').toLowerCase()] || LEVELS.info;

function normalize(value) {
  if (value instanceof Error) {
    return {
      message: value.message,
      stack: value.stack,
      name: value.name
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalize(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, entryValue]) => {
      acc[key] = normalize(entryValue);
      return acc;
    }, {});
  }

  return value;
}

function applyRedactions(target) {
  for (const path of REDACT_PATHS) {
    const segments = path.split('.');
    let cursor = target;
    for (let index = 0; index < segments.length - 1; index += 1) {
      if (cursor && typeof cursor === 'object' && segments[index] in cursor) {
        cursor = cursor[segments[index]];
      } else {
        cursor = null;
        break;
      }
    }

    if (cursor && typeof cursor === 'object') {
      const lastKey = segments[segments.length - 1];
      if (lastKey in cursor) {
        cursor[lastKey] = '[REDACTED]';
      }
    }
  }
}

function shouldLog(level) {
  const value = LEVELS[level] ?? LEVELS.info;
  return value <= levelThreshold;
}

function toConsole(level, payload) {
  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else if (level === 'debug' || level === 'trace') {
    console.debug(serialized);
  } else if (level === 'info') {
    console.info(serialized);
  } else {
    console.log(serialized);
  }
}

function createLogger(baseContext = {}) {
  function log(level, details, message) {
    if (!shouldLog(level)) {
      return;
    }

    let logDetails = details;
    let logMessage = message;

    if (typeof details === 'string' && message === undefined) {
      logMessage = details;
      logDetails = undefined;
    }

    const payload = {
      level,
      time: new Date().toISOString(),
      service: config.serviceName,
      env: config.env,
      ...baseContext
    };

    if (logDetails && typeof logDetails === 'object') {
      const normalized = normalize(logDetails);
      applyRedactions(normalized);
      Object.assign(payload, normalized);
    } else if (logDetails !== undefined && logMessage === undefined) {
      logMessage = String(logDetails);
    }

    if (logMessage) {
      payload.msg = logMessage;
    }

    toConsole(level, payload);
  }

  return {
    fatal: (details, message) => log('fatal', details, message),
    error: (details, message) => log('error', details, message),
    warn: (details, message) => log('warn', details, message),
    info: (details, message) => log('info', details, message),
    debug: (details, message) => log('debug', details, message),
    trace: (details, message) => log('trace', details, message),
    child(context = {}) {
      return createLogger({ ...baseContext, ...context });
    }
  };
}

const logger = createLogger();

module.exports = {
  logger,
  createLogger
};
