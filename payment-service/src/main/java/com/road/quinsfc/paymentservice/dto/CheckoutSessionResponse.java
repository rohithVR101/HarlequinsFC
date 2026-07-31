package com.road.quinsfc.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSessionResponse {
    private String paymentOrderId;
    private String checkoutUrl;
    private String sessionId;
}
