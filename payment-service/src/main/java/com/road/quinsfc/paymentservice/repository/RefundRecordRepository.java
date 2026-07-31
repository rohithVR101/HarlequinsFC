package com.road.quinsfc.paymentservice.repository;

import com.road.quinsfc.paymentservice.model.RefundRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRecordRepository extends JpaRepository<RefundRecord, String> {

    List<RefundRecord> findByPaymentOrderId(String paymentOrderId);
}
