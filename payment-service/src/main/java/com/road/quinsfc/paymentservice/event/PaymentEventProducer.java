package com.road.quinsfc.paymentservice.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(PaymentEventProducer.class);
    private static final String TOPIC_COMPLETED = "harlequins.payment.completed";
    private static final String TOPIC_REFUNDED = "harlequins.payment.refunded";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendPaymentCompletedEvent(PaymentCompletedEvent event) {
        logger.info("Publishing PaymentCompletedEvent to Kafka topic '{}': Payment Order ID {}", TOPIC_COMPLETED, event.getPaymentOrderId());
        try {
            kafkaTemplate.send(TOPIC_COMPLETED, event.getPaymentOrderId(), event);
        } catch (Exception e) {
            logger.error("Failed to publish PaymentCompletedEvent for order {}", event.getPaymentOrderId(), e);
        }
    }

    public void sendPaymentRefundedEvent(PaymentRefundedEvent event) {
        logger.info("Publishing PaymentRefundedEvent to Kafka topic '{}': Payment Order ID {}", TOPIC_REFUNDED, event.getPaymentOrderId());
        try {
            kafkaTemplate.send(TOPIC_REFUNDED, event.getPaymentOrderId(), event);
        } catch (Exception e) {
            logger.error("Failed to publish PaymentRefundedEvent for order {}", event.getPaymentOrderId(), e);
        }
    }
}
