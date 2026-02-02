const { Transaction } = require('../models');

/**
 * Finance Service - Business Logic Layer
 * Contains all finance-related business logic
 */
class FinanceService {
  /**
   * Create a new transaction
   */
  async createTransaction(transactionData, userId) {
    const transaction = await Transaction.create({
      ...transactionData,
      createdBy: userId,
    });
    return transaction.populate('createdBy', 'name email');
  }

  /**
   * Get all transactions with filters and pagination
   */
  async getTransactions(filters = {}, pagination = {}) {
    const { type, category, status, startDate, endDate } = filters;
    const { page = 1, limit = 10 } = pagination;

    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId) {
    const transaction = await Transaction.findById(transactionId)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  /**
   * Update transaction
   */
  async updateTransaction(transactionId, updateData) {
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy approvedBy', 'name email');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(transactionId) {
    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  /**
   * Get financial summary
   */
  async getSummary(startDate, endDate) {
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const summary = await Transaction.aggregate([
      { $match: { ...matchStage, status: 'APPROVED' } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      income: 0,
      expense: 0,
      balance: 0,
    };

    summary.forEach((item) => {
      if (item._id === 'INCOME') result.income = item.total;
      if (item._id === 'EXPENSE') result.expense = item.total;
    });

    result.balance = result.income - result.expense;

    return result;
  }

  /**
   * Get transactions by category
   */
  async getByCategory(type) {
    return Transaction.aggregate([
      { $match: { type, status: 'APPROVED' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }
}

module.exports = new FinanceService();
