/**
 * Review Repository - Handles all review-related API calls
 * This is the data access layer; only service classes should call these methods.
 */

import { apiClient } from '../utils/apiClient';

export interface ReviewRequest {
    userId: number;
    storeId: number;
    appointmentId: number;
    rating: number; // 1-5
    comment?: string;
}

export interface ReviewResponse {
    reviewId: number;
    userId: number;
    userName: string;
    storeId: number;
    storeName: string;
    appointmentId: number;
    rating: number;
    comment?: string;
    createdAt: string;
}

export class ReviewRepository {
    /**
     * Create a new review
     */
    static async createReview(request: ReviewRequest): Promise<ReviewResponse> {
        return apiClient.post<ReviewResponse>('/reviews', request);
    }

    /**
     * Get review by ID
     */
    static async getReviewById(id: number): Promise<ReviewResponse> {
        return apiClient.get<ReviewResponse>(`/reviews/${id}`);
    }

    /**
     * Get all reviews for a specific store
     */
    static async getReviewsByStore(storeId: number): Promise<ReviewResponse[]> {
        return apiClient.get<ReviewResponse[]>(`/reviews/store/${storeId}`);
    }

    /**
     * Get all reviews by a specific user
     */
    static async getReviewsByUser(userId: number): Promise<ReviewResponse[]> {
        return apiClient.get<ReviewResponse[]>(`/reviews/user/${userId}`);
    }

    /**
     * Update a review
     */
    static async updateReview(id: number, request: ReviewRequest): Promise<ReviewResponse> {
        return apiClient.put<ReviewResponse>(`/reviews/${id}`, request);
    }

    /**
     * Delete a review
     */
    static async deleteReview(id: number): Promise<void> {
        return apiClient.delete<void>(`/reviews/${id}`);
    }
}
