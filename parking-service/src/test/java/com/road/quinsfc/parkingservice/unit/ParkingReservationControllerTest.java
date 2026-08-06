package com.road.quinsfc.parkingservice.unit;

import com.road.quinsfc.parkingservice.controller.ParkingReservationController;
import com.road.quinsfc.parkingservice.dto.ReservationRequest;
import com.road.quinsfc.parkingservice.dto.ReservationResponse;
import com.road.quinsfc.parkingservice.model.ReservationStatus;
import com.road.quinsfc.parkingservice.service.ParkingReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParkingReservationControllerTest {

    @Mock
    private ParkingReservationService reservationService;

    @InjectMocks
    private ParkingReservationController reservationController;

    private ReservationResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = ReservationResponse.builder()
                .reservationId("RES-12345")
                .fixtureId("FIX-101")
                .zoneId("ZONE-A")
                .zoneName("Roseworth North")
                .plateNumber("AB12 CDE")
                .pricePaidPence(1500)
                .status(ReservationStatus.PENDING_PAYMENT)
                .memberUsername("demo_user")
                .reservedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createReservation_ShouldReturnCreatedStatus() {
        ReservationRequest request = ReservationRequest.builder()
                .fixtureId("FIX-101")
                .zoneId("ZONE-A")
                .plateNumber("AB12 CDE")
                .build();

        when(reservationService.createReservation(any(ReservationRequest.class), eq("demo_user")))
                .thenReturn(sampleResponse);

        ResponseEntity<ReservationResponse> response = reservationController.createReservation(request, "demo_user");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("RES-12345", response.getBody().getReservationId());
        verify(reservationService, times(1)).createReservation(any(ReservationRequest.class), eq("demo_user"));
    }

    @Test
    void getMyReservations_ShouldReturnList() {
        when(reservationService.getMemberReservations("demo_user")).thenReturn(List.of(sampleResponse));

        ResponseEntity<List<ReservationResponse>> response = reservationController.getMyReservations("demo_user");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(reservationService, times(1)).getMemberReservations("demo_user");
    }

    @Test
    void cancelReservation_ShouldReturnCancelledReservation() {
        sampleResponse.setStatus(ReservationStatus.CANCELLED);
        when(reservationService.cancelReservation("RES-12345", "demo_user")).thenReturn(sampleResponse);

        ResponseEntity<ReservationResponse> response = reservationController.cancelReservation("RES-12345", "demo_user");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(ReservationStatus.CANCELLED, response.getBody().getStatus());
        verify(reservationService, times(1)).cancelReservation("RES-12345", "demo_user");
    }
}
