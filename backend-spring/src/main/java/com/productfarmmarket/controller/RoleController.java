package com.productfarmmarket.controller;

import com.productfarmmarket.model.Role;
import com.productfarmmarket.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ІМПОРТ
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    // Отримання всіх ролей - ДОСТУПНО АВТЕНТИФІКОВАНИМ (для відображення UI)
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Додавання нової ролі - ТІЛЬКИ ADMIN
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Role createRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }

    // Отримання ролі за ID - ТІЛЬКИ ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Role getRoleById(@PathVariable Integer id) {
        return roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
    }
}