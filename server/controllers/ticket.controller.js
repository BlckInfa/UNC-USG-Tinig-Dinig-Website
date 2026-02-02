const { ticketService } = require('../services');

/**
 * Ticket Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 */
class TicketController {
  /**
   * Create a new ticket
   * POST /api/tickets
   */
  async createTicket(req, res, next) {
    try {
      const ticket = await ticketService.createTicket(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tickets
   * GET /api/tickets
   */
  async getTickets(req, res, next) {
    try {
      const { status, category, priority, page, limit } = req.query;
      const filters = { status, category, priority };
      const pagination = { page, limit };

      const result = await ticketService.getTickets(filters, pagination);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's tickets
   * GET /api/tickets/my
   */
  async getMyTickets(req, res, next) {
    try {
      const { page, limit } = req.query;
      const filters = { submittedBy: req.user.id };
      const pagination = { page, limit };

      const result = await ticketService.getTickets(filters, pagination);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ticket by ID
   * GET /api/tickets/:id
   */
  async getTicketById(req, res, next) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);

      res.json({
        success: true,
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ticket
   * PUT /api/tickets/:id
   */
  async updateTicket(req, res, next) {
    try {
      const ticket = await ticketService.updateTicket(
        req.params.id,
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Ticket updated successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment to ticket
   * POST /api/tickets/:id/comments
   */
  async addComment(req, res, next) {
    try {
      const { content } = req.body;
      const ticket = await ticketService.addComment(
        req.params.id,
        content,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete ticket
   * DELETE /api/tickets/:id
   */
  async deleteTicket(req, res, next) {
    try {
      await ticketService.deleteTicket(req.params.id);

      res.json({
        success: true,
        message: 'Ticket deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ticket statistics
   * GET /api/tickets/stats
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await ticketService.getStatistics();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TicketController();
