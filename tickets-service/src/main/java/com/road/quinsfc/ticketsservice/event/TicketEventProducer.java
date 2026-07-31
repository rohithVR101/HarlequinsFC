package com.road.quinsfc.ticketsservice.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class TicketEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(TicketEventProducer.class);
    private static final String TOPIC_PURCHASED = "harlequins.ticket.purchased";
    private static final String TOPIC_CANCELLED = "harlequins.ticket.cancelled";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public TicketEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTicketPurchasedEvent(TicketPurchasedEvent event) {
        logger.info("Publishing TicketPurchasedEvent to Kafka topic '{}': Ticket ID {}", TOPIC_PURCHASED, event.getTicketId());
        try {
            kafkaTemplate.send(TOPIC_PURCHASED, event.getTicketId(), event);
        } catch (Exception e) {
            logger.error("Failed to publish TicketPurchasedEvent for ticket {}", event.getTicketId(), e);
        }
    }

    public void sendTicketCancelledEvent(TicketCancelledEvent event) {
        logger.info("Publishing TicketCancelledEvent to Kafka topic '{}': Ticket ID {}", TOPIC_CANCELLED, event.getTicketId());
        try {
            kafkaTemplate.send(TOPIC_CANCELLED, event.getTicketId(), event);
        } catch (Exception e) {
            logger.error("Failed to publish TicketCancelledEvent for ticket {}", event.getTicketId(), e);
        }
    }
}
