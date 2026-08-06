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
public class VehicleRegistrationRequest {

    @NotBlank(message = "Reservation ID is required")
    private String reservationId;

    @NotBlank(message = "Plate number is required")
    private String plateNumber;

    private String vehicleMake;
    private String vehicleColour;
}
