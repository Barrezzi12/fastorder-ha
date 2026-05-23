import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
export const successRate = new Rate('orders_success_rate');
export const rateLimitedRate = new Rate('orders_rate_limited_rate');
export const orderLatency = new Trend('orders_latency_trend');

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Warm up
    { duration: '2m', target: 200 }, // Stress
    { duration: '30s', target: 0 },   // Cool down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% de las peticiones < 500ms
    'orders_success_rate': ['rate>0.8'], // Esperamos que al menos el 80% sean exitosas (el resto puede ser rate-limited)
    'http_req_failed': ['rate<0.05'],    // Menos del 5% de errores 5xx
  },
};

const BASE_URL = 'http://localhost:9000/api';

export default function () {
  const clientOrderId = uuidv4();

  const payload = JSON.stringify({
    clientOrderId,
    total: 25.50,
    items: [
      {
        productId: "p1-uuid",
        quantity: 1,
      },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Simulación de flujo real: Primero consultar menú (Caché), luego pedir.
  http.get(`${BASE_URL}/menu`);
  
  sleep(0.5);

  const res = http.post(`${BASE_URL}/orders`, payload, params);

  // Validación de estados
  const isSuccess = res.status === 200 || res.status === 201;
  const isRateLimited = res.status === 429;
  const isServerError = res.status >= 500;

  check(res, {
    'status is 20x (Success)': (r) => isSuccess,
    'status is 429 (Rate Limited)': (r) => isRateLimited,
    'status is not 5xx (Server Error)': (r) => !isServerError,
  });

  // Registro de métricas
  successRate.add(isSuccess);
  rateLimitedRate.add(isRateLimited);
  orderLatency.add(res.timings.duration);

  // Tiempo de pensamiento del usuario
  sleep(Math.random() * 2 + 1);
}
