package com.road.quinsfc.paymentservice.controller;

import com.road.quinsfc.paymentservice.service.PaymentService;
import com.road.quinsfc.paymentservice.service.StripeService;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class StripeWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookController.class);

    private final StripeService stripeService;
    private final PaymentService paymentService;

    public StripeWebhookController(StripeService stripeService, PaymentService paymentService) {
        this.stripeService = stripeService;
        this.paymentService = paymentService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {

        logger.info("Received Stripe webhook payload");

        try {
            Event event = stripeService.constructWebhookEvent(payload, sigHeader);

            if (event != null) {
                logger.info("Processing Stripe event type: {}", event.getType());

                if ("checkout.session.completed".equals(event.getType())) {
                    EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                    Optional<StripeObject> stripeObject = dataObjectDeserializer.getObject();
                    
                    if (stripeObject.isPresent() && stripeObject.get() instanceof Session session) {
                        logger.info("Stripe Checkout Session Completed for session: {}", session.getId());
                        paymentService.fulfillPayment(session.getId(), session.getPaymentIntent());
                    }
                }
            }

            return ResponseEntity.ok("Webhook Processed Successfully");
        } catch (Exception e) {
            logger.error("Error processing Stripe webhook", e);
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }
    }
}
