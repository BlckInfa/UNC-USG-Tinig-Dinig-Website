/**
 * Shared constants between client and server
 * Import these to maintain consistency across the application
 */

// Status types for tickets/requests
const STATUS_TYPES = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
};

// User roles
const USER_ROLES = {
    STUDENT: "STUDENT",
    OFFICER: "OFFICER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
};

// Ticket categories for TINIG DINIG
const TICKET_CATEGORIES = {
    COMPLAINT: "COMPLAINT",
    SUGGESTION: "SUGGESTION",
    INQUIRY: "INQUIRY",
    FEEDBACK: "FEEDBACK",
    REQUEST: "REQUEST",
};

// Transaction types for finance
const TRANSACTION_TYPES = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
    TRANSFER: "TRANSFER",
};

// Priority levels
const PRIORITY_LEVELS = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT",
};

// Issuance status types (workflow)
const ISSUANCE_STATUS = {
    DRAFT: "DRAFT",
    PENDING: "PENDING",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    PUBLISHED: "PUBLISHED",
};

// Issuance priority levels
const ISSUANCE_PRIORITY = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
};

// Issuance document types
const ISSUANCE_TYPES = {
    RESOLUTION: "RESOLUTION",
    MEMORANDUM: "MEMORANDUM",
    REPORT: "REPORT",
    CIRCULAR: "CIRCULAR",
};

// Attachment file types
const ATTACHMENT_TYPES = {
    DOCUMENT: "document",
    IMAGE: "image",
    OTHER: "other",
};

// Valid status transitions for workflow
const VALID_STATUS_TRANSITIONS = {
    DRAFT: ["PENDING"],
    PENDING: ["UNDER_REVIEW", "DRAFT"],
    UNDER_REVIEW: ["APPROVED", "REJECTED", "PENDING"],
    APPROVED: ["PUBLISHED"],
    REJECTED: ["DRAFT", "PENDING"],
    PUBLISHED: [],
};

// Pagination defaults
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

module.exports = {
    STATUS_TYPES,
    USER_ROLES,
    TICKET_CATEGORIES,
    TRANSACTION_TYPES,
    PRIORITY_LEVELS,
    ISSUANCE_STATUS,
    ISSUANCE_PRIORITY,
    ISSUANCE_TYPES,
    ATTACHMENT_TYPES,
    VALID_STATUS_TRANSITIONS,
    PAGINATION,
};
