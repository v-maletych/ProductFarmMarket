package com.productfarmmarket.auth;

// Клас DTO для запиту на аутентифікацію (вхід)
public class AuthenticationRequest {
    private String email;
    private String password;

    // Геттери та Сеттери
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}