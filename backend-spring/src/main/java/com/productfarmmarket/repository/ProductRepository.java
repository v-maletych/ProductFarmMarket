package com.productfarmmarket.repository;

import com.productfarmmarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List; // <-- ДОДАНО ІМПОРТ
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Перевизначаємо findById, щоб примусово завантажувати власника (User)
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.user u LEFT JOIN FETCH p.category c WHERE p.productId = :id")
    Optional<Product> findById(@Param("id") Long id);

    // 🔥 КРИТИЧНЕ ВИПРАВЛЕННЯ: Додаємо метод для завантаження ВСІХ продуктів з Category та User
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.user u LEFT JOIN FETCH p.category c")
    List<Product> findAllWithDetails();

    List<Product> findByUser_UserId(Long userId);
}