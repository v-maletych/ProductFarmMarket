package com.productfarmmarket.service;

import com.productfarmmarket.repository.ProductRepository;
import org.springframework.stereotype.Service;


@Service("productOwnershipService")
public class ProductOwnershipService {

    private final ProductRepository productRepository;

    public ProductOwnershipService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public boolean isOwner(Long productId, Long userId) {
        return productRepository.findById(productId)
                .map(product -> product.getUser() != null && product.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}