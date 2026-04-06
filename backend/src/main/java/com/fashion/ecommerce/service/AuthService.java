package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.AuthRequest;
import com.fashion.ecommerce.dto.AuthResponse;
import com.fashion.ecommerce.dto.RegisterRequest;
import com.fashion.ecommerce.domain.Role;
import com.fashion.ecommerce.domain.User;
import com.fashion.ecommerce.repository.UserRepository;
import com.fashion.ecommerce.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(request.email().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName().trim())
                .roles(Set.of(Role.USER))
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getId());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password()));
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow();
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getId());
    }
}
