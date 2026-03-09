/**
 * Favorite Service - Handles all favorite-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface FavoriteRequest {
  userId: number;
  vendorId: number;
}

export interface FavoriteResponse {
  favoriteId: number;
  userId: number;
  vendorId: number;
  vendorName: string;
  vendorIconUrl?: string;
  createdAt: string;
}

export class FavoriteService {
  /**
   * Add a vendor to favorites
   */
  static async addFavorite(request: FavoriteRequest): Promise<FavoriteResponse> {
    return await apiClient.post<FavoriteResponse>('/favorites', request);
  }

  /**
   * Get all favorites for a specific user
   */
  static async getUserFavorites(userId: number): Promise<FavoriteResponse[]> {
    return await apiClient.get<FavoriteResponse[]>(`/favorites/user/${userId}`);
  }

  /**
   * Remove a favorite
   */
  static async removeFavorite(id: number): Promise<void> {
    return await apiClient.delete<void>(`/favorites/${id}`);
  }
}
