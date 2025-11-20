package com.productfarmmarket.config;

import com.productfarmmarket.enums.RoleType;
import com.productfarmmarket.model.Role;
import com.productfarmmarket.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    // Створюємо Bean, який буде виконаний при старті застосунку
    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            // Перевіряємо, чи існує вже роль CUSTOMER, щоб уникнути дублікатів
            if (roleRepository.findByType(RoleType.CUSTOMER).isEmpty()) {

                // --- Створення Ролей ---

                // 1. ADMIN
                Role adminRole = new Role();
                adminRole.setType(RoleType.ADMIN);

                // 2. FARMER
                Role farmerRole = new Role();
                farmerRole.setType(RoleType.FARMER);

                // 3. CUSTOMER (Стандартна роль для реєстрації)
                Role customerRole = new Role();
                customerRole.setType(RoleType.CUSTOMER);

                // Зберігаємо всі ролі в базі даних
                roleRepository.saveAll(Arrays.asList(adminRole, farmerRole, customerRole));

                System.out.println("✅ Початкові ролі успішно ініціалізовано.");
            }
        };
    }
}