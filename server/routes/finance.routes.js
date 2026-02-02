const express = require('express');
const router = express.Router();
const { financeController } = require('../controllers');
const {
  authenticate,
  authorize,
  financeValidation,
  validateMongoId,
} = require('../middlewares');

/**
 * Finance Routes
 * /api/finance
 */

// All routes require authentication
router.use(authenticate);

// GET /api/finance/summary - Get financial summary
router.get('/summary', financeController.getSummary);

// GET /api/finance/reports - Get financial reports
router.get('/reports', financeController.getReports);

// GET /api/finance/transactions - Get all transactions
router.get('/transactions', financeController.getTransactions);

// POST /api/finance/transactions - Create transaction (Officers/Admin)
router.post(
  '/transactions',
  financeValidation.create,
  authorize('OFFICER', 'ADMIN', 'SUPER_ADMIN'),
  financeController.createTransaction
);

// GET /api/finance/transactions/:id - Get transaction by ID
router.get('/transactions/:id', validateMongoId, financeController.getTransactionById);

// PUT /api/finance/transactions/:id - Update transaction (Officers/Admin)
router.put(
  '/transactions/:id',
  validateMongoId,
  authorize('OFFICER', 'ADMIN', 'SUPER_ADMIN'),
  financeController.updateTransaction
);

// DELETE /api/finance/transactions/:id - Delete transaction (Admin only)
router.delete(
  '/transactions/:id',
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  financeController.deleteTransaction
);

module.exports = router;
