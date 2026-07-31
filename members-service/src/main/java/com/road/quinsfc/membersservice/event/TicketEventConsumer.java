package com.road.quinsfc.membersservice.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TicketEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TicketEventConsumer.class);

    @KafkaListener(topics = "harlequins.ticket.purchased", groupId = "members-group")
    public void handleTicketPurchased(String message) {
        logger.info("Kafka Event Received in members-service [harlequins.ticket.purchased]: {}", message);
    }

    @KafkaListener(topics = "harlequins.ticket.cancelled", groupId = "members-group")
    public void handleTicketCancelled(String message) {
        logger.info("Kafka Event Received in members-service [harlequins.ticket.cancelled]: {}", message);
    }
}
