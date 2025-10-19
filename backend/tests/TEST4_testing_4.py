const { request } = require('../testUtils');

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeValidResponse();
      expect(response.body.users).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = { name: 'Jane Doe' };
      
      const response = await request
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: userData.name
      });
    });

    it('should return 400 if name is missing', async () => {
      const response = await request
        .post('/api/users')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
