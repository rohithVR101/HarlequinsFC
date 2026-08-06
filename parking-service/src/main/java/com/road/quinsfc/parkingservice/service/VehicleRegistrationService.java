package com.road.quinsfc.parkingservice.service;

import com.road.quinsfc.parkingservice.dto.VehicleRegistrationRequest;
import com.road.quinsfc.parkingservice.exceptions.ReservationNotFoundException;
import com.road.quinsfc.parkingservice.model.ParkingReservation;
import com.road.quinsfc.parkingservice.model.VehicleRegistration;
import com.road.quinsfc.parkingservice.repository.ParkingReservationRepository;
import com.road.quinsfc.parkingservice.repository.VehicleRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleRegistrationService {

    private final VehicleRegistrationRepository vehicleRepository;
    private final ParkingReservationRepository reservationRepository;

    @Transactional
    public VehicleRegistration registerOrUpdateVehicle(VehicleRegistrationRequest request, String memberUsername) {
        ParkingReservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + request.getReservationId()));

        if (!reservation.getMemberUsername().equalsIgnoreCase(memberUsername)) {
            throw new IllegalArgumentException("Unauthorized to update vehicle for reservation " + request.getReservationId());
        }

        VehicleRegistration vehicle = vehicleRepository.findByReservation_ReservationId(request.getReservationId())
                .orElseGet(() -> VehicleRegistration.builder().reservation(reservation).build());

        vehicle.setPlateNumber(request.getPlateNumber().trim().toUpperCase());
        vehicle.setVehicleMake(request.getVehicleMake());
        vehicle.setVehicleColour(request.getVehicleColour());

        VehicleRegistration saved = vehicleRepository.save(vehicle);
        log.info("Registered vehicle plate {} for reservation {}", saved.getPlateNumber(), request.getReservationId());
        return saved;
    }

    @Transactional(readOnly = true)
    public VehicleRegistration getVehicleByReservation(String reservationId) {
        return vehicleRepository.findByReservation_ReservationId(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Vehicle registration not found for reservation: " + reservationId));
    }
}
