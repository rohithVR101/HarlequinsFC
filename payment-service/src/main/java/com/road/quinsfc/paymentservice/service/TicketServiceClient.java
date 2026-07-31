package com.road.quinsfc.paymentservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class TicketServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(TicketServiceClient.class);
    private final RestClient restClient;

    @Autowired
    public TicketServiceClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("http://tickets-ms")
                .build();
    }

    /**
     * Internal REST call to tickets-ms to reserve/purchase match seats.
     */
    public TicketPurchaseResponse purchaseTicket(String memberUsername, String fixtureId, String category, int quantity) {
        logger.info("Calling tickets-ms to purchase ticket for user '{}', fixture '{}', category '{}'", memberUsername, fixtureId, category);
        
        Map<String, Object> requestBody = Map.of(
                "fixtureId", fixtureId,
                "category", category,
                "quantity", quantity
        );

        try {
            return restClient.post()
                    .uri("/api/tickets/purchase")
                    .header("X-User-Name", memberUsername)
                    .body(requestBody)
                    .retrieve()
                    .body(TicketPurchaseResponse.class);
        } catch (Exception e) {
            logger.error("Failed to execute internal purchase call to tickets-ms for user {}", memberUsername, e);
            throw new RuntimeException("Downstream Ticket Service Failure: " + e.getMessage(), e);
        }
    }

    /**
     * Internal REST call to tickets-ms to cancel a ticket and restore seat inventory.
     */
    public TicketCancelResponse cancelTicket(String ticketId, String memberUsername) {
        logger.info("Calling tickets-ms to cancel ticket '{}' for user '{}'", ticketId, memberUsername);

        try {
            return restClient.delete()
                    .uri("/api/tickets/cancel/{ticketId}", ticketId)
                    .header("X-User-Name", memberUsername)
                    .retrieve()
                    .body(TicketCancelResponse.class);
        } catch (Exception e) {
            logger.error("Failed to execute internal cancel call to tickets-ms for ticket {}", ticketId, e);
            throw new RuntimeException("Downstream Ticket Cancellation Failure: " + e.getMessage(), e);
        }
    }

    public record TicketPurchaseResponse(
            String ticketId,
            String fixtureId,
            String memberUsername,
            String category,
            int quantity,
            Double totalPrice,
            String seatSection,
            String seatRow,
            String seatNumbers,
            String status,
            String purchasedAt,
            String qrCode
    ) {}

    public record TicketCancelResponse(
            String ticketId,
            String fixtureId,
            String memberUsername,
            String status
    ) {}
}
