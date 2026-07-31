package com.road.quinsfc.ticketsservice.event;

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
public class TicketPurchasedEvent {
    private String ticketId;
    private String fixtureId;
    private String memberUsername;
    private String category;
    private int quantity;
    private BigDecimal totalPrice;
    private String seatSection;
    private String seatNumbers;
    private LocalDateTime purchasedAt;
}
