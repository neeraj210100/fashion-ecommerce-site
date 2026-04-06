package com.fashion.ecommerce.domain;

import java.util.Arrays;

/**
 * Fixed product categories (replaces a categories table). Persisted on {@link Product} as {@code STRING}.
 */
public enum ProductCategory {
    WOMEN("women", "Women"),
    MEN("men", "Men"),
    ACCESSORIES("accessories", "Accessories");

    private final String slug;
    private final String displayName;

    ProductCategory(String slug, String displayName) {
        this.slug = slug;
        this.displayName = displayName;
    }

    public String getSlug() {
        return slug;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * @param slug URL slug, e.g. {@code women}; case-insensitive
     * @return matching category, or {@code null} if unknown
     */
    public static ProductCategory fromSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            return null;
        }
        String s = slug.trim().toLowerCase();
        return Arrays.stream(values())
                .filter(c -> c.slug.equals(s))
                .findFirst()
                .orElse(null);
    }
}
