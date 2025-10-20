const path = require('path');
const { buildRequiredEnv } = require('../testUtils/env');
const { DEFAULT_STORE_PATH } = require('../lib/managedEnv');

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
      "Missing required environment variable \"RENTGUY_API_BASE_URL\" for RentGuy integration (RENTGUY_API_BASE_URL and RENTGUY_API_KEY)."
    );
  });

  it('loads configuration with defaults', () => {
    process.env = { ...BASE_ENV };

    const config = loadConfig();

    expect(config.port).toBe(3000);
    expect(config.host).toBe('0.0.0.0');
    expect(config.cors.origin).toEqual([
      'https://*.netlify.app',
      'https://*.netlify.com',
      'https://netlify.app',
      'https://app.netlify.com',
      'https://api.netlify.com'
    ]);
    expect(config.cors.credentials).toBe(false);
    expect(config.cors.methods).toEqual(['GET', 'HEAD', 'OPTIONS']);
    expect(config.cors.allowCredentialsOrigins).toEqual([]);
    expect(config.cors.publicOrigins).toEqual(config.cors.origin);
    expect(config.security).toEqual({
      referrerPolicy: 'strict-origin-when-cross-origin',
      csp: { directives: {} },
      hsts: { maxAge: 60 * 60 * 24 * 180, includeSubDomains: true, preload: false }
    });
    expect(config.rateLimit).toEqual({ windowMs: 15 * 60 * 1000, max: 100 });
    expect(config.logging).toBe('dev');
    expect(config.databaseUrl).toBe('postgres://test-user:test-pass@localhost:5432/mrdj');
    expect(config.mail).toEqual({
      provider: 'postmark',
      apiKey: 'test-mail-key',
      from: 'noreply@example.com',
      replyTo: 'support@example.com',
      stream: null,
      templates: {
        contact: {},
        booking: {}
      }
    });
    expect(config.serviceName).toBe('mr-dj-backend');
    expect(config.version).toBe('1.0.0');
    expect(config.integrations).toEqual(
      expect.objectContaining({
        rentGuy: {
          enabled: true,
          baseUrl: 'https://rentguy.example/api',
          workspaceId: 'workspace-test',
          timeoutMs: 5000,
          webhookSecrets: []
        },
        sevensa: {
          enabled: true,
          submitUrl: 'https://sevensa.example/submit',
          retryDelayMs: 15000,
          maxAttempts: 5
        },
        hcaptcha: {
          enabled: false,
          siteKey: null,
          secretKey: null,
          verifyUrl: 'https://hcaptcha.com/siteverify'
        }
      })
    );
    expect(config.personalization).toEqual({
      automationWebhook: 'https://n8n.example/webhook',
      incomingWebhookSecrets: []
    });
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
        'CORS_PUBLIC_ORIGINS',
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
        'HCAPTCHA_SITE_KEY',
        'HCAPTCHA_SECRET_KEY',
        'HCAPTCHA_VERIFY_URL',
        'CORS_ORIGIN',
        'CORS_ORIGIN_LIST',
        'CSP_DIRECTIVES',
        'REFERRER_POLICY',
        'HSTS_MAX_AGE',
        'HSTS_INCLUDE_SUBDOMAINS',
        'HSTS_PRELOAD',
        'RENTGUY_API_BASE_URL',
        'RENTGUY_API_KEY',
        'RENTGUY_WORKSPACE_ID',
        'RENTGUY_TIMEOUT_MS',
        'RENTGUY_WEBHOOK_SECRETS',
        'SEVENSA_SUBMIT_URL',
        'SEVENSA_QUEUE_RETRY_DELAY_MS',
        'SEVENSA_QUEUE_MAX_ATTEMPTS',
        'N8N_PERSONALIZATION_WEBHOOK_URL',
        'PERSONALIZATION_WEBHOOK_SECRETS',
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
          'CORS_PUBLIC_ORIGINS',
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
        id: 'security',
        label: 'Beveiliging',
        description: 'Instellingen voor hCaptcha-validatie van formulieren en spam-preventie.',
        keys: [
          'HCAPTCHA_SITE_KEY',
          'HCAPTCHA_SECRET_KEY',
          'HCAPTCHA_VERIFY_URL',
          'CORS_ORIGIN',
          'CORS_ORIGIN_LIST',
          'CSP_DIRECTIVES',
          'REFERRER_POLICY',
          'HSTS_MAX_AGE',
          'HSTS_INCLUDE_SUBDOMAINS',
          'HSTS_PRELOAD'
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
          'RENTGUY_TIMEOUT_MS',
          'RENTGUY_WEBHOOK_SECRETS'
        ]
      }),
      expect.objectContaining({
        id: 'content-automation',
        label: 'Automation & CRM',
        description:
          'Instellingen voor Sevensa submit URL, retry-logica en queue-monitoring richting n8n en RentGuy.',
        keys: ['SEVENSA_SUBMIT_URL', 'SEVENSA_QUEUE_RETRY_DELAY_MS', 'SEVENSA_QUEUE_MAX_ATTEMPTS']
      }),
      expect.objectContaining({
        id: 'personalization',
        label: 'Personalization & CRO',
        description:
          'Webhook en toggles voor keyword-gedreven personalisatie, CRO-analytics en n8n automatiseringen.',
        keys: ['N8N_PERSONALIZATION_WEBHOOK_URL', 'PERSONALIZATION_WEBHOOK_SECRETS']
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
    process.env = buildRequiredEnv({
      PORT: '8080',
      HOST: '127.0.0.1',
      CORS_ORIGIN_LIST: 'https://example.com, https://studio.test',
      RATE_LIMIT_WINDOW_MS: '60000',
      RATE_LIMIT_MAX: '5',
      LOG_FORMAT: 'combined',
      DATABASE_URL: 'postgres://example',
      REDIS_URL: 'redis://cache',
      SERVICE_NAME: 'custom-service',
      npm_package_version: '2.3.4',
      MAIL_PROVIDER: 'postmark',
      MAIL_API_KEY: 'pm-key',
      MAIL_FROM_ADDRESS: 'Mister DJ <noreply@misterdj.nl>',
      MAIL_REPLY_TO: 'crew@misterdj.nl',
      MAIL_STREAM: 'transactional',
      MAIL_TEMPLATES_CONTACT: 'confirmation:tmpl-contact,internal:tmpl-internal',
      MAIL_TEMPLATES_BOOKING: 'customer:tmpl-booking',
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
    expect(config.cors.methods).toEqual(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
    expect(config.cors.allowCredentialsOrigins).toEqual([
      'https://example.com',
      'https://studio.test'
    ]);
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
    expect(config.mail).toEqual({
      provider: 'postmark',
      apiKey: 'pm-key',
      from: 'Mister DJ <noreply@misterdj.nl>',
      replyTo: 'crew@misterdj.nl',
      stream: 'transactional',
      templates: {
        contact: {
          confirmation: 'tmpl-contact',
          internal: 'tmpl-internal'
        },
        booking: {
          customer: 'tmpl-booking'
        }
      }
    });
    expect(config.serviceName).toBe('custom-service');
    expect(config.version).toBe('2.3.4');
    expect(config.integrations).toEqual(
      expect.objectContaining({
        rentGuy: {
          enabled: true,
          baseUrl: 'https://rentguy.example/api',
          workspaceId: 'workspace-test',
          timeoutMs: 7000,
          webhookSecrets: []
        },
        sevensa: {
          enabled: true,
          submitUrl: 'https://sevensa.example/submit',
          retryDelayMs: 45000,
          maxAttempts: 7
        },
        hcaptcha: {
          enabled: false,
          siteKey: null,
          secretKey: null,
          verifyUrl: 'https://hcaptcha.com/siteverify'
        }
      })
    );
    expect(config.personalization).toEqual({
      automationWebhook: process.env.N8N_PERSONALIZATION_WEBHOOK_URL,
      incomingWebhookSecrets: []
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
    process.env = {
      ...BASE_ENV,
      N8N_PERSONALIZATION_WEBHOOK_URL: 'https://n8n.test/webhook/personalization'
    };

    const config = loadConfig();

    expect(config.personalization).toEqual({
      automationWebhook: 'https://n8n.test/webhook/personalization',
      incomingWebhookSecrets: []
    });
    const personalizationSection = config.dashboard.sections.find(
      (section) => section.id === 'personalization'
    );
    expect(personalizationSection).toBeDefined();
    expect(personalizationSection.keys).toContain('N8N_PERSONALIZATION_WEBHOOK_URL');
    expect(personalizationSection.keys).toContain('PERSONALIZATION_WEBHOOK_SECRETS');
  });

  it('allows overriding security headers through environment variables', () => {
    process.env = buildRequiredEnv({
      CORS_ORIGIN_LIST: 'https://secure.example',
      REFERRER_POLICY: 'no-referrer',
      CSP_DIRECTIVES:
        "connect-src 'self' https://secure.example; img-src 'self' https://cdn.example",
      HSTS_MAX_AGE: '31536000',
      HSTS_INCLUDE_SUBDOMAINS: 'false',
      HSTS_PRELOAD: 'true'
    });

    const config = loadConfig();

    expect(config.cors.credentials).toBe(true);
    expect(config.cors.methods).toEqual(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
    expect(config.security.referrerPolicy).toBe('no-referrer');
    expect(config.security.csp.directives).toEqual({
      'connect-src': ["'self'", 'https://secure.example'],
      'img-src': ["'self'", 'https://cdn.example']
    });
    expect(config.security.hsts).toEqual({
      maxAge: 31536000,
      includeSubDomains: false,
      preload: true
    });
  });

  it('supports wildcard CORS configuration for public requests', () => {
    process.env = buildRequiredEnv({
      CORS_PUBLIC_ORIGINS: ' * ',
      RATE_LIMIT_WINDOW_MS: 'not-a-number',
      RATE_LIMIT_MAX: '-1'
    });

    const config = loadConfig();

    expect(config.cors.origin).toBe('*');
    expect(config.cors.publicOrigins).toBe('*');
    expect(config.cors.credentials).toBe(false);
    expect(config.cors.methods).toEqual(['GET', 'HEAD', 'OPTIONS']);
    expect(config.cors.allowCredentialsOrigins).toEqual([]);
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
      CORS_PUBLIC_ORIGINS: ' , , '
    });

    const config = loadConfig();
    expect(config.cors.origin).toEqual([
      'https://*.netlify.app',
      'https://*.netlify.com',
      'https://netlify.app',
      'https://app.netlify.com',
      'https://api.netlify.com'
    ]);
    const customSection = config.dashboard.sections.find((section) => section.id === 'custom');
    expect(customSection).toBeDefined();
    expect(customSection.keys).toEqual(['CUSTOM_KEY']);

    config.temporary = 'remove-me';

    process.env.CONFIG_DASHBOARD_KEYS = 'PORT';
    delete process.env.CUSTOM_KEY;

    const reloaded = config.reload();

    expect(reloaded.dashboard.managedKeys).toEqual(['PORT']);
    expect(reloaded.dashboard.sections.find((section) => section.id === 'custom')).toBeUndefined();
    expect(reloaded.cors.origin).toEqual([
      'https://*.netlify.app',
      'https://*.netlify.com',
      'https://netlify.app',
      'https://app.netlify.com',
      'https://api.netlify.com'
    ]);
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
