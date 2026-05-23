package com.fastorder.order_service.repository;

import com.fastorder.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByClientOrderId(UUID clientOrderId);
    Optional<Order> findByExternalId(UUID externalId);
    java.util.List<Order> findTop100ByOrderByCreatedAtDesc();
}
