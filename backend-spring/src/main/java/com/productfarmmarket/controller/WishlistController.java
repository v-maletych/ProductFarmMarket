package com.productfarmmarket.controller;

import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.User;
import com.productfarmmarket.model.Wishlist;
import com.productfarmmarket.repository.ProductRepository;
import com.productfarmmarket.repository.UserRepository;
import com.productfarmmarket.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    // 🔥 ГОЛОВНИЙ МЕТОД: TOGGLE (Додати/Видалити)
    @PostMapping("/toggle/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> toggleWishlist(@PathVariable Long productId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Перевіряємо, чи є вже в списку
        Optional<Wishlist> existingItem = wishlistRepository.findByUserAndProduct(user, product);

        if (existingItem.isPresent()) {
            // ЯКЩО Є -> ВИДАЛЯЄМО
            wishlistRepository.delete(existingItem.get());
            return ResponseEntity.ok("REMOVED");
        } else {
            // ЯКЩО НЕМАЄ -> ДОДАЄМО
            Wishlist newItem = new Wishlist();
            newItem.setUser(user);
            newItem.setProduct(product);
            wishlistRepository.save(newItem);
            return ResponseEntity.ok("ADDED");
        }
    }
}