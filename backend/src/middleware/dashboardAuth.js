const config = require('../config');

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
  if (!config.dashboard.enabled) {
    res.status(404).json({ error: 'Config dashboard disabled' });
    return;
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Basic ')) {
    unauthorized(res);
    return;
  }

  const base64Credentials = authorization.replace(/^Basic\s+/i, '').trim();

  let decoded = '';
  try {
    decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  } catch (_error) {
    unauthorized(res);
    return;
  }

  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex === -1) {
    unauthorized(res);
    return;
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== config.dashboard.username || password !== config.dashboard.password) {
    unauthorized(res);
    return;
  }

  if (config.dashboard.allowedIps.length) {
    const requestIp = normalizeIp(req.ip || req.connection?.remoteAddress);
    const allowedIps = config.dashboard.allowedIps.map(normalizeIp);
    if (!allowedIps.includes(requestIp)) {
      forbidden(res);
      return;
    }
  }

  next();
}

module.exports = dashboardAuth;
