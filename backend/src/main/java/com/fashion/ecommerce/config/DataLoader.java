package com.fashion.ecommerce.config;

import com.fashion.ecommerce.domain.Category;
import com.fashion.ecommerce.domain.Product;
import com.fashion.ecommerce.domain.Role;
import com.fashion.ecommerce.domain.User;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seed(
            CategoryRepository categories,
            ProductRepository products,
            UserRepository users,
            PasswordEncoder encoder
    ) {
        return args -> {
            if (categories.count() > 0) {
                return;
            }
            Category womens = categories.save(Category.builder().name("Women").slug("women").build());
            Category mens = categories.save(Category.builder().name("Men").slug("men").build());
            Category acc = categories.save(Category.builder().name("Accessories").slug("accessories").build());

            products.save(Product.builder()
                    .name("Silk Evening Dress")
                    .slug("silk-evening-dress")
                    .description("Floor-length silk dress with a clean silhouette. Limited capsule collection.")
                    .price(new BigDecimal("189.00"))
                    .imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80")
                    .category(womens)
                    .stock(24)
                    .featured(true)
                    .build());
            products.save(Product.builder()
                    .name("Merino Wool Coat")
                    .slug("merino-wool-coat")
                    .description("Tailored coat in Italian merino wool. Warmth without bulk.")
                    .price(new BigDecimal("320.00"))
                    .imageUrl("https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80")
                    .category(womens)
                    .stock(12)
                    .featured(true)
                    .build());
            products.save(Product.builder()
                    .name("Linen Summer Shirt")
                    .slug("linen-summer-shirt")
                    .description("Breathable European linen, relaxed fit.")
                    .price(new BigDecimal("79.00"))
                    .imageUrl("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80")
                    .category(mens)
                    .stock(40)
                    .featured(true)
                    .build());
            products.save(Product.builder()
                    .name("Selvedge Denim Jeans")
                    .slug("selvedge-denim-jeans")
                    .description("14oz Japanese selvedge denim, slim straight.")
                    .price(new BigDecimal("145.00"))
                    .imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80")
                    .category(mens)
                    .stock(30)
                    .featured(false)
                    .build());
            products.save(Product.builder()
                    .name("Leather Tote")
                    .slug("leather-tote")
                    .description("Full-grain leather tote with interior laptop sleeve.")
                    .price(new BigDecimal("210.00"))
                    .imageUrl("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80")
                    .category(acc)
                    .stock(18)
                    .featured(true)
                    .build());
            products.save(Product.builder()
                    .name("Minimalist Sneakers")
                    .slug("minimalist-sneakers")
                    .description("Italian leather upper, cushioned sole.")
                    .price(new BigDecimal("165.00"))
                    .imageUrl("https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80")
                    .category(acc)
                    .stock(50)
                    .featured(false)
                    .build());

            users.save(User.builder()
                    .email("demo@example.com")
                    .passwordHash(encoder.encode("password123"))
                    .fullName("Demo Customer")
                    .roles(Set.of(Role.USER))
                    .build());
        };
    }
}
