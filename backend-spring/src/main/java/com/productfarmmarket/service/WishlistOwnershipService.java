package com.productfarmmarket.service;

import com.productfarmmarket.repository.WishlistRepository;
import org.springframework.stereotype.Service;

@Service("wishlistOwnershipService")
public class WishlistOwnershipService {

    private final WishlistRepository wishlistRepository;

    public WishlistOwnershipService(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    public boolean isOwner(Long wishlistId, Long userId) {
        return wishlistRepository.findById(wishlistId)
                .map(wishlist -> wishlist.getUser() != null && wishlist.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}