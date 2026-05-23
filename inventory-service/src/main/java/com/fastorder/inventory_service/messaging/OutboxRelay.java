package com.fastorder.inventory_service.messaging;

import com.fastorder.inventory_service.model.OutboxEvent;
import com.fastorder.inventory_service.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxRelay {

    private final OutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;

    public static final String INVENTORY_EXCHANGE = "inventory.exchange";

    @Scheduled(fixedDelay = 100)
    @Transactional
    public void processOutboxEvents() {
        List<OutboxEvent> pendingEvents = outboxRepository.findTop200ByProcessedFalseOrderByCreatedAtAsc();
        
        if (pendingEvents.isEmpty()) return;

        for (OutboxEvent event : pendingEvents) {
            try {
                // El routing key depende del tipo de evento (STOCK_RESERVED o STOCK_REJECTED)
                String routingKey = event.getEventType().toLowerCase().replace("_", ".");
                
                rabbitTemplate.convertAndSend(
                        INVENTORY_EXCHANGE,
                        routingKey,
                        event.getPayload()
                );

                event.setProcessed(true);
                event.setProcessedAt(LocalDateTime.now());
                outboxRepository.save(event);
                
                log.info("Evento de Inventario enviado: {} para ID: {}", routingKey, event.getAggregateId());
            } catch (Exception e) {
                log.error("Error publicando evento de inventario {}", event.getId(), e);
            }
        }
    }
}
