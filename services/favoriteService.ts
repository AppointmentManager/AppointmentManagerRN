/**
 * Favorite Service - Business logic layer for favorite operations
 * Interacts with FavoriteRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  FavoriteRepository,
  FavoriteRequest,
  FavoriteResponse,
} from '../repository/FavoriteRepository';

export class FavoriteService {
  /**
   * Add a vendor to favorites
   */
  static async addFavorite(request: FavoriteRequest): Promise<ApiResponse<FavoriteResponse>> {
    try {
      const response = await FavoriteRepository.addFavorite(request);
      return {
        success: true,
        data: response,
        message: 'Added to favorites',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add favorite',
      };
    }
  }

  /**
   * Get all favorites for a specific user
   */
  static async getUserFavorites(userId: number): Promise<ApiResponse<FavoriteResponse[]>> {
    try {
      const responses = await FavoriteRepository.getUserFavorites(userId);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
      };
    }
  }

  /**
   * Remove a favorite
   */
  static async removeFavorite(id: number): Promise<ApiResponse<void>> {
    try {
      await FavoriteRepository.removeFavorite(id);
      return {
        success: true,
        message: 'Removed from favorites',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove favorite',
      };
    }
  }
}
