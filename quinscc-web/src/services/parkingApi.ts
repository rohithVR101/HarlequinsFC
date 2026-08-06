import axios from 'axios';

export interface ParkingZone {
  zoneId: string;
  zoneName: string;
  location: string;
  totalCapacity: number;
  eligibleTier: string;
  bookingMethod: string;
  priceMinPence: number | null;
  priceMaxPence: number | null;
  isBookable: boolean;
  isActive: boolean;
}

export interface ZoneAvailability {
  zoneId: string;
  zoneName: string;
  location: string;
  totalCapacity: number;
  reservedCount: number;
  availableSpaces: number;
  eligibleTier: string;
  bookingMethod: string;
  priceMinPence: number | null;
  priceMaxPence: number | null;
  isBookable: boolean;
  isActive: boolean;
}

export interface ParkingReservationPayload {
  fixtureId: string;
  zoneId: string;
  ticketId?: string;
  plateNumber?: string;
  vehicleMake?: string;
  vehicleColour?: string;
  paymentOrderId?: string;
  isPaid?: boolean;
}

export interface ParkingReservationResponse {
  reservationId: string;
  fixtureId: string;
  zoneId: string;
  zoneName: string;
  location: string;
  memberUsername: string;
  ticketId?: string;
  pricePaidPence: number;
  currency: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  paymentOrderId?: string;
  qrCode?: string;
  reservedAt: string;
  confirmedAt?: string;
  expiresAt?: string;
  plateNumber?: string;
  vehicleMake?: string;
  vehicleColour?: string;
}

export interface VehicleRegistrationPayload {
  reservationId: string;
  plateNumber: string;
  vehicleMake?: string;
  vehicleColour?: string;
}

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getParkingZones = async (): Promise<ParkingZone[]> => {
  const response = await api.get<ParkingZone[]>('/api/parking/zones');
  return response.data;
};

export const getParkingAvailability = async (fixtureId: string): Promise<ZoneAvailability[]> => {
  const response = await api.get<ZoneAvailability[]>(`/api/parking/zones/availability?fixtureId=${fixtureId}`);
  return response.data;
};

export const createParkingReservation = async (
  payload: ParkingReservationPayload,
  token: string
): Promise<ParkingReservationResponse> => {
  const response = await api.post<ParkingReservationResponse>(
    '/api/parking/reservations',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMyParkingReservations = async (token: string): Promise<ParkingReservationResponse[]> => {
  const response = await api.get<ParkingReservationResponse[]>(
    '/api/parking/reservations/my-reservations',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const cancelParkingReservation = async (
  reservationId: string,
  token: string
): Promise<ParkingReservationResponse> => {
  const response = await api.delete<ParkingReservationResponse>(
    `/api/parking/reservations/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const confirmParkingReservation = async (
  reservationId: string,
  token: string,
  paymentOrderId?: string
): Promise<ParkingReservationResponse> => {
  const response = await api.put<ParkingReservationResponse>(
    `/api/parking/reservations/${reservationId}/confirm${paymentOrderId ? `?paymentOrderId=${paymentOrderId}` : ''}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const registerVehicle = async (
  payload: VehicleRegistrationPayload,
  token: string
): Promise<any> => {
  const response = await api.post('/api/parking/vehicles', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
