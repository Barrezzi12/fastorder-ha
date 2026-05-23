package com.fastorder.order_service.messaging;

import com.fastorder.order_service.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryConsumer {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "stock.reserved.queue")
    public void handleStockReserved(String payload) {
        log.info("Stock RESERVADO recibido: {}", payload);
        UUID externalId = extractExternalId(payload);
        orderService.confirmOrder(externalId);
    }

    @RabbitListener(queues = "stock.rejected.queue")
    public void handleStockRejected(String payload) {
        log.warn("Stock RECHAZADO recibido: {}", payload);
        UUID externalId = extractExternalId(payload);
        orderService.cancelOrder(externalId);
    }

    private UUID extractExternalId(String payload) {
        try {
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);
            return UUID.fromString((String) data.get("externalId"));
        } catch (Exception e) {
            log.error("Error extrayendo externalId del payload", e);
            throw new RuntimeException("Payload inválido");
        }
    }
}
