package com.fashion.ecommerce.dto;

import java.math.BigDecimal;

public record CartItemDto(Long id, ProductDto product, int quantity, BigDecimal lineTotal) {
}
