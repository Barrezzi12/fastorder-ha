# FastOrder HA Frontend

Este es el cliente React para el sistema FastOrder HA. Está diseñado para ser resiliente, profesional y totalmente compatible con la arquitectura de microservicios existente.

## Tecnologías
- **React 18** + **Vite** + **TypeScript**
- **TanStack Query (React Query)**: Gestión de estado asíncrono y caché.
- **Tailwind CSS**: Estilizado moderno y responsive.
- **Lucide React**: Iconografía profesional.
- **Axios**: Cliente HTTP con interceptores.

## Requisitos
- Node.js 18+
- El backend (API Gateway en puerto 9000) debe estar corriendo.

## Instalación y Ejecución

1. Entra a la carpeta:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea tu archivo de entorno (opcional, ya existe uno por defecto):
```bash
cp .env.example .env
```

4. Ejecuta el modo desarrollo:
```bash
npm run dev
```

El sistema estará disponible en [http://localhost:3000](http://localhost:3000).

## Características Implementadas
- **Dashboard**: Resumen de estados y accesos directos.
- **Catálogo Interactivo**: Permite seleccionar cantidades y realizar pedidos al instante.
- **Polling Inteligente**: El historial de pedidos se actualiza cada 3 segundos, permitiendo ver cómo una orden pasa de `PENDING` a `CONFIRMED` asíncronamente sin recargar la página.
- **Idempotencia**: Generación de UUIDs únicos en el cliente para cada solicitud de pedido.
- **Diseño Mobile-First**: Adaptable a cualquier pantalla.
