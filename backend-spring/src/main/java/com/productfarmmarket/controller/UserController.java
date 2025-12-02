package com.productfarmmarket.controller;

import com.productfarmmarket.dto.UserResponse;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // --- Допоміжний метод для обробки Not Found ---
    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + id));
    }


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

    // Отримання користувача за ID - ADMIN або САМ КОРИСТУВАЧ
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public UserResponse getUserById(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        return new UserResponse(user);
    }

    // Оновлення користувача - ADMIN або САМ КОРИСТУВАЧ
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody User user) {

        User existingUser = findUserOrThrow(id);

        // 1. ОНОВЛЮЄМО ЛИШЕ ДОЗВОЛЕНІ ПОЛЯ (ІГНОРУЮЧИ EMAIL ТА PASSWD)
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setNumberPhone(user.getNumberPhone());

        // 2. ЗБЕРІГАЄМО
        // Примітка: Оскільки email та passwd не оновлюються, конфлікт унікальності
        // або скидання пароля не відбудеться.
        return new UserResponse(userRepository.save(existingUser));
    }

    // Видалення користувача - ADMIN або САМ КОРИСТУВАЧ
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public void deleteUser(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }
}

