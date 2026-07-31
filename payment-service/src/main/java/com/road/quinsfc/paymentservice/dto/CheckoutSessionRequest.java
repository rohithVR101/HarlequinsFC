package com.road.quinsfc.paymentservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutSessionRequest {

    @NotBlank(message = "Fixture ID is required")
    private String fixtureId;

    @NotBlank(message = "Category is required")
    private String category;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
