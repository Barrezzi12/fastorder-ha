package com.fastorder.inventory_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String INVENTORY_EXCHANGE = "inventory.exchange";
    public static final String STOCK_RESERVED_QUEUE = "stock.reserved.queue";
    public static final String STOCK_REJECTED_QUEUE = "stock.rejected.queue";

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public DirectExchange inventoryExchange() {
        return new DirectExchange(INVENTORY_EXCHANGE, true, false);
    }

    @Bean
    public Queue stockReservedQueue() {
        return new Queue(STOCK_RESERVED_QUEUE, true);
    }

    @Bean
    public Queue stockRejectedQueue() {
        return new Queue(STOCK_REJECTED_QUEUE, true);
    }

    @Bean
    public Binding stockReservedBinding() {
        return BindingBuilder.bind(stockReservedQueue())
                .to(inventoryExchange())
                .with("stock.reserved");
    }

    @Bean
    public Binding stockRejectedBinding() {
        return BindingBuilder.bind(stockRejectedQueue())
                .to(inventoryExchange())
                .with("stock.rejected");
    }
}
