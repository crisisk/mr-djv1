const { createLogger: winstonCreateLogger, format, transports } = require('winston');
const config = require('../config');

const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();

const baseFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  format.splat(),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service', 'env'] }),
  format.json()
);

const consoleTransport = new transports.Console({
  format: baseFormat,
  silent: config.env === 'test' || process.env.NODE_ENV === 'test'
});

const defaultOptions = {
  level: LOG_LEVEL,
  defaultMeta: {
    service: config.serviceName,
    env: config.env
  },
  transports: [consoleTransport]
};

function createLogger(options = {}) {
  const logger = winstonCreateLogger({
    ...defaultOptions,
    ...options,
    defaultMeta: {
      ...defaultOptions.defaultMeta,
      ...(options.defaultMeta || {})
    },
    transports: options.transports || defaultOptions.transports
  });

  return logger;
}

const logger = createLogger();

module.exports = {
  logger,
  createLogger
};
