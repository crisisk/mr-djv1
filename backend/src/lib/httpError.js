class HttpError extends Error {
  constructor(status, code, message, options = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusCode = status;
    this.code = code;
    this.details = options.details;
    this.cause = options.cause;
  }
}

function createHttpError(status, code, message, options = {}) {
  return new HttpError(status, code, message, options);
}

function validationError(details, message = 'Validatie mislukt') {
  return new HttpError(422, 'VALIDATION_ERROR', message, { details });
}

module.exports = {
  HttpError,
  createHttpError,
  validationError
};
