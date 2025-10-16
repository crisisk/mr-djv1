import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<750']
  },
  stages: [
    { duration: '2m', target: 200 },
    { duration: '3m', target: 500 },
    { duration: '5m', target: 1000 },
    { duration: '2m', target: 0 }
  ]
};

const BASE_URL = __ENV.BASE_URL || 'https://staging.sevensa.nl';

export default function () {
  const payload = JSON.stringify({
    name: 'Load Test User',
    email: `loadtest-${Math.random().toString(16).slice(2)}@example.com`,
    phone: '+31600000000',
    message: 'Load testing Mister DJ booking flow',
    eventType: 'wedding',
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    packageId: 'all-in'
  });

  const res = http.post(`${BASE_URL}/api/bookings`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has success flag': (r) => r.json('success') === true
  });

  sleep(1);
}
