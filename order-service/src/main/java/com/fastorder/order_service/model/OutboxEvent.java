package com.fastorder.order_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "outbox_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String aggregateType; // e.g., "ORDER"

    @Column(nullable = false)
    private String aggregateId;

    @Column(nullable = false)
    private String eventType; // e.g., "ORDER_CREATED"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String payload; // JSON del evento

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    @Column(nullable = false)
    private boolean processed = false;
}
