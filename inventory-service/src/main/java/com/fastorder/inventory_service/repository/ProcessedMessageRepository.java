package com.fastorder.inventory_service.repository;

import com.fastorder.inventory_service.model.ProcessedMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedMessageRepository extends JpaRepository<ProcessedMessage, String> {
}
