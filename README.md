# FastOrder HA - Plataforma de Pedidos Resiliente

Sistema de microservicios diseñado para alta disponibilidad, utilizando patrones de consistencia distribuida y observabilidad avanzada.

## 🚀 Arquitectura del Ecosistema
- **Frontend**: React + Vite + Tailwind (Dashboard administrativo y cliente).
- **API Gateway**: Spring Cloud Gateway (Puerto 9000).
- **Microservicios**: 
  - `order-service`: Gestión de pedidos (Puerto 8080).
  - `inventory-service`: Gestión de stock asíncrona (Puerto 8081).
  - `menu-service`: Catálogo con caché distribuida (Puerto 8082).
- **Infraestructura**:
  - PostgreSQL 15 (Persistencia políglota).
  - Redis 7 (Caché de alto rendimiento).
  - RabbitMQ (Bus de eventos con soporte para DLQ).
  - Prometheus + Grafana (Observabilidad total).

## 🛠️ Requisitos Previos
- Docker y Docker Desktop.
- Node.js 18+ (para el frontend).

## 🏁 Inicio Rápido

### 1. Levantar el Backend (Infraestructura y Servicios)
Desde la raíz del proyecto:
```powershell
docker-compose up -d --build
```

### 2. Levantar el Frontend
```powershell
cd frontend
npm install
npm run dev
```
Acceso: [http://localhost:5173](http://localhost:5173)

### 3. Acceso a Herramientas
- **Grafana**: [http://localhost:3000](http://localhost:3000) (User: `admin` / Pass: `admin`)
- **RabbitMQ**: [http://localhost:15672](http://localhost:15672) (User: `admin` / Pass: `admin_password`)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)

---

## ⏸️ Ciclo de Vida (Pausar y Reanudar)

### Para detener todo temporalmente (sin borrar datos):
```powershell
docker-compose stop
```

### Para volver a ejecutar tras una pausa:
```powershell
docker-compose start
```

### Para apagar y limpiar contenedores (mantiene la DB):
```powershell
docker-compose down
```

### Para realizar un backup manual antes de apagar:
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\backup_databases.ps1
```

## 🧪 Pruebas de Resistencia
Puedes ejecutar el script de carga mientras el sistema está arriba para ver la resiliencia en Grafana:
```powershell
.\tests-load\k6.exe run .\tests-load\checkpoint1-load.js
```
