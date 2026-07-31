-- Connect to quinsfc_tickets database
\c quinsfc_tickets;

-- Create match_inventories table
CREATE TABLE IF NOT EXISTS match_inventories (
    id BIGSERIAL PRIMARY KEY,
    fixture_id VARCHAR(50) NOT NULL UNIQUE,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create match_tier_inventories table
CREATE TABLE IF NOT EXISTS match_tier_inventories (
    id BIGSERIAL PRIMARY KEY,
    inventory_id BIGINT,
    category VARCHAR(20) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    fixture_id VARCHAR(50) NOT NULL,
    member_username VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    seat_section VARCHAR(100) NOT NULL,
    seat_row VARCHAR(50) NOT NULL,
    seat_numbers VARCHAR(100) NOT NULL,
    purchased_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    qr_code VARCHAR(100) NOT NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_member ON tickets (member_username);
CREATE INDEX IF NOT EXISTS idx_tickets_fixture ON tickets (fixture_id);
