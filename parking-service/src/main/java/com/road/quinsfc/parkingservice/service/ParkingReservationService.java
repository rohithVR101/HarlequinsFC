package com.road.quinsfc.parkingservice.service;

import com.road.quinsfc.parkingservice.dto.ReservationRequest;
import com.road.quinsfc.parkingservice.dto.ReservationResponse;
import com.road.quinsfc.parkingservice.event.ParkingReservationEvent;
import com.road.quinsfc.parkingservice.exceptions.ReservationNotFoundException;
import com.road.quinsfc.parkingservice.exceptions.ZoneFullException;
import com.road.quinsfc.parkingservice.model.ParkingReservation;
import com.road.quinsfc.parkingservice.model.ParkingZone;
import com.road.quinsfc.parkingservice.model.ReservationStatus;
import com.road.quinsfc.parkingservice.model.VehicleRegistration;
import com.road.quinsfc.parkingservice.repository.ParkingReservationRepository;
import com.road.quinsfc.parkingservice.repository.ParkingZoneRepository;
import com.road.quinsfc.parkingservice.repository.VehicleRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParkingReservationService {

    private final ParkingReservationRepository reservationRepository;
    private final ParkingZoneRepository zoneRepository;
    private final VehicleRegistrationRepository vehicleRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final List<ReservationStatus> EXCLUDED_STATUSES = Arrays.asList(
            ReservationStatus.CANCELLED,
            ReservationStatus.EXPIRED
    );

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String memberUsername) {
        ParkingZone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid parking zone: " + request.getZoneId()));

        if (!Boolean.TRUE.equals(zone.getIsBookable()) || !Boolean.TRUE.equals(zone.getIsActive())) {
            throw new IllegalArgumentException("Parking zone is not available for booking: " + zone.getZoneName());
        }

        // Check if member already has an active reservation for this fixture and zone
        if (reservationRepository.existsByMemberUsernameAndFixtureIdAndZone_ZoneIdAndStatusNotIn(
                memberUsername, request.getFixtureId(), request.getZoneId(), EXCLUDED_STATUSES)) {
            throw new IllegalArgumentException("You already have an active reservation for this zone on fixture " + request.getFixtureId());
        }

        // Capacity check
        long activeCount = reservationRepository.countActiveReservations(request.getFixtureId(), zone.getZoneId(), EXCLUDED_STATUSES);
        if (activeCount >= zone.getTotalCapacity()) {
            throw new ZoneFullException("Parking zone " + zone.getZoneName() + " is fully booked for fixture " + request.getFixtureId());
        }

        String reservationId = "PRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        int pricePence = zone.getPriceMinPence() != null ? zone.getPriceMinPence() : 0;
        boolean confirmed = Boolean.TRUE.equals(request.getIsPaid()) || pricePence == 0 || (request.getPaymentOrderId() != null && !request.getPaymentOrderId().isEmpty());
        ReservationStatus initialStatus = confirmed ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING_PAYMENT;
        String paymentOrderId = request.getPaymentOrderId() != null ? request.getPaymentOrderId() : (confirmed ? "PAY-PRK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase() : null);

        ParkingReservation reservation = ParkingReservation.builder()
                .reservationId(reservationId)
                .fixtureId(request.getFixtureId())
                .zone(zone)
                .memberUsername(memberUsername)
                .ticketId(request.getTicketId())
                .pricePaidPence(pricePence)
                .currency("GBP")
                .status(initialStatus)
                .paymentOrderId(paymentOrderId)
                .confirmedAt(confirmed ? LocalDateTime.now() : null)
                .qrCode(confirmed ? "QR-PARK-" + reservationId : null)
                .expiresAt(confirmed ? null : LocalDateTime.now().plusMinutes(15))
                .build();

        if (request.getPlateNumber() != null && !request.getPlateNumber().trim().isEmpty()) {
            VehicleRegistration vehicle = VehicleRegistration.builder()
                    .reservation(reservation)
                    .plateNumber(request.getPlateNumber().trim().toUpperCase())
                    .vehicleMake(request.getVehicleMake())
                    .vehicleColour(request.getVehicleColour())
                    .build();
            reservation.setVehicleRegistration(vehicle);
        }

        ParkingReservation saved = reservationRepository.save(reservation);
        log.info("Created parking reservation {} for member {} in zone {} with status {}", saved.getReservationId(), memberUsername, zone.getZoneId(), saved.getStatus());

        // Publish creation event to Kafka
        ParkingReservationEvent event = ParkingReservationEvent.builder()
                .reservationId(saved.getReservationId())
                .fixtureId(saved.getFixtureId())
                .zoneId(saved.getZone().getZoneId())
                .memberUsername(saved.getMemberUsername())
                .ticketId(saved.getTicketId())
                .pricePaidPence(saved.getPricePaidPence())
                .currency(saved.getCurrency())
                .status(saved.getStatus().name())
                .build();

        try {
            kafkaTemplate.send("parking.reservation.created", saved.getReservationId(), event);
        } catch (Exception e) {
            log.error("Failed to publish parking.reservation.created event", e);
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMemberReservations(String memberUsername) {
        return reservationRepository.findByMemberUsernameOrderByReservedAtDesc(memberUsername)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(String reservationId) {
        ParkingReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + reservationId));
        return mapToResponse(reservation);
    }

    @Transactional
    public ReservationResponse confirmPayment(String reservationId, String paymentOrderId) {
        ParkingReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + reservationId));

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setPaymentOrderId(paymentOrderId != null ? paymentOrderId : "PAY-PRK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        reservation.setConfirmedAt(LocalDateTime.now());
        reservation.setQrCode("QR-PARK-" + reservation.getReservationId());
        reservation.setExpiresAt(null);

        ParkingReservation saved = reservationRepository.save(reservation);
        log.info("Confirmed payment for parking reservation {}", reservationId);
        return mapToResponse(saved);
    }

    @Transactional
    public ReservationResponse cancelReservation(String reservationId, String memberUsername) {
        ParkingReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + reservationId));

        if (!reservation.getMemberUsername().equalsIgnoreCase(memberUsername)) {
            throw new IllegalArgumentException("Unauthorized to cancel reservation " + reservationId);
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.EXPIRED) {
            throw new IllegalArgumentException("Reservation is already " + reservation.getStatus());
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());
        ParkingReservation saved = reservationRepository.save(reservation);
        log.info("Cancelled parking reservation {}", reservationId);

        // Publish cancellation event to Kafka
        ParkingReservationEvent event = ParkingReservationEvent.builder()
                .reservationId(saved.getReservationId())
                .fixtureId(saved.getFixtureId())
                .zoneId(saved.getZone().getZoneId())
                .memberUsername(saved.getMemberUsername())
                .paymentOrderId(saved.getPaymentOrderId())
                .status(saved.getStatus().name())
                .build();

        try {
            kafkaTemplate.send("parking.reservation.cancelled", saved.getReservationId(), event);
        } catch (Exception e) {
            log.error("Failed to publish parking.reservation.cancelled event", e);
        }

        return mapToResponse(saved);
    }

    public ReservationResponse mapToResponse(ParkingReservation reservation) {
        VehicleRegistration vehicle = reservation.getVehicleRegistration();
        return ReservationResponse.builder()
                .reservationId(reservation.getReservationId())
                .fixtureId(reservation.getFixtureId())
                .zoneId(reservation.getZone().getZoneId())
                .zoneName(reservation.getZone().getZoneName())
                .location(reservation.getZone().getLocation())
                .memberUsername(reservation.getMemberUsername())
                .ticketId(reservation.getTicketId())
                .pricePaidPence(reservation.getPricePaidPence())
                .currency(reservation.getCurrency())
                .status(reservation.getStatus())
                .paymentOrderId(reservation.getPaymentOrderId())
                .qrCode(reservation.getQrCode())
                .reservedAt(reservation.getReservedAt())
                .confirmedAt(reservation.getConfirmedAt())
                .expiresAt(reservation.getExpiresAt())
                .plateNumber(vehicle != null ? vehicle.getPlateNumber() : null)
                .vehicleMake(vehicle != null ? vehicle.getVehicleMake() : null)
                .vehicleColour(vehicle != null ? vehicle.getVehicleColour() : null)
                .build();
    }
}
