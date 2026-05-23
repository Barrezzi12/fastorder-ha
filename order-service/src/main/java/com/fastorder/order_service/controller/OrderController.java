package com.fastorder.order_service.controller;

import com.fastorder.order_service.dto.OrderRequest;
import com.fastorder.order_service.model.Order;
import com.fastorder.order_service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        Order order = service.createOrder(request);
        return ResponseEntity.ok(new OrderResponse(
                order.getExternalId(),
                order.getStatus().name(),
                order.getTotal()
        ));
    }

    @GetMapping
    public ResponseEntity<java.util.List<Order>> list() {
        return ResponseEntity.ok(service.getAllOrders());
    }
}

record OrderResponse(
    UUID orderId,
    String status,
    java.math.BigDecimal total
) {}
