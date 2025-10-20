const http = require('http');
const app = require('../app');
const { resetInMemoryStore } = require('../services/contactService');

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
    const text = await response.text();
    let parsed;

    if (!text) {
      parsed = undefined;
    } else {
      try {
        parsed = JSON.parse(text);
      } catch (_error) {
        parsed = text;
      }
    }

    return {
      status: response.status,
      body: parsed,
      headers: response.headers
    };
  });
}

const validPayload = {
  name: 'Contact Tester',
  email: 'tester@example.com',
  phone: '0612345678',
  message: 'Ik heb interesse in jullie diensten voor een bruiloft.',
  eventType: 'Bruiloft',
  eventDate: '2025-08-01',
  packageId: 'gold'
};

describe('Contact route validation hardening', () => {
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

  it('rejects submissions that contain aggressive marketing keywords', async () => {
    const response = await request('POST', '/contact', {
      ...validPayload,
      message: 'Beste SEO marketing services met duizenden backlinks voor uw bedrijf.'
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'message',
          message: 'Bericht lijkt spam te bevatten'
        })
      ])
    );
  });

  it('rejects submissions that try to smuggle in promotional links', async () => {
    const response = await request('POST', '/contact', {
      ...validPayload,
      message: 'Bezoek http://spam.example voor ongelooflijke crypto deals!'
    });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'message',
          message: 'Bericht mag geen links bevatten'
        })
      ])
    );
  });

  it('rejects names that clearly look like spam campaigns', async () => {
    const response = await request('POST', '/contact', {
      ...validPayload,
      name: 'Bitcoin Casino Marketing Team'
    });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'name',
          message: 'Naam lijkt spam te bevatten'
        })
      ])
    );
  });
});
