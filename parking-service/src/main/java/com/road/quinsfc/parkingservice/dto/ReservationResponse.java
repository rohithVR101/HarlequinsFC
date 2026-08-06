package com.road.quinsfc.parkingservice.dto;

import com.road.quinsfc.parkingservice.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private String reservationId;
    private String fixtureId;
    private String zoneId;
    private String zoneName;
    private String location;
    private String memberUsername;
    private String ticketId;
    private Integer pricePaidPence;
    private String currency;
    private ReservationStatus status;
    private String paymentOrderId;
    private String qrCode;
    private LocalDateTime reservedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime expiresAt;
    private String plateNumber;
    private String vehicleMake;
    private String vehicleColour;
}
