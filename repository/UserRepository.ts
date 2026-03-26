/**
 * User Repository - Handles all user-related API calls
 * This is the data access layer; only service classes should call these methods.
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

export interface UserProfileRequest {
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNo: string;
    birthDate: string; // LocalDate format: YYYY-MM-DD
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    address: AddressDTO;
}

export interface UserProfileResponse {
    userId: number;
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNo: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    address?: AddressDTO | null;
    createdAt: string;
    isActive: boolean;
}

export class UserRepository {
    /**
     * Create a new user
     */
    static async createUser(request: UserProfileRequest): Promise<UserProfileResponse> {
        return await apiClient.post<UserProfileResponse>('/users/create', request);
    }

    /**
     * Get user by ID
     */
    static async getUserById(id: number): Promise<UserProfileResponse> {
        return await apiClient.get<UserProfileResponse>(`/users/${id}`);
    }

    /**
     * Get all users
     */
    static async getAllUsers(): Promise<UserProfileResponse[]> {
        return await apiClient.get<UserProfileResponse[]>('/users');
    }

    /**
     * Update user (full update)
     */
    static async updateUser(id: number, request: UserProfileRequest): Promise<UserProfileResponse> {
        return await apiClient.put<UserProfileResponse>(`/users/update/${id}`, request);
    }

    /**
     * Partial update user
     */
    static async partialUpdateUser(id: number, request: Partial<UserProfileRequest>): Promise<UserProfileResponse> {
        return await apiClient.patch<UserProfileResponse>(`/users/update/${id}`, request);
    }

    /**
     * Delete user
     */
    static async deleteUser(id: number): Promise<void> {
        return await apiClient.delete<void>(`/users/${id}`);
    }
}
