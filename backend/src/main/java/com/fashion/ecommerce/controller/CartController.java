package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.AddToCartRequest;
import com.fashion.ecommerce.dto.CartDto;
import com.fashion.ecommerce.dto.UpdateCartItemRequest;
import com.fashion.ecommerce.service.CartService;
import com.fashion.ecommerce.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CurrentUserService currentUserService;

    public CartController(CartService cartService, CurrentUserService currentUserService) {
        this.cartService = cartService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public CartDto get() {
        return cartService.getOrCreateCart(currentUserService.requireUserId());
    }

    @PostMapping("/items")
    public CartDto add(@Valid @RequestBody AddToCartRequest request) {
        return cartService.addItem(currentUserService.requireUserId(), request);
    }

    @PatchMapping("/items/{itemId}")
    public CartDto update(@PathVariable Long itemId, @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItem(currentUserService.requireUserId(), itemId, request);
    }
}
