describe('rateLimiter middleware', () => {
  let rateLimiter;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
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
    jest.doMock('../config', () => ({ env: 'development' }));
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

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
    expect(consoleWarn).toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('hides stack traces and logs server errors in production', () => {
    jest.doMock('../config', () => ({ env: 'production' }));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { errorHandler } = require('../middleware/errors');

    const err = new Error('kapot');
    err.status = 500;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorHandler(err, { method: 'POST', originalUrl: '/broken' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(consoleError).toHaveBeenCalled();
  });

  it('returns a helpful message for JSON parse errors', () => {
    jest.doMock('../config', () => ({ env: 'production' }));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
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
    expect(consoleError).toHaveBeenCalled();
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
