package com.productfarmmarket.repository;

import com.productfarmmarket.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // ДОДАНО: Спеціальний запит для завантаження відгуку разом з інформацією про автора (User)
    // Це запобігає помилкам LazyInitializationException при перевірці власності у @PreAuthorize
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user u WHERE r.reviewId = :id")
    Optional<Review> findById(@Param("id") Long id);
}