/**
 * Vendor Service - Business logic layer for vendor operations
 * Interacts with VendorRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  VendorRepository,
  VendorProfileRequest,
  VendorProfileResponse,
} from '../repository/VendorRepository';

export class VendorService {
  /**
   * Create a new vendor
   */
  static async createVendor(request: VendorProfileRequest): Promise<ApiResponse<VendorProfileResponse>> {
    try {
      const response = await VendorRepository.createVendor(request);
      return {
        success: true,
        data: response,
        message: 'Vendor created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create vendor',
      };
    }
  }

  /**
   * Get vendor by ID
   */
  static async getVendorById(id: number): Promise<ApiResponse<VendorProfileResponse>> {
    try {
      const response = await VendorRepository.getVendorById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendor',
      };
    }
  }

  /**
   * Get all vendors
   * @param categoryId - Optional filter by category ID
   */
  static async getAllVendors(categoryId?: number): Promise<ApiResponse<VendorProfileResponse[]>> {
    try {
      const responses = await VendorRepository.getAllVendors(categoryId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendors',
      };
    }
  }

  /**
   * Update a vendor
   */
  static async updateVendor(id: number, request: VendorProfileRequest): Promise<ApiResponse<VendorProfileResponse>> {
    try {
      const response = await VendorRepository.updateVendor(id, request);
      return {
        success: true,
        data: response,
        message: 'Vendor updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update vendor',
      };
    }
  }

  /**
   * Delete a vendor
   */
  static async deleteVendor(id: number): Promise<ApiResponse<void>> {
    try {
      await VendorRepository.deleteVendor(id);
      return {
        success: true,
        message: 'Vendor deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete vendor',
      };
    }
  }
}
