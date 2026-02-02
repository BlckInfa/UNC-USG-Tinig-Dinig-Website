const { Ticket } = require('../models');

/**
 * Ticket Service - Business Logic Layer
 * Contains all ticket-related business logic for Tinig Dinig
 */
class TicketService {
  /**
   * Create a new ticket
   */
  async createTicket(ticketData, userId) {
    const ticket = await Ticket.create({
      ...ticketData,
      submittedBy: userId,
    });
    return ticket.populate('submittedBy', 'name email');
  }

  /**
   * Get all tickets with filters and pagination
   */
  async getTickets(filters = {}, pagination = {}) {
    const { status, category, priority, submittedBy } = filters;
    const { page = 1, limit = 10 } = pagination;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (submittedBy) query.submittedBy = submittedBy;

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      tickets,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(ticketId) {
    const ticket = await Ticket.findById(ticketId)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  /**
   * Update ticket
   */
  async updateTicket(ticketId, updateData, userId) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Update fields
    Object.assign(ticket, updateData);

    // If status changed to COMPLETED, set resolvedAt
    if (updateData.status === 'COMPLETED' && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();
    return ticket.populate('submittedBy assignedTo', 'name email');
  }

  /**
   * Add comment to ticket
   */
  async addComment(ticketId, content, userId) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.comments.push({
      user: userId,
      content,
    });

    await ticket.save();
    return ticket.populate('comments.user', 'name email');
  }

  /**
   * Delete ticket
   */
  async deleteTicket(ticketId) {
    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  /**
   * Get ticket statistics
   */
  async getStatistics() {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Ticket.countDocuments();

    return { stats, total };
  }
}

module.exports = new TicketService();
