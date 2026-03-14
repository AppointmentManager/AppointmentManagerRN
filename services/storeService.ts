/**
 * Store Service - Handles all store-related API calls
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

export interface StoreRequest {
    vendorId: number;
    storeName: string;
    emailId: string;
    phoneNo: string;
    description?: string;
    address: AddressDTO;
}

export interface StoreResponse {
    storeId: number;
    vendorId: number;
    vendorName: string;
    storeName: string;
    emailId: string;
    phoneNo: string;
    description?: string;
    address: AddressDTO;
    averageRating?: number;
    isActive: boolean;
}

export interface StoreAvailabilityRequest {
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    startTime: string; // LocalTime format: HH:mm:ss
    endTime: string; // LocalTime format: HH:mm:ss
    isAvailable: boolean;
}

export interface StoreAvailabilityResponse {
    id: number;
    storeId: number;
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export class StoreService {
    /**
     * Create a new store
     */
    static async createStore(request: StoreRequest): Promise<StoreResponse> {
        return apiClient.post<StoreResponse>('/stores', request);
    }

    /**
     * Get store by ID
     */
    static async getStoreById(id: number): Promise<StoreResponse> {
        return apiClient.get<StoreResponse>(`/stores/${id}`);
    }

    /**
     * Get all stores for a specific vendor
     */
    static async getStoresByVendor(vendorId: number): Promise<StoreResponse[]> {
        return apiClient.get<StoreResponse[]>(`/stores/vendor/${vendorId}`);
    }

    /**
     * Update a store
     */
    static async updateStore(id: number, request: StoreRequest): Promise<StoreResponse> {
        return apiClient.put<StoreResponse>(`/stores/${id}`, request);
    }

    /**
     * Delete a store
     */
    static async deleteStore(id: number): Promise<void> {
        return apiClient.delete<void>(`/stores/${id}`);
    }

    /**
     * Add availability for a store
     */
    static async addAvailability(
        storeId: number,
        request: StoreAvailabilityRequest
    ): Promise<StoreAvailabilityResponse> {
        return apiClient.post<StoreAvailabilityResponse>(
            `/stores/${storeId}/availability`,
            request
        );
    }

    /**
     * Get store availability
     */
    static async getStoreAvailability(storeId: number): Promise<StoreAvailabilityResponse[]> {
        return apiClient.get<StoreAvailabilityResponse[]>(`/stores/${storeId}/availability`);
    }

    /**
     * Update store availability
     */
    static async updateAvailability(
        storeId: number,
        availabilityId: number,
        request: StoreAvailabilityRequest
    ): Promise<StoreAvailabilityResponse> {
        return apiClient.put<StoreAvailabilityResponse>(
            `/stores/${storeId}/availability/${availabilityId}`,
            request
        );
    }
}
