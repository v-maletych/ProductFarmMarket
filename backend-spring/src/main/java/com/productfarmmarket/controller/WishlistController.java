package com.productfarmmarket.controller;

import com.productfarmmarket.model.Wishlist;
import com.productfarmmarket.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    // get all the products from wishlist
    @GetMapping
    public List<Wishlist> getAllWishlistItems() {
        return wishlistRepository.findAll();
    }

    // add product to wishlist
    @PostMapping
    public Wishlist addToWishlist(@RequestBody Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    // delete product from the wishlist
    @DeleteMapping("/{id}")
    public void removeFromWishlist(@PathVariable Long id) {
        Wishlist wishlist = wishlistRepository.findById(id).orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        wishlistRepository.delete(wishlist);
    }
}