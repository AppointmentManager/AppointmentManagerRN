/**
 * Category Service - Handles all category-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface CategoryRequest {
  categoryName: string;
  description?: string;
  iconUrl?: string;
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export class CategoryService {
  /**
   * Create a new category
   */
  static async createCategory(request: CategoryRequest): Promise<CategoryResponse> {
    return await apiClient.post<CategoryResponse>('/categories', request);
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: number): Promise<CategoryResponse> {
    return await apiClient.get<CategoryResponse>(`/categories/${id}`);
  }

  /**
   * Get all categories
   * @param activeOnly - If true, returns only active categories
   */
  static async getAllCategories(activeOnly: boolean = false): Promise<CategoryResponse[]> {
    const endpoint = activeOnly ? '/categories?activeOnly=true' : '/categories';
    return await apiClient.get<CategoryResponse[]>(endpoint);
  }

  /**
   * Update a category
   */
  static async updateCategory(id: number, request: CategoryRequest): Promise<CategoryResponse> {
    return await apiClient.put<CategoryResponse>(`/categories/${id}`, request);
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: number): Promise<void> {
    return await apiClient.delete<void>(`/categories/${id}`);
  }
}
