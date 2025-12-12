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

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Order createOrder(@RequestBody Order order) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        order.setUser(currentUser);
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setDeliveryStatus(com.productfarmmarket.enums.DeliveryStatus.IN_PROGRESS);
        order.setPaymentStatus(true);

        if (order.getOrderItems() != null) {
            for (com.productfarmmarket.model.OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
            }
        }

        return orderRepository.save(order);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @orderOwnershipService.isOwner(#id, principal.userId)")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order existingOrder = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setOrderDate(order.getOrderDate());
        existingOrder.setPaymentStatus(order.getPaymentStatus());
        return orderRepository.save(existingOrder);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public List<Order> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(currentUser);
    }

    @GetMapping("/incoming")
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public List<Order> getIncomingOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        Long farmerId = userRepository.findByEmail(userEmail)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return orderRepository.findOrdersByFarmerId(farmerId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('FARMER', 'ADMIN')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String cleanStatus = status.replace("\"", "").trim();

        try {
            order.setDeliveryStatus(DeliveryStatus.valueOf(cleanStatus));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + cleanStatus);
        }

        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }
}