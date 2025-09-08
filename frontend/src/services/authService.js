// src/services/auth.service.js
import { apiRequest, uploadFile } from './api.js';

// Authentication API services
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        includeAuth: false,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        includeAuth: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
// Get auth token from storage
getAuthToken: () => {
  return localStorage.getItem('authToken');
},

  // Get current user
  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      console.error('Fetching current user failed:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();

      // Add fields
      Object.keys(profileData).forEach((key) => {
        if (key === 'address' || key === 'preferences') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (
          profileData[key] !== null &&
          profileData[key] !== undefined
        ) {
          formData.append(key, profileData[key]);
        }
      });

      return await uploadFile('/auth/profile', formData);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      return await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return Boolean(localStorage.getItem('authToken'));
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Store user data
  storeUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  },
};
