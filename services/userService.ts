/**
 * User Service - Business logic layer for user operations
 * Interacts with UserRepository for data access and UserTransformer for DTO mapping.
 * UI layer should only interact with this service.
 */

import { UserLocation, UserProfile, ApiResponse } from '../types/types';
import { UserRepository } from '../repository/UserRepository';
import { UserTransformer } from '../transformers/UserTransformer';

export class UserService {
    /**
     * Get the current user's profile
     * Returns an ApiResponse<UserProfile> compatible with the useUserProfile hook
     */
    static async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
        try {
            const response = await UserRepository.getUserById(userId);
            return {
                success: true,
                data: UserTransformer.toUserProfile(response),
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch profile',
            };
        }
    }

    /**
     * Get the current user's primary location
     */
    static async getUserLocation(userId: number): Promise<ApiResponse<UserLocation>> {
        try {
            const response = await UserRepository.getUserById(userId);

            return {
                success: true,
                data: UserTransformer.toUserLocation(response),
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch location',
            };
        }
    }

    /**
     * Update the current user's profile from the edit screen fields
     * Sends a partial update and returns the updated ApiResponse<UserProfile>
     */
    static async updateUserProfile(userId: number, fields: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }): Promise<ApiResponse<UserProfile>> {
        try {
            const response = await UserRepository.partialUpdateUser(userId, {
                firstName: fields.firstName,
                lastName: fields.lastName,
                emailId: fields.email,
                phoneNo: fields.phone,
            });
            return {
                success: true,
                data: UserTransformer.toUserProfile(response),
                message: 'Profile updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update profile',
            };
        }
    }

    /**
     * Get all users as UserProfile list
     */
    static async getAllUsers(): Promise<ApiResponse<UserProfile[]>> {
        try {
            const responses = await UserRepository.getAllUsers();
            return {
                success: true,
                data: UserTransformer.toUserProfileList(responses),
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch users',
            };
        }
    }

    /**
     * Delete a user by ID
     */
    static async deleteUser(id: number): Promise<ApiResponse<void>> {
        try {
            await UserRepository.deleteUser(id);
            return {
                success: true,
                message: 'User deleted successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete user',
            };
        }
    }
}
