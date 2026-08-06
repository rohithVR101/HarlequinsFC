package com.road.quinsfc.parkingservice.controller;

import com.road.quinsfc.parkingservice.dto.VehicleRegistrationRequest;
import com.road.quinsfc.parkingservice.model.VehicleRegistration;
import com.road.quinsfc.parkingservice.service.VehicleRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parking/vehicles")
@RequiredArgsConstructor
public class VehicleRegistrationController {

    private final VehicleRegistrationService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleRegistration> registerOrUpdateVehicle(
            @Valid @RequestBody VehicleRegistrationRequest request,
            @RequestHeader(value = "X-User-Name", defaultValue = "guest") String username) {
        return ResponseEntity.ok(vehicleService.registerOrUpdateVehicle(request, username));
    }

    @GetMapping
    public ResponseEntity<VehicleRegistration> getVehicle(
            @RequestParam("reservationId") String reservationId) {
        return ResponseEntity.ok(vehicleService.getVehicleByReservation(reservationId));
    }
}
