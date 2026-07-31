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
public class TicketCancelledEvent {
    private String ticketId;
    private String fixtureId;
    private String memberUsername;
    private int quantity;
    private BigDecimal refundAmount;
    private LocalDateTime cancelledAt;
}
