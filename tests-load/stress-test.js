import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate } from 'k6/metrics';

export const successRate = new Rate('success_rate');
export const rateLimitedRate = new Rate('rate_limited_rate');

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 200 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],

    // solo errores reales del sistema
    http_req_failed: ['rate<0.01'],

    // rate limiting debe ser observado, no aprobado/reprobado
  }
};

const BASE_URL = 'http://localhost:9000/api';

export default function () {
  const clientOrderId = uuidv4();

  const payload = JSON.stringify({
    clientOrderId,
    total: Number((Math.random() * 100).toFixed(2)),
    items: [
      {
        productId: "11111111-1111-1111-1111-111111111111",
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

  const isSuccess = res.status === 200 || res.status === 201;
  const isRateLimited = res.status === 429;
  const isServerError = res.status >= 500;

  check(res, {
    'valid response (200/201)': () => isSuccess,
    'rate limited (429)': () => isRateLimited,
    'no server errors (no 5xx)': () => !isServerError,
  });

  successRate.add(isSuccess);
  rateLimitedRate.add(isRateLimited);

  if (!isSuccess && !isRateLimited) {
    console.log(`UNEXPECTED ERROR: ${res.status} - ${res.body}`);
  }

  sleep(1);
}