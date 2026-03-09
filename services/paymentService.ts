/**
 * Payment Service - Handles all payment-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface PaymentRequest {
  appointmentId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING';
  transactionId?: string;
}

export interface PaymentResponse {
  paymentId: number;
  appointmentId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  createdAt: string;
}

export class PaymentService {
  /**
   * Create a new payment
   */
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>('/payments', request);
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(id: number): Promise<PaymentResponse> {
    return apiClient.get<PaymentResponse>(`/payments/${id}`);
  }

  /**
   * Get payment by appointment ID
   */
  static async getPaymentByAppointmentId(appointmentId: number): Promise<PaymentResponse> {
    return apiClient.get<PaymentResponse>(`/payments/appointment/${appointmentId}`);
  }

  /**
   * Update payment status
   */
  static async updateStatus(
    id: number,
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  ): Promise<PaymentResponse> {
    return apiClient.patch<PaymentResponse>(`/payments/${id}/status?status=${status}`);
  }
}
