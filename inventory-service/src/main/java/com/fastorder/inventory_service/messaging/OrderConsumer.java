package com.fastorder.inventory_service.messaging;

import com.fastorder.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderConsumer {

    private final InventoryService inventoryService;

    @RabbitListener(queues = "order.created.queue")
    public void handleOrderCreated(String payload) {
        log.info("Evento recibido de Order Service: {}", payload);
        inventoryService.processOrderCreated(payload);
    }
}
