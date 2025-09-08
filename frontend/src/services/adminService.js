import { apiRequest } from './api.js';

// Admin panel API services
export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return await apiRequest('/admin/dashboard');
  },

  // Get all users
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
    return await apiRequest(endpoint);
  },

  // Get user by ID
  getUserById: async (userId) => {
    return await apiRequest(`/admin/users/${userId}`);
  },

  // Update user status
  updateUserStatus: async (userId, statusData) => {
    return await apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Toggle court featured status
  toggleCourtFeatured: async (courtId) => {
    return await apiRequest(`/admin/courts/${courtId}/toggle-featured`, {
      method: 'PUT',
    });
  },

  // Approve tournament
  approveTournament: async (tournamentId, action) => {
    return await apiRequest(`/admin/tournaments/${tournamentId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  },

  // Verify booking payment
  verifyBookingPayment: async (bookingId, action) => {
    return await apiRequest(`/admin/bookings/${bookingId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  },

  // Get pending approvals
  getPendingApprovals: async (type = 'all') => {
    return await apiRequest(`/admin/pending-approvals?type=${type}`);
  },

  // Get system analytics
  getAnalytics: async (period = '30d') => {
    return await apiRequest(`/admin/analytics?period=${period}`);
  },

  // Get revenue reports
  getRevenueReports: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/revenue?${queryString}` : '/admin/revenue';
    
    return await apiRequest(endpoint);
  },
};
