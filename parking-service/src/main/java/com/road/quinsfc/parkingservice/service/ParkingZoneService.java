package com.road.quinsfc.parkingservice.service;

import com.road.quinsfc.parkingservice.dto.ZoneAvailabilityResponse;
import com.road.quinsfc.parkingservice.model.ParkingZone;
import com.road.quinsfc.parkingservice.model.ReservationStatus;
import com.road.quinsfc.parkingservice.repository.ParkingReservationRepository;
import com.road.quinsfc.parkingservice.repository.ParkingZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingZoneService {

    private final ParkingZoneRepository zoneRepository;
    private final ParkingReservationRepository reservationRepository;

    private static final List<ReservationStatus> EXCLUDED_STATUSES = Arrays.asList(
            ReservationStatus.CANCELLED,
            ReservationStatus.EXPIRED
    );

    @Transactional(readOnly = true)
    public List<ParkingZone> getAllZones() {
        return zoneRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<ZoneAvailabilityResponse> getZoneAvailabilityForFixture(String fixtureId) {
        List<ParkingZone> zones = zoneRepository.findByIsActiveTrue();

        return zones.stream().map(zone -> {
            long reserved = reservationRepository.countActiveReservations(fixtureId, zone.getZoneId(), EXCLUDED_STATUSES);
            int available = Math.max(0, zone.getTotalCapacity() - (int) reserved);

            return ZoneAvailabilityResponse.builder()
                    .zoneId(zone.getZoneId())
                    .zoneName(zone.getZoneName())
                    .location(zone.getLocation())
                    .totalCapacity(zone.getTotalCapacity())
                    .reservedCount((int) reserved)
                    .availableSpaces(available)
                    .eligibleTier(zone.getEligibleTier())
                    .bookingMethod(zone.getBookingMethod())
                    .priceMinPence(zone.getPriceMinPence())
                    .priceMaxPence(zone.getPriceMaxPence())
                    .isBookable(zone.getIsBookable())
                    .isActive(zone.getIsActive())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParkingZone getZoneById(String zoneId) {
        return zoneRepository.findById(zoneId)
                .orElseThrow(() -> new IllegalArgumentException("Parking zone not found: " + zoneId));
    }
}
