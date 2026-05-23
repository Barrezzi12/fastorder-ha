# Informe Técnico Final: Auditoría FastOrder HA

## 1. Patrones de Diseño Implementados
- **Transactional Outbox**: Garantiza que un pedido no se pierda si RabbitMQ falla momentáneamente.
- **Idempotencia**: Uso de `clientOrderId` en base de datos para ignorar peticiones duplicadas.
- **Saga Coreografiada**: Coordinación de stock y pedidos mediante eventos asíncronos.
- **Database per Service**: Aislamiento total de datos en PostgreSQL.

## 2. Resultados de la Prueba de Resistencia (Stress Test)
- **Volumen**: 5,000 pedidos en 30 segundos.
- **Escenario de Caos**: Caída de `inventory-service` y `fastorder-cache` simultáneamente.
- **Hallazgo**: 
  - El sistema mantuvo **disponibilidad del 100%** en la recepción de órdenes.
  - La consistencia eventual tardó **< 15 segundos** en estabilizarse tras revivir los contenedores.
  - **Tolerancia a Fallos**: El `menu-service` realizó fallback a DB al detectar caída de Redis.

## 3. Estrategia de Backup y Recuperación
Se implementó un script de automatización (`backup_databases.ps1`) que realiza volcados atómicos de las bases de datos `orders_db`, `inventory_db` y `menu_db`.
- **Frecuencia Recomendada**: Diaria (incremental) / Semanal (Full Dump).

## 4. Observabilidad
Integración de **Prometheus + Grafana** con métricas personalizadas de:
- Latencia promedio (ms).
- Throughput (RPS).
- Uso de Heap Memory JVM.
- Salud de contenedores (Metric: `up`).
