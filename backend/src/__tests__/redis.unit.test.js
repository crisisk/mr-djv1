const ORIGINAL_ENV = { ...process.env };

describe('redis connection helpers', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  it('constructs TLS-enabled options when redis TLS is configured', () => {
    process.env.NODE_ENV = 'production';

    const quitMock = jest.fn().mockResolvedValue();
    const IORedisMock = jest.fn(function IORedis(url, options) {
      this.url = url;
      this.options = options;
      this.status = 'ready';
      this.quit = quitMock;
      this.on = jest.fn().mockReturnThis();
      this.duplicate = jest.fn(() => new IORedisMock(url, options));
    });

    jest.doMock('../config', () => ({
      redis: {
        url: 'rediss://cache.example/0',
        namespace: 'mr-dj',
        tls: true,
        tlsRejectUnauthorized: false
      }
    }));
    jest.doMock('ioredis', () => IORedisMock);

    // eslint-disable-next-line global-require
    const redis = require('../lib/redis');

    const client = redis.createRedisConnection();
    expect(IORedisMock).toHaveBeenCalledWith(
      'rediss://cache.example/0',
      expect.objectContaining({
        url: 'rediss://cache.example/0',
        tls: { rejectUnauthorized: false },
        lazyConnect: true,
        enableReadyCheck: false
      })
    );

    return redis.closeAllRedisConnections().then(() => {
      expect(quitMock).toHaveBeenCalled();
      expect(client.options.tls.rejectUnauthorized).toBe(false);
    });
  });

  it('returns mock clients when redis is disabled', async () => {
    process.env.NODE_ENV = 'production';

    jest.doMock('../config', () => ({ redis: { url: null } }));
    jest.doMock('ioredis', () => jest.fn());

    const redis = require('../lib/redis');

    const client = redis.createRedisConnection();
    expect(client.status).toBe('end');
    await client.connect();
    expect(client.status).toBe('ready');
  });

  it('handles shared client connection failures gracefully', async () => {
    process.env.NODE_ENV = 'production';
    const connectError = new Error('connect failed');

    const IORedisMock = jest.fn(function IORedis(url, options) {
      this.url = url;
      this.options = options;
      this.status = 'end';
      this.connect = jest.fn().mockRejectedValue(connectError);
      this.quit = jest.fn().mockResolvedValue();
      this.on = jest.fn().mockReturnThis();
      this.duplicate = jest.fn(() => new IORedisMock(url, options));
    });

    jest.doMock('../config', () => ({
      redis: { url: 'redis://cache.example/0', namespace: 'mr-dj', tls: false }
    }));
    jest.doMock('ioredis', () => IORedisMock);

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const redis = require('../lib/redis');
    const client = await redis.getSharedRedisClient();

    expect(client).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('[redis] Failed to connect', connectError);

    consoleError.mockRestore();
  });
});
