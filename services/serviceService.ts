/**
 * Service Service - Handles all service-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface ServiceRequest {
  categoryId: number;
  storeId: number;
  serviceName: string;
  description?: string;
  duration: number; // in minutes
  price: number;
}

export interface ServiceResponse {
  serviceId: number;
  category: CategoryResponse;
  storeId: number;
  storeName: string;
  serviceName: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
}

export class ServiceService {
  /**
   * Create a new service
   */
  static async createService(request: ServiceRequest): Promise<ServiceResponse> {
    return await apiClient.post<ServiceResponse>('/services', request);
  }

  /**
   * Get service by ID
   */
  static async getServiceById(id: number): Promise<ServiceResponse> {
    return await apiClient.get<ServiceResponse>(`/services/${id}`);
  }

  /**
   * Get all services
   * @param storeId - Optional filter by store ID
   * @param categoryId - Optional filter by category ID
   */
  static async getAllServices(
    storeId?: number,
    categoryId?: number
  ): Promise<ServiceResponse[]> {
    const params = new URLSearchParams();

    if (storeId) {
      params.append('storeId', storeId.toString());
    }
    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }

    const endpoint = params.toString()
      ? `/services?${params.toString()}`
      : '/services';

    return await apiClient.get<ServiceResponse[]>(endpoint);
  }

  /**
   * Update a service
   */
  static async updateService(id: number, request: ServiceRequest): Promise<ServiceResponse> {
    return await apiClient.put<ServiceResponse>(`/services/${id}`, request);
  }

  /**
   * Delete a service
   */
  static async deleteService(id: number): Promise<void> {
    return await apiClient.delete<void>(`/services/${id}`);
  }
}
