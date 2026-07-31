package com.road.quinsfc.ticketsservice.model;

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
@Table(name = "tickets")
public class MatchTicket {

    @Id
    @Column(name = "ticket_id", nullable = false, length = 50)
    private String ticketId;

    @Column(name = "fixture_id", nullable = false, length = 50)
    private String fixtureId;

    @Column(name = "member_username", nullable = false, length = 100)
    private String memberUsername;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 20)
    private TicketCategory category;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "seat_section", nullable = false, length = 100)
    private String seatSection;

    @Column(name = "seat_row", nullable = false, length = 50)
    private String seatRow;

    @Column(name = "seat_numbers", nullable = false, length = 100)
    private String seatNumbers;

    @Column(name = "purchased_at", nullable = false)
    private LocalDateTime purchasedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TicketStatus status;

    @Column(name = "qr_code", nullable = false, length = 100)
    private String qrCode;
}
