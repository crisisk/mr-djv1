const path = require('path');
const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
const BASE_ENV = buildRequiredEnv();

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

  it('throws descriptive errors when required environment variables are missing', () => {
    const env = { ...BASE_ENV };
    delete env.RENTGUY_API_BASE_URL;
    process.env = env;

    expect(() => loadConfig()).toThrow(
      'Missing required environment variable "RENTGUY_API_BASE_URL" for RentGuy integration (RENTGUY_API_BASE_URL and RENTGUY_API_KEY).'
    );
  });

  it('parses numeric and list based configuration values', () => {
    const tmpPath = path.join(__dirname, '..', '..', 'tmp-manual.env');
    process.env = buildRequiredEnv({
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
      CONFIG_DASHBOARD_STORE_PATH: tmpPath,
      ALERT_WEBHOOK_URLS: 'https://hooks.example/alert, https://hooks.example/backup',
      ALERT_THROTTLE_MS: '30000',
      ALERT_QUEUE_WARNING_BACKLOG: '10',
      ALERT_QUEUE_CRITICAL_BACKLOG: '40',
      ALERT_QUEUE_RECOVERY_BACKLOG: '2',
      ALERT_QUEUE_WARNING_RETRY_AGE_MS: '120000',
      ALERT_QUEUE_CRITICAL_RETRY_AGE_MS: '240000',
      ALERT_QUEUE_RECOVERY_RETRY_AGE_MS: '60000',
      ALERT_QUEUE_DEAD_LETTER_WARNING: '2',
      RENTGUY_TIMEOUT_MS: '7000',
      SEVENSA_QUEUE_RETRY_DELAY_MS: '45000',
      SEVENSA_QUEUE_MAX_ATTEMPTS: '7'
    });

    const config = loadConfig();

    expect(config.port).toBe(8080);
    expect(config.host).toBe('127.0.0.1');
    expect(config.cors.origin).toEqual(['https://example.com', 'https://studio.test']);
    expect(config.cors.credentials).toBe(true);
    expect(config.rateLimit.windowMs).toBe(60000);
    expect(config.rateLimit.max).toBe(5);
    expect(config.logging).toBe('combined');
    expect(config.databaseUrl).toBe('postgres://example');
    expect(config.redis).toEqual(
      expect.objectContaining({
        url: 'redis://cache',
        tls: false,
        namespace: 'mr-dj'
      })
    );
    expect(config.serviceName).toBe('custom-service');
    expect(config.version).toBe('2.3.4');
    expect(config.integrations).toEqual(
      expect.objectContaining({
        rentGuy: {
          enabled: true,
          baseUrl: process.env.RENTGUY_API_BASE_URL,
          workspaceId: process.env.RENTGUY_WORKSPACE_ID,
          timeoutMs: 7000
        },
        sevensa: {
          enabled: true,
          submitUrl: process.env.SEVENSA_SUBMIT_URL,
          retryDelayMs: 45000,
          maxAttempts: 7
        }
      })
    );
    expect(config.personalization).toEqual({
      automationWebhook: process.env.N8N_PERSONALIZATION_WEBHOOK_URL
    });
    expect(config.alerts.webhooks).toEqual([
      'https://hooks.example/alert',
      'https://hooks.example/backup'
    ]);
    expect(config.alerts.throttleMs).toBe(30000);
    expect(config.alerts.queue).toEqual({
      warningBacklog: 10,
      criticalBacklog: 40,
      recoveryBacklog: 2,
      warningRetryAgeMs: 120000,
      criticalRetryAgeMs: 240000,
      recoveryRetryAgeMs: 60000,
      deadLetterWarning: 2
    });
    expect(config.dashboard.enabled).toBe(true);
    expect(config.dashboard.username).toBe('admin');
    expect(config.dashboard.password).toBe('secret');
    expect(config.dashboard.allowedIps).toEqual(['127.0.0.1', '10.0.0.1']);
    expect(config.dashboard.managedKeys).toEqual(['PORT', 'DATABASE_URL']);
    const sections = config.dashboard.sections.map((section) => section.id);
    expect(sections).toEqual(['application']);
    expect(config.dashboard.storePath).toBe(path.resolve(process.cwd(), tmpPath));
  });

  it('exposes personalization automation webhook when configured', () => {
    process.env = { ...BASE_ENV };

    const config = loadConfig();

    expect(config.personalization).toEqual({
      automationWebhook: BASE_ENV.N8N_PERSONALIZATION_WEBHOOK_URL
    });
    const personalizationSection = config.dashboard.sections.find(
      (section) => section.id === 'personalization'
    );
    expect(personalizationSection).toBeDefined();
    expect(personalizationSection.keys).toContain('N8N_PERSONALIZATION_WEBHOOK_URL');
  });

  it('supports wildcard CORS configuration', () => {
    process.env = buildRequiredEnv({
      CORS_ORIGIN: ' * ',
      RATE_LIMIT_WINDOW_MS: 'not-a-number',
      RATE_LIMIT_MAX: '-1'
    });

    const config = loadConfig();

    expect(config.cors.origin).toBe('*');
    expect(config.cors.credentials).toBe(false);
    expect(config.rateLimit.windowMs).toBe(15 * 60 * 1000);
    expect(config.rateLimit.max).toBe(100);
  });

  it('exposes automation configuration for the city content workflow', () => {
    process.env = buildRequiredEnv({
      SEO_AUTOMATION_API_URL: 'https://seo.internal/keywords',
      SEO_AUTOMATION_API_KEY: 'token',
      SEO_AUTOMATION_KEYWORDSET_ID: 'brabant',
      SEO_AUTOMATION_REGION: 'Noord-Brabant',
      SEO_AUTOMATION_THEME_KEYWORDS: 'dj, feest',
      SEO_AUTOMATION_APPROVAL_EMAIL: 'marketing@mr-dj.nl',
      CITY_AUTOMATION_LLM_PROVIDER: 'openai',
      CITY_AUTOMATION_LLM_MODEL: 'gpt-4.1-mini',
      CITY_AUTOMATION_LLM_API_KEY: 'openai-key',
      CITY_AUTOMATION_DRY_RUN: 'true'
    });

    const config = loadConfig();

    expect(config.automation).toEqual({
      seo: {
        apiUrl: 'https://seo.internal/keywords',
        keywordSetId: 'brabant',
        region: 'Noord-Brabant',
        themeKeywords: ['dj', 'feest']
      },
      llm: {
        provider: 'openai',
        model: 'gpt-4.1-mini',
        apiKeyConfigured: true
      },
      approvals: {
        email: 'marketing@mr-dj.nl'
      },
      dryRun: true
    });

    const automationSection = config.dashboard.sections.find((section) => section.id === 'automation');
    expect(automationSection).toBeDefined();
    expect(automationSection.keys).toContain('SEO_AUTOMATION_API_URL');
    expect(config.dashboard.managedKeys).toEqual(expect.arrayContaining(['CITY_AUTOMATION_LLM_MODEL']));
  });

  it('reloads configuration, copies arrays/objects and removes stale keys', () => {
    process.env = buildRequiredEnv({
      CONFIG_DASHBOARD_ENABLED: 'true',
      CONFIG_DASHBOARD_USER: 'admin',
      CONFIG_DASHBOARD_PASS: 'secret',
      CONFIG_DASHBOARD_KEYS: 'PORT,CUSTOM_KEY',
      CUSTOM_KEY: 'value',
      CORS_ORIGIN: ' , , '
    });

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

  it('requires at least one automation API key', () => {
    const env = buildRequiredEnv();
    delete env.CITY_AUTOMATION_LLM_API_KEY;
    delete env.OPENAI_API_KEY;
    process.env = env;

    expect(() => loadConfig()).toThrow(
      'Missing required environment variable "CITY_AUTOMATION_LLM_API_KEY" for city content automation LLM access (provide CITY_AUTOMATION_LLM_API_KEY or OPENAI_API_KEY).'
    );
  });
});
