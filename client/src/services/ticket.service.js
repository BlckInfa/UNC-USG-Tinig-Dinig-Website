import api from './api';
import { ENDPOINTS } from '../config';

/**
 * Ticket Service - Tinig Dinig
 * Handles all ticket-related API calls
 */
export const ticketService = {
  /**
   * Get all tickets
   */
  getAll: async (params = {}) => {
    const response = await api.get(ENDPOINTS.TICKETS.BASE, { params });
    return response.data;
  },

  /**
   * Get ticket by ID
   */
  getById: async (id) => {
    const response = await api.get(ENDPOINTS.TICKETS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new ticket
   */
  create: async (ticketData) => {
    const response = await api.post(ENDPOINTS.TICKETS.BASE, ticketData);
    return response.data;
  },

  /**
   * Update ticket
   */
  update: async (id, ticketData) => {
    const response = await api.put(ENDPOINTS.TICKETS.BY_ID(id), ticketData);
    return response.data;
  },

  /**
   * Delete ticket
   */
  delete: async (id) => {
    const response = await api.delete(ENDPOINTS.TICKETS.BY_ID(id));
    return response.data;
  },

  /**
   * Add comment to ticket
   */
  addComment: async (ticketId, commentData) => {
    const response = await api.post(ENDPOINTS.TICKETS.COMMENTS(ticketId), commentData);
    return response.data;
  },
};

export default ticketService;
