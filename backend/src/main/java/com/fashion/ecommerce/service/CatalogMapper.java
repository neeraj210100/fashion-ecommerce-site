package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CategoryDto;
import com.fashion.ecommerce.dto.ProductDto;
import com.fashion.ecommerce.domain.Category;
import com.fashion.ecommerce.domain.Product;
import org.springframework.stereotype.Component;

@Component
public class CatalogMapper {

    public CategoryDto toDto(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug());
    }

    public ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getDescription(),
                p.getPrice(),
                p.getImageUrl(),
                toDto(p.getCategory()),
                p.getStock(),
                p.isFeatured()
        );
    }
}
