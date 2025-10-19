// testRateLimiter.ts
import request from 'supertest';
import app from './app';

describe('Rate Limiter Middleware', () => {
  it('should allow requests within the rate limit', async () => {
    for (let i = 0; i < 100; i++) {
      const response = await request(app).get('/book-dj');
      expect(response.status).toBe(200);
    }
  });

  it('should block requests exceeding the rate limit', async () => {
    for (let i = 0; i < 101; i++) {
      const response = await request(app).get('/book-dj');
      if (i === 100) {
        expect(response.status).toBe(429);
      }
    }
  });

  it('should reset the rate limit after a minute', async () => {
    // Simulate waiting for 60 seconds
    await new Promise((resolve) => setTimeout(resolve, 60000));

    const response = await request(app).get('/book-dj');
    expect(response.status).toBe(200);
  });
});
