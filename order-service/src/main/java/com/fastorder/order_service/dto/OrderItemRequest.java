package com.fastorder.order_service.dto;

import jakarta.validation.constraints.*;

public record OrderItemRequest(
    @NotBlank String productId,
    @Min(1) int quantity
) {}
