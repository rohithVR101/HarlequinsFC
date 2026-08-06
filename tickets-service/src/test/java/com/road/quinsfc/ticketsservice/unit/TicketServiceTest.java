package com.road.quinsfc.ticketsservice.unit;

import com.road.quinsfc.ticketsservice.dto.FixtureAvailabilityResponse;
import com.road.quinsfc.ticketsservice.dto.TicketPurchaseRequest;
import com.road.quinsfc.ticketsservice.event.TicketCancelledEvent;
import com.road.quinsfc.ticketsservice.event.TicketEventProducer;
import com.road.quinsfc.ticketsservice.event.TicketPurchasedEvent;
import com.road.quinsfc.ticketsservice.exceptions.InsufficientInventoryException;
import com.road.quinsfc.ticketsservice.exceptions.TicketNotFoundException;
import com.road.quinsfc.ticketsservice.model.*;
import com.road.quinsfc.ticketsservice.repository.MatchInventoryRepository;
import com.road.quinsfc.ticketsservice.repository.MatchTicketRepository;
import com.road.quinsfc.ticketsservice.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private MatchInventoryRepository inventoryRepository;

    @Mock
    private MatchTicketRepository ticketRepository;

    @Mock
    private TicketEventProducer eventProducer;

    @InjectMocks
    private TicketService ticketService;

    private MatchInventory sampleInventory;

    @BeforeEach
    void setUp() {
        sampleInventory = new MatchInventory("FIX-101", 20000, 4000, 1000);
    }

    @Test
    void getAvailability_ShouldReturnCorrectData() {
        when(inventoryRepository.findByFixtureId("FIX-101")).thenReturn(Optional.of(sampleInventory));

        FixtureAvailabilityResponse response = ticketService.getAvailability("FIX-101");

        assertNotNull(response);
        assertEquals("FIX-101", response.getFixtureId());
        assertEquals(25000, response.getTotalCapacity());
        assertEquals(20000, response.getCategoryCounts().get(TicketCategory.STANDARD));
        assertEquals(4000, response.getCategoryCounts().get(TicketCategory.PREMIUM));
        assertEquals(1000, response.getCategoryCounts().get(TicketCategory.VIP));
    }

    @Test
    void purchaseTicket_Success() {
        when(inventoryRepository.findByFixtureIdWithLock("FIX-101")).thenReturn(Optional.of(sampleInventory));
        when(ticketRepository.save(any(MatchTicket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TicketPurchaseRequest request = new TicketPurchaseRequest();
        request.setFixtureId("FIX-101");
        request.setCategory(TicketCategory.STANDARD);
        request.setQuantity(2);

        MatchTicket ticket = ticketService.purchaseTicket("demo_user", request);

        assertNotNull(ticket);
        assertEquals("FIX-101", ticket.getFixtureId());
        assertEquals("demo_user", ticket.getMemberUsername());
        assertEquals(2, ticket.getQuantity());
        assertEquals(TicketCategory.STANDARD, ticket.getCategory());
        assertEquals(TicketStatus.PURCHASED, ticket.getStatus());
        assertEquals(new BigDecimal("90.00"), ticket.getTotalPrice());

        verify(eventProducer, times(1)).sendTicketPurchasedEvent(any(TicketPurchasedEvent.class));
    }

    @Test
    void purchaseTicket_ThrowsException_WhenInsufficientInventory() {
        sampleInventory.getTierInventories().stream()
                .filter(t -> t.getCategory() == TicketCategory.VIP)
                .findFirst()
                .ifPresent(tier -> tier.setAvailableSeats(1));

        when(inventoryRepository.findByFixtureIdWithLock("FIX-101")).thenReturn(Optional.of(sampleInventory));

        TicketPurchaseRequest request = new TicketPurchaseRequest();
        request.setFixtureId("FIX-101");
        request.setCategory(TicketCategory.VIP);
        request.setQuantity(5);

        assertThrows(InsufficientInventoryException.class, () -> ticketService.purchaseTicket("demo_user", request));
    }

    @Test
    void cancelTicket_Success() {
        MatchTicket ticket = new MatchTicket();
        ticket.setTicketId("HFC-TKT-2026-9999");
        ticket.setFixtureId("FIX-101");
        ticket.setMemberUsername("demo_user");
        ticket.setCategory(TicketCategory.STANDARD);
        ticket.setQuantity(2);
        ticket.setTotalPrice(new BigDecimal("90.00"));
        ticket.setStatus(TicketStatus.PURCHASED);

        when(ticketRepository.findByTicketIdAndMemberUsername("HFC-TKT-2026-9999", "demo_user"))
                .thenReturn(Optional.of(ticket));
        when(inventoryRepository.findByFixtureIdWithLock("FIX-101")).thenReturn(Optional.of(sampleInventory));
        when(ticketRepository.save(any(MatchTicket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MatchTicket cancelled = ticketService.cancelTicket("HFC-TKT-2026-9999", "demo_user");

        assertNotNull(cancelled);
        assertEquals(TicketStatus.CANCELLED, cancelled.getStatus());
        verify(eventProducer, times(1)).sendTicketCancelledEvent(any(TicketCancelledEvent.class));
    }

    @Test
    void cancelTicket_ThrowsException_WhenTicketNotFound() {
        when(ticketRepository.findByTicketIdAndMemberUsername("UNKNOWN", "demo_user"))
                .thenReturn(Optional.empty());

        assertThrows(TicketNotFoundException.class, () -> ticketService.cancelTicket("UNKNOWN", "demo_user"));
    }
}
