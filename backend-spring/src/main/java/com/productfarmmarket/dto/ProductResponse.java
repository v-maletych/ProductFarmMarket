package com.productfarmmarket.dto;

import com.productfarmmarket.model.Category;
import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.User;

// DTO для безпечного повернення даних продукту
public class ProductResponse {

    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Boolean inStock;
    private Long ownerId; // ID власника (фермера)
    private String ownerName;
    private String categoryName;

    // Конструктор, який приймає об'єкт Product і копіює лише потрібні поля
    public ProductResponse(Product product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.inStock = product.getInStock();

        // Перевірка на null, оскільки зв'язок ManyToOne може бути Lazy
        if (product.getUser() != null) {
            this.ownerId = product.getUser().getUserId();
            this.ownerName = product.getUser().getFirstName() + " " + product.getUser().getLastName();
        }
        if (product.getCategory() != null) {
            this.categoryName = product.getCategory().getName();
        }
    }

    // --- Геттери та Сеттери ---
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}