package com.road.quinsfc.paymentservice.service;

import com.road.quinsfc.paymentservice.dto.*;
import com.road.quinsfc.paymentservice.event.PaymentCompletedEvent;
import com.road.quinsfc.paymentservice.event.PaymentEventProducer;
import com.road.quinsfc.paymentservice.event.PaymentRefundedEvent;
import com.road.quinsfc.paymentservice.exceptions.PaymentNotFoundException;
import com.road.quinsfc.paymentservice.exceptions.PaymentProcessingException;
import com.road.quinsfc.paymentservice.exceptions.RefundFailedException;
import com.road.quinsfc.paymentservice.model.PaymentOrder;
import com.road.quinsfc.paymentservice.model.PaymentStatus;
import com.road.quinsfc.paymentservice.model.RefundRecord;
import com.road.quinsfc.paymentservice.repository.PaymentOrderRepository;
import com.road.quinsfc.paymentservice.repository.RefundRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentOrderRepository paymentOrderRepository;
    private final RefundRecordRepository refundRecordRepository;
    private final StripeService stripeService;
    private final TicketServiceClient ticketServiceClient;
    private final PaymentEventProducer eventProducer;

    private static final Map<String, BigDecimal> CATEGORY_PRICES = Map.of(
            "STANDARD", new BigDecimal("45.00"),
            "PREMIUM", new BigDecimal("85.00"),
            "VIP", new BigDecimal("175.00")
    );

    public PaymentService(PaymentOrderRepository paymentOrderRepository,
                          RefundRecordRepository refundRecordRepository,
                          StripeService stripeService,
                          TicketServiceClient ticketServiceClient,
                          PaymentEventProducer eventProducer) {
        this.paymentOrderRepository = paymentOrderRepository;
        this.refundRecordRepository = refundRecordRepository;
        this.stripeService = stripeService;
        this.ticketServiceClient = ticketServiceClient;
        this.eventProducer = eventProducer;
    }

    /**
     * Initiate Stripe Checkout Session and save PENDING PaymentOrder.
     */
    @Transactional
    public CheckoutSessionResponse createCheckoutSession(String memberUsername, CheckoutSessionRequest request) {
        String category = request.getCategory().toUpperCase();
        BigDecimal unitPrice = CATEGORY_PRICES.getOrDefault(category, new BigDecimal("45.00"));
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        int randomId = 1000 + new Random().nextInt(9000);
        String paymentOrderId = "HFC-PAY-2026-" + randomId;

        // Call Stripe SDK
        StripeService.SessionCreateParamsResult stripeResult = stripeService.createCheckoutSession(
                paymentOrderId,
                request.getFixtureId(),
                category,
                request.getQuantity(),
                unitPrice,
                totalAmount
        );

        PaymentOrder order = new PaymentOrder();
        order.setPaymentOrderId(paymentOrderId);
        order.setMemberUsername(memberUsername);
        order.setFixtureId(request.getFixtureId());
        order.setCategory(category);
        order.setQuantity(request.getQuantity());
        order.setUnitPrice(unitPrice);
        order.setTotalAmount(totalAmount);
        order.setCurrency("GBP");
        order.setStatus(PaymentStatus.PENDING);
        order.setStripeCheckoutSessionId(stripeResult.sessionId());
        order.setCreatedAt(LocalDateTime.now());
        order.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        paymentOrderRepository.save(order);

        logger.info("Created PENDING PaymentOrder '{}' for member '{}' - Checkout Session: {}",
                paymentOrderId, memberUsername, stripeResult.sessionId());

        return new CheckoutSessionResponse(paymentOrderId, stripeResult.url(), stripeResult.sessionId());
    }

    /**
     * Complete payment when webhook fires or frontend payment success callback executes.
     */
    @Transactional
    public PaymentOrder fulfillPayment(String checkoutSessionId, String paymentIntentId) {
        logger.info("Fulfilling payment order for Checkout Session ID: {}", checkoutSessionId);

        PaymentOrder order = paymentOrderRepository.findByStripeCheckoutSessionId(checkoutSessionId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment order not found for checkout session: " + checkoutSessionId));

        if (order.getStatus() == PaymentStatus.PAID) {
            logger.info("Payment order '{}' already PAID. Skipping fulfillment.", order.getPaymentOrderId());
            return order;
        }

        // Call downstream tickets-ms to reserve seat & generate ticket
        TicketServiceClient.TicketPurchaseResponse ticketResponse = ticketServiceClient.purchaseTicket(
                order.getMemberUsername(),
                order.getFixtureId(),
                order.getCategory(),
                order.getQuantity()
        );

        order.setStatus(PaymentStatus.PAID);
        order.setStripePaymentIntentId(paymentIntentId != null ? paymentIntentId : "pi_mock_" + order.getPaymentOrderId());
        order.setTicketId(ticketResponse.ticketId());
        order.setPaidAt(LocalDateTime.now());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        // Publish event to Kafka
        eventProducer.sendPaymentCompletedEvent(new PaymentCompletedEvent(
                savedOrder.getPaymentOrderId(),
                savedOrder.getMemberUsername(),
                savedOrder.getFixtureId(),
                savedOrder.getCategory(),
                savedOrder.getQuantity(),
                savedOrder.getTotalAmount(),
                savedOrder.getStripePaymentIntentId(),
                savedOrder.getTicketId(),
                savedOrder.getPaidAt()
        ));

        return savedOrder;
    }

    /**
     * Process full Stripe refund and cancel match ticket.
     */
    @Transactional
    public RefundResponse processRefund(String paymentOrderId, String memberUsername, RefundRequest refundRequest) {
        PaymentOrder order = paymentOrderRepository.findByPaymentOrderIdAndMemberUsername(paymentOrderId, memberUsername)
                .orElseThrow(() -> new PaymentNotFoundException("Payment order " + paymentOrderId + " not found for member " + memberUsername));

        if (order.getStatus() != PaymentStatus.PAID) {
            throw new PaymentProcessingException("Order " + paymentOrderId + " cannot be refunded because status is " + order.getStatus());
        }

        String paymentIntentId = order.getStripePaymentIntentId() != null ? order.getStripePaymentIntentId() : "pi_mock_" + order.getPaymentOrderId();

        // 1. Issue Stripe Refund
        StripeService.StripeRefundResult refundResult = stripeService.processRefund(paymentIntentId, order.getTotalAmount(), refundRequest != null ? refundRequest.getReason() : null);

        // 2. Cancel Ticket in tickets-ms
        if (order.getTicketId() != null) {
            ticketServiceClient.cancelTicket(order.getTicketId(), memberUsername);
        }

        // 3. Persist Refund Record
        int randomId = 1000 + new Random().nextInt(9000);
        String refundId = "HFC-REF-2026-" + randomId;

        RefundRecord record = new RefundRecord();
        record.setRefundId(refundId);
        record.setPaymentOrderId(paymentOrderId);
        record.setStripeRefundId(refundResult.refundId());
        record.setRefundAmount(order.getTotalAmount());
        record.setReason(refundRequest != null ? refundRequest.getReason() : "Customer Requested Refund");
        record.setStatus("SUCCEEDED");
        record.setCreatedAt(LocalDateTime.now());
        record.setCompletedAt(LocalDateTime.now());

        refundRecordRepository.save(record);

        // 4. Update PaymentOrder Status
        order.setStatus(PaymentStatus.REFUNDED);
        paymentOrderRepository.save(order);

        // 5. Publish Kafka Event
        eventProducer.sendPaymentRefundedEvent(new PaymentRefundedEvent(
                paymentOrderId,
                refundId,
                memberUsername,
                refundResult.refundId(),
                order.getTotalAmount(),
                record.getCompletedAt()
        ));

        return new RefundResponse(
                refundId,
                paymentOrderId,
                refundResult.refundId(),
                order.getTotalAmount(),
                "SUCCEEDED",
                record.getCompletedAt()
        );
    }

    public PaymentOrderResponse getOrder(String paymentOrderId, String memberUsername) {
        PaymentOrder order = paymentOrderRepository.findByPaymentOrderIdAndMemberUsername(paymentOrderId, memberUsername)
                .orElseThrow(() -> new PaymentNotFoundException("Payment order " + paymentOrderId + " not found"));

        return mapToResponse(order);
    }

    public Page<PaymentOrderResponse> getMemberOrders(String memberUsername, Pageable pageable) {
        return paymentOrderRepository.findByMemberUsernameOrderByCreatedAtDesc(memberUsername, pageable)
                .map(this::mapToResponse);
    }

    public PaymentOrderResponse getOrderByTicketId(String ticketId) {
        PaymentOrder order = paymentOrderRepository.findByTicketId(ticketId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment order for ticket ID " + ticketId + " not found"));
        return mapToResponse(order);
    }

    private PaymentOrderResponse mapToResponse(PaymentOrder o) {
        return new PaymentOrderResponse(
                o.getPaymentOrderId(),
                o.getMemberUsername(),
                o.getFixtureId(),
                o.getCategory(),
                o.getQuantity(),
                o.getUnitPrice(),
                o.getTotalAmount(),
                o.getCurrency(),
                o.getStatus(),
                o.getStripeCheckoutSessionId(),
                o.getStripePaymentIntentId(),
                o.getTicketId(),
                o.getCreatedAt(),
                o.getPaidAt()
        );
    }
}
