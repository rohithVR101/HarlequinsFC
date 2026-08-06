import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description 'Publish PaymentCompletedEvent to payment-events topic upon checkout fulfillment'
    label 'payment_completed'
    input {
        triggeredBy('triggerPaymentCompletedEvent()')
    }
    outputMessage {
        sentTo 'payment-events'
        body([
            paymentOrderId: $(c(regex('ORD-[0-9]+')), p('ORD-12345')),
            stripeCheckoutSessionId: $(c(regex('cs_test_[a-zA-Z0-9]+')), p('cs_test_999')),
            memberUsername: $(c(regex('[a-zA-Z0-9_]+')), p('demo_user')),
            amount: $(c(regex('[0-9]+\\.[0-9]{2}')), p(90.00)),
            status: 'COMPLETED'
        ])
        headers {
            header('contentType', 'application/json')
        }
    }
}
