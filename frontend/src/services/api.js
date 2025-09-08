// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Create headers with token
const createHeaders = (includeAuth = true, contentType = 'application/json') => {
  const headers = { 'Content-Type': contentType };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Handle API response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.includeAuth !== false, options.contentType),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// File upload helper
const uploadFile = async (endpoint, formData, includeAuth = true, method = 'POST') => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(includeAuth, 'multipart/form-data');
  delete headers['Content-Type']; // browser sets this automatically

  const config = {
    method,
    headers,
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('File Upload Error:', error);
    throw error;
  }
};

export { API_BASE_URL, apiRequest, uploadFile, getAuthToken };
