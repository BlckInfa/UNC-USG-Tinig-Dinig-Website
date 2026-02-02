/**
 * Validation helper utilities
 */

export const validators = {
  /**
   * Check if value is empty
   */
  isEmpty: (value) => {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0);
  },

  /**
   * Validate email format
   */
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate minimum length
   */
  minLength: (value, min) => {
    return value && value.length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  /**
   * Validate password strength
   */
  isStrongPassword: (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate Philippine mobile number
   */
  isPhilippineMobile: (number) => {
    const mobileRegex = /^(09|\+639)\d{9}$/;
    return mobileRegex.test(number);
  },
};

/**
 * Create form validation
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default validators;
