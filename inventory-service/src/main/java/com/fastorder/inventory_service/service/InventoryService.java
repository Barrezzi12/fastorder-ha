package com.fastorder.inventory_service.service;

import com.fastorder.inventory_service.model.*;
import com.fastorder.inventory_service.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final OutboxRepository outboxRepository;
    private final ProcessedMessageRepository processedMessageRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processOrderCreated(String orderPayload) {
        try {
            Map<String, Object> order = objectMapper.readValue(orderPayload, Map.class);
            String externalId = (String) order.get("externalId");
            java.util.List<Map<String, Object>> items = (java.util.List<Map<String, Object>>) order.get("items");

            // 1. CHEQUEO DE IDEMPOTENCIA (Anti-Duplicidad)
            if (processedMessageRepository.existsById(externalId)) {
                log.warn("Pedido {} ya fue procesado por el inventario. Ignorando duplicado.", externalId);
                return;
            }
            
            log.info("Validando stock para pedido: {} con {} items", externalId, items != null ? items.size() : 0);

            boolean allAvailable = true;
            if (items == null || items.isEmpty()) {
                allAvailable = false;
            } else {
                for (Map<String, Object> item : items) {
                    String productId = (String) item.get("productId");
                    Integer quantity = (Integer) item.get("quantity");
                    
                    Inventory stock = inventoryRepository.findBySku(productId).orElse(null);
                    if (stock == null || stock.getQuantity() < quantity) {
                        log.warn("Stock insuficiente para producto: {}. Requerido: {}, Disponible: {}", 
                                productId, quantity, stock != null ? stock.getQuantity() : 0);
                        allAvailable = false;
                        break;
                    }
                }
            }

            if (allAvailable) {
                for (Map<String, Object> item : items) {
                    String productId = (String) item.get("productId");
                    Integer quantity = (Integer) item.get("quantity");
                    Inventory stock = inventoryRepository.findBySku(productId).get();
                    stock.setQuantity(stock.getQuantity() - quantity);
                    inventoryRepository.save(stock);
                }

                createOutboxEvent("STOCK_RESERVED", externalId, orderPayload);
                log.info("Stock RESERVADO para pedido: {}", externalId);
            } else {
                createOutboxEvent("STOCK_REJECTED", externalId, orderPayload);
                log.warn("Stock RECHAZADO para pedido: {}", externalId);
            }

            // 2. REGISTRAR MENSAJE PROCESADO
            processedMessageRepository.save(new ProcessedMessage(externalId, null));

        } catch (Exception e) {
            log.error("Error procesando stock", e);
            throw new RuntimeException("Error en consistencia de inventario");
        }
    }

    private void createOutboxEvent(String type, String aggregateId, String payload) {
        OutboxEvent event = OutboxEvent.builder()
                .aggregateType("INVENTORY")
                .aggregateId(aggregateId)
                .eventType(type)
                .payload(payload)
                .build();
        outboxRepository.save(event);
    }
}
