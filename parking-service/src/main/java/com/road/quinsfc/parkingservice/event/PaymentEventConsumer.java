package com.road.quinsfc.parkingservice.event;

import com.road.quinsfc.parkingservice.service.ParkingReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final ParkingReservationService reservationService;

    @KafkaListener(topics = "payment.completed", groupId = "parking-service-group", containerFactory = "kafkaListenerContainerFactory")
    public void handlePaymentCompleted(Map<String, Object> event) {
        log.info("Received payment.completed event: {}", event);
        try {
            String paymentOrderId = (String) event.get("paymentOrderId");
            String reservationId = (String) event.get("reservationId");

            if (reservationId != null && !reservationId.isEmpty()) {
                reservationService.confirmPayment(reservationId, paymentOrderId);
            }
        } catch (Exception e) {
            log.error("Error processing payment.completed event in parking-service", e);
        }
    }
}
