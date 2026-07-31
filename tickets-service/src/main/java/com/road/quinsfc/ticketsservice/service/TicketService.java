package com.road.quinsfc.ticketsservice.service;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final MatchInventoryRepository inventoryRepository;
    private final MatchTicketRepository ticketRepository;
    private final TicketEventProducer eventProducer;

    private static final Map<TicketCategory, BigDecimal> CATEGORY_PRICES = Map.of(
            TicketCategory.STANDARD, new BigDecimal("45.00"),
            TicketCategory.PREMIUM, new BigDecimal("85.00"),
            TicketCategory.VIP, new BigDecimal("175.00")
    );

    public TicketService(MatchInventoryRepository inventoryRepository,
                         MatchTicketRepository ticketRepository,
                         TicketEventProducer eventProducer) {
        this.inventoryRepository = inventoryRepository;
        this.ticketRepository = ticketRepository;
        this.eventProducer = eventProducer;
    }

    /**
     * Get or initialize stadium seat inventory for a fixture.
     * Default capacity = 25,000 (Standard: 20000, Premium: 4000, VIP: 1000)
     */
    @Transactional
    public MatchInventory getOrInitInventory(String fixtureId) {
        return inventoryRepository.findByFixtureId(fixtureId)
                .orElseGet(() -> {
                    logger.info("Initializing new PostgreSQL match inventory for fixture ID: {}", fixtureId);
                    MatchInventory init = new MatchInventory(fixtureId, 20000, 4000, 1000);
                    return inventoryRepository.save(init);
                });
    }

    public FixtureAvailabilityResponse getAvailability(String fixtureId) {
        MatchInventory inventory = getOrInitInventory(fixtureId);

        Map<TicketCategory, Integer> counts = new EnumMap<>(TicketCategory.class);
        for (MatchTierInventory tier : inventory.getTierInventories()) {
            counts.put(tier.getCategory(), tier.getAvailableSeats());
        }

        Map<TicketCategory, Integer> prices = new EnumMap<>(TicketCategory.class);
        prices.put(TicketCategory.STANDARD, 45);
        prices.put(TicketCategory.PREMIUM, 85);
        prices.put(TicketCategory.VIP, 175);

        return new FixtureAvailabilityResponse(
                fixtureId,
                inventory.getTotalCapacity(),
                counts,
                prices
        );
    }

    /**
     * ACID Transactional Seat Reservation & Purchase in PostgreSQL.
     */
    @Transactional
    public MatchTicket purchaseTicket(String memberUsername, TicketPurchaseRequest request) {
        logger.info("Processing ACID ticket purchase for member '{}' - Fixture: {}, Category: {}, Quantity: {}",
                memberUsername, request.getFixtureId(), request.getCategory(), request.getQuantity());

        // Acquire lock on Postgres inventory row for concurrent ACID protection
        MatchInventory inventory = inventoryRepository.findByFixtureIdWithLock(request.getFixtureId())
                .orElseGet(() -> {
                    MatchInventory init = new MatchInventory(request.getFixtureId(), 20000, 4000, 1000);
                    return inventoryRepository.save(init);
                });

        int requestedQty = request.getQuantity();
        TicketCategory category = request.getCategory();

        MatchTierInventory targetTier = inventory.getTierInventories().stream()
                .filter(t -> t.getCategory() == category)
                .findFirst()
                .orElseThrow(() -> new InsufficientInventoryException("Category " + category + " not found."));

        if (targetTier.getAvailableSeats() < requestedQty) {
            throw new InsufficientInventoryException("Only " + targetTier.getAvailableSeats() + " " + category + " tickets remaining.");
        }

        targetTier.setAvailableSeats(targetTier.getAvailableSeats() - requestedQty);
        inventoryRepository.save(inventory);

        // Generate Ticket details
        int randomId = 1000 + new Random().nextInt(9000);
        String ticketId = "HFC-TKT-2026-" + randomId;
        BigDecimal unitPrice = CATEGORY_PRICES.get(category);
        BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(requestedQty));

        Map<String, String> seatAllocation = generateSeats(category, requestedQty);

        MatchTicket ticket = new MatchTicket();
        ticket.setTicketId(ticketId);
        ticket.setFixtureId(request.getFixtureId());
        ticket.setMemberUsername(memberUsername);
        ticket.setCategory(category);
        ticket.setPrice(unitPrice);
        ticket.setQuantity(requestedQty);
        ticket.setTotalPrice(totalPrice);
        ticket.setSeatSection(seatAllocation.get("section"));
        ticket.setSeatRow(seatAllocation.get("row"));
        ticket.setSeatNumbers(seatAllocation.get("numbers"));
        ticket.setStatus(TicketStatus.PURCHASED);
        ticket.setPurchasedAt(LocalDateTime.now());
        ticket.setQrCode("HFC-PASS-" + randomId + "-" + request.getFixtureId().toUpperCase());

        MatchTicket savedTicket = ticketRepository.save(ticket);

        // Publish event to Kafka stream
        eventProducer.sendTicketPurchasedEvent(new TicketPurchasedEvent(
                savedTicket.getTicketId(),
                savedTicket.getFixtureId(),
                savedTicket.getMemberUsername(),
                savedTicket.getCategory().name(),
                savedTicket.getQuantity(),
                savedTicket.getTotalPrice(),
                savedTicket.getSeatSection(),
                savedTicket.getSeatNumbers(),
                savedTicket.getPurchasedAt()
        ));

        return savedTicket;
    }

    public List<MatchTicket> getMemberTickets(String memberUsername) {
        return ticketRepository.findByMemberUsernameOrderByPurchasedAtDesc(memberUsername);
    }

    /**
     * ACID Transactional Cancellation & Refund in PostgreSQL.
     */
    @Transactional
    public MatchTicket cancelTicket(String ticketId, String memberUsername) {
        logger.info("Processing ticket cancellation for ticket ID '{}' by member '{}'", ticketId, memberUsername);

        MatchTicket ticket = ticketRepository.findByTicketIdAndMemberUsername(ticketId, memberUsername)
                .orElseThrow(() -> new TicketNotFoundException("Ticket " + ticketId + " not found for user " + memberUsername));

        if (ticket.getStatus() == TicketStatus.CANCELLED) {
            return ticket; // Already cancelled
        }

        // Restore inventory in PostgreSQL
        MatchInventory inventory = inventoryRepository.findByFixtureIdWithLock(ticket.getFixtureId())
                .orElseGet(() -> new MatchInventory(ticket.getFixtureId(), 20000, 4000, 1000));

        inventory.getTierInventories().stream()
                .filter(t -> t.getCategory() == ticket.getCategory())
                .findFirst()
                .ifPresent(tier -> tier.setAvailableSeats(tier.getAvailableSeats() + ticket.getQuantity()));

        inventoryRepository.save(inventory);

        // Update ticket status
        ticket.setStatus(TicketStatus.CANCELLED);
        MatchTicket updatedTicket = ticketRepository.save(ticket);

        // Publish event to Kafka stream
        eventProducer.sendTicketCancelledEvent(new TicketCancelledEvent(
                updatedTicket.getTicketId(),
                updatedTicket.getFixtureId(),
                updatedTicket.getMemberUsername(),
                updatedTicket.getQuantity(),
                updatedTicket.getTotalPrice(),
                LocalDateTime.now()
        ));

        return updatedTicket;
    }

    private Map<String, String> generateSeats(TicketCategory category, int qty) {
        List<String> sections = switch (category) {
            case STANDARD -> List.of("North Stand - Block N1", "South Stand - Block S3", "West Stand - Upper W2");
            case PREMIUM -> List.of("East Terrace - Block E2", "East Terrace - Block E3");
            case VIP -> List.of("Quins Diamond Suite - Box 4", "Quins Diamond Suite - Box 7");
        };

        Random r = new Random();
        String sec = sections.get(r.nextInt(sections.size()));
        int row = r.nextInt(20) + 1;
        int startSeat = r.nextInt(30) + 1;
        int endSeat = startSeat + qty - 1;
        String numbers = qty == 1 ? "Seat " + startSeat : "Seats " + startSeat + "-" + endSeat;

        return Map.of(
                "section", sec,
                "row", "Row " + row,
                "numbers", numbers
        );
    }
}
