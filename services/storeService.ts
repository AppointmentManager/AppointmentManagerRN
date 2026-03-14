/**
 * Store Service - Business logic layer for store operations
 * Interacts with StoreRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
    StoreRepository,
    StoreRequest,
    StoreResponse,
    StoreAvailabilityRequest,
    StoreAvailabilityResponse,
} from '../repository/StoreRepository';
import { StoreTransformer } from '../transformers/StoreTransformer';
import { StoreCardData } from '../types/store';

export class StoreService {
    /**
     * Create a new store
     */
    static async createStore(request: StoreRequest): Promise<ApiResponse<StoreResponse>> {
        try {
            const response = await StoreRepository.createStore(request);
            return {
                success: true,
                data: response,
                message: 'Store created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create store',
            };
        }
    }

    /**
     * Get store by ID
     */
    static async getStoreById(id: number): Promise<ApiResponse<StoreResponse>> {
        try {
            const response = await StoreRepository.getStoreById(id);
            return {
                success: true,
                data: response,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch store',
            };
        }
    }

    /**
     * Get all stores
     */
    static async getAllStores(): Promise<ApiResponse<StoreResponse[]>> {
        try {
            const responses = await StoreRepository.getAllStores();
            return {
                success: true,
                data: responses,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch stores',
            };
        }
    }

    /**
     * Get store card data with availability for the home screen
     */
    static async getStoreCatalog(): Promise<ApiResponse<StoreCardData[]>> {
        try {
            const stores = await StoreRepository.getAllStores();
            const now = new Date();
            const cards = await Promise.all(
                stores
                    .filter(store => store.isActive)
                    .map(async store => {
                        const availability = await this.getStoreAvailabilityData(store.storeId);
                        return StoreTransformer.toStoreCard(store, availability, now);
                    })
            );
            console.log("store catalog: " + JSON.stringify(cards));
            return {
                success: true,
                data: cards,
            };
        } catch (error) {
            console.log("store catalog error: " + JSON.stringify(error));
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch stores',
            };
        }
    }

    /**
     * Get all stores for a specific vendor
     */
    static async getStoresByVendor(vendorId: number): Promise<ApiResponse<StoreResponse[]>> {
        try {
            const responses = await StoreRepository.getStoresByVendor(vendorId);
            return {
                success: true,
                data: responses,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch stores',
            };
        }
    }

    /**
     * Update a store
     */
    static async updateStore(id: number, request: StoreRequest): Promise<ApiResponse<StoreResponse>> {
        try {
            const response = await StoreRepository.updateStore(id, request);
            return {
                success: true,
                data: response,
                message: 'Store updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update store',
            };
        }
    }

    /**
     * Delete a store
     */
    static async deleteStore(id: number): Promise<ApiResponse<void>> {
        try {
            await StoreRepository.deleteStore(id);
            return {
                success: true,
                message: 'Store deleted successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete store',
            };
        }
    }

    /**
     * Add availability for a store
     */
    static async addAvailability(
        storeId: number,
        request: StoreAvailabilityRequest
    ): Promise<ApiResponse<StoreAvailabilityResponse>> {
        try {
            const response = await StoreRepository.addAvailability(storeId, request);
            return {
                success: true,
                data: response,
                message: 'Availability added successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add availability',
            };
        }
    }

    /**
     * Get store availability
     */
    static async getStoreAvailability(storeId: number): Promise<ApiResponse<StoreAvailabilityResponse[]>> {
        try {
            const responses = await StoreRepository.getStoreAvailability(storeId);
            return {
                success: true,
                data: responses,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch availability',
            };
        }
    }

    /**
     * Update store availability
     */
    static async updateAvailability(
        storeId: number,
        availabilityId: number,
        request: StoreAvailabilityRequest
    ): Promise<ApiResponse<StoreAvailabilityResponse>> {
        try {
            const response = await StoreRepository.updateAvailability(storeId, availabilityId, request);
            return {
                success: true,
                data: response,
                message: 'Availability updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update availability',
            };
        }
    }

    private static async getStoreAvailabilityData(storeId: number): Promise<StoreAvailabilityResponse[]> {
        try {
            return await StoreRepository.getStoreAvailability(storeId);
        } catch {
            return [];
        }
    }
}
