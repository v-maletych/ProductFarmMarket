package com.productfarmmarket.controller;

import com.productfarmmarket.model.OrderItem;
import com.productfarmmarket.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderitems")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderItem createOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderItem getOrderItemById(@PathVariable Long id) {
        return orderItemRepository.findById(id).orElseThrow(() -> new RuntimeException("Order item not found"));
    }
}