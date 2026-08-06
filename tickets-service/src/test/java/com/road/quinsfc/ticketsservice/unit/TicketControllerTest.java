package com.road.quinsfc.ticketsservice.unit;

import com.road.quinsfc.ticketsservice.controller.TicketController;
import com.road.quinsfc.ticketsservice.dto.FixtureAvailabilityResponse;
import com.road.quinsfc.ticketsservice.dto.TicketPurchaseRequest;
import com.road.quinsfc.ticketsservice.model.MatchTicket;
import com.road.quinsfc.ticketsservice.model.TicketCategory;
import com.road.quinsfc.ticketsservice.model.TicketStatus;
import com.road.quinsfc.ticketsservice.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketControllerTest {

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private TicketController ticketController;

    private MatchTicket sampleTicket;

    @BeforeEach
    void setUp() {
        sampleTicket = new MatchTicket();
        sampleTicket.setTicketId("TCK-12345");
        sampleTicket.setFixtureId("FIX-101");
        sampleTicket.setMemberUsername("demo_user");
        sampleTicket.setCategory(TicketCategory.STANDARD);
        sampleTicket.setQuantity(2);
        sampleTicket.setPrice(new BigDecimal("45.00"));
        sampleTicket.setTotalPrice(new BigDecimal("90.00"));
        sampleTicket.setStatus(TicketStatus.PURCHASED);
    }

    @Test
    void getAvailability_ShouldReturnFixtureAvailability() {
        FixtureAvailabilityResponse mockResponse = new FixtureAvailabilityResponse(
                "FIX-101", 25000, Map.of(TicketCategory.STANDARD, 20000), Map.of(TicketCategory.STANDARD, 45)
        );
        when(ticketService.getAvailability("FIX-101")).thenReturn(mockResponse);

        ResponseEntity<FixtureAvailabilityResponse> response = ticketController.getAvailability("FIX-101");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("FIX-101", response.getBody().getFixtureId());
        assertEquals(25000, response.getBody().getTotalCapacity());
        verify(ticketService, times(1)).getAvailability("FIX-101");
    }

    @Test
    void purchaseTickets_ShouldReturnCreatedStatusAndTicket() {
        TicketPurchaseRequest request = new TicketPurchaseRequest();
        request.setFixtureId("FIX-101");
        request.setCategory(TicketCategory.STANDARD);
        request.setQuantity(2);

        when(ticketService.purchaseTicket(eq("demo_user"), any(TicketPurchaseRequest.class))).thenReturn(sampleTicket);

        ResponseEntity<MatchTicket> response = ticketController.purchaseTickets("demo_user", request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("TCK-12345", response.getBody().getTicketId());
        verify(ticketService, times(1)).purchaseTicket(eq("demo_user"), any(TicketPurchaseRequest.class));
    }

    @Test
    void getMyTickets_ShouldReturnMemberList() {
        when(ticketService.getMemberTickets("demo_user")).thenReturn(List.of(sampleTicket));

        ResponseEntity<List<MatchTicket>> response = ticketController.getMyTickets("demo_user");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("TCK-12345", response.getBody().get(0).getTicketId());
        verify(ticketService, times(1)).getMemberTickets("demo_user");
    }

    @Test
    void cancelTicket_ShouldReturnCancelledTicket() {
        sampleTicket.setStatus(TicketStatus.CANCELLED);
        when(ticketService.cancelTicket("TCK-12345", "demo_user")).thenReturn(sampleTicket);

        ResponseEntity<MatchTicket> response = ticketController.cancelTicket("demo_user", "TCK-12345");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(TicketStatus.CANCELLED, response.getBody().getStatus());
        verify(ticketService, times(1)).cancelTicket("TCK-12345", "demo_user");
    }
}
