import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate, Trend } from 'k6/metrics';

// Custom Metrics
export const successRate = new Rate('orders_success_rate');
export const errorRate = new Rate('orders_error_rate');
export const orderLatency = new Trend('orders_latency_trend');

export const options = {
  scenarios: {
    constant_load: {
      executor: 'constant-arrival-rate',
      rate: 500, // 500 iterations per second * 2 requests = 1000 req/s
      timeUnit: '1s',
      duration: '2m', // 2 minutes to generate ~120,000 total requests
      preAllocatedVUs: 100,
      maxVUs: 400,
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<800'], // 95% of requests < 800ms
    'orders_success_rate': ['rate>0.95'], // Expected high success rate (excluding rate limits if any)
    'http_req_failed': ['rate<0.01'],    // Less than 1% hard errors
  },
};

const BASE_URL = 'http://localhost:9000/api';

export default function () {
  const clientOrderId = uuidv4();

  const payload = JSON.stringify({
    clientOrderId,
    total: 8.50,
    items: [
      {
        productId: "BURGER_001",
        quantity: 1,
      },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Mix of GET and POST to simulate real traffic
  // 1. Get Menu (Read Operation)
  const menuRes = http.get(`${BASE_URL}/menu`);
  check(menuRes, { 'menu status is 200': (r) => r.status === 200 });

  // 2. Create Order (Critical Write Operation)
  const orderRes = http.post(`${BASE_URL}/orders`, payload, params);

  const isSuccess = orderRes.status === 200 || orderRes.status === 201;
  const isError = orderRes.status >= 400 && orderRes.status !== 429;

  check(orderRes, {
    'order status is 20x': (r) => isSuccess,
    'no server errors (5xx)': (r) => orderRes.status < 500,
  });

  successRate.add(isSuccess);
  errorRate.add(isError);
  orderLatency.add(orderRes.timings.duration);
}
