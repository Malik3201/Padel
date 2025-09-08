import { apiRequest, uploadFile } from './api.js';

// Tournament system API services
export const tournamentService = {
  // Get all tournaments with filters
  getTournaments: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tournaments?${queryString}` : '/tournaments';
    
    return await apiRequest(endpoint);
  },

  // Get tournament by ID
  getTournamentById: async (tournamentId) => {
    return await apiRequest(`/tournaments/${tournamentId}`);
  },

  // Create tournament (Organizer only)
  createTournament: async (tournamentData) => {
    const formData = new FormData();
    
    // Add all tournament data fields
    Object.keys(tournamentData).forEach(key => {
      if (key === 'images' && Array.isArray(tournamentData[key])) {
        // Handle multiple image files
        tournamentData[key].forEach((file, index) => {
          formData.append('images', file);
        });
      } else if (key === 'address' || key === 'prizePool' || key === 'rules' || key === 'requirements') {
        // Stringify complex objects
        formData.append(key, JSON.stringify(tournamentData[key]));
      } else if (tournamentData[key] !== null && tournamentData[key] !== undefined) {
        formData.append(key, tournamentData[key]);
      }
    });

    return await uploadFile('/tournaments', formData);
  },

  // Update tournament (Organizer only)
  updateTournament: async (tournamentId, tournamentData) => {
    const formData = new FormData();
    
    // Add all tournament data fields
    Object.keys(tournamentData).forEach(key => {
      if (key === 'images' && Array.isArray(tournamentData[key])) {
        tournamentData[key].forEach((file, index) => {
          formData.append('images', file);
        });
      } else if (key === 'address' || key === 'prizePool' || key === 'rules' || key === 'requirements') {
        formData.append(key, JSON.stringify(tournamentData[key]));
      } else if (tournamentData[key] !== null && tournamentData[key] !== undefined) {
        formData.append(key, tournamentData[key]);
      }
    });

    return await uploadFile(`/tournaments/${tournamentId}`, formData, true, 'PUT');
  },

  // Delete tournament (Organizer only)
  deleteTournament: async (tournamentId) => {
    return await apiRequest(`/tournaments/${tournamentId}`, {
      method: 'DELETE',
    });
  },

  // Register for tournament
  registerForTournament: async (tournamentId, registrationData) => {
    return await apiRequest(`/tournaments/${tournamentId}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  // Get tournament registrations (Organizer only)
  getTournamentRegistrations: async (tournamentId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tournaments/${tournamentId}/registrations?${queryString}` : `/tournaments/${tournamentId}/registrations`;
    
    return await apiRequest(endpoint);
  },

  // Get organizer's tournaments
  getOrganizerTournaments: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tournaments/organizer/my-tournaments?${queryString}` : '/tournaments/organizer/my-tournaments';
    
    return await apiRequest(endpoint);
  },

  // Get user's tournament registrations
  getUserRegistrations: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tournaments/my-registrations?${queryString}` : '/tournaments/my-registrations';
    
    return await apiRequest(endpoint);
  },
};
