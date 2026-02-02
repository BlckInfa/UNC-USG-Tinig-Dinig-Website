const { validationResult, body, param, query } = require('express-validator');

/**
 * Validation Result Handler
 * Checks for validation errors and returns them
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

/**
 * Auth Validation Rules
 */
const authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('studentId')
      .trim()
      .notEmpty()
      .withMessage('Student ID is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    validate,
  ],
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validate,
  ],
};

/**
 * Ticket Validation Rules
 */
const ticketValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['COMPLAINT', 'SUGGESTION', 'INQUIRY', 'FEEDBACK', 'REQUEST'])
      .withMessage('Invalid category'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
      .withMessage('Invalid priority'),
    validate,
  ],
  update: [
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status'),
    validate,
  ],
};

/**
 * Finance Validation Rules
 */
const financeValidation = {
  create: [
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('type')
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['INCOME', 'EXPENSE', 'TRANSFER'])
      .withMessage('Invalid transaction type'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    validate,
  ],
};

/**
 * MongoDB ID Validation
 */
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  validate,
  authValidation,
  ticketValidation,
  financeValidation,
  validateMongoId,
};
