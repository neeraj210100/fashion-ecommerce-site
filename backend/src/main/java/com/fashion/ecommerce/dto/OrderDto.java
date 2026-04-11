package com.fashion.ecommerce.dto;

import com.fashion.ecommerce.domain.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id,
        String orderNumber,
        OrderStatus status,
        BigDecimal totalAmount,
        String shippingName,
        String shippingLine1,
        String shippingLine2,
        String shippingCity,
        String shippingPostalCode,
        String shippingCountry,
        Instant createdAt,
        String razorpayOrderId,
        List<OrderLineDto> lines
) {
}
