const http = require('http');
const express = require('express');
const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv() };

jest.mock('../lib/db', () => ({
  isConfigured: jest.fn(() => false),
  runQuery: jest.fn(),
  getStatus: jest.fn(() => ({ connected: false })),
  getPool: jest.fn(() => null)
}));

const feedbackRouter = require('../routes/feedback');
const surveyService = require('../services/surveyService');

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

  return fetch(url, options).then(async (response) => {
    const text = await response.text();
    const payload = text ? JSON.parse(text) : undefined;
    return {
      status: response.status,
      body: payload
    };
  });
}

describe('POST /feedback', () => {
  beforeAll((done) => {
    const app = express();
    app.use(express.json());
    app.use('/feedback', feedbackRouter);
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
    process.env = ORIGINAL_ENV;
  });

  afterEach(() => {
    surveyService.resetInMemoryStore();
  });

  it('rejects submissions without a token', async () => {
    const response = await request('POST', '/feedback', {
      rating: 5,
      reviewText: 'Fantastisch feest!'
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
  });

  it('records valid survey responses', async () => {
    const { survey } = await surveyService.createSurveyInvite({
      id: 'contact-1',
      email: 'fan@example.com',
      name: 'Party Fan'
    });

    const response = await request('POST', '/feedback', {
      token: survey.responseToken,
      rating: 5,
      reviewText: 'Fantastisch feest!'
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'received',
        survey: expect.objectContaining({
          id: survey.id,
          status: 'submitted',
          approved: false
        })
      })
    );
  });
});
