/**
 * Review Service - Business logic layer for review operations
 * Interacts with ReviewRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  ReviewRepository,
  ReviewRequest,
  ReviewResponse,
} from '../repository/ReviewRepository';

export class ReviewService {
  /**
   * Create a new review
   */
  static async createReview(request: ReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    try {
      const response = await ReviewRepository.createReview(request);
      return {
        success: true,
        data: response,
        message: 'Review submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit review',
      };
    }
  }

  /**
   * Get review by ID
   */
  static async getReviewById(id: number): Promise<ApiResponse<ReviewResponse>> {
    try {
      const response = await ReviewRepository.getReviewById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch review',
      };
    }
  }

  /**
   * Get all reviews for a specific store
   */
  static async getReviewsByStore(storeId: number): Promise<ApiResponse<ReviewResponse[]>> {
    try {
      const responses = await ReviewRepository.getReviewsByStore(storeId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch store reviews',
      };
    }
  }

  /**
   * Get all reviews by a specific user
   */
  static async getReviewsByUser(userId: number): Promise<ApiResponse<ReviewResponse[]>> {
    try {
      const responses = await ReviewRepository.getReviewsByUser(userId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user reviews',
      };
    }
  }

  /**
   * Update a review
   */
  static async updateReview(id: number, request: ReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    try {
      const response = await ReviewRepository.updateReview(id, request);
      return {
        success: true,
        data: response,
        message: 'Review updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update review',
      };
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(id: number): Promise<ApiResponse<void>> {
    try {
      await ReviewRepository.deleteReview(id);
      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete review',
      };
    }
  }
}
