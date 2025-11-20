package com.productfarmmarket.repository;

import com.productfarmmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Метод, необхідний для Spring Security (логін відбувається через email)
    Optional<User> findByEmail(String email);
}