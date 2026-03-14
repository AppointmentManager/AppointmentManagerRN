/**
 * Notification Service - Business logic layer for notification operations
 * Interacts with NotificationRepository for data access.
 * UI layer should only interact with this service.
 */

import { ApiResponse } from '../types/types';
import {
  NotificationRepository,
  NotificationResponse,
} from '../repository/NotificationRepository';

export class NotificationService {
  /**
   * Get all notifications for a specific user
   * @param userId - User ID
   * @param unreadOnly - If true, returns only unread notifications
   */
  static async getUserNotifications(
    userId: number,
    unreadOnly: boolean = false
  ): Promise<ApiResponse<NotificationResponse[]>> {
    try {
      const responses = await NotificationRepository.getUserNotifications(userId, unreadOnly);
      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
      };
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: number): Promise<ApiResponse<void>> {
    try {
      await NotificationRepository.markAsRead(id);
      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark notification as read',
      };
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(id: number): Promise<ApiResponse<void>> {
    try {
      await NotificationRepository.deleteNotification(id);
      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete notification',
      };
    }
  }
}
