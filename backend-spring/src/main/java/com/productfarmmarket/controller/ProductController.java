package com.productfarmmarket.controller;

import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.User; // Імпорт
import com.productfarmmarket.repository.ProductRepository;
import com.productfarmmarket.repository.UserRepository; // Імпорт
import com.productfarmmarket.dto.ProductResponse; // Якщо у вас є ProductResponse DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Імпорт
import org.springframework.security.core.context.SecurityContextHolder; // Імпорт
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository; // <-- ДОДАНО ДЛЯ ЗНАХОДЖЕННЯ ПОТОЧНОГО КОРИСТУВАЧА

    // Отримання всіх продуктів - ДОСТУПНО УСІМ
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Створення продукту - FARMER та ADMIN
    @PostMapping
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public Product createProduct(@RequestBody Product product) {

        // --- ЛОГІКА ВСТАНОВЛЕННЯ ВЛАСНИКА ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        product.setUser(currentUser); // Встановлюємо поточного користувача як власника
        // --- КІНЕЦЬ ЛОГІКИ ---

        return productRepository.save(product);
    }

    // Отримання продукту за ID - ДОСТУПНО УСІМ
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Оновлення продукту - АДМІН АБО ВЛАСНИК
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @productOwnershipService.isOwner(#id, principal.userId)")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        // Перевіряємо, чи користувач намагається змінити власника. Якщо так, це робить лише ADMIN
        if (product.getUser() != null && !product.getUser().getUserId().equals(existingProduct.getUser().getUserId())) {
            // Додаткова перевірка, щоб не змінювати власника, якщо це не Admin
            if (!SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
                throw new RuntimeException("Only ADMIN can change product ownership.");
            }
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setInStock(product.getInStock());

        return productRepository.save(existingProduct);
    }

    // Видалення продукту - АДМІН АБО ВЛАСНИК
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @productOwnershipService.isOwner(#id, principal.userId)")
    public void deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }
}