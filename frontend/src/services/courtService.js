// src/services/courtService.js
import { apiRequest, uploadFile } from './api.js';

export const courtService = {
  getCourts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const endpoint = queryParams.toString() ? `/courts?${queryParams}` : '/courts';
    return await apiRequest(endpoint);
  },

  getFeaturedCourts: async () => {
    return await apiRequest('/courts/featured');
  },

  getCourtById: async (courtId) => {
    return await apiRequest(`/courts/${courtId}`);
  },

  checkAvailability: async (courtId, date, time, duration) => {
    const queryParams = new URLSearchParams({ date, time, duration: duration.toString() });
    return await apiRequest(`/courts/${courtId}/availability?${queryParams}`);
  },

  createCourt: async (courtData) => {
    const formData = new FormData();
    Object.keys(courtData).forEach(key => {
      if (key === 'images' && Array.isArray(courtData[key])) {
        courtData[key].forEach(file => formData.append('images', file));
      } else if (['address', 'amenities', 'operatingHours'].includes(key)) {
        formData.append(key, JSON.stringify(courtData[key]));
      } else if (courtData[key] !== null && courtData[key] !== undefined) {
        formData.append(key, courtData[key]);
      }
    });
    return await uploadFile('/courts', formData);
  },

  updateCourt: async (courtId, courtData) => {
    const formData = new FormData();
    Object.keys(courtData).forEach(key => {
      if (key === 'images' && Array.isArray(courtData[key])) {
        courtData[key].forEach(file => formData.append('images', file));
      } else if (['address', 'amenities', 'operatingHours'].includes(key)) {
        formData.append(key, JSON.stringify(courtData[key]));
      } else if (courtData[key] !== null && courtData[key] !== undefined) {
        formData.append(key, courtData[key]);
      }
    });
    return await uploadFile(`/courts/${courtId}`, formData, true, 'PUT');
  },

  deleteCourt: async (courtId) => {
    return await apiRequest(`/courts/${courtId}`, { method: 'DELETE' });
  },

  getOwnerCourts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const endpoint = queryParams.toString() ? `/courts/owner/my-courts?${queryParams}` : '/courts/owner/my-courts';
    return await apiRequest(endpoint);
  },
};
