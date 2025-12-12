package com.productfarmmarket.repository;

import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.User;
import com.productfarmmarket.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
}