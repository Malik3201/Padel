import { apiRequest, uploadFile } from './api.js';

// Booking system API services
export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Upload payment proof
  uploadPaymentProof: async (bookingId, paymentProofFile) => {
    const formData = new FormData();
    formData.append('paymentProofUrl', paymentProofFile);

    return await uploadFile(`/bookings/${bookingId}/payment-proof`, formData, true, 'PUT');
  },

  // Get user's bookings
  getUserBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/bookings/my-bookings?${queryString}` : '/bookings/my-bookings';
    
    return await apiRequest(endpoint);
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    return await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}`);
  },

  // Get all bookings (Admin/Owner)
  getAllBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    
    return await apiRequest(endpoint);
  },

  // Get court bookings (Owner)
  getCourtBookings: async (courtId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/courts/${courtId}/bookings?${queryString}` : `/courts/${courtId}/bookings`;
    
    return await apiRequest(endpoint);
  },
};
