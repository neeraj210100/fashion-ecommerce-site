package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CategoryDto;
import com.fashion.ecommerce.dto.PageResponse;
import com.fashion.ecommerce.dto.ProductDto;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CatalogMapper mapper;

    public CatalogService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            CatalogMapper mapper
    ) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> listCategories() {
        return categoryRepository.findAll(Sort.by("name")).stream().map(mapper::toDto).toList();
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
            result = productRepository.findByCategorySlug(categorySlug, pr).map(mapper::toDto);
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
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }
}
