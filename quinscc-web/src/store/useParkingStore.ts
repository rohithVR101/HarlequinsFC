import { create } from 'zustand';
import {
  getParkingZones,
  getParkingAvailability,
  createParkingReservation,
  getMyParkingReservations,
  cancelParkingReservation,
  registerVehicle,
} from '../services/parkingApi';
import type {
  ParkingZone,
  ZoneAvailability,
  ParkingReservationResponse,
  ParkingReservationPayload,
  VehicleRegistrationPayload,
} from '../services/parkingApi';

export interface ParkingState {
  zones: ParkingZone[];
  availability: Record<string, ZoneAvailability[]>;
  myReservations: ParkingReservationResponse[];
  isLoadingZones: boolean;
  isLoadingAvailability: Record<string, boolean>;
  isLoadingMyReservations: boolean;
  error: string | null;

  fetchZones: () => Promise<void>;
  fetchAvailability: (fixtureId: string) => Promise<void>;
  fetchMyReservations: (token: string) => Promise<void>;
  reserveParking: (payload: ParkingReservationPayload, token: string) => Promise<ParkingReservationResponse | null>;
  cancelReservation: (reservationId: string, token: string) => Promise<boolean>;
  updateVehicle: (payload: VehicleRegistrationPayload, token: string) => Promise<boolean>;
}

export const useParkingStore = create<ParkingState>()((set, get) => ({
  zones: [],
  availability: {},
  myReservations: [],
  isLoadingZones: false,
  isLoadingAvailability: {},
  isLoadingMyReservations: false,
  error: null,

  fetchZones: async () => {
    set({ isLoadingZones: true, error: null });
    try {
      const data = await getParkingZones();
      set({ zones: data, isLoadingZones: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch parking zones', isLoadingZones: false });
    }
  },

  fetchAvailability: async (fixtureId: string) => {
    set((state) => ({
      isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: true },
    }));
    try {
      const data = await getParkingAvailability(fixtureId);
      set((state) => ({
        availability: {
          ...state.availability,
          [fixtureId]: data,
        },
        isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: false },
      }));
    } catch (err: any) {
      set((state) => ({
        isLoadingAvailability: { ...state.isLoadingAvailability, [fixtureId]: false },
      }));
    }
  },

  fetchMyReservations: async (token: string) => {
    set({ isLoadingMyReservations: true, error: null });
    try {
      const data = await getMyParkingReservations(token);
      set({ myReservations: data, isLoadingMyReservations: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch parking reservations', isLoadingMyReservations: false });
    }
  },

  reserveParking: async (payload: ParkingReservationPayload, token: string) => {
    set({ error: null });
    try {
      const reservation = await createParkingReservation(payload, token);
      await get().fetchMyReservations(token);
      return reservation;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to reserve parking';
      set({ error: msg });
      return null;
    }
  },

  cancelReservation: async (reservationId: string, token: string) => {
    set({ error: null });
    try {
      await cancelParkingReservation(reservationId, token);
      await get().fetchMyReservations(token);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to cancel reservation' });
      return false;
    }
  },

  updateVehicle: async (payload: VehicleRegistrationPayload, token: string) => {
    set({ error: null });
    try {
      await registerVehicle(payload, token);
      await get().fetchMyReservations(token);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to register vehicle' });
      return false;
    }
  },
}));
