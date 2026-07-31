package com.road.quinsfc.ticketsservice.controller;

import com.road.quinsfc.ticketsservice.dto.FixtureAvailabilityResponse;
import com.road.quinsfc.ticketsservice.dto.TicketPurchaseRequest;
import com.road.quinsfc.ticketsservice.model.MatchTicket;
import com.road.quinsfc.ticketsservice.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/availability/{fixtureId}")
    public ResponseEntity<FixtureAvailabilityResponse> getAvailability(@PathVariable String fixtureId) {
        return ResponseEntity.ok(ticketService.getAvailability(fixtureId));
    }

    @PostMapping("/purchase")
    public ResponseEntity<MatchTicket> purchaseTickets(
            @RequestHeader(value = "X-User-Name", required = false, defaultValue = "demo_user") String memberUsername,
            @Valid @RequestBody TicketPurchaseRequest request) {
        MatchTicket ticket = ticketService.purchaseTicket(memberUsername, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<MatchTicket>> getMyTickets(
            @RequestHeader(value = "X-User-Name") String memberUsername) {
        return ResponseEntity.ok(ticketService.getMemberTickets(memberUsername));
    }

    @DeleteMapping("/cancel/{ticketId}")
    public ResponseEntity<MatchTicket> cancelTicket(
            @RequestHeader(value = "X-User-Name") String memberUsername,
            @PathVariable String ticketId) {
        MatchTicket cancelled = ticketService.cancelTicket(ticketId, memberUsername);
        return ResponseEntity.ok(cancelled);
    }
}
