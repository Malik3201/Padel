import { apiRequest } from './api.js';

// Notifications API services
export const notificationService = {
  // Get user notifications
  getNotifications: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    
    return await apiRequest(endpoint);
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}`);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await apiRequest('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  // Get unread count
  getUnreadCount: async () => {
    return await apiRequest('/notifications/unread-count');
  },

  // Create notification (Admin/System)
  createNotification: async (notificationData) => {
    return await apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  // Send notification to user
  sendNotificationToUser: async (userId, notificationData) => {
    return await apiRequest(`/notifications/send/${userId}`, {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  // Send notification to all users
  sendNotificationToAll: async (notificationData) => {
    return await apiRequest('/notifications/send-all', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },
};
