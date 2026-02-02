const { User } = require('../models');

/**
 * User Service - Business Logic Layer
 * Contains all user-related business logic
 */
class UserService {
  /**
   * Get all users with pagination
   */
  async getUsers(pagination = {}) {
    const { page = 1, limit = 10 } = pagination;

    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId, role) {
    const validRoles = ['STUDENT', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'];

    if (!validRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Activate user
   */
  async activateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();
