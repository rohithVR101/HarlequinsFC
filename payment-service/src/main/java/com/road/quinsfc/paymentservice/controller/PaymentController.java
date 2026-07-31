package com.road.quinsfc.paymentservice.controller;

import com.road.quinsfc.paymentservice.dto.*;
import com.road.quinsfc.paymentservice.model.PaymentOrder;
import com.road.quinsfc.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout-session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            @RequestHeader(value = "X-User-Name", required = false, defaultValue = "demo_user") String memberUsername,
            @Valid @RequestBody CheckoutSessionRequest request) {
        CheckoutSessionResponse response = paymentService.createCheckoutSession(memberUsername, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/fulfill")
    public ResponseEntity<PaymentOrder> fulfillPaymentSession(
            @RequestParam("session_id") String sessionId) {
        PaymentOrder order = paymentService.fulfillPayment(sessionId, null);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/order/{paymentOrderId}")
    public ResponseEntity<PaymentOrderResponse> getOrder(
            @RequestHeader(value = "X-User-Name") String memberUsername,
            @PathVariable String paymentOrderId) {
        return ResponseEntity.ok(paymentService.getOrder(paymentOrderId, memberUsername));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<Page<PaymentOrderResponse>> getMyOrders(
            @RequestHeader(value = "X-User-Name") String memberUsername,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(paymentService.getMemberOrders(memberUsername, PageRequest.of(page, size)));
    }

    @PostMapping("/refund/{paymentOrderId}")
    public ResponseEntity<RefundResponse> refundOrder(
            @RequestHeader(value = "X-User-Name") String memberUsername,
            @PathVariable String paymentOrderId,
            @RequestBody(required = false) RefundRequest refundRequest) {
        RefundResponse response = paymentService.processRefund(paymentOrderId, memberUsername, refundRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/by-ticket/{ticketId}")
    public ResponseEntity<PaymentOrderResponse> getOrderByTicketId(
            @PathVariable String ticketId) {
        return ResponseEntity.ok(paymentService.getOrderByTicketId(ticketId));
    }
}
