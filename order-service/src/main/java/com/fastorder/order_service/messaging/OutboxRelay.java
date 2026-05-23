package com.fastorder.order_service.messaging;

import com.fastorder.order_service.model.OutboxEvent;
import com.fastorder.order_service.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class OutboxRelay {

    private final OutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;

    /**
     * Procesa eventos pendientes de la tabla Outbox.
     * En producción se usaría CDC (Change Data Capture) como Debezium para latencia < 10ms.
     * Aquí usamos un Scheduler optimizado para la demo.
     */
    @Scheduled(fixedDelay = 100) // Cada 100ms para alta disponibilidad y throughput
    @Transactional
    public void processOutboxEvents() {
        // Obtenemos un lote controlado para no bloquear la DB mucho tiempo
        List<OutboxEvent> pendingEvents = outboxRepository.findTop200ByProcessedFalseOrderByCreatedAtAsc();
        
        if (pendingEvents.isEmpty()) return;

        log.info("Procesando {} eventos pendientes en Outbox", pendingEvents.size());

        for (OutboxEvent event : pendingEvents) {
            try {
                // Publicación con Publisher Confirms (configurado en properties)
                rabbitTemplate.convertAndSend(
                        "order.exchange",
                        "order.created",
                        event.getPayload() // Enviamos el JSON pre-generado
                );

                event.setProcessed(true);
                event.setProcessedAt(LocalDateTime.now());
                outboxRepository.save(event);
                
            } catch (Exception e) {
                log.error("Fallo al publicar evento {} de la Outbox. Reintentará en el próximo ciclo.", event.getId(), e);
                // No marcamos como procesado, el scheduler lo intentará de nuevo (Backoff natural)
            }
        }
    }
}
