const { financeService } = require('../services');

/**
 * Finance Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 */
class FinanceController {
  /**
   * Create a new transaction
   * POST /api/finance/transactions
   */
  async createTransaction(req, res, next) {
    try {
      const transaction = await financeService.createTransaction(
        req.body,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all transactions
   * GET /api/finance/transactions
   */
  async getTransactions(req, res, next) {
    try {
      const { type, category, status, startDate, endDate, page, limit } = req.query;
      const filters = { type, category, status, startDate, endDate };
      const pagination = { page, limit };

      const result = await financeService.getTransactions(filters, pagination);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction by ID
   * GET /api/finance/transactions/:id
   */
  async getTransactionById(req, res, next) {
    try {
      const transaction = await financeService.getTransactionById(req.params.id);

      res.json({
        success: true,
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update transaction
   * PUT /api/finance/transactions/:id
   */
  async updateTransaction(req, res, next) {
    try {
      const transaction = await financeService.updateTransaction(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        message: 'Transaction updated successfully',
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transaction
   * DELETE /api/finance/transactions/:id
   */
  async deleteTransaction(req, res, next) {
    try {
      await financeService.deleteTransaction(req.params.id);

      res.json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get financial summary
   * GET /api/finance/summary
   */
  async getSummary(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const summary = await financeService.getSummary(startDate, endDate);

      res.json({
        success: true,
        data: { summary },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get report by category
   * GET /api/finance/reports
   */
  async getReports(req, res, next) {
    try {
      const { type = 'EXPENSE' } = req.query;
      const report = await financeService.getByCategory(type);

      res.json({
        success: true,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinanceController();
