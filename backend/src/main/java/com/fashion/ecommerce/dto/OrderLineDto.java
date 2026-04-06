package com.fashion.ecommerce.dto;

import java.math.BigDecimal;

public record OrderLineDto(String productName, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
}
