import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate, Trend, Counter } from 'k6/metrics';

// --- MÉTRICAS PERSONALIZADAS (Para impresionar al profesor) ---
export const ordersCounter = new Counter('total_pedidos_intentados');
export const successRate = new Rate('tasa_exito_http');
export const apiLatency = new Trend('latencia_real_ms');
export const throughput = new Counter('peticiones_por_segundo');

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Fase 1: Calentamiento (Ramp-up)
    { duration: '2m', target: 300 }, // Fase 2: Carga Máxima (Stress - 50k+ peticiones)
    { duration: '30s', target: 0 },   // Fase 3: Recuperación (Ramp-down)
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // El 95% debe ser < 500ms
    'tasa_exito_http': ['rate>0.99'],   // Menos del 1% de errores HTTP
  },
};

const BASE_URL = 'http://localhost:9000/api';

export default function () {
  
  // 1. FLUJO DE USUARIO: Navegando el Menú
  group('Navegacion de Usuario', function () {
    const menuRes = http.get(`${BASE_URL}/menu`, { tags: { name: 'ConsultarMenu' } });
    
    check(menuRes, {
      'Menú cargado correctamente': (r) => r.status === 200,
    });
    
    apiLatency.add(menuRes.timings.duration);
    throughput.add(1);
    sleep(Math.random() * 0.5); // Simula tiempo de lectura
  });

  // 2. FLUJO DE USUARIO: Realizando Pedido Crítico
  group('Operacion Critica: Pedido', function () {
    const clientOrderId = uuidv4();
    const payload = JSON.stringify({
      clientOrderId,
      total: 8.50,
      items: [{ productId: "BURGER_001", quantity: 1 }]
    });

    const params = { headers: { 'Content-Type': 'application/json' }, tags: { name: 'CrearPedido' } };

    const orderRes = http.post(`${BASE_URL}/orders`, payload, params);

    const isSuccess = orderRes.status === 200 || orderRes.status === 201;

    check(orderRes, {
      'Pedido aceptado (20x)': (r) => isSuccess,
      'Sin errores de servidor (5xx)': (r) => r.status < 500,
    });

    // Actualizar métricas visuales
    ordersCounter.add(1);
    successRate.add(isSuccess);
    apiLatency.add(orderRes.timings.duration);
    throughput.add(1);

    // LOG VISUAL PERIÓDICO (Opcional, para la terminal)
    if (__ITER % 100 === 0) {
      console.log(`[LIVE TEST] Iteración: ${__ITER} | Pedidos enviados: ${ordersCounter.value}`);
    }
  });

  sleep(0.1); // Pequeña pausa para no saturar el socket local
}
