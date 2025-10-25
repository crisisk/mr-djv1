const http = require('http');
const { buildRequiredEnv } = require('../testUtils/env');

const REQUIRED_ENV = buildRequiredEnv({
  RENTGUY_API_BASE_URL: 'https://example.com/rentguy',
  RENTGUY_API_KEY: 'test-rentguy-key',
  SEVENSA_SUBMIT_URL: 'https://example.com/sevensa',
  N8N_PERSONALIZATION_WEBHOOK_URL: 'https://example.com/webhook',
  SEO_AUTOMATION_API_URL: 'https://example.com/seo',
  SEO_AUTOMATION_API_KEY: 'test-seo-key',
  SEO_AUTOMATION_KEYWORDSET_ID: 'seo-keywords',
  CITY_AUTOMATION_LLM_PROVIDER: 'openai',
  CITY_AUTOMATION_LLM_MODEL: 'gpt-4',
  CITY_AUTOMATION_LLM_API_KEY: 'test-llm-key'
});

for (const [key, value] of Object.entries(REQUIRED_ENV)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.LOG_FORMAT = process.env.LOG_FORMAT || 'silent';

jest.mock('../lib/logger', () => {
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    child: () => mockLogger
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    logger: mockLogger
  };
});

jest.mock('../middleware/rateLimiter', () => (_req, _res, next) => next());

const app = require('../app');
const { resetSessions, getDefaultSelections } = require('../services/sessionService');

let server;
let baseUrl;

function request(method, path, body, headers = {}) {
  const url = new URL(path, baseUrl);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body !== undefined) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return fetch(url, options).then(async (response) => {
    const rawBody = await response.text();
    let parsedBody;

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (_error) {
        parsedBody = rawBody;
      }
    }

    return {
      status: response.status,
      body: parsedBody,
      headers: response.headers
    };
  });
}

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

afterEach(() => {
  resetSessions();
});

describe('Session API', () => {
  it('creates a new session cookie and returns default selections', async () => {
    const response = await request('GET', '/session');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ selections: getDefaultSelections() });

    const setCookie = response.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain('mr-dj-session=');
  });

  it('persists updates for the same session', async () => {
    const initial = await request('GET', '/session');
    const cookieHeader = initial.headers.get('set-cookie');
    expect(cookieHeader).toBeTruthy();

    const updatePayload = {
      selections: {
        date: '2025-05-20',
        location: 'Eindhoven',
        eventType: 'Bruiloft',
        package: { id: 'gold', name: 'Gold' },
        pricing: {
          total: 1299,
          currency: 'EUR',
          formattedTotal: '€1.299,-'
        }
      }
    };

    const update = await request('PATCH', '/session', updatePayload, {
      Cookie: cookieHeader
    });

    expect(update.status).toBe(200);
    expect(update.body.selections).toMatchObject({
      location: 'Eindhoven',
      eventType: 'Bruiloft',
      date: '2025-05-20',
      package: expect.objectContaining({ id: 'gold', name: 'Gold' }),
      pricing: expect.objectContaining({ total: 1299, currency: 'EUR' })
    });

    const followUp = await request('GET', '/session', undefined, {
      Cookie: cookieHeader
    });

    expect(followUp.status).toBe(200);
    expect(followUp.body.selections).toMatchObject({
      location: 'Eindhoven',
      eventType: 'Bruiloft',
      date: '2025-05-20'
    });
  });

  it('returns validation errors when selections payload is invalid', async () => {
    const response = await request('PATCH', '/session', {});

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'selections' })
      ])
    );
  });
});
