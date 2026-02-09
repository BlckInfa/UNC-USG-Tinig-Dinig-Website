/**
 * API Configuration
 * Centralized API base URLs and endpoints
 */

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        ME: "/auth/me",
    },

    // Users
    USERS: {
        BASE: "/users",
        BY_ID: (id) => `/users/${id}`,
    },

    // Tickets (Tinig Dinig)
    TICKETS: {
        BASE: "/tickets",
        BY_ID: (id) => `/tickets/${id}`,
        COMMENTS: (id) => `/tickets/${id}/comments`,
    },

    // Finance
    FINANCE: {
        TRANSACTIONS: "/finance/transactions",
        TRANSACTION_BY_ID: (id) => `/finance/transactions/${id}`,
        SUMMARY: "/finance/summary",
        REPORTS: "/finance/reports",
    },

    // Organization
    ORG: {
        MEMBERS: "/org/members",
        MEMBER_BY_ID: (id) => `/org/members/${id}`,
        STRUCTURE: "/org/structure",
    },

    // Issuances — Public (read-only, published data)
    ISSUANCES: {
        BASE: "/issuances",
        BY_ID: (id) => `/issuances/${id}`,
        COMMENTS: (id) => `/issuances/${id}/comments`,
        COMMENTS_COUNT: (id) => `/issuances/${id}/comments/count`,
    },

    // Issuances — Admin (requires authenticate + authorize)
    ADMIN_ISSUANCES: {
        BASE: "/admin/issuances",
        BY_ID: (id) => `/admin/issuances/${id}`,
        STATUS: (id) => `/admin/issuances/${id}/status`,
        VALID_STATUSES: (id) => `/admin/issuances/${id}/valid-statuses`,
        ATTACHMENTS: (id) => `/admin/issuances/${id}/attachments`,
        ATTACHMENT_BY_ID: (id, attachmentId) =>
            `/admin/issuances/${id}/attachments/${attachmentId}`,
        STATUS_HISTORY: (id) => `/admin/issuances/${id}/status-history`,
        VERSION_HISTORY: (id) => `/admin/issuances/${id}/version-history`,
        COMMENTS: (id) => `/admin/issuances/${id}/comments`,
        COMMENTS_COUNT: (id) => `/admin/issuances/${id}/comments/count`,
    },

    // Comments
    COMMENTS: {
        BASE: "/comments",
        BY_ID: (id) => `/comments/${id}`,
    },
};

export default {
    API_BASE_URL,
    ENDPOINTS,
};
