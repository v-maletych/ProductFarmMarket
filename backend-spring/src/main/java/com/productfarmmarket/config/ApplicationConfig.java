package com.productfarmmarket.config;

import com.productfarmmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor; // Припускаємо, що ви використовуєте Lombok для @RequiredArgsConstructor
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;
    // Порожній блок {} після userRepository; вилучено, оскільки він викликав би помилку.

    /**
     * Визначає, як Spring Security шукатиме користувачів (зазвичай по email).
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    /**
     * Визначає провайдера аутентифікації, який використовує UserDetailsService та PasswordEncoder.
     * Хоча методи все ще можуть відображатися як @Deprecated, ця структура є правильною
     * для ручної конфігурації у Spring Security.
     */
    @Bean
    @SuppressWarnings("deprecation") // <-- ДОДАЙТЕ ЦЕЙ РЯДОК
    public AuthenticationProvider authenticationProvider() {
        // Рядки 39 і 40, які генерують попередження, тепер будуть проігноровані
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(); 
        authProvider.setUserDetailsService(userDetailsService()); 
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Менеджер аутентифікації. Spring Boot 3+ вимагає цього @Bean.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Хешерування паролів.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}