const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authenticate, authValidation } = require('../middlewares');

/**
 * Auth Routes
 * /api/auth
 */

// POST /api/auth/register - Register new user
router.post('/register', authValidation.register, authController.register);

// POST /api/auth/login - Login user
router.post('/login', authValidation.login, authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// POST /api/auth/logout - Logout user
router.post('/logout', authenticate, authController.logout);

module.exports = router;
