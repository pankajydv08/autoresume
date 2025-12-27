/**
 * API Service - Centralized API configuration
 * Handles all API calls to the backend
 * 
 * In development mode (Vite), API calls to /api/* are proxied to backend:8000
 * The Vite proxy is configured in vite.config.js
 */

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // Use environment variable if available (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL;
    console.log('[API] Using VITE_API_BASE_URL:', url);
    return url;
  }
  
  // In development, the Vite proxy handles /api/* requests
  // So we use a relative /api path
  if (import.meta.env.DEV) {
    console.log('[API] Development mode - using /api proxy (configured in vite.config.js)');
    return window.location.origin;  // Use current origin, requests go to /api/*
  }
  
  // Production: use the same origin as the frontend
  const productionUrl = window.location.origin;
  console.log('[API] Production mode - using:', productionUrl);
  return productionUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Log for debugging
console.log('[API] Initialized. Base URL:', API_BASE_URL);

export default API_BASE_URL;

/**
 * Make an API call with standardized error handling
 * @param {string} endpoint - The API endpoint (e.g., '/api/update-resume')
 * @param {object} options - Fetch options
 * @returns {Promise} - The response promise
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(`API call failed to ${endpoint}:`, error);
    throw error;
  }
};
