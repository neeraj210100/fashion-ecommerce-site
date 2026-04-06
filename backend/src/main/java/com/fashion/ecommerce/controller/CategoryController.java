package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.CategoryDto;
import com.fashion.ecommerce.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CatalogService catalogService;

    public CategoryController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CategoryDto> list() {
        return catalogService.listCategories();
    }
}
