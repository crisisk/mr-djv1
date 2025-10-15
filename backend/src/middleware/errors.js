const config = require('../config');

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    error: err.publicMessage || 'Internal server error'
  };

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
