import api from './api';
import { ENDPOINTS } from '../config';

/**
 * Finance Service
 * Handles all finance-related API calls
 */
export const financeService = {
  /**
   * Get all transactions
   */
  getTransactions: async (params = {}) => {
    const response = await api.get(ENDPOINTS.FINANCE.TRANSACTIONS, { params });
    return response.data;
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (id) => {
    const response = await api.get(ENDPOINTS.FINANCE.TRANSACTION_BY_ID(id));
    return response.data;
  },

  /**
   * Create transaction
   */
  createTransaction: async (transactionData) => {
    const response = await api.post(ENDPOINTS.FINANCE.TRANSACTIONS, transactionData);
    return response.data;
  },

  /**
   * Update transaction
   */
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(ENDPOINTS.FINANCE.TRANSACTION_BY_ID(id), transactionData);
    return response.data;
  },

  /**
   * Delete transaction
   */
  deleteTransaction: async (id) => {
    const response = await api.delete(ENDPOINTS.FINANCE.TRANSACTION_BY_ID(id));
    return response.data;
  },

  /**
   * Get financial summary
   */
  getSummary: async (params = {}) => {
    const response = await api.get(ENDPOINTS.FINANCE.SUMMARY, { params });
    return response.data;
  },

  /**
   * Get financial reports
   */
  getReports: async (params = {}) => {
    const response = await api.get(ENDPOINTS.FINANCE.REPORTS, { params });
    return response.data;
  },
};

export default financeService;
