package com.productfarmmarket.controller;

import com.productfarmmarket.model.Review;
import com.productfarmmarket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // Отримання всіх відгуків - ДОСТУПНО УСІМ (Публічні дані)
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Додавання нового відгуку - ЛИШЕ АВТЕНТИФІКОВАНИЙ
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Review createReview(@RequestBody Review review) {
        // УВАГА: Тут має бути логіка встановлення поточного користувача як автора!
        return reviewRepository.save(review);
    }

    // Отримання відгуку за ID - ДОСТУПНО УСІМ
    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    // Оновлення відгуку - АДМІН АБО ВЛАСНИК
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewOwnershipService.isOwner(#id, principal.userId)")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review existingReview = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        existingReview.setRaiting(review.getRaiting());
        existingReview.setComment(review.getComment());
        return reviewRepository.save(existingReview);
    }

    // Видалення відгуку - АДМІН АБО ВЛАСНИК
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewOwnershipService.isOwner(#id, principal.userId)")
    public void deleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }
}