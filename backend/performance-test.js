/**
 * K6 Load Testing Script voor Mr. DJ Backend
 *
 * Run with: k6 run performance-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp-up to 10 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Peak load
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests under 500ms
    'http_req_failed': ['rate<0.01'],   // Error rate under 1%
    'errors': ['rate<0.05'],            // Custom error rate under 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://mr-dj.sevensa.nl';

export default function () {
  // Test health endpoint
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check has uptime': (r) => JSON.parse(r.body).uptime > 0,
  }) || errorRate.add(1);

  sleep(1);

  // Test packages endpoint (if exists)
  const packagesRes = http.get(`${BASE_URL}/api/packages`);
  check(packagesRes, {
    'packages status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(2);

  // Test contact form submission
  const contactPayload = JSON.stringify({
    name: `Load Test User ${__VU}-${__ITER}`,
    email: `loadtest${__VU}_${__ITER}@example.com`,
    phone: '+31612345678',
    message: 'Performance test submission',
    eventType: 'bruiloft',
    eventDate: '2025-12-31',
  });

  const contactParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const contactRes = http.post(`${BASE_URL}/api/contact`, contactPayload, contactParams);

  check(contactRes, {
    'contact form status is 201': (r) => r.status === 201,
    'contact form returns contactId': (r) => JSON.parse(r.body).contactId !== undefined,
  }) || errorRate.add(1);

  sleep(3);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  return `
=== Mr. DJ Performance Test Results ===

Checks................: ${data.metrics.checks.values.passes / data.metrics.checks.values.count * 100}% passed
HTTP Request Duration.: p(95)=${data.metrics.http_req_duration.values['p(95)']}ms
Error Rate...........: ${data.metrics.errors.values.rate * 100}%
Total Requests.......: ${data.metrics.http_reqs.values.count}
Failed Requests......: ${data.metrics.http_req_failed.values.count}
  `;
}
