# Manual de Usuario - FastOrder HA

## 1. Introducción
FastOrder HA es una plataforma de gestión de pedidos en tiempo real. Este manual guía al usuario a través de las funciones principales del frontend.

## 2. Dashboard Principal
Al entrar en [http://localhost:5173](http://localhost:5173), verás el **Dashboard de Control**:
- **Confirmados**: Total de pedidos que ya tienen stock reservado.
- **Pendientes**: Pedidos en proceso de validación asíncrona.
- **Sistema Online**: Indicador verde pulsante que confirma la conexión con el Gateway.

## 3. Realizar un Pedido (Catálogo)
1. Ve a la pestaña **"Menú"** en la barra de navegación.
2. Selecciona la cantidad usando los botones `+` y `-`.
3. Haz clic en **"Pedir"**. 
4. El botón cambiará a un check verde indicando que la solicitud fue enviada correctamente.

## 4. Seguimiento de Pedidos
Ve a la pestaña **"Pedidos"**:
- Aquí verás una tabla con todas tus órdenes.
- **Estado Naranja (Procesando)**: El sistema está validando el inventario. No necesitas refrescar; se actualizará solo.
- **Estado Verde (Confirmado)**: Tu pedido ha sido validado y el stock descontado.
- **Estado Rojo (Cancelado)**: No había stock suficiente para procesar la orden.

## 5. Panel Técnico (Observabilidad)
Para administradores que deseen ver el rendimiento:
1. Accede a [http://localhost:3000/dashboards](http://localhost:3000).
2. Selecciona **"FastOrder HA - Microservices Dashboard"**.
3. Podrás monitorear la carga de CPU y la velocidad de respuesta del sistema.
