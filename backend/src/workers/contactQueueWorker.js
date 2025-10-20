const { logger } = require('../lib/logger');
const contactService = require('../services/contactService');

const DEFAULT_INTERVAL_MS = 30000;

let intervalHandle = null;

async function tick() {
  try {
    const result = await contactService.flushQueuedContacts();
    if (result?.flushed) {
      logger.debug(
        {
          event: 'contact.queue.worker-flush',
          flushed: result.flushed,
          queueSize: result.queueSize
        },
        'Contact queue worker flushed pending contacts'
      );
    }
  } catch (error) {
    logger.error({ event: 'contact.queue.worker-error', err: error }, 'Contact queue worker failed');
  }
}

function startContactQueueWorker({ intervalMs = DEFAULT_INTERVAL_MS } = {}) {
  if (intervalHandle) {
    return;
  }

  intervalHandle = setInterval(tick, intervalMs);

  if (typeof intervalHandle.unref === 'function') {
    intervalHandle.unref();
  }

  // Kick off an initial attempt without waiting for the first interval.
  tick().catch((error) => {
    logger.error({ event: 'contact.queue.worker-initial-error', err: error }, 'Initial contact queue flush failed');
  });
}

function stopContactQueueWorker() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

module.exports = {
  startContactQueueWorker,
  stopContactQueueWorker
};
