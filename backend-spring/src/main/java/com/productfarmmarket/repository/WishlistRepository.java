package com.productfarmmarket.repository;

import com.productfarmmarket.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Завантажуємо елемент Wishlist разом із User (власником)
    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.user u WHERE w.wishlistId = :id")
    Optional<Wishlist> findById(@Param("id") Long id);
}