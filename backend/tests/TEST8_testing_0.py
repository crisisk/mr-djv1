// loadTest.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Custom metrics
const errorRate = new Rate('errors');
const requestDuration = new Trend('request_duration');

// Test configuration
export const options = {
  // Test scenario
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 100,         // 100 concurrent users
      duration: '5m',   // Run for 5 minutes
      gracefulStop: '30s'
    }
  },
  // Thresholds
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // 95% of requests should be below 2s
    'http_req_failed': ['rate<0.01'],    // Error rate should be below 1%
    'errors': ['rate<0.01']              // Custom error rate threshold
  }
};

// Environment variables with defaults
const CONFIG = {
  BASE_URL: __ENV.BASE_URL || 'http://localhost:3000',
  TIMEOUT: __ENV.TIMEOUT || '30s',
};

// Test setup - runs once per VU
export function setup() {
  console.log(`Starting load test with configuration:
    Base URL: ${CONFIG.BASE_URL}
    Timeout: ${CONFIG.TIMEOUT}
  `);
  
  // Validate configuration
  if (!CONFIG.BASE_URL) {
    throw new Error('BASE_URL is required');
  }
}

// Main test function
export default function () {
  try {
    // Example endpoints to test
    const endpoints = [
      { path: '/api/users', method: 'GET' },
      { path: '/api/products', method: 'GET' },
      { path: '/api/orders', method: 'POST', payload: { userId: 1, productId: 1 } }
    ];

    for (const endpoint of endpoints) {
      let response;
      const url = `${CONFIG.BASE_URL}${endpoint.path}`;
      
      // Make request based on method
      switch (endpoint.method) {
        case 'GET':
          response = http.get(url, {
            timeout: CONFIG.TIMEOUT,
            tags: { endpoint: endpoint.path }
          });
          break;
        case 'POST':
          response = http.post(url, JSON.stringify(endpoint.payload), {
            timeout: CONFIG.TIMEOUT,
            headers: { 'Content-Type': 'application/json' },
            tags: { endpoint: endpoint.path }
          });
          break;
      }

      // Record custom metrics
      requestDuration.add(response.timings.duration, { endpoint: endpoint.path });

      // Verify response
      const checkResult = check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 2000ms': (r) => r.timings.duration < 2000
      });

      if (!checkResult) {
        errorRate.add(1);
        console.error(`Error for ${endpoint.path}: ${response.status} - ${response.body}`);
      }
    }

    // Add random sleep between requests (1-5 seconds)
    sleep(Math.random() * 4 + 1);
    
  } catch (error) {
    errorRate.add(1);
    console.error(`Test execution error: ${error.message}`);
  }
}

// Test teardown - runs at the end
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
