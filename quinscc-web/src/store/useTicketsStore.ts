import { create } from 'zustand';
import type { UserTicket, TicketCategoryType } from '../data/ticketsData';
import {
  getFixtureAvailability,
  purchaseTickets as apiPurchaseTickets,
  getMyTickets as apiGetMyTickets,
  cancelTicket as apiCancelTicket,
  toUserTicket,
} from '../services/ticketsApi';
import type { FixtureAvailabilityResponse } from '../services/ticketsApi';

export interface PurchasePayload {
  fixtureId: string;
  category: TicketCategoryType;
  quantity: number;
  memberUsername: string;
}

export interface TicketsState {
  // Cached availability from backend (keyed by fixtureId)
  availability: Record<string, Record<TicketCategoryType, number>>;
  myTickets: UserTicket[];
  isLoadingAvailability: Record<string, boolean>;
  isLoadingMyTickets: boolean;

  // Actions
  fetchAvailability: (fixtureId: string) => Promise<void>;
  fetchAllAvailability: (fixtureIds: string[]) => Promise<void>;
  purchaseTickets: (payload: PurchasePayload, token: string) => Promise<UserTicket>;
  fetchMyTickets: (token: string) => Promise<void>;
  cancelTicket: (ticketId: string, token: string) => Promise<boolean>;
  getAvailableCount: (fixtureId: string, category?: TicketCategoryType) => number;
}

// Purge legacy local storage key from earlier mock version
try {
  localStorage.removeItem('quinsfc-tickets-storage');
} catch {}

export const useTicketsStore = create<TicketsState>()((set, get) => ({
  availability: {},
  myTickets: [],
  isLoadingAvailability: {},
  isLoadingMyTickets: false,

  fetchAvailability: async (fixtureId: string) => {
    set((state) => ({
      isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: true },
    }));
    try {
      const data: FixtureAvailabilityResponse = await getFixtureAvailability(fixtureId);
      set((state) => ({
        availability: {
          ...state.availability,
          [fixtureId]: data.categoryCounts,
        },
        isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: false },
      }));
    } catch {
      set((state) => ({
        isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: false },
      }));
    }
  },

  fetchAllAvailability: async (fixtureIds: string[]) => {
    const loadingState: Record<string, boolean> = {};
    fixtureIds.forEach((id) => (loadingState[id] = true));
    set((state) => ({
      isLoadingAvailability: { ...state.isLoadingAvailability, ...loadingState },
    }));

    const results = await Promise.allSettled(
      fixtureIds.map((id) => getFixtureAvailability(id))
    );

    const newAvailability: Record<string, Record<TicketCategoryType, number>> = {};
    const doneLoading: Record<string, boolean> = {};

    results.forEach((result, idx) => {
      const fixtureId = fixtureIds[idx];
      doneLoading[fixtureId] = false;
      if (result.status === 'fulfilled') {
        newAvailability[fixtureId] = result.value.categoryCounts;
      }
    });

    set((state) => ({
      availability: { ...state.availability, ...newAvailability },
      isLoadingAvailability: { ...state.isLoadingAvailability, ...doneLoading },
    }));
  },

  purchaseTickets: async (payload: PurchasePayload, token: string) => {
    const response = await apiPurchaseTickets(
      {
        fixtureId: payload.fixtureId,
        category: payload.category,
        quantity: payload.quantity,
      },
      token
    );

    const ticket = toUserTicket(response);

    // Refresh availability from backend after purchase
    try {
      const data = await getFixtureAvailability(payload.fixtureId);
      set((state) => ({
        myTickets: [ticket, ...state.myTickets],
        availability: {
          ...state.availability,
          [payload.fixtureId]: data.categoryCounts,
        },
      }));
    } catch {
      // Even if refresh fails, add ticket to local state
      set((state) => ({
        myTickets: [ticket, ...state.myTickets],
      }));
    }

    return ticket;
  },

  fetchMyTickets: async (token: string) => {
    set({ isLoadingMyTickets: true });
    try {
      const data = await apiGetMyTickets(token);
      const tickets = data.map(toUserTicket);
      set({ myTickets: tickets, isLoadingMyTickets: false });
    } catch {
      set({ isLoadingMyTickets: false });
    }
  },

  cancelTicket: async (ticketId: string, token: string) => {
    try {
      const response = await apiCancelTicket(ticketId, token);
      const cancelledTicket = toUserTicket(response);

      // Refresh availability for the cancelled ticket's fixture
      try {
        const data = await getFixtureAvailability(cancelledTicket.fixtureId);
        set((state) => ({
          myTickets: state.myTickets.map((t) =>
            t.ticketId === ticketId ? cancelledTicket : t
          ),
          availability: {
            ...state.availability,
            [cancelledTicket.fixtureId]: data.categoryCounts,
          },
        }));
      } catch {
        set((state) => ({
          myTickets: state.myTickets.map((t) =>
            t.ticketId === ticketId ? cancelledTicket : t
          ),
        }));
      }

      return true;
    } catch {
      return false;
    }
  },

  getAvailableCount: (fixtureId: string, category?: TicketCategoryType) => {
    const state = get();
    const fixAvail = state.availability[fixtureId];
    if (!fixAvail) return -1; // -1 means "not loaded yet"
    if (category) return fixAvail[category] ?? 0;

    return (fixAvail.STANDARD || 0) + (fixAvail.PREMIUM || 0) + (fixAvail.VIP || 0);
  },
}));
