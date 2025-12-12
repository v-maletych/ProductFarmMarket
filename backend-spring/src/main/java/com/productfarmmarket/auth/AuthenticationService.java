package com.productfarmmarket.auth;

import com.productfarmmarket.enums.RoleType;
import com.productfarmmarket.jwt.JwtService;
import com.productfarmmarket.model.Role;
import com.productfarmmarket.model.User;
import com.productfarmmarket.repository.RoleRepository;
import com.productfarmmarket.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {

        RoleType requestedRoleType;
        try {
            requestedRoleType = RoleType.valueOf(request.getSelectedRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid or missing role selection. Must be CUSTOMER or FARMER.");
        }

        if (requestedRoleType != RoleType.CUSTOMER && requestedRoleType != RoleType.FARMER) {
            throw new RuntimeException("Cannot register as " + requestedRoleType.name() + ". Only CUSTOMER and FARMER roles are allowed.");
        }

        Role finalRole = roleRepository.findByType(requestedRoleType)
                .orElseThrow(() -> new RuntimeException("Role " + requestedRoleType.name() + " not found. Please initialize roles."));


        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setNumberPhone(request.getNumberPhone());
        user.setPasswd(passwordEncoder.encode(request.getPassword()));

        user.setRole(finalRole);

        User savedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(savedUser);
        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(jwtToken);
    }
}