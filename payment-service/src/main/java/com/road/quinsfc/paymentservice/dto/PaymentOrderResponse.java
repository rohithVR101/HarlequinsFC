package com.road.quinsfc.paymentservice.dto;

import com.road.quinsfc.paymentservice.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {
    private String paymentOrderId;
    private String memberUsername;
    private String fixtureId;
    private String category;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String currency;
    private PaymentStatus status;
    private String stripeCheckoutSessionId;
    private String stripePaymentIntentId;
    private String ticketId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
