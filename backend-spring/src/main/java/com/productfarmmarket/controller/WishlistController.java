package com.productfarmmarket.controller;

import com.productfarmmarket.model.Wishlist;
import com.productfarmmarket.model.User; // Імпорт
import com.productfarmmarket.repository.WishlistRepository;
import com.productfarmmarket.repository.UserRepository; // Імпорт
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository; // <-- ДОДАНО ДЛЯ ЗНАХОДЖЕННЯ ПОТОЧНОГО КОРИСТУВАЧА

    // Отримання всіх елементів - ТІЛЬКИ ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Wishlist> getAllWishlistItems() {
        return wishlistRepository.findAll();
    }

    // Додавання продукту до списку - АВТЕНТИФІКОВАНИЙ КОРИСТУВАЧ
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Wishlist addToWishlist(@RequestBody Wishlist wishlist) {

        // --- ЛОГІКА ВСТАНОВЛЕННЯ ВЛАСНИКА ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        wishlist.setUser(currentUser); // Встановлюємо поточного користувача як власника
        // --- КІНЕЦЬ ЛОГІКИ ---

        return wishlistRepository.save(wishlist);
    }

    // Видалення продукту зі списку - АДМІН АБО ВЛАСНИК
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @wishlistOwnershipService.isOwner(#id, principal.userId)")
    public void removeFromWishlist(@PathVariable Long id) {
        Wishlist wishlist = wishlistRepository.findById(id).orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        wishlistRepository.delete(wishlist);
    }
}