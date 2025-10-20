const config = require('../config');
const { HttpError } = require('../lib/httpError');

const STATUS_TO_CODE = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  409: 'CONFLICT',
  410: 'GONE',
  412: 'PRECONDITION_FAILED',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  422: 'VALIDATION_ERROR',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT'
};

const STATUS_TO_MESSAGE = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Endpoint not found',
  405: 'Method not allowed',
  409: 'Conflict detected',
  410: 'Resource is no longer available',
  412: 'Precondition failed',
  415: 'Unsupported media type',
  422: 'Validatie mislukt',
  429: 'Too many requests',
  500: 'Internal server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout'
};

function statusToCode(status) {
  return STATUS_TO_CODE[status] || `ERROR_${status}`;
}

function statusToMessage(status) {
  return STATUS_TO_MESSAGE[status] || STATUS_TO_MESSAGE[500];
}

function buildPayload({ code, message, details }, err) {
  const payload = {
    error: {
      code,
      message
    }
  };

  if (typeof details !== 'undefined') {
    payload.details = details;
  }

  if (config.env !== 'production' && err) {
    payload.debug = {
      message: err.message,
      stack: err.stack
    };
  }

  return payload;
}

function logError(err, req, status) {
  if (config.env === 'test') {
    return;
  }

  const context = `${req.method} ${req.originalUrl}`;

  if (status >= 500) {
    console.error(`[errorHandler] ${context} ->`, err);
    return;
  }

  console.warn(`[errorHandler] ${context} -> ${err.message}`);
}

function mapError(err) {
  if (err instanceof HttpError) {
    return {
      status: err.status,
      code: err.code || statusToCode(err.status),
      message: err.message || statusToMessage(err.status),
      details: err.details
    };
  }

  if (err.type === 'entity.parse.failed') {
    return {
      status: 400,
      code: 'INVALID_JSON',
      message: 'Ongeldige JSON payload',
      details: {
        hint: 'Controleer of de JSON body correct is geformatteerd.'
      }
    };
  }

  const statusFromError = err.status || err.statusCode;

  if (statusFromError && statusFromError >= 400 && statusFromError < 500) {
    return {
      status: statusFromError,
      code: err.code || statusToCode(statusFromError),
      message: err.publicMessage || err.message || statusToMessage(statusFromError),
      details: err.details
    };
  }

  return {
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: STATUS_TO_MESSAGE[500],
    details: config.env === 'production' ? undefined : err.details
  };
}

function notFoundHandler(req, res) {
  const mapped = {
    status: 404,
    code: 'NOT_FOUND',
    message: STATUS_TO_MESSAGE[404],
    details: {
      path: req.path
    }
  };

  res.status(mapped.status).json(buildPayload(mapped));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const mapped = mapError(err);

  logError(err, req, mapped.status);

  res.status(mapped.status).json(buildPayload(mapped, err));
}

module.exports = {
  notFoundHandler,
  errorHandler
};
