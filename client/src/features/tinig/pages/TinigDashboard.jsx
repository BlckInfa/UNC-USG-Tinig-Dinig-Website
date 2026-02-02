import { useState } from 'react';
import { Card, Button, Modal } from '../../../components';
import './TinigDashboard.css';

/**
 * Tinig Dinig Dashboard - Ticket Management
 */
const TinigDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickets = [
    { 
      id: 1, 
      title: 'Request for better WiFi in Library',
      category: 'SUGGESTION',
      status: 'PENDING',
      priority: 'MEDIUM',
      createdAt: '2024-01-15',
    },
    { 
      id: 2, 
      title: 'Concern about cafeteria food quality',
      category: 'COMPLAINT',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: '2024-01-14',
    },
    { 
      id: 3, 
      title: 'Inquiry about scholarship programs',
      category: 'INQUIRY',
      status: 'COMPLETED',
      priority: 'LOW',
      createdAt: '2024-01-12',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      IN_PROGRESS: 'info',
      COMPLETED: 'success',
      REJECTED: 'danger',
    };
    return colors[status] || 'neutral';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      URGENT: 'urgent',
    };
    return colors[priority] || 'neutral';
  };

  return (
    <div className="tinig-dashboard">
      <div className="tinig-header">
        <div>
          <h2>Tinig Dinig</h2>
          <p className="tinig-subtitle">Voice your concerns and suggestions</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + New Ticket
        </Button>
      </div>

      <div className="filters">
        <select className="filter-select">
          <option value="">All Categories</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="SUGGESTION">Suggestion</option>
          <option value="INQUIRY">Inquiry</option>
          <option value="FEEDBACK">Feedback</option>
        </select>
        <select className="filter-select">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="tickets-list">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="ticket-card" hoverable>
            <div className="ticket-header">
              <span className={`category-badge ${ticket.category.toLowerCase()}`}>
                {ticket.category}
              </span>
              <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <h3 className="ticket-title">{ticket.title}</h3>
            <div className="ticket-footer">
              <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className="ticket-date">{ticket.createdAt}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Ticket"
        size="md"
      >
        <form className="ticket-form">
          <div className="form-group">
            <label>Category</label>
            <select>
              <option value="COMPLAINT">Complaint</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="INQUIRY">Inquiry</option>
              <option value="FEEDBACK">Feedback</option>
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="Brief description of your concern" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} placeholder="Provide detailed information..." />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TinigDashboard;
