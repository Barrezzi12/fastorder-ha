package com.fastorder.menu_service.controller;

import com.fastorder.menu_service.model.Product;
import com.fastorder.menu_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final ProductRepository productRepository;

    @GetMapping
    @Cacheable(value = "products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    @CacheEvict(value = "products", allEntries = true)
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
