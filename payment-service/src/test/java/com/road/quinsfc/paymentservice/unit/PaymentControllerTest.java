package com.road.quinsfc.paymentservice.unit;

import com.road.quinsfc.paymentservice.controller.PaymentController;
import com.road.quinsfc.paymentservice.dto.*;
import com.road.quinsfc.paymentservice.model.PaymentOrder;
import com.road.quinsfc.paymentservice.model.PaymentStatus;
import com.road.quinsfc.paymentservice.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private PaymentOrder sampleOrder;

    @BeforeEach
    void setUp() {
        sampleOrder = new PaymentOrder();
        sampleOrder.setPaymentOrderId("ORD-12345");
        sampleOrder.setStripeCheckoutSessionId("cs_test_999");
        sampleOrder.setMemberUsername("demo_user");
        sampleOrder.setFixtureId("FIX-101");
        sampleOrder.setCategory("STANDARD");
        sampleOrder.setQuantity(2);
        sampleOrder.setUnitPrice(new BigDecimal("45.00"));
        sampleOrder.setTotalAmount(new BigDecimal("90.00"));
        sampleOrder.setCurrency("GBP");
        sampleOrder.setStatus(PaymentStatus.PAID);
        sampleOrder.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createCheckoutSession_ShouldReturnCreatedStatus() {
        CheckoutSessionRequest request = new CheckoutSessionRequest();
        request.setFixtureId("FIX-101");
        request.setCategory("STANDARD");
        request.setQuantity(2);

        CheckoutSessionResponse mockResponse = new CheckoutSessionResponse(
                "ORD-12345", "https://checkout.stripe.com/pay/cs_test_999", "cs_test_999"
        );

        when(paymentService.createCheckoutSession(eq("demo_user"), any(CheckoutSessionRequest.class)))
                .thenReturn(mockResponse);

        ResponseEntity<CheckoutSessionResponse> response = paymentController.createCheckoutSession("demo_user", request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("cs_test_999", response.getBody().getSessionId());
        assertEquals("ORD-12345", response.getBody().getPaymentOrderId());
        verify(paymentService, times(1)).createCheckoutSession(eq("demo_user"), any(CheckoutSessionRequest.class));
    }

    @Test
    void fulfillPaymentSession_ShouldReturnFulfillOrder() {
        when(paymentService.fulfillPayment("cs_test_999", null)).thenReturn(sampleOrder);

        ResponseEntity<PaymentOrder> response = paymentController.fulfillPaymentSession("cs_test_999");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(PaymentStatus.PAID, response.getBody().getStatus());
        verify(paymentService, times(1)).fulfillPayment("cs_test_999", null);
    }
}
