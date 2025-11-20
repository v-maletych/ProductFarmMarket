package com.productfarmmarket.service;

import com.productfarmmarket.repository.WishlistRepository;
import org.springframework.stereotype.Service;

@Service("wishlistOwnershipService") // Назва біна для SpEL
public class WishlistOwnershipService {

    private final WishlistRepository wishlistRepository;

    public WishlistOwnershipService(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    /**
     * Перевіряє, чи є користувач (userId) власником елемента списку бажань (wishlistId).
     */
    public boolean isOwner(Long wishlistId, Long userId) {
        return wishlistRepository.findById(wishlistId)
                .map(wishlist -> wishlist.getUser() != null && wishlist.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}