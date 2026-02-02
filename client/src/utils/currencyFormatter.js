/**
 * Currency formatting utilities
 */

/**
 * Format number as Philippine Peso
 * @param {number} amount
 * @param {Object} options
 */
export const formatCurrency = (amount, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };
  
  return new Intl.NumberFormat('en-PH', defaultOptions).format(amount);
};

/**
 * Format as compact currency (e.g., ₱1.2M)
 */
export const formatCompactCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-PH').format(num);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  return parseFloat(currencyString.replace(/[^\d.-]/g, ''));
};
