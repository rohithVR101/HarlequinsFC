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
@Table(name = "refund_records")
public class RefundRecord {

    @Id
    @Column(name = "refund_id", nullable = false, length = 50)
    private String refundId;

    @Column(name = "payment_order_id", nullable = false, length = 50)
    private String paymentOrderId;

    @Column(name = "stripe_refund_id", length = 255, unique = true)
    private String stripeRefundId;

    @Column(name = "refund_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "reason", length = 255)
    private String reason;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
