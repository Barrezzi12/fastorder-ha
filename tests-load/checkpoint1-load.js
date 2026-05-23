import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate, Trend } from 'k6/metrics';

export const ordersSuccessRate = new Rate('orders_success_rate');
export const unexpectedStatusRate = new Rate('unexpected_status_rate');
export const ordersLatency = new Trend('orders_latency');

export const options = {
  scenarios: {
    checkpoint1_orders: {
      executor: 'shared-iterations',
      vus: 200,
      iterations: 50000,
      maxDuration: '20m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    orders_success_rate: ['rate>0.80'],
    unexpected_status_rate: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9000/api';

export default function () {
  const menuRes = http.get(`${BASE_URL}/menu`);

  check(menuRes, {
    'menu responds 200 or tolerated empty startup error': (r) =>
      r.status === 200 || r.status === 404 || r.status === 500,
  });

  const payload = JSON.stringify({
    clientOrderId: uuidv4(),
    total: 25.5,
    items: [
      {
        productId: 'DEFAULT',
        quantity: 1,
      },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/orders`, payload, params);
  const success = res.status === 200 || res.status === 201 || res.status === 202;
  const tolerated = success || res.status === 409 || res.status === 429;
  const unexpected = !tolerated;

  check(res, {
    'order accepted': () => success,
    'no unexpected status': () => !unexpected,
    'no server error': (r) => r.status < 500,
  });

  ordersSuccessRate.add(success);
  unexpectedStatusRate.add(unexpected);
  ordersLatency.add(res.timings.duration);

  if (unexpected) {
    console.log(`Unexpected status ${res.status}: ${res.body}`);
  }

  sleep(Math.random() * 0.5);
}
