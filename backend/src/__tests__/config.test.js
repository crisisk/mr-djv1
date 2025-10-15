const path = require('path');
const { DEFAULT_STORE_PATH } = require('../lib/managedEnv');

const ORIGINAL_ENV = { ...process.env };

function loadConfig() {
  jest.resetModules();
  return require('../config');
}

describe('config', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('uses safe defaults when environment variables are missing', () => {
    process.env = {};
    const config = loadConfig();

    expect(config.port).toBe(3000);
    expect(config.host).toBe('0.0.0.0');
    expect(config.cors).toEqual({ origin: '*', credentials: false });
    expect(config.rateLimit).toEqual({ windowMs: 15 * 60 * 1000, max: 100 });
    expect(config.logging).toBe('dev');
    expect(config.databaseUrl).toBeUndefined();
    expect(config.serviceName).toBe('mr-dj-backend');
    expect(config.version).toBe('1.0.0');
    expect(config.dashboard).toEqual({
      enabled: false,
      username: null,
      password: null,
      allowedIps: [],
      managedKeys: [
        'NODE_ENV',
        'HOST',
        'PORT',
        'SERVICE_NAME',
        'LOG_FORMAT',
        'CORS_ORIGIN',
        'RATE_LIMIT_WINDOW_MS',
        'RATE_LIMIT_MAX',
        'DATABASE_URL',
        'REDIS_URL',
        'PGSSLMODE'
      ],
      storePath: DEFAULT_STORE_PATH
    });
  });

  it('parses numeric and list based configuration values', () => {
    const tmpPath = path.join(__dirname, '..', '..', 'tmp-manual.env');
    process.env = {
      PORT: '8080',
      HOST: '127.0.0.1',
      CORS_ORIGIN: 'https://example.com, https://studio.test',
      RATE_LIMIT_WINDOW_MS: '60000',
      RATE_LIMIT_MAX: '5',
      LOG_FORMAT: 'combined',
      DATABASE_URL: 'postgres://example',
      REDIS_URL: 'redis://cache',
      SERVICE_NAME: 'custom-service',
      npm_package_version: '2.3.4',
      CONFIG_DASHBOARD_ENABLED: 'true',
      CONFIG_DASHBOARD_USER: 'admin',
      CONFIG_DASHBOARD_PASS: 'secret',
      CONFIG_DASHBOARD_ALLOWED_IPS: '127.0.0.1,10.0.0.1',
      CONFIG_DASHBOARD_KEYS: 'PORT,DATABASE_URL',
      CONFIG_DASHBOARD_STORE_PATH: tmpPath
    };

    const config = loadConfig();

    expect(config.port).toBe(8080);
    expect(config.host).toBe('127.0.0.1');
    expect(config.cors.origin).toEqual(['https://example.com', 'https://studio.test']);
    expect(config.cors.credentials).toBe(true);
    expect(config.rateLimit.windowMs).toBe(60000);
    expect(config.rateLimit.max).toBe(5);
    expect(config.logging).toBe('combined');
    expect(config.databaseUrl).toBe('postgres://example');
    expect(config.redisUrl).toBe('redis://cache');
    expect(config.serviceName).toBe('custom-service');
    expect(config.version).toBe('2.3.4');
    expect(config.dashboard).toEqual({
      enabled: true,
      username: 'admin',
      password: 'secret',
      allowedIps: ['127.0.0.1', '10.0.0.1'],
      managedKeys: ['PORT', 'DATABASE_URL'],
      storePath: path.resolve(process.cwd(), tmpPath)
    });
  });

  it('supports wildcard CORS configuration', () => {
    process.env = {
      CORS_ORIGIN: ' * ',
      RATE_LIMIT_WINDOW_MS: 'not-a-number',
      RATE_LIMIT_MAX: '-1'
    };

    const config = loadConfig();

    expect(config.cors.origin).toBe('*');
    expect(config.cors.credentials).toBe(false);
    expect(config.rateLimit.windowMs).toBe(15 * 60 * 1000);
    expect(config.rateLimit.max).toBe(100);
  });
});
