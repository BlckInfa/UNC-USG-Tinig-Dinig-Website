/**
 * Shared constants between client and server
 * Import these to maintain consistency across the application
 */

// Status types for tickets/requests
export const STATUS_TYPES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// User roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  OFFICER: 'OFFICER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

// Ticket categories for TINIG DINIG
export const TICKET_CATEGORIES = {
  COMPLAINT: 'COMPLAINT',
  SUGGESTION: 'SUGGESTION',
  INQUIRY: 'INQUIRY',
  FEEDBACK: 'FEEDBACK',
  REQUEST: 'REQUEST'
};

// Transaction types for finance
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// For CommonJS compatibility
module.exports = {
  STATUS_TYPES,
  USER_ROLES,
  TICKET_CATEGORIES,
  TRANSACTION_TYPES,
  PRIORITY_LEVELS,
  PAGINATION
};
