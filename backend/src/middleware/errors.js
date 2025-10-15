const config = require('../config');

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
}

function logError(err, req) {
  const context = `${req.method} ${req.originalUrl}`;

  if (config.env === 'test') {
    return;
  }

  if ((err.status || err.statusCode || 500) >= 500) {
    console.error(`[errorHandler] ${context} ->`, err);
    return;
  }

  console.warn(`[errorHandler] ${context} -> ${err.message}`);
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
