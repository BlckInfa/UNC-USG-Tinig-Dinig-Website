const express = require('express');
const router = express.Router();
const { ticketController } = require('../controllers');
const {
  authenticate,
  authorize,
  ticketValidation,
  validateMongoId,
} = require('../middlewares');

/**
 * Ticket Routes (Tinig Dinig)
 * /api/tickets
 */

// All routes require authentication
router.use(authenticate);

// GET /api/tickets/stats - Get ticket statistics (Officers/Admin)
router.get(
  '/stats',
  authorize('OFFICER', 'ADMIN', 'SUPER_ADMIN'),
  ticketController.getStatistics
);

// GET /api/tickets/my - Get current user's tickets
router.get('/my', ticketController.getMyTickets);

// POST /api/tickets - Create new ticket
router.post('/', ticketValidation.create, ticketController.createTicket);

// GET /api/tickets - Get all tickets (Officers/Admin can see all)
router.get('/', ticketController.getTickets);

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', validateMongoId, ticketController.getTicketById);

// PUT /api/tickets/:id - Update ticket (Officers/Admin)
router.put(
  '/:id',
  validateMongoId,
  ticketValidation.update,
  authorize('OFFICER', 'ADMIN', 'SUPER_ADMIN'),
  ticketController.updateTicket
);

// POST /api/tickets/:id/comments - Add comment
router.post('/:id/comments', validateMongoId, ticketController.addComment);

// DELETE /api/tickets/:id - Delete ticket (Admin only)
router.delete(
  '/:id',
  validateMongoId,
  authorize('ADMIN', 'SUPER_ADMIN'),
  ticketController.deleteTicket
);

module.exports = router;
