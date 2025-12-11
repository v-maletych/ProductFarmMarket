package com.productfarmmarket.repository;

import com.productfarmmarket.model.Order;
import com.productfarmmarket.model.User; // <--- Не забудьте імпорт
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user u WHERE o.orderId = :id")
    Optional<Order> findById(@Param("id") Long id);

    // 🔥 ДОДАЙТЕ ЦЕЙ МЕТОД, ЯКЩО ЙОГО НЕМАЄ 🔥
    // Це дозволяє знайти всі замовлення конкретного юзера
    List<Order> findByUser(User user);

    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN OrderItem oi ON o.orderId = oi.order.orderId " +
            "JOIN Product p ON oi.product.productId = p.productId " +
            "WHERE p.user = :farmer")
    List<Order> findOrdersByFarmer(@Param("farmer") User farmer);
}