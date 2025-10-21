const http = require('http');
const { buildRequiredEnv } = require('../testUtils/env');

process.env = { ...process.env, ...buildRequiredEnv() };

const app = require('../app');

function startTestServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`
      });
    });
  });
}

async function request(baseUrl, path = '/', options = {}) {
  const response = await fetch(new URL(path, baseUrl), options);
  const bodyText = await response.text();
  let parsedBody;

  if (bodyText) {
    try {
      parsedBody = JSON.parse(bodyText);
    } catch (_error) {
      parsedBody = bodyText;
    }
  }

  return {
    status: response.status,
    headers: response.headers,
    body: parsedBody
  };
}

function parseContentSecurityPolicy(headerValue) {
  return headerValue
    .split(';')
    .map((directive) => directive.trim())
    .filter(Boolean)
    .reduce((acc, directive) => {
      const [name, ...values] = directive.split(/\s+/);
      acc[name] = values;
      return acc;
    }, {});
}

describe('Security headers', () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    ({ server, baseUrl } = await startTestServer());
  });

  afterAll((done) => {
    server.close(done);
  });

  it('applies helmet security headers with Netlify aware CSP rules', async () => {
    const response = await request(baseUrl, '/health');

    expect(response.status).toBe(200);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('SAMEORIGIN');
    expect(response.headers.get('x-dns-prefetch-control')).toBe('off');
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('strict-transport-security')).toBeNull();

    const cspHeader = response.headers.get('content-security-policy');
    expect(cspHeader).toBeTruthy();

    const directives = parseContentSecurityPolicy(cspHeader);

    expect(directives['default-src']).toEqual(["'self'"]);
    expect(directives['connect-src']).toEqual(
      expect.arrayContaining([
        "'self'",
        'https://*.netlify.app',
        'https://*.netlify.com',
        'https://netlify.app',
        'https://app.netlify.com',
        'https://api.netlify.com'
      ])
    );
    expect(directives['frame-ancestors']).toEqual(
      expect.arrayContaining(["'self'", 'https://app.netlify.com', 'https://*.netlify.app'])
    );
  });

  it('enables HSTS only for secure requests', async () => {
    const insecure = await request(baseUrl, '/health');
    expect(insecure.headers.get('strict-transport-security')).toBeNull();

    const secure = await request(baseUrl, '/health', {
      headers: { 'X-Forwarded-Proto': 'https' }
    });

    expect(secure.headers.get('strict-transport-security')).toBe(
      'max-age=15552000; includeSubDomains'
    );
  });
});
