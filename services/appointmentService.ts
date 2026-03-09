/**
 * Appointment Service - Handles all appointment-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface ServiceResponse {
  serviceId: number;
  serviceName: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
}

export interface AppointmentRequest {
  userId: number;
  storeId: number;
  serviceId: number;
  appointmentDate: string; // LocalDate format: YYYY-MM-DD
  startTime: string; // LocalTime format: HH:mm:ss
  notes?: string;
}

export interface AppointmentResponse {
  appointmentId: number;
  userId: number;
  userName: string;
  storeId: number;
  storeName: string;
  service: ServiceResponse;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async createAppointment(request: AppointmentRequest): Promise<AppointmentResponse> {
    return await apiClient.post<AppointmentResponse>('/appointments', request);
  }

  /**
   * Get appointment by ID
   */
  static async getAppointmentById(id: number): Promise<AppointmentResponse> {
    return await apiClient.get<AppointmentResponse>(`/appointments/${id}`);
  }

  /**
   * Get all appointments for a specific user
   */
  static async getAppointmentsByUser(userId: number): Promise<AppointmentResponse[]> {
    return await apiClient.get<AppointmentResponse[]>(`/appointments/user/${userId}`);
  }

  /**
   * Get all appointments for a specific store
   */
  static async getAppointmentsByStore(storeId: number): Promise<AppointmentResponse[]> {
    return await apiClient.get<AppointmentResponse[]>(`/appointments/store/${storeId}`);
  }

  /**
   * Update appointment status
   */
  static async updateStatus(
    id: number,
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  ): Promise<AppointmentResponse> {
    return await apiClient.patch<AppointmentResponse>(`/appointments/${id}/status?status=${status}`);
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(id: number): Promise<void> {
    return await apiClient.delete<void>(`/appointments/${id}`);
  }
}
