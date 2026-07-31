package com.road.quinsfc.paymentservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "payment_orders")
public class PaymentOrder {

    @Id
    @Column(name = "payment_order_id", nullable = false, length = 50)
    private String paymentOrderId;

    @Column(name = "member_username", nullable = false, length = 100)
    private String memberUsername;

    @Column(name = "fixture_id", nullable = false, length = 50)
    private String fixtureId;

    @Column(name = "category", nullable = false, length = 20)
    private String category;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "GBP";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status;

    @Column(name = "stripe_checkout_session_id", length = 255, unique = true)
    private String stripeCheckoutSessionId;

    @Column(name = "stripe_payment_intent_id", length = 255, unique = true)
    private String stripePaymentIntentId;

    @Column(name = "ticket_id", length = 50, unique = true)
    private String ticketId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
