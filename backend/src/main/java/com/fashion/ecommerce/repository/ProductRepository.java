package com.fashion.ecommerce.repository;

import com.fashion.ecommerce.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")
    Optional<Product> findBySlug(String slug);

    @EntityGraph(attributePaths = "category")
    Page<Product> findByCategorySlug(String categorySlug, Pageable pageable);

    @EntityGraph(attributePaths = "category")
    Page<Product> findByFeaturedTrue(Pageable pageable);

    @EntityGraph(attributePaths = "category")
    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);
}
