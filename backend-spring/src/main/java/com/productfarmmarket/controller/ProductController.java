package com.productfarmmarket.controller;

import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.ProductRepository;
import com.productfarmmarket.repository.UserRepository;
import com.productfarmmarket.dto.ProductResponse; // <-- ТЕПЕР ПРАЦЮЄ
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // <-- ДОДАЄМО ІМПОРТ

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Отримання всіх продуктів - ПОВЕРТАЄМО DTO
    @GetMapping
    public List<ProductResponse> getAllProducts() {
        // 🔥 ВИКОРИСТОВУЄМО НОВИЙ МЕТОД З EAGER LOADING 🔥
        return productRepository.findAllWithDetails().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    // Створення продукту - ПОВЕРТАЄМО DTO
    @PostMapping
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public ProductResponse createProduct(@RequestBody Product product) {

        // --- ЛОГІКА ВСТАНОВЛЕННЯ ВЛАСНИКА ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        product.setUser(currentUser); // Встановлюємо поточного користувача як власника
        // --- КІНЕЦЬ ЛОГІКИ ---

        return new ProductResponse(productRepository.save(product));
    }

    // Отримання продукту за ID - ПОВЕРТАЄМО DTO
    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductResponse(product);
    }

    // Оновлення продукту - ПОВЕРТАЄМО DTO
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @productOwnershipService.isOwner(#id, principal.userId)")
    public ProductResponse updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        // Логіка перевірки зміни власника (залишаємо для ADMIN)
        if (product.getUser() != null && !product.getUser().getUserId().equals(existingProduct.getUser().getUserId())) {
            if (!SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
                throw new RuntimeException("Only ADMIN can change product ownership.");
            }
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setInStock(product.getInStock());

        return new ProductResponse(productRepository.save(existingProduct));
    }

    // Видалення продукту
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @productOwnershipService.isOwner(#id, principal.userId)")
    public void deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    @GetMapping("/seller/{sellerId}")
    public List<ProductResponse> getProductsBySeller(@PathVariable Long sellerId) {
        return productRepository.findByUser_UserId(sellerId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
}