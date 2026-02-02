const express = require('express');
const router = express.Router();
const { orgController } = require('../controllers');
const { authenticate, authorize, validateMongoId } = require('../middlewares');

/**
 * Organization Routes
 * /api/org
 */

// Public routes
// GET /api/org/structure - Get organization structure (public)
router.get('/structure', orgController.getStructure);

// GET /api/org/members - Get all organization members (public)
router.get('/members', orgController.getMembers);

// Protected routes
// POST /api/org/members - Add member (Admin only)
router.post(
  '/members',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  orgController.addMember
);

// GET /api/org/members/:id - Get member by ID
router.get('/members/:id', validateMongoId, orgController.getMemberById);

// PUT /api/org/members/:id - Update member (Admin only)
router.put(
  '/members/:id',
  authenticate,
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  orgController.updateMember
);

// DELETE /api/org/members/:id - Remove member (Admin only)
router.delete(
  '/members/:id',
  authenticate,
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  orgController.removeMember
);

module.exports = router;
