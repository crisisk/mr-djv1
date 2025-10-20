const config = require('../config');
const { logger } = require('../lib/logger');

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
}

function logError(err, req) {
  if (config.env === 'test') {
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const requestLogger = logger.child({
    middleware: 'errorHandler',
    method: req.method,
    path: req.originalUrl,
    statusCode
  });

  if (statusCode >= 500) {
    requestLogger.error('Unhandled server error', { err });
    return;
  }

  requestLogger.warn('Client error handled', { err });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  logError(err, req);

  const isJsonParseError = err.type === 'entity.parse.failed';
  const statusCode = isJsonParseError ? 400 : err.status || err.statusCode || 500;
  const response = {
    error: isJsonParseError ? 'Ongeldige JSON payload' : err.publicMessage || 'Internal server error'
  };

  if (isJsonParseError) {
    response.details = 'Controleer of de JSON body correct is geformatteerd.';
  }

  if (config.env !== 'production') {
    response.message = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
