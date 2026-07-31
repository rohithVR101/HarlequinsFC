import axios from 'axios';
import type { TicketCategoryType } from '../data/ticketsData';

export interface CheckoutSessionPayload {
  fixtureId: string;
  category: TicketCategoryType;
  quantity: number;
}

export interface CheckoutSessionResponse {
  paymentOrderId: string;
  checkoutUrl: string;
  sessionId: string;
}

export interface PaymentOrderResponse {
  paymentOrderId: string;
  memberUsername: string;
  fixtureId: string;
  category: TicketCategoryType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'EXPIRED';
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  ticketId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface RefundResponse {
  refundId: string;
  paymentOrderId: string;
  stripeRefundId: string;
  refundAmount: number;
  status: string;
  completedAt: string;
}

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createCheckoutSession = async (
  payload: CheckoutSessionPayload,
  token: string
): Promise<CheckoutSessionResponse> => {
  const response = await api.post<CheckoutSessionResponse>(
    '/api/payments/checkout-session',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fulfillPaymentSession = async (
  sessionId: string,
  token?: string
): Promise<PaymentOrderResponse> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await api.post<PaymentOrderResponse>(
    `/api/payments/fulfill?session_id=${sessionId}`,
    {},
    { headers }
  );
  return response.data;
};

export const getMyPaymentOrders = async (
  token: string,
  page = 0,
  size = 10
): Promise<{ content: PaymentOrderResponse[]; totalPages: number }> => {
  const response = await api.get<{ content: PaymentOrderResponse[]; totalPages: number }>(
    `/api/payments/my-orders?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const refundPaymentOrder = async (
  paymentOrderId: string,
  reason: string,
  token: string
): Promise<RefundResponse> => {
  const response = await api.post<RefundResponse>(
    `/api/payments/refund/${paymentOrderId}`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
