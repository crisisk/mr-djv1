const supertest = require('supertest');
const app = require('../src/app');

const request = supertest(app);

/**
 * Helper function to make authenticated requests
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {string} token - Authentication token
 * @returns {Promise} - Supertest request
 */
const authenticatedRequest = (method, url, data = null, token = null) => {
  const req = request[method](url);
  
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  
  if (data) {
    req.send(data);
  }
  
  return req;
};

module.exports = {
  request,
  authenticatedRequest
};
