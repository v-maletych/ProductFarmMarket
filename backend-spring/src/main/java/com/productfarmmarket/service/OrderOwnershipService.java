package com.productfarmmarket.service;

import com.productfarmmarket.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service("orderOwnershipService")
public class OrderOwnershipService {

    private final OrderRepository orderRepository;

    public OrderOwnershipService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public boolean isOwner(Long orderId, Long userId) {
        return orderRepository.findById(orderId)
                .map(order -> order.getUser() != null && order.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}