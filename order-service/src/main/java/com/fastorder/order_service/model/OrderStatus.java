package com.fastorder.order_service.model;

public enum OrderStatus {
    PENDING,
    INVENTORY_RESERVED,
    KITCHEN_ACCEPTED,
    CONFIRMED,
    FAILED,
    COMPENSATING, // Para SAGA
    CANCELLED
}
