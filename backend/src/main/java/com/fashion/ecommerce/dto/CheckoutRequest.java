package com.fashion.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        @NotBlank @Size(max = 120) String shippingName,
        @NotBlank @Size(max = 200) String shippingLine1,
        @Size(max = 200) String shippingLine2,
        @NotBlank @Size(max = 100) String shippingCity,
        @NotBlank @Size(max = 20) String shippingPostalCode,
        @NotBlank @Size(max = 100) String shippingCountry
) {
}
