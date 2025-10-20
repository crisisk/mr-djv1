function setupLoggerMock() {
  const childLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(() => childLogger)
  };

  const rootLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(() => childLogger)
  };

  jest.doMock('../lib/logger', () => ({
    logger: rootLogger
  }));

  return { rootLogger, childLogger };
}

describe('rateLimiter middleware', () => {
  let rateLimiter;
  let loggerMocks;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    loggerMocks = setupLoggerMock();
    jest.doMock('../config', () => ({
      rateLimit: { windowMs: 100, max: 2 }
    }));
    rateLimiter = require('../middleware/rateLimiter');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetModules();
    jest.clearAllMocks();
  });

  function createRequest(ip = '127.0.0.1') {
    return { ip };
  }

  function createResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  }

  it('allows requests within the configured window', () => {
    const req = createRequest();
    const res = createResponse();
    const next = jest.fn();

    rateLimiter(req, res, next);
    rateLimiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('blocks requests that exceed the limit and recovers after the window', () => {
    const req = createRequest('10.0.0.1');
    const res = createResponse();
    const next = jest.fn();

    rateLimiter(req, res, next);
    rateLimiter(req, res, next);
    rateLimiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Too many requests',
      retryAfter: expect.any(Number)
    });
    expect(loggerMocks.rootLogger.child).toHaveBeenCalledWith(
      expect.objectContaining({ middleware: 'rateLimiter', identifier: '10.0.0.1' })
    );
    expect(loggerMocks.childLogger.warn).toHaveBeenCalledWith(
      'Rate limit exceeded',
      expect.objectContaining({ retryAfterSeconds: expect.any(Number) })
    );

    jest.advanceTimersByTime(150);
    res.status.mockClear();
    res.json.mockClear();

    rateLimiter(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(3);
  });
});

describe('error handlers', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('returns JSON responses with stack traces outside production', () => {
    const loggerMocks = setupLoggerMock();
    jest.doMock('../config', () => ({ env: 'development' }));

    const { errorHandler, notFoundHandler } = require('../middleware/errors');

    const notFoundRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    notFoundHandler({ path: '/missing' }, notFoundRes);
    expect(notFoundRes.status).toHaveBeenCalledWith(404);
    expect(notFoundRes.json).toHaveBeenCalledWith({ error: 'Endpoint not found', path: '/missing' });

    const err = new Error('kapot');
    err.status = 418;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorHandler(err, { method: 'GET', originalUrl: '/test' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Internal server error',
      message: 'kapot',
      stack: expect.any(String)
    }));
    expect(loggerMocks.rootLogger.child).toHaveBeenCalledWith(
      expect.objectContaining({ middleware: 'errorHandler', method: 'GET', path: '/test' })
    );
    expect(loggerMocks.childLogger.warn).toHaveBeenCalledWith(
      'Client error handled',
      expect.objectContaining({ err })
    );
    expect(loggerMocks.childLogger.error).not.toHaveBeenCalled();
  });

  it('hides stack traces and logs server errors in production', () => {
    const loggerMocks = setupLoggerMock();
    jest.doMock('../config', () => ({ env: 'production' }));

    const { errorHandler } = require('../middleware/errors');

    const err = new Error('kapot');
    err.status = 500;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorHandler(err, { method: 'POST', originalUrl: '/broken' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(loggerMocks.childLogger.error).toHaveBeenCalledWith(
      'Unhandled server error',
      expect.objectContaining({ err })
    );
  });

  it('returns a helpful message for JSON parse errors', () => {
    const loggerMocks = setupLoggerMock();
    jest.doMock('../config', () => ({ env: 'production' }));
    const { errorHandler } = require('../middleware/errors');

    const err = new Error('Unexpected token');
    err.type = 'entity.parse.failed';
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorHandler(err, { method: 'POST', originalUrl: '/contact' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ongeldige JSON payload',
      details: 'Controleer of de JSON body correct is geformatteerd.'
    });
    expect(loggerMocks.childLogger.error).toHaveBeenCalledWith(
      'Unhandled server error',
      expect.objectContaining({ err })
    );
  });
});

describe('dashboard auth middleware', () => {
  function createResponse() {
    return {
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  }

  afterEach(() => {
    jest.resetModules();
  });

  function loadMiddleware(overrides = {}) {
    setupLoggerMock();
    jest.doMock('../config', () => ({
      dashboard: {
        enabled: true,
        username: 'admin',
        password: 'secret',
        allowedIps: [],
        ...overrides.dashboard
      }
    }));

    return require('../middleware/dashboardAuth');
  }

  it('returns 404 when the dashboard is disabled', () => {
    const dashboardAuth = loadMiddleware({ dashboard: { enabled: false } });
    const res = createResponse();
    dashboardAuth({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Config dashboard disabled' });
  });

  it('requires basic auth credentials', () => {
    const dashboardAuth = loadMiddleware();
    const res = createResponse();

    dashboardAuth({ headers: {} }, res, jest.fn());

    expect(res.set).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="Config Dashboard"');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('rejects malformed credentials and mismatched users', () => {
    const dashboardAuth = loadMiddleware();
    const res = createResponse();
    const next = jest.fn();

    dashboardAuth({ headers: { authorization: 'Basic !!!' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);

    res.status.mockClear();
    res.json.mockClear();
    res.set.mockClear();

    const badUser = Buffer.from('other:secret').toString('base64');
    dashboardAuth({ headers: { authorization: `Basic ${badUser}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('enforces allowed IPs and normalizes IPv6 addresses', () => {
    const dashboardAuth = loadMiddleware({
      dashboard: { allowedIps: ['127.0.0.1', '10.0.0.1'] }
    });
    const res = createResponse();
    const next = jest.fn();

    dashboardAuth(
      {
        headers: {
          authorization: `Basic ${Buffer.from('admin:secret').toString('base64')}`
        },
        ip: '192.168.0.1'
      },
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });

    res.status.mockClear();
    res.json.mockClear();

    dashboardAuth(
      {
        headers: {
          authorization: `Basic ${Buffer.from('admin:secret').toString('base64')}`
        },
        ip: '::ffff:127.0.0.1'
      },
      res,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);

    const nextFromConnection = jest.fn();
    dashboardAuth(
      {
        headers: {
          authorization: `Basic ${Buffer.from('admin:secret').toString('base64')}`
        },
        connection: { remoteAddress: '::ffff:10.0.0.1' }
      },
      res,
      nextFromConnection
    );

    expect(nextFromConnection).toHaveBeenCalledTimes(1);
  });
});
