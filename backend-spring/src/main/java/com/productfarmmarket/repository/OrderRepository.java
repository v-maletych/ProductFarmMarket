package com.productfarmmarket.repository;

import com.productfarmmarket.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ДОДАНО: Завантажуємо замовлення разом з користувачем (власником)
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user u WHERE o.orderId = :id")
    Optional<Order> findById(@Param("id") Long id);
}