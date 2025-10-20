const config = require('../config');
const { logger } = require('../lib/logger');

function normalizeIp(value) {
  if (!value) {
    return '';
  }

  return value.startsWith('::ffff:') ? value.slice(7) : value;
}

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Config Dashboard"');
  res.status(401).json({ error: 'Unauthorized' });
}

function forbidden(res) {
  res.status(403).json({ error: 'Forbidden' });
}

function dashboardAuth(req, res, next) {
  const requestLogger = logger.child({
    middleware: 'dashboardAuth',
    method: req.method,
    path: req.originalUrl
  });

  requestLogger.debug('Validating dashboard request');

  if (!config.dashboard.enabled) {
    requestLogger.info('Dashboard requested while disabled');
    res.status(404).json({ error: 'Config dashboard disabled' });
    return;
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Basic ')) {
    requestLogger.warn('Dashboard authorization header missing');
    unauthorized(res);
    return;
  }

  const base64Credentials = authorization.replace(/^Basic\s+/i, '').trim();

  let decoded = '';
  try {
    decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  } catch (_error) {
    requestLogger.warn('Dashboard authorization header not valid base64');
    unauthorized(res);
    return;
  }

  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex === -1) {
    requestLogger.warn('Dashboard authorization header missing separator');
    unauthorized(res);
    return;
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== config.dashboard.username || password !== config.dashboard.password) {
    requestLogger.warn('Dashboard authentication failed');
    unauthorized(res);
    return;
  }

  if (config.dashboard.allowedIps.length) {
    const requestIp = normalizeIp(req.ip || req.connection?.remoteAddress);
    const allowedIps = config.dashboard.allowedIps.map(normalizeIp);
    if (!allowedIps.includes(requestIp)) {
      requestLogger.warn('Dashboard access denied due to IP restriction', { requestIp });
      forbidden(res);
      return;
    }
  }

  requestLogger.debug('Dashboard authentication succeeded');
  next();
}

module.exports = dashboardAuth;
