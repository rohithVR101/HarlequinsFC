package com.road.quinsfc.parkingservice.controller;

import com.road.quinsfc.parkingservice.dto.ZoneAvailabilityResponse;
import com.road.quinsfc.parkingservice.model.ParkingZone;
import com.road.quinsfc.parkingservice.service.ParkingZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking/zones")
@RequiredArgsConstructor
public class ParkingZoneController {

    private final ParkingZoneService zoneService;

    @GetMapping
    public ResponseEntity<List<ParkingZone>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/availability")
    public ResponseEntity<List<ZoneAvailabilityResponse>> getZoneAvailability(
            @RequestParam("fixtureId") String fixtureId) {
        return ResponseEntity.ok(zoneService.getZoneAvailabilityForFixture(fixtureId));
    }
}
