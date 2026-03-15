/**
 * Service Service - Business logic layer for service operations
 * Interacts with ServiceRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  ServiceRepository,
  ServiceRequest,
  ServiceResponse,
} from '../repository/ServiceRepository';

export class ServiceService {
  /**
   * Create a new service
   */
  static async createService(request: ServiceRequest): Promise<ApiResponse<ServiceResponse>> {
    try {
      const response = await ServiceRepository.createService(request);
      return {
        success: true,
        data: response,
        message: 'Service created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create service',
      };
    }
  }

  /**
   * Get service by ID
   */
  static async getServiceById(id: number): Promise<ApiResponse<ServiceResponse>> {
    try {
      const response = await ServiceRepository.getServiceById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch service',
      };
    }
  }

  /**
   * Get all services
   * @param storeId - Optional filter by store ID
   * @param categoryId - Optional filter by category ID
   */
  static async getAllServices(
    storeId?: number,
    categoryId?: number
  ): Promise<ApiResponse<ServiceResponse[]>> {
    try {
      const responses = await ServiceRepository.getAllServices(storeId, categoryId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch services',
      };
    }
  }

  /**
   * Update a service
   */
  static async updateService(id: number, request: ServiceRequest): Promise<ApiResponse<ServiceResponse>> {
    try {
      const response = await ServiceRepository.updateService(id, request);
      return {
        success: true,
        data: response,
        message: 'Service updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update service',
      };
    }
  }

  /**
   * Delete a service
   */
  static async deleteService(id: number): Promise<ApiResponse<void>> {
    try {
      await ServiceRepository.deleteService(id);
      return {
        success: true,
        message: 'Service deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete service',
      };
    }
  }
}
