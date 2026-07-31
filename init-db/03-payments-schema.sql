-- Connect to quinsfc_payments database
\c quinsfc_payments;

-- Create payment_orders table
CREATE TABLE IF NOT EXISTS payment_orders (
    payment_order_id VARCHAR(50) PRIMARY KEY,
    member_username VARCHAR(100) NOT NULL,
    fixture_id VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'GBP',
    status VARCHAR(20) NOT NULL,
    stripe_checkout_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    ticket_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create refund_records table
CREATE TABLE IF NOT EXISTS refund_records (
    refund_id VARCHAR(50) PRIMARY KEY,
    payment_order_id VARCHAR(50) NOT NULL REFERENCES payment_orders(payment_order_id),
    stripe_refund_id VARCHAR(255) UNIQUE,
    refund_amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_payment_orders_member ON payment_orders (member_username);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders (status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_fixture ON payment_orders (fixture_id);
CREATE INDEX IF NOT EXISTS idx_refund_records_order ON refund_records (payment_order_id);
