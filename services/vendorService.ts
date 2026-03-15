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
import {
  StoreAvailabilityResponse,
  StoreRepository,
  StoreResponse,
} from '../repository/StoreRepository';
import { ServiceRepository } from '../repository/ServiceRepository';
import { VendorTransformer } from '../transformers/VendorTransformer';
import { VendorCardData, VendorDetailsData, VendorServiceItem } from '../types/vendor';

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
   * Get vendor card data for the home screen.
   */
  static async getVendorCatalog(categoryId?: number): Promise<ApiResponse<VendorCardData[]>> {
    try {
      const vendors = await VendorRepository.getAllVendors(categoryId);
      const cards = await Promise.all(
        vendors.map(async vendor => {
          const stores = await this.getStoresForVendor(vendor.vendorId);
          const availability = await this.getAvailabilityForStores(stores);
          return VendorTransformer.toVendorCard(vendor, stores, availability);
        })
      );

      return {
        success: true,
        data: cards,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendors',
      };
    }
  }

  /**
   * Get vendor details data for the details screen.
   */
  static async getVendorDetails(vendorId: number): Promise<ApiResponse<VendorDetailsData>> {
    try {
      const vendor = await VendorRepository.getVendorById(vendorId);
      const stores = await this.getStoresForVendor(vendorId);
      const availability = await this.getAvailabilityForStores(stores);
      const services = await this.getServicesForStores(stores);

      return {
        success: true,
        data: VendorTransformer.toVendorDetails(vendor, stores, availability, services),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendor details',
      };
    }
  }

  /**
   * Build bookable slots for a vendor service from store availability.
   */
  static async getAvailableSlots(
    vendorId: number,
    serviceId: number
  ): Promise<ApiResponse<string[]>> {
    try {
      const stores = await this.getStoresForVendor(vendorId);
      const services = await this.getServicesForStores(stores);
      const selectedService = services.find(service => service.id === serviceId);

      if (!selectedService) {
        return {
          success: false,
          error: 'Service not found for this vendor',
        };
      }

      const availability = await this.getAvailabilityForStore(selectedService.storeId);
      return {
        success: true,
        data: VendorTransformer.buildAvailableSlots(availability, selectedService.durationMinutes),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch available slots',
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

  private static async getStoresForVendor(vendorId: number): Promise<StoreResponse[]> {
    try {
      return await StoreRepository.getStoresByVendor(vendorId);
    } catch {
      return [];
    }
  }

  private static async getServicesForStores(stores: StoreResponse[]): Promise<VendorServiceItem[]> {
    const servicesByStore = await Promise.all(
      stores.map(async store => {
        try {
          const services = await ServiceRepository.getAllServices(store.storeId);
          return services.map(service => VendorTransformer.toVendorServiceItem(service));
        } catch {
          return [];
        }
      })
    );

    return servicesByStore.flat();
  }

  private static async getAvailabilityForStores(
    stores: StoreResponse[]
  ): Promise<StoreAvailabilityResponse[]> {
    const availabilityByStore = await Promise.all(
      stores.map(store => this.getAvailabilityForStore(store.storeId))
    );

    return availabilityByStore.flat();
  }

  private static async getAvailabilityForStore(
    storeId: number
  ): Promise<StoreAvailabilityResponse[]> {
    try {
      return await StoreRepository.getStoreAvailability(storeId);
    } catch {
      return [];
    }
  }
}
