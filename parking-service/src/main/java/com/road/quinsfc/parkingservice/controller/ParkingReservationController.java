package com.road.quinsfc.parkingservice.controller;

import com.road.quinsfc.parkingservice.dto.ReservationRequest;
import com.road.quinsfc.parkingservice.dto.ReservationResponse;
import com.road.quinsfc.parkingservice.service.ParkingReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking/reservations")
@RequiredArgsConstructor
public class ParkingReservationController {

    private final ParkingReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            @RequestHeader(value = "X-User-Name", defaultValue = "guest") String username) {
        ReservationResponse response = reservationService.createReservation(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @RequestHeader(value = "X-User-Name", defaultValue = "guest") String username) {
        return ResponseEntity.ok(reservationService.getMemberReservations(username));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable("reservationId") String reservationId) {
        return ResponseEntity.ok(reservationService.getReservationById(reservationId));
    }

    @PutMapping("/{reservationId}/confirm")
    public ResponseEntity<ReservationResponse> confirmReservation(
            @PathVariable("reservationId") String reservationId,
            @RequestParam(value = "paymentOrderId", required = false) String paymentOrderId) {
        return ResponseEntity.ok(reservationService.confirmPayment(reservationId, paymentOrderId));
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable("reservationId") String reservationId,
            @RequestHeader(value = "X-User-Name", defaultValue = "guest") String username) {
        return ResponseEntity.ok(reservationService.cancelReservation(reservationId, username));
    }
}
