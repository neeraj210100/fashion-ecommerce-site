package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.PageResponse;
import com.fashion.ecommerce.dto.ProductDto;
import com.fashion.ecommerce.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final CatalogService catalogService;

    public ProductController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public PageResponse<ProductDto> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return catalogService.listProducts(category, q, page, size);
    }

    @GetMapping("/featured")
    public PageResponse<ProductDto> featured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        return catalogService.featured(page, size);
    }

    @GetMapping("/{slug}")
    public ProductDto bySlug(@PathVariable String slug) {
        return catalogService.getBySlug(slug);
    }
}
