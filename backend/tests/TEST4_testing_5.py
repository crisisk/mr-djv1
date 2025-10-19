const { authenticatedRequest } = require('../testUtils');

describe('Auth API', () => {
  describe('GET /api/auth', () => {
    it('should return 401 without token', async () => {
      const response = await authenticatedRequest('get', '/api/auth')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return authenticated status with token', async () => {
      const token = 'valid-test-token';
      
      const response = await authenticatedRequest('get', '/api/auth', null, token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('authenticated', true);
    });
  });
});
