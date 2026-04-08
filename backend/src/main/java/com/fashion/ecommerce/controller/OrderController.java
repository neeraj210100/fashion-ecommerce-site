package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.CheckoutRequest;
import com.fashion.ecommerce.dto.OrderDto;
import com.fashion.ecommerce.service.CurrentUserService;
import com.fashion.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CurrentUserService currentUserService;

    public OrderController(OrderService orderService, CurrentUserService currentUserService) {
        this.orderService = orderService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/checkout")
    public OrderDto checkout(@Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(currentUserService.requireUserId(), request);
    }

    @GetMapping
    public List<OrderDto> list() {
        return orderService.listForUser(currentUserService.requireUserId());
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable Long id) {
        return orderService.getForUser(currentUserService.requireUserId(), id);
    }

    @PatchMapping("/{id}/cancel")
    public OrderDto cancel(@PathVariable Long id) {
        return orderService.cancel(currentUserService.requireUserId(), id);
    }
}
