const http = require('http');
const app = require('../app');
const { resetInMemoryStore } = require('../services/bookingStepService');

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

describe('Booking step validation API', () => {
  it('returns 400 when flowId or stepId is missing', async () => {
    const response = await request('POST', '/booking-steps/validate', {
      stepId: 'event-details',
      payload: {}
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'FlowId ontbreekt of is ongeldig.' });
  });

  it('returns validation errors when required fields are absent', async () => {
    const response = await request('POST', '/booking-steps/validate', {
      flowId: 'flow-123',
      stepId: 'event-details',
      payload: {}
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        { field: 'eventType', message: 'Kies een type evenement.' },
        { field: 'eventDate', message: 'Selecteer een datum.' }
      ])
    );
  });

  it('persists progress when validation succeeds', async () => {
    const response = await request('POST', '/booking-steps/validate', {
      flowId: 'flow-123',
      stepId: 'package-selection',
      payload: { packageId: 'gold' }
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      flowId: 'flow-123',
      stepId: 'package-selection'
    });
    expect(Array.isArray(response.body.progress)).toBe(true);
    expect(response.body.progress).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flowId: 'flow-123',
          stepId: 'package-selection',
          isComplete: true
        })
      ])
    );
  });
});
