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
public class PaymentRefundedEvent {
    private String paymentOrderId;
    private String refundId;
    private String memberUsername;
    private String stripeRefundId;
    private BigDecimal refundAmount;
    private LocalDateTime refundedAt;
}
