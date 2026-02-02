import api from './api';
import { ENDPOINTS } from '../config';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Get current user data
   */
  getCurrentUser: async () => {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    const response = await api.post(ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};

export default authService;
