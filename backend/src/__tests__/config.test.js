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
    expect(config.integrations.rentGuy).toEqual({
      enabled: false,
      baseUrl: null,
      workspaceId: null,
      timeoutMs: 5000
    });
    expect(config.personalization).toEqual({ automationWebhook: null });
    expect(config.dashboard.enabled).toBe(false);
    expect(config.dashboard.username).toBeNull();
    expect(config.dashboard.password).toBeNull();
    expect(config.dashboard.allowedIps).toEqual([]);
    expect(config.dashboard.managedKeys).toEqual([
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
      'PGSSLMODE',
      'MAIL_PROVIDER',
      'MAIL_API_KEY',
      'MAIL_FROM_ADDRESS',
      'MAIL_REPLY_TO',
      'MAIL_TEMPLATES_CONTACT',
      'MAIL_TEMPLATES_BOOKING',
      'RENTGUY_API_BASE_URL',
      'RENTGUY_API_KEY',
      'RENTGUY_WORKSPACE_ID',
      'RENTGUY_TIMEOUT_MS',
      'N8N_PERSONALIZATION_WEBHOOK_URL'
    ]);
    expect(config.dashboard.sections).toEqual([
      expect.objectContaining({
        id: 'application',
        label: 'Applicatie instellingen',
        keys: [
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
        ]
      }),
      expect.objectContaining({
        id: 'mail',
        label: 'E-mailintegratie',
        keys: [
          'MAIL_PROVIDER',
          'MAIL_API_KEY',
          'MAIL_FROM_ADDRESS',
          'MAIL_REPLY_TO',
          'MAIL_TEMPLATES_CONTACT',
          'MAIL_TEMPLATES_BOOKING'
        ]
      }),
      expect.objectContaining({
        id: 'rentguy',
        label: 'RentGuy integratie',
        keys: [
          'RENTGUY_API_BASE_URL',
          'RENTGUY_API_KEY',
          'RENTGUY_WORKSPACE_ID',
          'RENTGUY_TIMEOUT_MS'
        ]
      }),
      expect.objectContaining({
        id: 'personalization',
        label: 'Personalization & CRO',
        keys: ['N8N_PERSONALIZATION_WEBHOOK_URL']
      })
    ]);
    expect(config.dashboard.storePath).toBe(DEFAULT_STORE_PATH);
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
    expect(config.integrations.rentGuy).toEqual({
      enabled: false,
      baseUrl: null,
      workspaceId: null,
      timeoutMs: 5000
    });
    expect(config.dashboard.enabled).toBe(true);
    expect(config.dashboard.username).toBe('admin');
    expect(config.dashboard.password).toBe('secret');
    expect(config.dashboard.allowedIps).toEqual(['127.0.0.1', '10.0.0.1']);
    expect(config.dashboard.managedKeys).toEqual(['PORT', 'DATABASE_URL']);
    expect(config.dashboard.sections).toEqual([
      expect.objectContaining({
        id: 'application',
        keys: ['PORT', 'DATABASE_URL']
      })
    ]);
    expect(config.dashboard.storePath).toBe(path.resolve(process.cwd(), tmpPath));
  });

  it('exposes personalization automation webhook when configured', () => {
    process.env = {
      N8N_PERSONALIZATION_WEBHOOK_URL: 'https://n8n.test/webhook/personalization'
    };

    const config = loadConfig();

    expect(config.personalization).toEqual({
      automationWebhook: 'https://n8n.test/webhook/personalization'
    });
    const personalizationSection = config.dashboard.sections.find(
      (section) => section.id === 'personalization'
    );
    expect(personalizationSection).toBeDefined();
    expect(personalizationSection.keys).toContain('N8N_PERSONALIZATION_WEBHOOK_URL');
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

  it('reloads configuration, copies arrays/objects and removes stale keys', () => {
    process.env = {
      CONFIG_DASHBOARD_ENABLED: 'true',
      CONFIG_DASHBOARD_USER: 'admin',
      CONFIG_DASHBOARD_PASS: 'secret',
      CONFIG_DASHBOARD_KEYS: 'PORT,CUSTOM_KEY',
      CUSTOM_KEY: 'value',
      CORS_ORIGIN: ' , , '
    };

    const config = loadConfig();
    expect(config.cors.origin).toBe('*');
    const customSection = config.dashboard.sections.find((section) => section.id === 'custom');
    expect(customSection).toBeDefined();
    expect(customSection.keys).toEqual(['CUSTOM_KEY']);

    config.temporary = 'remove-me';

    process.env.CONFIG_DASHBOARD_KEYS = 'PORT';
    delete process.env.CUSTOM_KEY;

    const reloaded = config.reload();

    expect(reloaded.dashboard.managedKeys).toEqual(['PORT']);
    expect(reloaded.dashboard.sections.find((section) => section.id === 'custom')).toBeUndefined();
    expect(reloaded.cors.origin).toBe('*');
    expect(reloaded.temporary).toBeUndefined();
  });
});
