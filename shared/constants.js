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

// Comment visibility types
const COMMENT_VISIBILITY = {
    PUBLIC: "PUBLIC",
    INTERNAL: "INTERNAL",
};

// Attachment file types
const ATTACHMENT_TYPES = {
    DOCUMENT: "document",
    IMAGE: "image",
    OTHER: "other",
};

// Allowed file MIME types for uploads
const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "text/plain",
    "text/csv",
];

// Max file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max attachments per issuance
const MAX_ATTACHMENTS_PER_ISSUANCE = 10;

// Audit log action types
const AUDIT_ACTIONS = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    STATUS_CHANGE: "STATUS_CHANGE",
    DEPARTMENT_ASSIGN: "DEPARTMENT_ASSIGN",
    ATTACHMENT_ADD: "ATTACHMENT_ADD",
    ATTACHMENT_REMOVE: "ATTACHMENT_REMOVE",
    COMMENT_CREATE: "COMMENT_CREATE",
    COMMENT_UPDATE: "COMMENT_UPDATE",
    COMMENT_DELETE: "COMMENT_DELETE",
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
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    MAX_ATTACHMENTS_PER_ISSUANCE,
    COMMENT_VISIBILITY,
    AUDIT_ACTIONS,
    VALID_STATUS_TRANSITIONS,
    PAGINATION,
};
