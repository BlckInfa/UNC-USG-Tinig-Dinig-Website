const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticate, authorize, validateMongoId } = require('../middlewares');

/**
 * User Routes
 * /api/users
 */

// All routes require authentication
router.use(authenticate);

// GET /api/users - Get all users (Admin only)
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), userController.getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateMongoId, userController.getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', validateMongoId, userController.updateUser);

// PATCH /api/users/:id/role - Update user role (Admin only)
router.patch(
  '/:id/role',
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  userController.updateUserRole
);

// PATCH /api/users/:id/deactivate - Deactivate user (Admin only)
router.patch(
  '/:id/deactivate',
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  userController.deactivateUser
);

module.exports = router;
