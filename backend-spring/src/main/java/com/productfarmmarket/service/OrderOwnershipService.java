package com.productfarmmarket.service;

import com.productfarmmarket.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service("orderOwnershipService") // Важливо: назва біна для SpEL
public class OrderOwnershipService {

    private final OrderRepository orderRepository;

    public OrderOwnershipService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Перевіряє, чи є користувач (userId) власником замовлення (orderId).
     */
    public boolean isOwner(Long orderId, Long userId) {
        return orderRepository.findById(orderId)
                // Перевіряємо, чи існує замовлення і чи збігається його автор з поточним користувачем
                .map(order -> order.getUser() != null && order.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}