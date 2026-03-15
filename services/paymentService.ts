/**
 * Payment Service - Business logic layer for payment operations
 * Interacts with PaymentRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  PaymentRepository,
  PaymentRequest,
  PaymentResponse,
} from '../repository/PaymentRepository';

export class PaymentService {
  /**
   * Create a new payment
   */
  static async createPayment(request: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await PaymentRepository.createPayment(request);
      return {
        success: true,
        data: response,
        message: 'Payment created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment',
      };
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(id: number): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await PaymentRepository.getPaymentById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment',
      };
    }
  }

  /**
   * Get payment by appointment ID
   */
  static async getPaymentByAppointmentId(appointmentId: number): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await PaymentRepository.getPaymentByAppointmentId(appointmentId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment',
      };
    }
  }

  /**
   * Update payment status
   */
  static async updateStatus(
    id: number,
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await PaymentRepository.updateStatus(id, status);
      return {
        success: true,
        data: response,
        message: `Payment status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment status',
      };
    }
  }
}
