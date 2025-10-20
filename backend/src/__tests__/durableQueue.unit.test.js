const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };

function loadDurableQueue(overrides = {}) {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  const reportQueueMetrics = jest.fn();
  const notifyQueueDeadLetter = jest.fn();

  jest.doMock('../config', () => ({
    redis: {
      namespace: 'mr-dj-test',
      url: null,
      tls: false,
      tlsRejectUnauthorized: true,
      ...(overrides.redis || {})
    }
  }));

  jest.doMock('../lib/logger', () => ({ logger }));
  jest.doMock('../lib/alerts', () => ({ reportQueueMetrics, notifyQueueDeadLetter }));
  jest.doMock('../lib/redis', () => ({
    createRedisConnection: jest.fn(() => ({
      quit: jest.fn().mockResolvedValue(),
      duplicate: jest.fn(),
      on: jest.fn().mockReturnThis()
    })),
    getSharedRedisClient: jest.fn(),
    closeAllRedisConnections: jest.fn()
  }));

  // eslint-disable-next-line global-require
  const durableQueue = require('../lib/durableQueue');
  return { ...durableQueue, logger, reportQueueMetrics, notifyQueueDeadLetter };
}

describe('durableQueue in-memory behaviour', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv(), NODE_ENV: 'test' };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  it('captures queue metrics using the alerts reporter', async () => {
    const { createDurableQueue, reportQueueMetrics } = loadDurableQueue();
    const queue = createDurableQueue('emails', async () => undefined);

    await queue.addJob({ type: 'welcome' });

    const metrics = await queue.getMetrics();

    expect(metrics.counts).toEqual(expect.objectContaining({ waiting: 1, failed: 0 }));
    expect(reportQueueMetrics).toHaveBeenCalledWith(
      'emails',
      expect.objectContaining({ counts: expect.objectContaining({ waiting: 1 }) })
    );
  });

  it('moves exhausted jobs to the dead-letter queue and notifies alerts', async () => {
    const failure = new Error('boom');
    const { createDurableQueue, notifyQueueDeadLetter } = loadDurableQueue();
    const processor = jest.fn().mockRejectedValue(failure);

    const queue = createDurableQueue('critical', processor, { defaultJobOptions: { attempts: 1 } });
    const failureHandler = jest.fn();
    queue.worker.on('failed', failureHandler);

    const job = await queue.addJob({ payload: true }, { attempts: 1 });
    job.waitUntilFinished().catch(() => {});

    try {
      await job.promote();
      throw new Error('expected job to fail');
    } catch (error) {
      expect(error).toBe(failure);
    }

    expect(failureHandler).toHaveBeenCalledWith(expect.objectContaining({ id: job.id }), failure);
    expect(notifyQueueDeadLetter).toHaveBeenCalledWith(
      'critical',
      expect.objectContaining({
        jobId: job.id,
        attemptsMade: 1,
        failedReason: 'boom'
      })
    );
  });

  it('records close failures and continues shutting down remaining queues', async () => {
    const { createDurableQueue, closeAllQueues, logger } = loadDurableQueue();
    const queue = createDurableQueue('closing', async () => undefined);
    queue.close = jest.fn().mockRejectedValue(new Error('close-failed'));

    await closeAllQueues();

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ err: expect.any(Error), queue: 'closing' }),
      'Failed to close queue'
    );
  });
});
