package com.productfarmmarket.controller;

import com.productfarmmarket.enums.DeliveryStatus;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        order.setUser(currentUser);
        order.setOrderDate(java.time.LocalDateTime.now()); // <--- ВСТАНОВЛЮЄМО ЧАС
        order.setDeliveryStatus(com.productfarmmarket.enums.DeliveryStatus.IN_PROGRESS);
        order.setPaymentStatus(true); // Або логіка оплати

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

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public List<Order> getMyOrders() {
        // 1. Отримуємо email поточного користувача
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // 2. Знаходимо юзера в базі
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Шукаємо всі замовлення цього юзера
        // УВАГА: Переконайтеся, що у вас є метод findByUser в OrderRepository (див. нижче)
        return orderRepository.findByUser(currentUser);
    }

    // 1. Отримання вхідних замовлень (для ФЕРМЕРА)
    @GetMapping("/incoming")
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public List<Order> getIncomingOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // Знаходимо ID поточного фермера
        Long farmerId = userRepository.findByEmail(userEmail)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return orderRepository.findOrdersByFarmerId(farmerId);
    }

    // 2. Зміна статусу замовлення (для ФЕРМЕРА)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Тут проста логіка: беремо рядок, чистимо від лапок і перетворюємо в ENUM
        String cleanStatus = status.replace("\"", "").trim();

        try {
            order.setDeliveryStatus(DeliveryStatus.valueOf(cleanStatus));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + cleanStatus);
        }

        return orderRepository.save(order);
    }

    // Видалення замовлення - ТІЛЬКИ ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }
}