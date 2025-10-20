const config = require('../config');
const createBasicAuth = require('./basicAuth');

const REALM = 'Config Dashboard';

const requireDashboardAuth = createBasicAuth({ realm: REALM });

function normalizeIp(value) {
  if (!value) {
    return '';
  }

  return value.startsWith('::ffff:') ? value.slice(7) : value;
}

function forbidden(res) {
  res.status(403).json({ error: 'Forbidden' });
}

function dashboardAuth(req, res, next) {
  if (!config.dashboard.enabled) {
    res.status(404).json({ error: 'Config dashboard disabled' });
    return;
  }

  requireDashboardAuth(req, res, () => {
    if (config.dashboard.allowedIps.length) {
      const requestIp = normalizeIp(req.ip || req.connection?.remoteAddress);
      const allowedIps = config.dashboard.allowedIps.map(normalizeIp);
      if (!allowedIps.includes(requestIp)) {
        forbidden(res);
        return;
      }
    }

    next();
  });
}

module.exports = dashboardAuth;
