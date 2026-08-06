import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description 'Publish TicketPurchasedEvent to ticket-events topic upon successful purchase'
    label 'ticket_purchased'
    input {
        triggeredBy('triggerTicketPurchasedEvent()')
    }
    outputMessage {
        sentTo 'ticket-events'
        body([
            ticketId: $(c(regex('HFC-TKT-[0-9]{4}-[0-9]{4}')), p('HFC-TKT-2026-1234')),
            fixtureId: $(c(regex('FIX-[0-9]+')), p('FIX-101')),
            memberUsername: $(c(regex('[a-zA-Z0-9_]+')), p('demo_user')),
            category: $(c(regex('STANDARD|PREMIUM|VIP')), p('STANDARD')),
            quantity: $(c(regex('[1-9][0-9]*')), p(2)),
            totalPrice: $(c(regex('[0-9]+\\.[0-9]{2}')), p(90.00))
        ])
        headers {
            header('contentType', 'application/json')
        }
    }
}
