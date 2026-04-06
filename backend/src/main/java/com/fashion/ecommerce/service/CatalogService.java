package com.fashion.ecommerce.service;

import com.fashion.ecommerce.domain.ProductCategory;
import com.fashion.ecommerce.dto.CategoryDto;
import com.fashion.ecommerce.dto.PageResponse;
import com.fashion.ecommerce.dto.ProductDto;
import com.fashion.ecommerce.exception.BadRequestException;
import com.fashion.ecommerce.exception.NotFoundException;
import com.fashion.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
public class CatalogService {

    private final ProductRepository productRepository;
    private final CatalogMapper mapper;

    public CatalogService(ProductRepository productRepository, CatalogMapper mapper) {
        this.productRepository = productRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> listCategories() {
        return Arrays.stream(ProductCategory.values())
                .sorted(Comparator.comparing(ProductCategory::getDisplayName))
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> listProducts(String categorySlug, String q, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("name"));
        Page<ProductDto> result;
        if (q != null && !q.isBlank()) {
            result = productRepository
                    .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q.trim(), q.trim(), pr)
                    .map(mapper::toDto);
        } else if (categorySlug != null && !categorySlug.isBlank()) {
            ProductCategory cat = ProductCategory.fromSlug(categorySlug);
            if (cat == null) {
                throw new BadRequestException("Unknown category: " + categorySlug);
            }
            result = productRepository.findByCategory(cat, pr).map(mapper::toDto);
        } else {
            result = productRepository.findAll(pr).map(mapper::toDto);
        }
        return new PageResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> featured(int page, int size) {
        PageRequest pr = PageRequest.of(page, size);
        Page<ProductDto> result = productRepository.findByFeaturedTrue(pr).map(mapper::toDto);
        return new PageResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public ProductDto getBySlug(String slug) {
        return productRepository.findBySlug(slug).map(mapper::toDto)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }
}
