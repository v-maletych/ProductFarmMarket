package com.productfarmmarket.dto;

import com.productfarmmarket.enums.RoleType;
import com.productfarmmarket.model.User;

// DTO для безпечного повернення даних користувача фронтенду
public class UserResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String numberPhone;
    private String email;
    private RoleType role;

    // Конструктор, який приймає об'єкт User і копіює лише потрібні поля
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.numberPhone = user.getNumberPhone();
        this.email = user.getEmail();
        this.role = user.getRole().getType();
    }

    // --- Геттери та Сеттери ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getNumberPhone() { return numberPhone; }
    public void setNumberPhone(String numberPhone) { this.numberPhone = numberPhone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public RoleType getRole() { return role; }
    public void setRole(RoleType role) { this.role = role; }
}