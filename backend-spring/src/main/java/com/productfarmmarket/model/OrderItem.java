package com.productfarmmarket.model;

import com.fasterxml.jackson.annotation.JsonBackReference; // Імпорт
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items") // Краще використовувати snake_case
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderItem_id")
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference // 🔥 ДОДАТИ ЦЕ (це зворотна сторона зв'язку)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private Double price; // Краще Double, якщо у вас в Product Double

    // ... Геттери та Сеттери ...
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}