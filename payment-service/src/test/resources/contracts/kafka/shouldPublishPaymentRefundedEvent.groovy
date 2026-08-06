import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description 'Publish PaymentRefundedEvent to payment-events topic upon refund'
    label 'payment_refunded'
    input {
        triggeredBy('triggerPaymentRefundedEvent()')
    }
    outputMessage {
        sentTo 'payment-events'
        body([
            paymentOrderId: $(c(regex('ORD-[0-9]+')), p('ORD-12345')),
            refundId: $(c(regex('re_[a-zA-Z0-9]+')), p('re_test_999')),
            amount: $(c(regex('[0-9]+\\.[0-9]{2}')), p(90.00)),
            status: 'REFUNDED'
        ])
        headers {
            header('contentType', 'application/json')
        }
    }
}
