const managedEnv = require('../lib/managedEnv');

function unauthorized(res, realm) {
  res.set('WWW-Authenticate', `Basic realm="${realm}"`);
  res.status(401).json({ error: 'Unauthorized' });
}

function parseBasicAuthHeader(header) {
  if (!header || typeof header !== 'string' || !header.startsWith('Basic ')) {
    return null;
  }

  const base64Credentials = header.replace(/^Basic\s+/i, '').trim();

  let decoded;
  try {
    decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  } catch (_error) {
    return null;
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1)
  };
}

function resolveDashboardCredentials() {
  const envUsername = process.env.CONFIG_DASHBOARD_USER;
  const envPassword = process.env.CONFIG_DASHBOARD_PASS;

  if (envUsername && envPassword) {
    return { username: envUsername, password: envPassword };
  }

  const managedValues = managedEnv.loadFromDiskSync();
  const managedUsername = managedValues.CONFIG_DASHBOARD_USER;
  const managedPassword = managedValues.CONFIG_DASHBOARD_PASS;

  if (managedUsername && managedPassword) {
    return { username: managedUsername, password: managedPassword };
  }

  return { username: null, password: null };
}

function createBasicAuth({ realm = 'Secure Area', getCredentials = resolveDashboardCredentials } = {}) {
  if (typeof getCredentials !== 'function') {
    throw new TypeError('getCredentials must be a function');
  }

  return function basicAuthMiddleware(req, res, next) {
    const { username: expectedUsername, password: expectedPassword } = getCredentials(req) || {};

    if (!expectedUsername || !expectedPassword) {
      unauthorized(res, realm);
      return;
    }

    const parsed = parseBasicAuthHeader(req.headers?.authorization);

    if (!parsed) {
      unauthorized(res, realm);
      return;
    }

    if (parsed.username !== expectedUsername || parsed.password !== expectedPassword) {
      unauthorized(res, realm);
      return;
    }

    next();
  };
}

module.exports = createBasicAuth;
module.exports.resolveDashboardCredentials = resolveDashboardCredentials;
module.exports.parseBasicAuthHeader = parseBasicAuthHeader;
