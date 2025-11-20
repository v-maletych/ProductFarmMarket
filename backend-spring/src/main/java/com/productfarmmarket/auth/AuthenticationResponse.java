package com.productfarmmarket.auth;

// Клас DTO для відповіді з JWT токеном
public class AuthenticationResponse {
    private String token;

    public AuthenticationResponse(String token) {
        this.token = token;
    }

    // Геттери та Сеттери
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}