package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CategoryDto;
import com.fashion.ecommerce.dto.ProductDto;
import com.fashion.ecommerce.domain.Product;
import com.fashion.ecommerce.domain.ProductCategory;
import org.springframework.stereotype.Component;

@Component
public class CatalogMapper {

    public CategoryDto toDto(ProductCategory c) {
        return new CategoryDto((long) c.ordinal(), c.getDisplayName(), c.getSlug());
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
