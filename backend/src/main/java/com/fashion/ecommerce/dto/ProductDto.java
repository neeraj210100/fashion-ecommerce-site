package com.fashion.ecommerce.dto;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        CategoryDto category,
        int stock,
        boolean featured
) {
}
