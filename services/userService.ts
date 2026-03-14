/**
 * User Service - Business logic layer for user operations
 * Interacts with UserRepository for data access and UserTransformer for DTO mapping.
 * UI layer should only interact with this service.
 */

import { UserProfile, ApiResponse } from '../types/types';
import { UserRepository } from '../repository/UserRepository';
import { UserTransformer } from '../transformers/UserTransformer';

export class UserService {
    /**
     * Get the current user's profile
     * Returns an ApiResponse<UserProfile> compatible with the useUserProfile hook
     * TODO: Replace hardcoded userId with actual authenticated user ID
     */
    static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
        try {
            const response = await UserRepository.getUserById(1);
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
     * Update the current user's profile from the edit screen fields
     * Sends a partial update and returns the updated ApiResponse<UserProfile>
     * TODO: Replace hardcoded userId with actual authenticated user ID
     */
    static async updateUserProfile(fields: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }): Promise<ApiResponse<UserProfile>> {
        try {
            const response = await UserRepository.partialUpdateUser(1, {
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
