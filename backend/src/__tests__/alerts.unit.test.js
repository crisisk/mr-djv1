const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };

function loadAlerts(configOverrides = {}) {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const baseConfig = {
    alerts: {
      webhooks: ['https://alerts.example/primary', 'https://alerts.example/secondary'],
      throttleMs: 60000,
      queue: {
        warningBacklog: 10,
        criticalBacklog: 25,
        warningRetryAgeMs: 60000,
        criticalRetryAgeMs: 300000,
        deadLetterWarning: 2
      }
    }
  };

  jest.doMock('../config', () => ({
    ...baseConfig,
    ...configOverrides
  }));

  jest.doMock('../lib/logger', () => ({ logger }));

  // eslint-disable-next-line global-require
  const alerts = require('../lib/alerts');
  return { ...alerts, logger };
}

describe('alerts library', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv(), NODE_ENV: 'test' };
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.fetch;
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  it('sends degradation and recovery alerts while honoring throttle windows', async () => {
    const { reportQueueMetrics } = loadAlerts();

    await reportQueueMetrics('emails', {
      counts: { waiting: 12, delayed: 0, failed: 0 },
      retryAgeP95: 0
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload).toMatchObject({
      severity: 'warning',
      queue: 'emails',
      details: expect.objectContaining({
        reason: 'backlog',
        backlog: 12,
        backlogDescription: '12 jobs'
      })
    });

    global.fetch.mockClear();

    await reportQueueMetrics('emails', {
      counts: { waiting: 12, delayed: 0, failed: 0 },
      retryAgeP95: 0
    });
    expect(global.fetch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(61000);

    await reportQueueMetrics('emails', {
      counts: { waiting: 0, delayed: 0, failed: 0 },
      retryAgeP95: 0
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const recovery = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(recovery).toMatchObject({
      severity: 'recovery',
      summary: 'Queue metrics recovered',
      details: expect.objectContaining({ backlog: 0, retryAge: 0 })
    });
  });

  it('logs warnings when webhooks respond with non-2xx status codes', async () => {
    const { reportQueueMetrics, logger } = loadAlerts();
    global.fetch.mockResolvedValue({ ok: false, status: 503 });

    await reportQueueMetrics('queue', {
      counts: { waiting: 15, delayed: 0, failed: 0 },
      retryAgeP95: 0
    });

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://alerts.example/primary', status: 503 }),
      'Alert webhook responded with non-2xx status'
    );
  });

  it('logs errors when webhook dispatch fails', async () => {
    const { reportQueueMetrics, logger } = loadAlerts();
    global.fetch.mockRejectedValue(new Error('network down'));

    await reportQueueMetrics('queue', {
      counts: { waiting: 15, delayed: 0, failed: 0 },
      retryAgeP95: 0
    });

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        err: expect.any(Error),
        url: 'https://alerts.example/primary'
      }),
      'Failed to dispatch alert webhook'
    );
  });

  it('sends dead-letter notifications with job context and throttling', async () => {
    const { notifyQueueDeadLetter } = loadAlerts();

    const entry = {
      jobId: 'job-123',
      attemptsMade: 5,
      failedReason: 'timeout'
    };

    await notifyQueueDeadLetter('emails', entry);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    let payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload).toMatchObject({
      severity: 'critical',
      details: expect.objectContaining({
        reason: 'dead-letter',
        jobId: 'job-123',
        attemptsMade: 5
      })
    });

    global.fetch.mockClear();
    await notifyQueueDeadLetter('emails', entry);
    expect(global.fetch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(61000);
    await notifyQueueDeadLetter('emails', entry);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload.details).toEqual(expect.objectContaining({ jobId: 'job-123' }));
  });
});
