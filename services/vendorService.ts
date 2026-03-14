/**
 * Vendor Service - Handles all vendor-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface AddressDTO {
  addressId?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  type: 'HOME' | 'WORK' | 'BUSINESS' | 'OTHER';
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface VendorProfileRequest {
  vendorName: string;
  categoryId: number;
  emailId: string;
  phoneNo: string;
  description?: string;
  gstNumber: string;
}

export interface VendorProfileResponse {
  vendorId: number;
  vendorName: string;
  category: CategoryResponse;
  emailId: string;
  phoneNo: string;
  description?: string;
  address?: AddressDTO;
  gstNumber: string;
  averageRating?: number;
  isActive: boolean;
}



export class VendorService {
  /**
   * Create a new vendor
   */
  static async createVendor(request: VendorProfileRequest): Promise<VendorProfileResponse> {
    return await apiClient.post<VendorProfileResponse>('/vendors', request);
  }

  /**
   * Get vendor by ID
   */
  static async getVendorById(id: number): Promise<VendorProfileResponse> {
    return await apiClient.get<VendorProfileResponse>(`/vendors/${id}`);
  }

  /**
   * Get all vendors
   * @param categoryId - Optional filter by category ID
   */
  static async getAllVendors(categoryId?: number): Promise<VendorProfileResponse[]> {
    const endpoint = categoryId
      ? `/vendors?categoryId=${categoryId}`
      : '/vendors';
    return await apiClient.get<VendorProfileResponse[]>(endpoint);
  }

  /**
   * Update a vendor
   */
  static async updateVendor(id: number, request: VendorProfileRequest): Promise<VendorProfileResponse> {
    return await apiClient.put<VendorProfileResponse>(`/vendors/${id}`, request);
  }

  /**
   * Delete a vendor
   */
  static async deleteVendor(id: number): Promise<void> {
    return await apiClient.delete<void>(`/vendors/${id}`);
  }
}
