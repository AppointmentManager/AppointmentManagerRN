/**
 * Category Service - Business logic layer for category operations
 * Interacts with CategoryRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  CategoryRepository,
  CategoryRequest,
  CategoryResponse,
} from '../repository/CategoryRepository';

export class CategoryService {
  /**
   * Create a new category
   */
  static async createCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await CategoryRepository.createCategory(request);
      return {
        success: true,
        data: response,
        message: 'Category created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create category',
      };
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await CategoryRepository.getCategoryById(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch category',
      };
    }
  }

  /**
   * Get all categories
   * @param activeOnly - If true, returns only active categories
   */
  static async getAllCategories(activeOnly: boolean = false): Promise<ApiResponse<CategoryResponse[]>> {
    try {
      const responses = await CategoryRepository.getAllCategories(activeOnly);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      };
    }
  }

  /**
   * Update a category
   */
  static async updateCategory(id: number, request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await CategoryRepository.updateCategory(id, request);
      return {
        success: true,
        data: response,
        message: 'Category updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update category',
      };
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
      await CategoryRepository.deleteCategory(id);
      return {
        success: true,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete category',
      };
    }
  }
}
