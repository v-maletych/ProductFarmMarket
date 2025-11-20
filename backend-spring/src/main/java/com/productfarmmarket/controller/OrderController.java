package com.productfarmmarket.controller;

import com.productfarmmarket.model.Order;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.OrderRepository;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired // Потрібно для встановлення поточного користувача при створенні
    private UserRepository userRepository;

    // Отримання всіх замовлень - ТІЛЬКИ ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Додавання нового замовлення - ДОСТУПНО АВТЕНТИФІКОВАНОМУ КОРИСТУВАЧУ
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Order createOrder(@RequestBody Order order) {
        // Логіка встановлення поточного користувача як покупця
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        // Встановлюємо користувача-покупця
        order.setUser(currentUser);

        return orderRepository.save(order);
    }

    // Отримання замовлення за ID - ADMIN АБО ВЛАСНИК
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @orderOwnershipService.isOwner(#id, principal.userId)")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Оновлення замовлення - ТІЛЬКИ ADMIN (АБО ВЛАСНИК може скасувати, якщо захочете)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order existingOrder = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setOrderDate(order.getOrderDate());
        existingOrder.setPaymentStatus(order.getPaymentStatus());
        // ... оновлення інших полів
        return orderRepository.save(existingOrder);
    }

    // Видалення замовлення - ТІЛЬКИ ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }
}