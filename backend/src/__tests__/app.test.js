const app = require('../app');
const { resetInMemoryStore } = require('../services/contactService');
const http = require('http');

let server;
let baseUrl;

function request(method, path, body) {
  const url = new URL(path, baseUrl);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options).then(async (response) => ({
    status: response.status,
    body: await response.json(),
    headers: response.headers
  }));
}

describe('Mister DJ API', () => {
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
    resetInMemoryStore();
  });

  it('returns service metadata on the root route', async () => {
    const response = await request('GET', '/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: 'Mister DJ API',
      endpoints: expect.objectContaining({
        health: '/health',
        contact: '/contact'
      })
    });
  });

  it('exposes a detailed health check', async () => {
    const response = await request('GET', '/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      service: expect.any(String),
      dependencies: expect.objectContaining({
        storageStrategy: expect.any(String)
      })
    });
  });

  it('rejects invalid contact submissions', async () => {
    const response = await request('POST', '/contact', {});

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt'
    });
  });

  it('accepts contact submissions and stores them in memory when no DB is configured', async () => {
    const response = await request('POST', '/contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0612345678',
      message: 'Ik heb interesse in het gouden pakket.',
      eventType: 'Bruiloft',
      eventDate: '2024-12-31',
      packageId: 'gold'
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      persisted: false,
      status: 'pending'
    });
    expect(response.body.contactId).toBeDefined();
  });
});
