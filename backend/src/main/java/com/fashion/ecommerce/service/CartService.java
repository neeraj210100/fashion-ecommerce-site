package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.AddToCartRequest;
import com.fashion.ecommerce.dto.CartDto;
import com.fashion.ecommerce.dto.CartItemDto;
import com.fashion.ecommerce.dto.UpdateCartItemRequest;
import com.fashion.ecommerce.domain.Cart;
import com.fashion.ecommerce.domain.CartItem;
import com.fashion.ecommerce.domain.Product;
import com.fashion.ecommerce.domain.User;
import com.fashion.ecommerce.repository.CartRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
//import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CatalogMapper catalogMapper;

    public CartService(
            CartRepository cartRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            CatalogMapper catalogMapper
    ) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.catalogMapper = catalogMapper;
    }

    @Transactional
    public CartDto getOrCreateCart(Long userId) {
        Cart cart = cartRepository.findByUser_IdAndActiveTrue(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    Cart c = Cart.builder().user(user).active(true).items(new ArrayList<>()).build();
                    return cartRepository.save(c);
                });
        return toDto(cart);
    }

    @Transactional
    public CartDto addItem(Long userId, AddToCartRequest req) {
        Cart cart = cartRepository.findByUser_IdAndActiveTrue(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    Cart c = Cart.builder().user(user).active(true).items(new ArrayList<>()).build();
                    return cartRepository.save(c);
                });
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (product.getStock() < req.quantity()) {
            throw new IllegalArgumentException("Not enough stock");
        }
        for (CartItem line : cart.getItems()) {
            if (line.getProduct().getId().equals(product.getId())) {
                int next = line.getQuantity() + req.quantity();
                if (next > product.getStock()) {
                    throw new IllegalArgumentException("Not enough stock");
                }
                line.setQuantity(next);
                return toDto(cartRepository.save(cart));
            }
        }
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(req.quantity()).build();
        cart.getItems().add(item);
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartDto updateItem(Long userId, Long cartItemId, UpdateCartItemRequest req) {
        Cart cart = cartRepository.findByUser_IdAndActiveTrue(userId).orElseThrow();
        CartItem line = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (req.quantity() == 0) {
            cart.getItems().remove(line);
        } else {
            if (line.getProduct().getStock() < req.quantity()) {
                throw new IllegalArgumentException("Not enough stock");
            }
            line.setQuantity(req.quantity());
        }
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public void clear(Long userId) {
        cartRepository.findByUser_IdAndActiveTrue(userId).ifPresent(c -> {
            c.getItems().clear();
            cartRepository.save(c);
        });
    }

    private CartDto toDto(Cart cart) {
        List<CartItemDto> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem line : cart.getItems()) {
            BigDecimal unit = line.getProduct().getPrice();
            BigDecimal lineTotal = unit.multiply(BigDecimal.valueOf(line.getQuantity()));
            subtotal = subtotal.add(lineTotal);
            items.add(new CartItemDto(
                    line.getId(),
                    catalogMapper.toDto(line.getProduct()),
                    line.getQuantity(),
                    lineTotal
            ));
        }
        return new CartDto(cart.getId(), items, subtotal);
    }
}
