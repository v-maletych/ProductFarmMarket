package com.productfarmmarket.config;

import com.productfarmmarket.enums.RoleType;
import com.productfarmmarket.model.Category;
import com.productfarmmarket.model.Product;
import com.productfarmmarket.model.Role;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.CategoryRepository;
import com.productfarmmarket.repository.ProductRepository;
import com.productfarmmarket.repository.RoleRepository;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initData(RoleRepository roleRepository,
                                      UserRepository userRepository,
                                      CategoryRepository categoryRepository,
                                      ProductRepository productRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {

            // 1. РОЛІ
            Role adminRole = roleRepository.findByType(RoleType.ADMIN).orElseGet(() -> roleRepository.save(createRole(RoleType.ADMIN)));
            Role farmerRole = roleRepository.findByType(RoleType.FARMER).orElseGet(() -> roleRepository.save(createRole(RoleType.FARMER)));
            Role customerRole = roleRepository.findByType(RoleType.CUSTOMER).orElseGet(() -> roleRepository.save(createRole(RoleType.CUSTOMER)));

            // 2. ЮЗЕРИ
            User farmer = userRepository.findByEmail("farmer@gmail.com").orElseGet(() -> {
                User u = new User();
                u.setEmail("farmer@gmail.com");
                u.setPasswd(passwordEncoder.encode("password"));
                u.setFirstName("Іван");
                u.setLastName("Фермер");
                u.setNumberPhone("0991234567");
                u.setRole(farmerRole);
                return userRepository.save(u);
            });

            if (userRepository.findByEmail("client@gmail.com").isEmpty()) {
                User u = new User();
                u.setEmail("client@gmail.com");
                u.setPasswd(passwordEncoder.encode("password"));
                u.setFirstName("Олена");
                u.setLastName("Покупець");
                u.setNumberPhone("0997654321");
                u.setRole(customerRole);
                userRepository.save(u);
            }

            // 3. КАТЕГОРІЇ
            if (categoryRepository.count() == 0) {
                List<Category> categories = Arrays.asList(
                        createCategory("Овочі"),
                        createCategory("Фрукти"),
                        createCategory("М'ясо та Птиця"),
                        createCategory("Молочні продукти"),
                        createCategory("Яйця"),
                        createCategory("Бакалія"),
                        createCategory("Мед та Варення")
                );
                categoryRepository.saveAll(categories);
            }

            // 4. ТОВАРИ З ФОТО
            if (productRepository.count() == 0) {
                Category veg = getCat(categoryRepository, "Овочі");
                Category fruit = getCat(categoryRepository, "Фрукти");
                Category meat = getCat(categoryRepository, "М'ясо та Птиця");
                Category dairy = getCat(categoryRepository, "Молочні продукти");
                Category eggs = getCat(categoryRepository, "Яйця");
                Category honey = getCat(categoryRepository, "Мед та Варення");

                List<Product> products = Arrays.asList(
                        // Овочі
                        createProduct(farmer, veg, "Картопля молода", "Свіжа картопля з власного городу.", 25.00,
                                "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600"),
                        createProduct(farmer, veg, "Помідори рожеві", "Солодкі домашні помідори.", 85.00,
                                "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600"),
                        createProduct(farmer, veg, "Огірки хрусткі", "Тільки з грядки.", 60.00,
                                "https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=600"),

                        // Фрукти
                        createProduct(farmer, fruit, "Яблука Голден", "Солодкі яблука з Вінничини.", 40.00,
                                "https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=600"),
                        createProduct(farmer, fruit, "Полуниця", "Ароматна сезонна полуниця.", 120.00,
                                "https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=600"),

                        // М'ясо
                        createProduct(farmer, meat, "Свинина (ошийок)", "Свіже домашнє м'ясо.", 220.00,
                                "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=600"),
                        createProduct(farmer, meat, "Курка домашня", "Ціла тушка бройлера.", 150.00,
                                "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=600"),

                        // Молочка
                        createProduct(farmer, dairy, "Молоко коров'яче (1л)", "Ранкове незбиране молоко.", 40.00,
                                "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600"),
                        createProduct(farmer, dairy, "Сир домашній", "Жирний домашній творог.", 140.00,
                                "https://images.pexels.com/photos/4187778/pexels-photo-4187778.jpeg?auto=compress&cs=tinysrgb&w=600"),

                        // Яйця
                        createProduct(farmer, eggs, "Яйця курячі (10 шт)", "Великі домашні яйця.", 60.00,
                                "https://images.pexels.com/photos/162712/eggs-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600"),

                        // Мед
                        createProduct(farmer, honey, "Мед Липовий (0.5л)", "Натуральний мед зі власної пасіки.", 180.00,
                                "https://images.pexels.com/photos/33242/honey-comb-honey-bee-hive.jpg?auto=compress&cs=tinysrgb&w=600")
                );

                productRepository.saveAll(products);
                System.out.println("✅ Товари з фото створено!");
            }
        };
    }

    private Role createRole(RoleType type) {
        Role r = new Role(); r.setType(type); return r;
    }
    private Category createCategory(String name) {
        Category c = new Category(); c.setName(name); return c;
    }
    private Category getCat(CategoryRepository repo, String name) {
        return repo.findAll().stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }

    // Оновлений метод з параметром image
    private Product createProduct(User user, Category category, String name, String description, Double price, String image) {
        Product p = new Product();
        p.setUser(user);
        p.setCategory(category);
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setInStock(true);
        p.setImage(image); // Зберігаємо URL
        return p;
    }
}