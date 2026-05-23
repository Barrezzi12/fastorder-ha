package com.fastorder.order_service.repository;

import com.fastorder.order_service.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OutboxRepository extends JpaRepository<OutboxEvent, UUID> {
    List<OutboxEvent> findTop200ByProcessedFalseOrderByCreatedAtAsc();
}
