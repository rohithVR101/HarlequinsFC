package com.road.quinsfc.paymentservice.event;

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
public class PaymentCompletedEvent {
    private String paymentOrderId;
    private String memberUsername;
    private String fixtureId;
    private String category;
    private int quantity;
    private BigDecimal totalAmount;
    private String stripePaymentIntentId;
    private String ticketId;
    private LocalDateTime paidAt;
}
