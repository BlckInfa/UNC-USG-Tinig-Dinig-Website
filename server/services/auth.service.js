const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { env } = require('../config');

/**
 * Auth Service - Business Logic Layer
 * Contains all authentication-related business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { studentId: userData.studentId }],
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email already registered');
      }
      throw new Error('Student ID already registered');
    }

    // Create new user
    const user = await User.create(userData);
    return user;
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id);

    return { user, token };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
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
}

module.exports = new AuthService();
