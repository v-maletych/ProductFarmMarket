package com.productfarmmarket.controller;

import com.productfarmmarket.model.Review;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.ReviewRepository;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-products")
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public List<Review> getMyProductReviews() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewRepository.findByProduct_User_UserId(currentUser.getUserId());
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @GetMapping("/seller/{sellerId}")
    public List<Review> getReviewsBySeller(@PathVariable Long sellerId) {
        return reviewRepository.findByProduct_User_UserId(sellerId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Review createReview(@RequestBody Review review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        review.setUser(currentUser);
        review.setCreatedAt(java.time.LocalDateTime.now());

        if (review.getProduct() != null && review.getProduct().getProductId() != null) {
        }

        return reviewRepository.save(review);
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewOwnershipService.isOwner(#id, principal.userId)")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review existingReview = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        existingReview.setRaiting(review.getRaiting());
        existingReview.setComment(review.getComment());
        return reviewRepository.save(existingReview);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewOwnershipService.isOwner(#id, principal.userId)")
    public void deleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }
}