const http = require('http');
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

async function request(baseUrl, path = '/') {
  const response = await fetch(new URL(path, baseUrl));
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
});
