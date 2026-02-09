import api from "../../../services/api";
import { ENDPOINTS } from "../../../config";

/**
 * Issuance Service
 * Handles all issuance-related API calls.
 *
 * PUBLIC endpoints  → ENDPOINTS.ISSUANCES.*       (read-only, published data)
 * ADMIN  endpoints  → ENDPOINTS.ADMIN_ISSUANCES.* (mutations, full access, requires JWT)
 */
export const issuanceService = {
    // ================================================================
    // PUBLIC — read-only, no auth required
    // ================================================================

    /**
     * Get all published issuances (public)
     * GET /api/issuances
     */
    getAll: async (params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BASE, { params });
        return response.data?.data?.issuances || [];
    },

    /**
     * Get a single published issuance (public)
     * GET /api/issuances/:id
     */
    getPublicById: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BY_ID(id));
        return response.data?.data?.issuance || null;
    },

    /**
     * Get comments for an issuance (public)
     * GET /api/issuances/:id/comments
     */
    getComments: async (id, params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.COMMENTS(id), {
            params,
        });
        return response.data?.data || { comments: [], pagination: {} };
    },

    /**
     * Add comment to an issuance (requires auth, public route)
     * POST /api/issuances/:id/comments
     */
    addComment: async (id, content, parentCommentId = null) => {
        const response = await api.post(ENDPOINTS.ISSUANCES.COMMENTS(id), {
            content,
            parentCommentId,
        });
        return response.data?.data?.comment || null;
    },

    /**
     * Get comment count for an issuance (public)
     * GET /api/issuances/:id/comments/count
     */
    getCommentCount: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.COMMENTS_COUNT(id));
        return response.data?.data?.count || 0;
    },

    // ================================================================
    // ADMIN — requires authenticate + authorize(ADMIN, SUPER_ADMIN)
    // All calls go through /api/admin/issuances/*
    // ================================================================

    /**
     * Get all issuances with filters (admin)
     * GET /api/admin/issuances
     */
    getAllAdmin: async (params = {}) => {
        const response = await api.get(ENDPOINTS.ADMIN_ISSUANCES.BASE, {
            params,
        });
        return response.data?.data || { issuances: [], pagination: {} };
    },

    /**
     * Get issuance by ID (admin — any status)
     * GET /api/admin/issuances/:id
     */
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.ADMIN_ISSUANCES.BY_ID(id));
        return response.data?.data?.issuance || null;
    },

    /**
     * Create a new issuance (admin)
     * POST /api/admin/issuances
     */
    create: async (data) => {
        const response = await api.post(ENDPOINTS.ADMIN_ISSUANCES.BASE, data);
        return response.data?.data?.issuance || null;
    },

    /**
     * Update an issuance (admin)
     * PUT /api/admin/issuances/:id
     */
    update: async (id, data) => {
        const response = await api.put(
            ENDPOINTS.ADMIN_ISSUANCES.BY_ID(id),
            data,
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Delete an issuance (admin)
     * DELETE /api/admin/issuances/:id
     */
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.ADMIN_ISSUANCES.BY_ID(id));
        return response.data;
    },

    /**
     * Update issuance status — workflow transition (admin)
     * PATCH /api/admin/issuances/:id/status
     */
    updateStatus: async (id, status, reason = "") => {
        const response = await api.patch(ENDPOINTS.ADMIN_ISSUANCES.STATUS(id), {
            status,
            reason,
        });
        return response.data?.data?.issuance || null;
    },

    /**
     * Get valid next statuses for an issuance (admin)
     * GET /api/admin/issuances/:id/valid-statuses
     */
    getValidStatuses: async (id) => {
        const response = await api.get(
            ENDPOINTS.ADMIN_ISSUANCES.VALID_STATUSES(id),
        );
        return (
            response.data?.data || { currentStatus: "", validNextStatuses: [] }
        );
    },

    /**
     * Add attachment to an issuance — JSON metadata (admin)
     * POST /api/admin/issuances/:id/attachments
     */
    addAttachment: async (id, attachment) => {
        const response = await api.post(
            ENDPOINTS.ADMIN_ISSUANCES.ATTACHMENTS(id),
            attachment,
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Upload a file as an attachment to an issuance — multipart (admin)
     * POST /api/admin/issuances/:id/attachments
     */
    uploadAttachment: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(
            ENDPOINTS.ADMIN_ISSUANCES.ATTACHMENTS(id),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Remove attachment from an issuance (admin)
     * DELETE /api/admin/issuances/:id/attachments/:attachmentId
     */
    removeAttachment: async (id, attachmentId) => {
        const response = await api.delete(
            ENDPOINTS.ADMIN_ISSUANCES.ATTACHMENT_BY_ID(id, attachmentId),
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Get status history for an issuance (admin)
     * GET /api/admin/issuances/:id/status-history
     */
    getStatusHistory: async (id) => {
        const response = await api.get(
            ENDPOINTS.ADMIN_ISSUANCES.STATUS_HISTORY(id),
        );
        return response.data?.data?.history || [];
    },

    /**
     * Get version history for an issuance (admin)
     * GET /api/admin/issuances/:id/version-history
     */
    getVersionHistory: async (id) => {
        const response = await api.get(
            ENDPOINTS.ADMIN_ISSUANCES.VERSION_HISTORY(id),
        );
        return response.data?.data?.history || [];
    },
};

/**
 * Comment Service (standalone operations — requires auth)
 */
export const commentService = {
    /**
     * Update a comment
     * PUT /api/comments/:id
     */
    update: async (id, content) => {
        const response = await api.put(ENDPOINTS.COMMENTS.BY_ID(id), {
            content,
        });
        return response.data?.data?.comment || null;
    },

    /**
     * Delete a comment
     * DELETE /api/comments/:id
     */
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.COMMENTS.BY_ID(id));
        return response.data;
    },
};

export default issuanceService;
