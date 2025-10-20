const http = require('http');
const app = require('../app');
const { resetInMemoryStore } = require('../services/bookingService');

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

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return fetch(url, options).then(async (response) => {
    const rawBody = await response.text();
    let parsedBody;

    if (!rawBody) {
      parsedBody = undefined;
    } else {
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

describe('Bookings API validation', () => {
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

  it('returns detailed validation errors for invalid payloads', async () => {
    const response = await request('POST', '/bookings', {
      name: '',
      email: 'not-an-email',
      phone: '123',
      eventType: '',
      eventDate: 'not-a-date',
      message: 'x'.repeat(4001)
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        { field: 'name', message: 'Naam is vereist' },
        { field: 'email', message: 'Ongeldig e-mailadres' },
        { field: 'phone', message: 'Telefoonnummer is vereist' },
        { field: 'eventType', message: 'Type evenement is vereist' },
        { field: 'eventDate', message: 'Ongeldige datum' },
        { field: 'message', message: 'Bericht is te lang' }
      ])
    );
  });

  it('normalises valid payloads before creating bookings', async () => {
    const response = await request('POST', '/bookings', {
      name: '  Geldige Klant  ',
      email: '  klant@example.com  ',
      phone: ' 0612345678 ',
      eventType: '  Bruiloft ',
      eventDate: ' 2024-12-31 ',
      message: '  Wij hebben interesse. ',
      packageId: ' gold ',
      extraneous: 'ignored'
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      eventType: 'Bruiloft',
      requestedPackage: 'gold'
    });
  });
});
