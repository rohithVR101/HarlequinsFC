package com.road.quinsfc.parkingservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {

    @NotBlank(message = "Fixture ID is required")
    private String fixtureId;

    @NotBlank(message = "Zone ID is required")
    private String zoneId;

    private String ticketId;

    private String plateNumber;
    private String vehicleMake;
    private String vehicleColour;

    private String paymentOrderId;
    private Boolean isPaid;
}
