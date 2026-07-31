export type TicketCategoryType = 'STANDARD' | 'PREMIUM' | 'VIP';

export interface CategoryInfo {
  id: TicketCategoryType;
  name: string;
  price: number; // GBP
  description: string;
  defaultCount: number;
}

export interface FixtureTicketAvailability {
  fixtureId: string;
  categoryCounts: Record<TicketCategoryType, number>;
}

export interface UserTicket {
  ticketId: string;
  fixtureId: string;
  memberUsername: string;
  category: TicketCategoryType;
  categoryName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  seatSection: string;
  seatRow: string;
  seatNumbers: string; // e.g. "14-15"
  purchasedAt: string; // ISO date string
  status: 'PURCHASED' | 'CANCELLED';
  qrCode: string;
}

export const TICKET_CATEGORIES: CategoryInfo[] = [
  {
    id: 'STANDARD',
    name: 'Standard Match Pass',
    price: 45,
    description: 'General admission seating in the North and South Stands with great pitch visibility.',
    defaultCount: 120,
  },
  {
    id: 'PREMIUM',
    name: 'East Terrace Premium',
    price: 85,
    description: 'Padded mid-tier seating on the half-way line with exclusive lounge access.',
    defaultCount: 35,
  },
  {
    id: 'VIP',
    name: 'Quins Diamond VIP Suite',
    price: 175,
    description: 'Ultra-luxury box seating, complimentary matchday dining, and player lounge pass.',
    defaultCount: 8,
  },
];

export const INITIAL_FIXTURE_AVAILABILITY: Record<string, Record<TicketCategoryType, number>> = {
  'fix-4': { STANDARD: 42, PREMIUM: 12, VIP: 2 },
  'fix-5': { STANDARD: 150, PREMIUM: 45, VIP: 6 },
  'fix-carabao-r3': { STANDARD: 85, PREMIUM: 28, VIP: 4 },
  'fix-7': { STANDARD: 64, PREMIUM: 18, VIP: 3 },
  'fix-8': { STANDARD: 110, PREMIUM: 30, VIP: 5 },
  'fix-9': { STANDARD: 180, PREMIUM: 50, VIP: 10 },
  'fix-10': { STANDARD: 95, PREMIUM: 22, VIP: 4 },
  'fix-carabao-r4': { STANDARD: 70, PREMIUM: 15, VIP: 2 },
  'fix-11': { STANDARD: 200, PREMIUM: 60, VIP: 12 },
  'fix-12': { STANDARD: 88, PREMIUM: 24, VIP: 5 },
  'fix-13': { STANDARD: 35, PREMIUM: 8, VIP: 1 }, // Low stock match
  'fix-carabao-qf': { STANDARD: 15, PREMIUM: 4, VIP: 0 }, // Derby match selling fast
};

export const INITIAL_DEMO_TICKETS: UserTicket[] = [
  {
    ticketId: 'HFC-TKT-2026-8891',
    fixtureId: 'fix-5',
    memberUsername: 'demo_user',
    category: 'PREMIUM',
    categoryName: 'East Terrace Premium',
    price: 85,
    quantity: 2,
    totalPrice: 170,
    seatSection: 'East Stand - Block E2',
    seatRow: 'Row 14',
    seatNumbers: 'Seats 18, 19',
    purchasedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'PURCHASED',
    qrCode: 'HFC-PASS-8891-FX5',
  },
];
