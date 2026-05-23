package com.fastorder.inventory_service.repository;

import com.fastorder.inventory_service.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OutboxRepository extends JpaRepository<OutboxEvent, Long> {
    List<OutboxEvent> findTop200ByProcessedFalseOrderByCreatedAtAsc();
}
