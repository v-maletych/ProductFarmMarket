package com.productfarmmarket.model;

import com.productfarmmarket.enums.Raiting;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime; // <--- ПРАВИЛЬНИЙ ІМПОРТ

@Entity
@Table(name = "reviews")
public class Review {
    // ... (поля id, product, user, raiting залишаються без змін) ...
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Raiting raiting;

    private String comment;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt; // <--- Змінено з Timestamp

    // Геттери та Сеттери...
    // (Додайте їх для всіх полів)
    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Raiting getRaiting() { return raiting; }
    public void setRaiting(Raiting raiting) { this.raiting = raiting; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}