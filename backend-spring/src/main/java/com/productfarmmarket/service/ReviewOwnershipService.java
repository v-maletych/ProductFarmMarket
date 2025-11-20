package com.productfarmmarket.service;

import com.productfarmmarket.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service("reviewOwnershipService") // Важливо: назва біна повинна збігатися з @PreAuthorize
public class ReviewOwnershipService {

    private final ReviewRepository reviewRepository;

    public ReviewOwnershipService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Перевіряє, чи є користувач (userId) автором відгуку (reviewId).
     */
    public boolean isOwner(Long reviewId, Long userId) {
        // 1. Знаходимо відгук
        return reviewRepository.findById(reviewId)
                // 2. Якщо знайдено, перевіряємо, чи є автор (user) та чи збігається його ID
                .map(review -> review.getUser() != null && review.getUser().getUserId().equals(userId))
                // 3. Якщо відгуку немає, повертаємо false
                .orElse(false);
    }
}