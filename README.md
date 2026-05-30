# FastOrder HA

FastOrder HA es una plataforma de pedidos en linea para restaurante, construida con una arquitectura de microservicios orientada a alta disponibilidad, consistencia eventual, mensajeria asincrona y observabilidad.

Repositorio Git: https://github.com/Barrezzi12/fastorder-ha.git

## Descripcion general

El sistema permite consultar el menu, crear pedidos, validar inventario y procesar eventos de negocio mediante servicios desacoplados. La solucion esta preparada para escenarios de alta demanda, fallos parciales y recuperacion mediante contenedores.

Componentes principales:

- `frontend`: aplicacion React + Vite + Tailwind para consulta y gestion.
- `api-gateway`: punto de entrada basado en Spring Cloud Gateway, expuesto en el puerto `9000`.
- `menu-service`: servicio de catalogo y menu, con cache en Redis.
- `order-service`: servicio de pedidos, idempotencia y Transactional Outbox.
- `inventory-service`: servicio de stock, consumo de eventos e idempotencia de mensajes.
- `database`: scripts SQL de inicializacion y carpeta de migraciones.
- `monitoring`: configuracion de Prometheus y espacio para dashboards de Grafana.
- `tests`: scripts de pruebas de carga con k6.

## Tecnologias

- Java + Spring Boot para los microservicios.
- React + Vite + Tailwind para el frontend.
- PostgreSQL 15 para persistencia.
- Redis 7 para cache.
- RabbitMQ para mensajeria asincrona.
- Docker Compose para ejecucion local.
- Prometheus y Grafana para monitoreo.
- k6 para pruebas de carga.

## Estructura de carpetas

```text
fastorder-ha/
  api-gateway/
  menu-service/
  order-service/
  inventory-service/
  frontend/
  docker-compose.yml
  database/
    init.sql
    migrations/
  monitoring/
    prometheus.yml
    grafana/
  tests/
    checkpoint1-load.js
    stress-test.js
    stress-test-v2.js
    final-stress-test.js
    final-stress-test-visual.js
    k6.exe
  chaos/
  k8s/
  backups/
  README.md
```

## Requisitos previos

- Docker Desktop.
- Node.js 18 o superior para ejecutar el frontend.
- PowerShell en Windows.

## Levantar el sistema

Desde la raiz del proyecto, iniciar infraestructura y servicios:

```powershell
docker-compose up -d --build
```

Levantar el frontend:

```powershell
cd frontend
npm install
npm run dev
```

Accesos principales:

- Frontend: http://localhost:5173
- API Gateway: http://localhost:9000
- Grafana: http://localhost:3000 (`admin` / `admin`)
- Prometheus: http://localhost:9090
- RabbitMQ Management: http://localhost:15672 (`admin` / `admin_password`)

## Endpoints principales

Los endpoints se consumen a traves del API Gateway usando la base:

```text
http://localhost:9000/api
```

Listado de endpoints:

- `GET /api/menu`: consulta los productos del menu.
- `POST /api/menu`: registra un producto del menu y limpia la cache asociada.
- `POST /api/orders`: crea un pedido.
- `GET /api/orders`: lista los pedidos recientes.

Ejemplo de creacion de pedido:

```json
{
  "clientOrderId": "uuid-generado-por-cliente",
  "total": 25.5,
  "items": [
    {
      "productId": "BURGER_001",
      "quantity": 1
    }
  ]
}
```

## Base de datos

La inicializacion de PostgreSQL se encuentra en:

```text
database/init.sql
```

La carpeta `database/migrations` queda reservada para scripts incrementales o migraciones futuras.

Bases usadas por los servicios:

- `orders_db`
- `inventory_db`
- `menu_db`

## Monitoreo

Prometheus usa la configuracion ubicada en:

```text
monitoring/prometheus.yml
```

Grafana queda disponible en `http://localhost:3000` para visualizar metricas de servicios, contenedores y comportamiento bajo carga.

## Pruebas

Los scripts de carga se encuentran en la carpeta `tests`.

Ejecutar prueba de carga principal:

```powershell
.\tests\k6.exe run .\tests\checkpoint1-load.js
```

Ejecutar prueba de estres final:

```powershell
.\tests\k6.exe run .\tests\final-stress-test.js
```

## Ciclo de vida

Detener temporalmente sin borrar datos:

```powershell
docker-compose stop
```

Reanudar servicios:

```powershell
docker-compose start
```

Apagar contenedores manteniendo volumenes:

```powershell
docker-compose down
```

Generar backup manual:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\backup_databases.ps1
```

## Archivos de configuracion relevantes

- `docker-compose.yml`: orquestacion local de servicios e infraestructura.
- `database/init.sql`: estructura inicial de bases de datos.
- `monitoring/prometheus.yml`: configuracion de scraping de Prometheus.
- `api-gateway/src/main/resources/application.yml`: rutas del gateway.
- `*/src/main/resources/application.properties`: configuracion de microservicios.
- `tests/*.js`: escenarios de carga y estres con k6.
