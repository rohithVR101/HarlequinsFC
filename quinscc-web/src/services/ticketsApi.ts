import axios from 'axios';

export type TicketCategoryType = 'STANDARD' | 'PREMIUM' | 'VIP';

export interface CategoryInfo {
  id: TicketCategoryType;
  name: string;
  price: number; // GBP
  description: string;
  defaultCount: number;
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
  seatNumbers: string;
  purchasedAt: string;
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
    description: 'Ultra-luxury box seating, complimentary dining, player lounge pass, and dedicated Zone B Underground VIP Parking space included.',
    defaultCount: 8,
  },
];

export interface FixtureAvailabilityResponse {
  fixtureId: string;
  totalCapacity: number;
  categoryCounts: Record<TicketCategoryType, number>;
  categoryPrices: Record<TicketCategoryType, number>;
}

export interface TicketPurchasePayload {
  fixtureId: string;
  category: TicketCategoryType;
  quantity: number;
}

export interface MatchTicketResponse {
  ticketId: string;
  fixtureId: string;
  memberUsername: string;
  category: TicketCategoryType;
  categoryName?: string;
  price?: number;
  unitPrice?: number;
  quantity: number;
  totalPrice: number;
  seatSection: string;
  seatRow: string;
  seatNumbers: string;
  status: 'PURCHASED' | 'CANCELLED';
  purchasedAt: string;
  cancelledAt?: string | null;
  qrCode: string;
}

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-logout if Gateway returns 401 Unauthorized (e.g. expired token or service restart)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      import('../store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
    }
    return Promise.reject(error);
  }
);

/**
 * Get live seat availability for a fixture from the tickets-service (PostgreSQL).
 * Public endpoint — no JWT required.
 */
export const getFixtureAvailability = async (
  fixtureId: string
): Promise<FixtureAvailabilityResponse> => {
  const response = await api.get<FixtureAvailabilityResponse>(
    `/api/tickets/availability/${fixtureId}`
  );
  return response.data;
};

/**
 * Purchase tickets for a fixture.
 * Protected endpoint — requires JWT Authorization header.
 */
export const purchaseTickets = async (
  payload: TicketPurchasePayload,
  token: string
): Promise<MatchTicketResponse> => {
  const response = await api.post<MatchTicketResponse>(
    '/api/tickets/purchase',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Get all tickets for the authenticated member.
 * Protected endpoint — requires JWT Authorization header.
 */
export const getMyTickets = async (
  token: string
): Promise<MatchTicketResponse[]> => {
  const response = await api.get<MatchTicketResponse[]>(
    '/api/tickets/my-tickets',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Cancel a ticket booking and restore inventory.
 * Protected endpoint — requires JWT Authorization header.
 */
export const cancelTicket = async (
  ticketId: string,
  token: string
): Promise<MatchTicketResponse> => {
  const response = await api.delete<MatchTicketResponse>(
    `/api/tickets/cancel/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Convert backend MatchTicketResponse to frontend UserTicket shape.
 */
export const toUserTicket = (r: MatchTicketResponse): UserTicket => {
  const categoryNames: Record<TicketCategoryType, string> = {
    STANDARD: 'Standard Match Pass',
    PREMIUM: 'East Terrace Premium',
    VIP: 'Quins Diamond VIP Suite',
  };

  return {
    ticketId: r.ticketId,
    fixtureId: r.fixtureId,
    memberUsername: r.memberUsername,
    category: r.category,
    categoryName: r.categoryName || categoryNames[r.category] || r.category,
    price: r.price ?? r.unitPrice ?? 0,
    quantity: r.quantity,
    totalPrice: r.totalPrice,
    seatSection: r.seatSection,
    seatRow: r.seatRow,
    seatNumbers: r.seatNumbers,
    purchasedAt: r.purchasedAt,
    status: r.status,
    qrCode: r.qrCode,
  };
};
