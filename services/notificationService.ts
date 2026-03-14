/**
 * Notification Service - Handles all notification-related API calls
 */

import { apiClient } from '../utils/apiClient';

export interface NotificationResponse {
  notificationId: number;
  userId: number;
  notificationType: 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLATION' | 'PAYMENT_CONFIRMATION';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  /**
   * Get all notifications for a specific user
   * @param userId - User ID
   * @param unreadOnly - If true, returns only unread notifications
   */
  static async getUserNotifications(
    userId: number,
    unreadOnly: boolean = false
  ): Promise<NotificationResponse[]> {
    const endpoint = unreadOnly
      ? `/notifications/user/${userId}?unreadOnly=true`
      : `/notifications/user/${userId}`;

    return apiClient.get<NotificationResponse[]>(endpoint);
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: number): Promise<void> {
    return apiClient.patch<void>(`/notifications/${id}/read`);
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(id: number): Promise<void> {
    return apiClient.delete<void>(`/notifications/${id}`);
  }
}
