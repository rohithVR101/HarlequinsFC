package com.road.quinsfc.paymentservice.repository;

import com.road.quinsfc.paymentservice.model.PaymentOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, String> {

    Optional<PaymentOrder> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);

    Optional<PaymentOrder> findByTicketId(String ticketId);

    Optional<PaymentOrder> findByPaymentOrderIdAndMemberUsername(String paymentOrderId, String memberUsername);

    Page<PaymentOrder> findByMemberUsernameOrderByCreatedAtDesc(String memberUsername, Pageable pageable);
}
