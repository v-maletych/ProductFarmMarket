package com.productfarmmarket.controller;

import com.productfarmmarket.model.OrderItem;
import com.productfarmmarket.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ІМПОРТ
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderitems")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    // Отримання всіх елементів замовлення - ТІЛЬКИ ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Додавання нового елементу замовлення - ТІЛЬКИ ADMIN
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderItem createOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Отримання елементу замовлення за ID - ТІЛЬКИ ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderItem getOrderItemById(@PathVariable Long id) {
        return orderItemRepository.findById(id).orElseThrow(() -> new RuntimeException("Order item not found"));
    }

    // Потрібно додати методи PUT та DELETE і також захистити їх ADMIN.
    // Наразі залишаємо так, як було у вашому початковому коді, але з PreAuthorize.
}