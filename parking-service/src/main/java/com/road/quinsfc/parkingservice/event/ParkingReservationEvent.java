package com.road.quinsfc.parkingservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingReservationEvent {
    private String reservationId;
    private String fixtureId;
    private String zoneId;
    private String memberUsername;
    private String ticketId;
    private Integer pricePaidPence;
    private String currency;
    private String paymentOrderId;
    private String status;
}
