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
    expect(config.integrations).toEqual(
      expect.objectContaining({
        rentGuy: {
          enabled: false,
          baseUrl: null,
          workspaceId: null,
          timeoutMs: 5000
        },
        sevensa: {
          enabled: false,
          submitUrl: null,
          retryDelayMs: 15000,
          maxAttempts: 5
        }
      })
    );
    expect(config.personalization).toEqual({ automationWebhook: null });
    expect(config.alerts).toEqual({
      webhooks: [],
      throttleMs: 2 * 60 * 1000,
      queue: {
        warningBacklog: 25,
        criticalBacklog: 75,
        recoveryBacklog: 5,
        warningRetryAgeMs: 5 * 60 * 1000,
        criticalRetryAgeMs: 15 * 60 * 1000,
        recoveryRetryAgeMs: 2 * 60 * 1000,
        deadLetterWarning: 1
      }
    });
    expect(config.dashboard.enabled).toBe(false);
    expect(config.dashboard.username).toBeNull();
    expect(config.dashboard.password).toBeNull();
    expect(config.dashboard.allowedIps).toEqual([]);
    expect(config.dashboard.managedKeys).toEqual(
      expect.arrayContaining([
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
        'REDIS_TLS',
        'REDIS_NAMESPACE',
        'REDIS_TLS_REJECT_UNAUTHORIZED',
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
        'SEVENSA_SUBMIT_URL',
        'SEVENSA_QUEUE_RETRY_DELAY_MS',
        'SEVENSA_QUEUE_MAX_ATTEMPTS',
        'N8N_PERSONALIZATION_WEBHOOK_URL',
        'FEATURE_PERSONALIZATION',
        'SEO_AUTOMATION_API_URL',
        'SEO_AUTOMATION_API_KEY',
        'SEO_AUTOMATION_KEYWORDSET_ID',
        'FEATURE_AUTOMATION',
        'CITY_AUTOMATION_LLM_PROVIDER',
        'CITY_AUTOMATION_LLM_MODEL'
      ])
    );
    expect(config.dashboard.sections).toEqual([
      expect.objectContaining({
        id: 'application',
        label: 'Applicatie instellingen',
        description: 'Basisconfiguratie voor runtime gedrag, databaseverbindingen en rate limiting voor de API.',
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
          'REDIS_TLS',
          'REDIS_NAMESPACE',
          'REDIS_TLS_REJECT_UNAUTHORIZED',
          'PGSSLMODE'
        ]
      }),
      expect.objectContaining({
        id: 'mail',
        label: 'E-mailintegratie',
        description:
          'Credentials, afzender en templaten voor transactionele mails richting klanten en interne teams.',
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
        description:
          'API-parameters voor de synchronisatie van leads en boekingen richting de RentGuy applicatie.',
        keys: [
          'RENTGUY_API_BASE_URL',
          'RENTGUY_API_KEY',
          'RENTGUY_WORKSPACE_ID',
          'RENTGUY_TIMEOUT_MS'
        ]
      }),
      expect.objectContaining({
        id: 'content-automation',
        label: 'Automation & CRM',
        description: 'Instellingen voor Sevensa submit URL, retry-logica en queue-monitoring richting n8n en RentGuy.',
        keys: [
          'SEVENSA_SUBMIT_URL',
          'SEVENSA_QUEUE_RETRY_DELAY_MS',
          'SEVENSA_QUEUE_MAX_ATTEMPTS'
        ]
      }),
      expect.objectContaining({
        id: 'personalization',
        label: 'Personalization & CRO',
        description:
          'Webhook en toggles voor keyword-gedreven personalisatie, CRO-analytics en n8n automatiseringen.',
        keys: ['N8N_PERSONALIZATION_WEBHOOK_URL', 'FEATURE_PERSONALIZATION']
      }),
      expect.objectContaining({
        id: 'automation',
        label: 'Content automatisering',
        description: 'SEO keyword ingest, LLM-configuratie en reviewkanalen voor de interne city page generator.',
        keys: [
          'FEATURE_AUTOMATION',
          'SEO_AUTOMATION_API_URL',
          'SEO_AUTOMATION_API_KEY',
          'SEO_AUTOMATION_KEYWORDSET_ID',
          'SEO_AUTOMATION_REGION',
          'SEO_AUTOMATION_THEME_KEYWORDS',
          'SEO_AUTOMATION_APPROVAL_EMAIL',
          'CITY_AUTOMATION_LLM_PROVIDER',
          'CITY_AUTOMATION_LLM_MODEL',
          'CITY_AUTOMATION_LLM_API_KEY',
          'CITY_AUTOMATION_DRY_RUN'
        ]
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
      CONFIG_DASHBOARD_STORE_PATH: tmpPath,
      ALERT_WEBHOOK_URLS: 'https://hooks.example/alert, https://hooks.example/backup',
      ALERT_THROTTLE_MS: '30000',
      ALERT_QUEUE_WARNING_BACKLOG: '10',
      ALERT_QUEUE_CRITICAL_BACKLOG: '40',
      ALERT_QUEUE_RECOVERY_BACKLOG: '2',
      ALERT_QUEUE_WARNING_RETRY_AGE_MS: '120000',
      ALERT_QUEUE_CRITICAL_RETRY_AGE_MS: '240000',
      ALERT_QUEUE_RECOVERY_RETRY_AGE_MS: '60000',
      ALERT_QUEUE_DEAD_LETTER_WARNING: '2'
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
          enabled: false,
          baseUrl: null,
          workspaceId: null,
          timeoutMs: 5000
        },
        sevensa: {
          enabled: false,
          submitUrl: null,
          retryDelayMs: 15000,
          maxAttempts: 5
        }
      })
    );
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

  it('exposes automation configuration for the city content workflow', () => {
    process.env = {
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
    };

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
    expect(config.dashboard.managedKeys).toContain('CITY_AUTOMATION_LLM_MODEL');
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
