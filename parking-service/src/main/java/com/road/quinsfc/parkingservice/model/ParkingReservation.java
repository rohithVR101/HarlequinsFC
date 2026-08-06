package com.road.quinsfc.parkingservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ParkingReservation {

    @Id
    @Column(name = "reservation_id", length = 50)
    private String reservationId;

    @Column(name = "fixture_id", nullable = false, length = 50)
    private String fixtureId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private ParkingZone zone;

    @Column(name = "member_username", nullable = false, length = 100)
    private String memberUsername;

    @Column(name = "ticket_id", length = 50)
    private String ticketId;

    @Column(name = "price_paid_pence", nullable = false)
    private Integer pricePaidPence;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "GBP";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING_PAYMENT;

    @Column(name = "payment_order_id", length = 50)
    private String paymentOrderId;

    @Column(name = "qr_code", length = 100)
    private String qrCode;

    @CreationTimestamp
    @Column(name = "reserved_at", nullable = false, updatable = false)
    private LocalDateTime reservedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private VehicleRegistration vehicleRegistration;
}
