package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.OrderDto;
import com.fashion.ecommerce.dto.PaymentVerifyRequest;
import com.fashion.ecommerce.service.CurrentUserService;
import com.fashion.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final OrderService orderService;
    private final CurrentUserService currentUserService;
    private final String razorpayKeyId;

    public PaymentController(
            OrderService orderService,
            CurrentUserService currentUserService,
            @Qualifier("razorpayKeyId") String razorpayKeyId
    ) {
        this.orderService = orderService;
        this.currentUserService = currentUserService;
        this.razorpayKeyId = razorpayKeyId;
    }

    @GetMapping("/config")
    public Map<String, String> config() {
        return Map.of("razorpayKeyId", razorpayKeyId);
    }

    @PostMapping("/verify")
    public OrderDto verify(@Valid @RequestBody PaymentVerifyRequest request) {
        return orderService.verifyPayment(currentUserService.requireUserId(), request);
    }
}
