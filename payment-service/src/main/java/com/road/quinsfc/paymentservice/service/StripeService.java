package com.road.quinsfc.paymentservice.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.api-key:sk_test_mock_123456789}")
    private String apiKey;

    @Value("${stripe.webhook-secret:whsec_mock_123456789}")
    private String webhookSecret;

    @Value("${stripe.success-url:http://localhost:5173/tickets/payment-success?session_id={CHECKOUT_SESSION_ID}}")
    private String successUrl;

    @Value("${stripe.cancel-url:http://localhost:5173/tickets}")
    private String cancelUrl;

    public boolean isMockMode() {
        return apiKey == null || apiKey.startsWith("sk_test_mock");
    }

    /**
     * Create a Stripe Checkout Session for buying tickets.
     */
    public SessionCreateParamsResult createCheckoutSession(String paymentOrderId, String fixtureId, String category, int quantity, BigDecimal unitPrice, BigDecimal totalAmount) {
        if (isMockMode()) {
            logger.info("[MOCK STRIPE] Creating mock checkout session for order {}", paymentOrderId);
            String sessionId = "cs_test_mock_" + UUID.randomUUID().toString().substring(0, 8);
            String mockUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
            return new SessionCreateParamsResult(sessionId, mockUrl);
        }

        try {
            long unitAmountCents = unitPrice.multiply(BigDecimal.valueOf(100)).longValue();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .setClientReferenceId(paymentOrderId)
                    .putMetadata("fixtureId", fixtureId)
                    .putMetadata("category", category)
                    .putMetadata("quantity", String.valueOf(quantity))
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity((long) quantity)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("gbp")
                                                    .setUnitAmount(unitAmountCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Harlequins FC — " + category + " Ticket")
                                                                    .setDescription("Matchday Ticket for Fixture " + fixtureId)
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);
            return new SessionCreateParamsResult(session.getId(), session.getUrl());
        } catch (StripeException e) {
            logger.error("Failed to create Stripe Checkout Session for order {}", paymentOrderId, e);
            throw new RuntimeException("Stripe Session Creation Failed: " + e.getMessage(), e);
        }
    }

    /**
     * Issue a Stripe Refund via PaymentIntent ID.
     */
    public StripeRefundResult processRefund(String stripePaymentIntentId, BigDecimal amount, String reason) {
        if (isMockMode()) {
            logger.info("[MOCK STRIPE] Processing mock refund for PaymentIntent {}", stripePaymentIntentId);
            String mockRefundId = "re_test_mock_" + UUID.randomUUID().toString().substring(0, 8);
            return new StripeRefundResult(mockRefundId, "succeeded");
        }

        try {
            long amountCents = amount.multiply(BigDecimal.valueOf(100)).longValue();
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(stripePaymentIntentId)
                    .setAmount(amountCents)
                    .setReason(RefundCreateParams.Reason.REQUESTED_BY_CUSTOMER)
                    .build();

            Refund refund = Refund.create(params);
            return new StripeRefundResult(refund.getId(), refund.getStatus());
        } catch (StripeException e) {
            logger.error("Failed to process Stripe refund for PaymentIntent {}", stripePaymentIntentId, e);
            throw new RuntimeException("Stripe Refund Failed: " + e.getMessage(), e);
        }
    }

    /**
     * Verify and construct Event from webhook payload & signature.
     */
    public Event constructWebhookEvent(String payload, String sigHeader) {
        if (isMockMode()) {
            logger.info("[MOCK STRIPE] Bypassing signature verification in mock mode");
            try {
                return Event.GSON.fromJson(payload, Event.class);
            } catch (Exception e) {
                return null;
            }
        }

        try {
            return Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            logger.error("Invalid Stripe webhook signature", e);
            throw new RuntimeException("Invalid Webhook Signature", e);
        }
    }

    public record SessionCreateParamsResult(String sessionId, String url) {}
    public record StripeRefundResult(String refundId, String status) {}
}
