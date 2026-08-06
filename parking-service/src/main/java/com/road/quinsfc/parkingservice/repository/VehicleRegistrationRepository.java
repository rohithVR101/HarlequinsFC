package com.road.quinsfc.parkingservice.repository;

import com.road.quinsfc.parkingservice.model.VehicleRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRegistrationRepository extends JpaRepository<VehicleRegistration, Long> {
    Optional<VehicleRegistration> findByReservation_ReservationId(String reservationId);
    Optional<VehicleRegistration> findByPlateNumber(String plateNumber);
}
