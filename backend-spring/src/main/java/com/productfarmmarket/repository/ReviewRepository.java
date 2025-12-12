package com.productfarmmarket.repository;

import com.productfarmmarket.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user u WHERE r.reviewId = :id")
    Optional<Review> findById(@Param("id") Long id);

    List<Review> findByProduct_User_UserId(Long userId);
}