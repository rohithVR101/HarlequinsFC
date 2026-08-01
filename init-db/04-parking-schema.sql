-- Connect to quinsfc_parking database
\c quinsfc_parking;

-- Create parking_zones table
CREATE TABLE IF NOT EXISTS parking_zones (
    zone_id         VARCHAR(20)   PRIMARY KEY,
    zone_name       VARCHAR(100)  NOT NULL,
    location        VARCHAR(200)  NOT NULL,
    total_capacity  INTEGER       NOT NULL,
    eligible_tier   VARCHAR(100)  NOT NULL,
    booking_method  VARCHAR(100)  NOT NULL,
    price_min_pence INTEGER,
    price_max_pence INTEGER,
    is_bookable     BOOLEAN       NOT NULL DEFAULT TRUE,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Seed initial parking zones
INSERT INTO parking_zones (zone_id, zone_name, location, total_capacity, eligible_tier, booking_method, price_min_pence, price_max_pence, is_bookable, is_active)
VALUES
    ('ZONE_A', 'Zone A (On-Site Blue Badge)', 'Craneford Way Stadium (North Gate)', 75, 'Blue Badge / Accessible Fans Only', 'Pre-booked via tickets-app', 0, 0, TRUE, TRUE),
    ('ZONE_B', 'Zone B (VIP / Hospitality)', 'Craneford Way Stadium (Underground)', 40, 'Executive Box / Club Directors', 'Included in VIP Packages', NULL, NULL, FALSE, TRUE),
    ('ZONE_C', 'Zone C (Stoop North Car Park)', 'Twickenham Stoop (Adjacent)', 300, 'All Members & General Fans', 'Pre-booked via parking-service (£15–£20)', 1500, 2000, TRUE, TRUE),
    ('ZONE_D', 'Zone D (Rosebine Car Park)', 'A316 Chertsey Road (5-min walk)', 450, 'All Members & General Fans', 'Pre-booked via parking-service (£10–£15)', 1000, 1500, TRUE, TRUE),
    ('CYCLE_HUB', 'Cycle Hub (North & South Plazas)', 'Craneford Way Stadium Exterior', 350, 'All Fans & Visiting Supporters', 'Free / First-Come, First-Served', NULL, NULL, FALSE, TRUE),
    ('CYCLE_OVERFLOW', 'Cycle Overflow (Gates 1 & 3)', 'Twickenham Stoop Exterior', 100, 'All Fans & Visiting Supporters', 'Free / First-Come, First-Served', NULL, NULL, FALSE, TRUE)
ON CONFLICT (zone_id) DO UPDATE SET
    zone_name = EXCLUDED.zone_name,
    location = EXCLUDED.location,
    total_capacity = EXCLUDED.total_capacity,
    eligible_tier = EXCLUDED.eligible_tier,
    booking_method = EXCLUDED.booking_method,
    price_min_pence = EXCLUDED.price_min_pence,
    price_max_pence = EXCLUDED.price_max_pence,
    is_bookable = EXCLUDED.is_bookable,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Create parking_reservations table
CREATE TABLE IF NOT EXISTS parking_reservations (
    reservation_id    VARCHAR(50)    PRIMARY KEY,
    fixture_id        VARCHAR(50)    NOT NULL,
    zone_id           VARCHAR(20)    NOT NULL REFERENCES parking_zones(zone_id),
    member_username   VARCHAR(100)   NOT NULL,
    ticket_id         VARCHAR(50),
    price_paid_pence  INTEGER        NOT NULL,
    currency          VARCHAR(3)     NOT NULL DEFAULT 'GBP',
    status            VARCHAR(20)    NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_order_id  VARCHAR(50),
    qr_code           VARCHAR(100),
    reserved_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
    confirmed_at      TIMESTAMP,
    checked_in_at     TIMESTAMP,
    expires_at        TIMESTAMP,
    cancelled_at      TIMESTAMP
);

-- Indexes for parking_reservations
CREATE INDEX IF NOT EXISTS idx_parking_res_member   ON parking_reservations (member_username);
CREATE INDEX IF NOT EXISTS idx_parking_res_fixture  ON parking_reservations (fixture_id);
CREATE INDEX IF NOT EXISTS idx_parking_res_zone     ON parking_reservations (zone_id);
CREATE INDEX IF NOT EXISTS idx_parking_res_status   ON parking_reservations (status);
CREATE INDEX IF NOT EXISTS idx_parking_res_ticket   ON parking_reservations (ticket_id);

-- Prevent duplicate active reservations for same member + fixture + zone
CREATE UNIQUE INDEX IF NOT EXISTS uq_parking_res_member_fixture_zone
    ON parking_reservations (member_username, fixture_id, zone_id)
    WHERE status NOT IN ('CANCELLED', 'EXPIRED');

-- Create vehicle_registrations table
CREATE TABLE IF NOT EXISTS vehicle_registrations (
    vehicle_id        BIGSERIAL      PRIMARY KEY,
    reservation_id    VARCHAR(50)    NOT NULL REFERENCES parking_reservations(reservation_id) ON DELETE CASCADE,
    plate_number      VARCHAR(15)    NOT NULL,
    vehicle_make      VARCHAR(50),
    vehicle_colour    VARCHAR(30),
    registered_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vehicle_per_reservation UNIQUE (reservation_id)
);

-- Index for vehicle plate ANPR lookup
CREATE INDEX IF NOT EXISTS idx_vehicle_plate ON vehicle_registrations (plate_number);
