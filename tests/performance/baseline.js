import http from 'k6/http';
import { check, sleep, Trend } from 'k6';

export const options = {
  summaryTrendStats: ['avg', 'p(95)', 'p(99)', 'min', 'max'],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
  scenarios: {
    ramping_api_load: {
      executor: 'ramping-arrival-rate',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      maxVUs: 50,
      stages: [
        { target: 20, duration: '2m' },
        { target: 40, duration: '3m' },
        { target: 10, duration: '2m' }
      ],
      exec: 'testApi'
    },
    smoke_frontend: {
      executor: 'constant-vus',
      vus: 5,
      duration: '5m',
      exec: 'testFrontend'
    }
  }
};

const frontendTrend = new Trend('frontend_time_to_first_byte');
const BASE_URL = (__ENV.BASE_URL || 'https://mr-dj.sevensa.nl').replace(/\/$/, '');
const API_URL = __ENV.API_URL || `${BASE_URL}/api/health`;

export function testApi() {
  const res = http.get(API_URL);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes OK': (r) => r.body && r.body.includes('OK')
  });
  sleep(1);
}

export function testFrontend() {
  const res = http.get(`${BASE_URL}/`);
  frontendTrend.add(res.timings.waiting, { page: 'home' });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'ttfb < 500ms': (r) => r.timings.waiting < 500
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6-summary.json': JSON.stringify(data, null, 2)
  };
}
