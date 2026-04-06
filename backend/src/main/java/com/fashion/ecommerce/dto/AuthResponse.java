package com.fashion.ecommerce.dto;

public record AuthResponse(String token, String email, String fullName, Long userId) {
}
