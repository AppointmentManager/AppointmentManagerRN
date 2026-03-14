/**
 * Appointment Service - Business logic layer for appointment operations
 * Interacts with AppointmentRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  AppointmentRepository,
  AppointmentRequest,
  AppointmentResponse,
} from '../repository/AppointmentRepository';

export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async createAppointment(request: AppointmentRequest): Promise<ApiResponse<AppointmentResponse>> {
    try {
      const response = await AppointmentRepository.createAppointment(request);
      return {
        success: true,
        data: response,
        message: 'Appointment created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment',
      };
    }
  }

  /**
   * Get appointment by ID
   */
  static async getAppointmentById(id: number): Promise<ApiResponse<AppointmentResponse>> {
    try {
      const response = await AppointmentRepository.getAppointmentById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointment',
      };
    }
  }

  /**
   * Get all appointments for a specific user
   */
  static async getAppointmentsByUser(userId: number): Promise<ApiResponse<AppointmentResponse[]>> {
    try {
      const responses = await AppointmentRepository.getAppointmentsByUser(userId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user appointments',
      };
    }
  }

  /**
   * Get all appointments for a specific store
   */
  static async getAppointmentsByStore(storeId: number): Promise<ApiResponse<AppointmentResponse[]>> {
    try {
      const responses = await AppointmentRepository.getAppointmentsByStore(storeId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch store appointments',
      };
    }
  }

  /**
   * Update appointment status
   */
  static async updateStatus(
    id: number,
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  ): Promise<ApiResponse<AppointmentResponse>> {
    try {
      const response = await AppointmentRepository.updateStatus(id, status);
      return {
        success: true,
        data: response,
        message: `Appointment status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update appointment status',
      };
    }
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(id: number): Promise<ApiResponse<void>> {
    try {
      await AppointmentRepository.cancelAppointment(id);
      return {
        success: true,
        message: 'Appointment cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel appointment',
      };
    }
  }
}
