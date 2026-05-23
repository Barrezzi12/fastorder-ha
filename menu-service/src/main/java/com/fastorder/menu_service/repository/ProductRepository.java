package com.fastorder.menu_service.repository;

import com.fastorder.menu_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
