package com.productfarmmarket.auth;


// Клас DTO для запиту на реєстрацію
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String numberPhone;
    private String selectedRole; // <-- НОВЕ ПОЛЕ: Для вибору ролі

    // Геттери та Сеттери
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNumberPhone() { return numberPhone; }
    public void setNumberPhone(String numberPhone) { this.numberPhone = numberPhone; }
    public String getSelectedRole() { return selectedRole; } // <-- НОВИЙ ГЕТТЕР
    public void setSelectedRole(String selectedRole) { this.selectedRole = selectedRole; } // <-- НОВИЙ СЕТТЕР
}