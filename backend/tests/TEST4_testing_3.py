// Global test setup
beforeAll(() => {
  // Add any global setup (e.g., database connection)
});

afterAll(() => {
  // Add any global teardown
});

// Add custom matchers if needed
expect.extend({
  toBeValidResponse(received) {
    const pass = received && typeof received === 'object';
    return {
      message: () => `expected ${received} to be a valid response object`,
      pass
    };
  }
});
