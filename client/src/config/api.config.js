/**
 * API Configuration
 * Centralized API base URLs and endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  
  // Tickets (Tinig Dinig)
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id) => `/tickets/${id}`,
    COMMENTS: (id) => `/tickets/${id}/comments`,
  },
  
  // Finance
  FINANCE: {
    TRANSACTIONS: '/finance/transactions',
    TRANSACTION_BY_ID: (id) => `/finance/transactions/${id}`,
    SUMMARY: '/finance/summary',
    REPORTS: '/finance/reports',
  },
  
  // Organization
  ORG: {
    MEMBERS: '/org/members',
    MEMBER_BY_ID: (id) => `/org/members/${id}`,
    STRUCTURE: '/org/structure',
  },
};

export default {
  API_BASE_URL,
  ENDPOINTS,
};
