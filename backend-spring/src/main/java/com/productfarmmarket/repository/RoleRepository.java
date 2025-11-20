package com.productfarmmarket.repository;

import com.productfarmmarket.model.Role;
import com.productfarmmarket.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    // Метод для пошуку ролі за типом (ENUM)
    Optional<Role> findByType(RoleType type);
}