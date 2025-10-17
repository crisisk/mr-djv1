const config = require('../config');
const { logger } = require('./logger');

const queueState = new Map();
const lastNotifications = new Map();

function getWebhooks() {
  const urls = config.alerts?.webhooks || [];
  return urls.filter(Boolean);
}

function getQueueThresholds() {
  return config.alerts?.queue || {};
}

function getThrottleMs() {
  return Number(config.alerts?.throttleMs) || 120000;
}

function shouldSend(key, severity) {
  const throttleMs = getThrottleMs();
  const now = Date.now();
  const entry = lastNotifications.get(key);

  if (!entry) {
    lastNotifications.set(key, { severity, timestamp: now });
    return true;
  }

  const severityChanged = entry.severity !== severity;
  const expired = now - entry.timestamp >= throttleMs;

  if (severityChanged || expired) {
    lastNotifications.set(key, { severity, timestamp: now });
    return true;
  }

  return false;
}

async function dispatch(payload) {
  const webhooks = getWebhooks();
  if (!webhooks.length) {
    return;
  }

  const body = JSON.stringify(payload);
  await Promise.all(
    webhooks.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        if (!response.ok) {
          logger.warn({ url, status: response.status }, 'Alert webhook responded with non-2xx status');
        }
      } catch (error) {
        logger.error({ err: error, url }, 'Failed to dispatch alert webhook');
      }
    })
  );
}

function buildQueuePayload(queueName, severity, summary, details = {}) {
  return {
    type: 'queue_alert',
    queue: queueName,
    severity,
    summary,
    details: {
      ...details,
      queue: queueName,
      severity,
      observedAt: new Date().toISOString()
    }
  };
}

function describeBacklog(backlog) {
  return backlog === 1 ? '1 job' : `${backlog} jobs`;
}

function describeDuration(ms) {
  if (!ms || ms <= 0) {
    return '0s';
  }
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (!remainingSeconds) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

async function sendQueueAlert(queueName, severity, summary, details) {
  const payload = buildQueuePayload(queueName, severity, summary, details);
  await dispatch(payload);
}

async function sendQueueRecovery(queueName, backlog, retryAge) {
  if (!shouldSend(`${queueName}:recovery`, 'recovery')) {
    return;
  }

  await sendQueueAlert(queueName, 'recovery', 'Queue metrics recovered', {
    backlog,
    retryAge,
    backlogDescription: describeBacklog(backlog),
    retryAgeDescription: describeDuration(retryAge)
  });
}

async function sendQueueDegradation(queueName, severity, reason, metrics) {
  if (!shouldSend(`${queueName}:${reason}`, severity)) {
    return;
  }

  await sendQueueAlert(queueName, severity, 'Queue thresholds exceeded', {
    reason,
    backlog: metrics.backlog,
    retryAge: metrics.retryAge,
    deadLetters: metrics.deadLetters,
    backlogDescription: describeBacklog(metrics.backlog),
    retryAgeDescription: describeDuration(metrics.retryAge),
    counts: metrics.counts
  });
}

async function sendDeadLetterNotification(queueName, entry) {
  if (!shouldSend(`${queueName}:dead-letter`, 'critical')) {
    return;
  }

  await sendQueueAlert(queueName, 'critical', 'Job moved to dead-letter queue', {
    reason: 'dead-letter',
    jobId: entry?.jobId,
    attemptsMade: entry?.attemptsMade,
    failedReason: entry?.failedReason
  });
}

async function reportQueueMetrics(queueName, metrics) {
  const thresholds = getQueueThresholds();
  const backlog = (metrics.counts?.waiting || 0) + (metrics.counts?.delayed || 0);
  const retryAge = metrics.retryAgeP95 || 0;
  const deadLetters = metrics.counts?.failed || 0;

  let severity = null;
  let reason = null;

  if (typeof thresholds.criticalBacklog === 'number' && backlog >= thresholds.criticalBacklog) {
    severity = 'critical';
    reason = 'backlog';
  } else if (typeof thresholds.warningBacklog === 'number' && backlog >= thresholds.warningBacklog) {
    severity = 'warning';
    reason = 'backlog';
  }

  if (!severity) {
    if (typeof thresholds.criticalRetryAgeMs === 'number' && retryAge >= thresholds.criticalRetryAgeMs) {
      severity = 'critical';
      reason = 'retry_age';
    } else if (typeof thresholds.warningRetryAgeMs === 'number' && retryAge >= thresholds.warningRetryAgeMs) {
      severity = 'warning';
      reason = 'retry_age';
    }
  }

  if (!severity && typeof thresholds.deadLetterWarning === 'number' && deadLetters >= thresholds.deadLetterWarning) {
    severity = 'warning';
    reason = 'dead_letter';
  }

  const previous = queueState.get(queueName) || { severity: null };
  queueState.set(queueName, { severity: severity || null, backlog, retryAge });

  if (severity) {
    await sendQueueDegradation(queueName, severity, reason || 'unknown', {
      backlog,
      retryAge,
      deadLetters,
      counts: metrics.counts
    });
    return;
  }

  if (previous.severity) {
    await sendQueueRecovery(queueName, backlog, retryAge);
  }
}

async function notifyQueueDeadLetter(queueName, entry) {
  await sendDeadLetterNotification(queueName, entry);
}

module.exports = {
  reportQueueMetrics,
  notifyQueueDeadLetter
};
