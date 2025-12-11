package com.productfarmmarket.service;

import com.productfarmmarket.repository.ProductRepository;
import org.springframework.stereotype.Service;


@Service("productOwnershipService") // Вказуємо назву біна для SpEL
public class ProductOwnershipService {

    private final ProductRepository productRepository;

    public ProductOwnershipService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Перевіряє, чи є користувач (за userId) власником продукту (за productId).
     */
    public boolean isOwner(Long productId, Long userId) {
        // Отримуємо продукт і порівнюємо ID власника
        return productRepository.findById(productId)
                .map(product -> product.getUser() != null && product.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}