package com.productfarmmarket.controller;

import com.productfarmmarket.dto.UserResponse;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ІМПОРТ
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Отримання всіх користувачів - ТІЛЬКИ ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    // Створення користувача (не для реєстрації) - ТІЛЬКИ ADMIN
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public UserResponse createUser(@RequestBody User user) {
        // УВАГА: У реальному застосунку тут треба хешувати пароль!
        return new UserResponse(userRepository.save(user));
    }

    // Отримання користувача за ID - ТІЛЬКИ ADMIN (або сам користувач)
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == principal.userId") // principal.userId - поточний ID користувача
    public UserResponse getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user);
    }

    // Оновлення користувача - ТІЛЬКИ ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setNumberPhone(user.getNumberPhone());
        existingUser.setEmail(user.getEmail());
        return new UserResponse(userRepository.save(existingUser));
    }

    // Видалення користувача - ТІЛЬКИ ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}