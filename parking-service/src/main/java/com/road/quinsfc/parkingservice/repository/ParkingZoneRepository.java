package com.road.quinsfc.parkingservice.repository;

import com.road.quinsfc.parkingservice.model.ParkingZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingZoneRepository extends JpaRepository<ParkingZone, String> {
    List<ParkingZone> findByIsActiveTrue();
}
