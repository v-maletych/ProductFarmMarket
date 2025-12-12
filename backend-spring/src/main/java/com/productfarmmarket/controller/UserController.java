package com.productfarmmarket.controller;

import com.productfarmmarket.dto.UserResponse;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public UserResponse createUser(@RequestBody User user) {
        return new UserResponse(userRepository.save(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public UserResponse getUserById(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        return new UserResponse(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody User user) {

        User existingUser = findUserOrThrow(id);

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setNumberPhone(user.getNumberPhone());

        return new UserResponse(userRepository.save(existingUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.userId")
    public void deleteUser(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }
}

