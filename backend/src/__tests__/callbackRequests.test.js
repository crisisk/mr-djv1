const http = require('http');
const app = require('../app');
const { resetInMemoryStore: resetCallbackStore } = require('../services/callbackRequestService');

async function sendRequest(baseUrl, payload) {
  const response = await fetch(`${baseUrl}/callback-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const bodyText = await response.text();
  const body = bodyText ? JSON.parse(bodyText) : undefined;

  return { status: response.status, body };
}

describe('callback request validations', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  afterEach(() => {
    resetCallbackStore();
  });

  it('rejects requests without a name', async () => {
    const response = await sendRequest(baseUrl, {
      phone: '+31612345678',
      eventType: 'Bruiloft'
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt',
      details: expect.arrayContaining([
        expect.objectContaining({ field: 'name', message: 'Naam is vereist' })
      ])
    });
  });

  it('rejects requests with invalid phone numbers', async () => {
    const response = await sendRequest(baseUrl, {
      name: 'Test Klant',
      phone: 'abcde',
      eventType: 'Verjaardag'
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt',
      details: expect.arrayContaining([
        expect.objectContaining({ field: 'phone', message: 'Ongeldig telefoonnummer' })
      ])
    });
  });

  it('rejects requests with event types that exceed the maximum length', async () => {
    const response = await sendRequest(baseUrl, {
      name: 'Test Klant',
      phone: '+31612345678',
      eventType: 'A'.repeat(300)
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt',
      details: expect.arrayContaining([
        expect.objectContaining({ field: 'eventType', message: 'Type evenement is te lang' })
      ])
    });
  });
});
