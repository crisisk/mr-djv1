// api.test.js

const request = require('supertest');
const app = require('../app'); // Your Express app
const db = require('../db'); // Your database connection

/**
 * Test suite for API endpoints
 * Coverage includes:
 * - CRUD operations
 * - Authentication
 * - Error handling
 * - Edge cases
 * - Response formats
 */

describe('API Endpoints', () => {
  // Setup and teardown
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.clear(); // Clear database before each test
  });

  // GET Endpoints Tests
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle pagination correctly', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=10')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('totalPages');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a single user', async () => {
      const userId = 'validId';
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', userId);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/nonexistentId')
        .expect(404);
    });
  });

  // POST Endpoints Tests
  describe('POST /api/users', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(validUser.name);
      expect(res.body.email).toBe(validUser.email);
    });

    it('should reject invalid email format', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/users').send(validUser);
      await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(409);
    });
  });

  // PUT Endpoints Tests
  describe('PUT /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      // Create a test user
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Original Name',
          email: 'original@example.com',
          password: 'password123'
        });
      userId = res.body.id;
    });

    it('should update user with valid data', async () => {
      const updateData = { name: 'Updated Name' };
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
    });

    it('should reject invalid update fields', async () => {
      const invalidUpdate = { invalidField: 'value' };
      await request(app)
        .put(`/api/users/${userId}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  // DELETE Endpoints Tests
  describe('DELETE /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      // Create a test user
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Delete Test',
          email: 'delete@example.com',
          password: 'password123'
        });
      userId = res.body.id;
    });

    it('should delete existing user', async () => {
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      // Verify user is deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/users/nonexistentId')
        .expect(404);
    });
  });

  // Authentication Tests
  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      await request(app)
        .get('/api/protected-route')
        .expect(401);
    });

    it('should accept requests with valid authentication', async () => {
      const token = 'valid-token'; // Mock token
      await request(app)
        .get('/api/protected-route')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should reject invalid tokens', async () => {
      await request(app)
        .get('/api/protected-route')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Simulate a server error
      jest.spyOn(db, 'query').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const res = await request(app)
        .get('/api/users')
        .expect(500);

      expect(res.body).toHaveProperty('error');
    });

    it('should handle rate limiting', async () => {
      // Make multiple requests in quick succession
      const requests = Array(100).fill().map(() => 
        request(app).get('/api/users')
      );

      const responses = await Promise.all(requests);
      expect(responses.some(res => res.status === 429)).toBeTruthy();
    });

    it('should validate request body', async () => {
      const invalidData = { invalid: 'data' };
      await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);
    });
  });
});
