package com.productfarmmarket.service;

import com.productfarmmarket.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service("reviewOwnershipService")
public class ReviewOwnershipService {

    private final ReviewRepository reviewRepository;

    public ReviewOwnershipService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public boolean isOwner(Long reviewId, Long userId) {
        return reviewRepository.findById(reviewId)
                .map(review -> review.getUser() != null && review.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}