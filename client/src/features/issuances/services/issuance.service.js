import api from "../../../services/api";
import { ENDPOINTS } from "../../../config";

/**
 * Issuance Service
 * Handles all issuance-related API calls
 */
export const issuanceService = {
    /**
     * Get all published issuances (public)
     * @param {Object} params - Query parameters (e.g., type filter)
     */
    getAll: async (params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BASE, { params });
        return response.data?.data?.issuances || [];
    },

    /**
     * Get all issuances with filters (admin)
     * @param {Object} params - Query parameters (status, type, priority, department, category, page, limit)
     */
    getAllAdmin: async (params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.ADMIN, { params });
        return response.data?.data || { issuances: [], pagination: {} };
    },

    /**
     * Get issuance by ID
     * @param {string} id - Issuance ID
     */
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BY_ID(id));
        return response.data?.data?.issuance || null;
    },

    /**
     * Create a new issuance
     * @param {Object} data - Issuance data
     */
    create: async (data) => {
        const response = await api.post(ENDPOINTS.ISSUANCES.BASE, data);
        return response.data?.data?.issuance || null;
    },

    /**
     * Update an issuance
     * @param {string} id - Issuance ID
     * @param {Object} data - Update data
     */
    update: async (id, data) => {
        const response = await api.put(ENDPOINTS.ISSUANCES.BY_ID(id), data);
        return response.data?.data?.issuance || null;
    },

    /**
     * Delete an issuance
     * @param {string} id - Issuance ID
     */
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.ISSUANCES.BY_ID(id));
        return response.data;
    },

    /**
     * Update issuance status (workflow transition)
     * @param {string} id - Issuance ID
     * @param {string} status - New status
     * @param {string} reason - Reason for status change
     */
    updateStatus: async (id, status, reason = "") => {
        const response = await api.patch(ENDPOINTS.ISSUANCES.STATUS(id), {
            status,
            reason,
        });
        return response.data?.data?.issuance || null;
    },

    /**
     * Get valid next statuses for an issuance
     * @param {string} id - Issuance ID
     */
    getValidStatuses: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.VALID_STATUSES(id));
        return (
            response.data?.data || { currentStatus: "", validNextStatuses: [] }
        );
    },

    /**
     * Add attachment to an issuance (JSON metadata)
     * @param {string} id - Issuance ID
     * @param {Object} attachment - Attachment data (filename, url, fileType, mimeType, size)
     */
    addAttachment: async (id, attachment) => {
        const response = await api.post(
            ENDPOINTS.ISSUANCES.ATTACHMENTS(id),
            attachment,
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Upload a file as an attachment to an issuance (multipart)
     * @param {string} id - Issuance ID
     * @param {File} file - Browser File object
     */
    uploadAttachment: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(
            ENDPOINTS.ISSUANCES.ATTACHMENTS(id),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Remove attachment from an issuance
     * @param {string} id - Issuance ID
     * @param {string} attachmentId - Attachment ID
     */
    removeAttachment: async (id, attachmentId) => {
        const response = await api.delete(
            ENDPOINTS.ISSUANCES.ATTACHMENT_BY_ID(id, attachmentId),
        );
        return response.data?.data?.issuance || null;
    },

    /**
     * Get status history for an issuance
     * @param {string} id - Issuance ID
     */
    getStatusHistory: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.STATUS_HISTORY(id));
        return response.data?.data?.history || [];
    },

    /**
     * Get version history for an issuance
     * @param {string} id - Issuance ID
     */
    getVersionHistory: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.VERSION_HISTORY(id));
        return response.data?.data?.history || [];
    },

    /**
     * Get comments for an issuance
     * @param {string} id - Issuance ID
     * @param {Object} params - Pagination params
     */
    getComments: async (id, params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.COMMENTS(id), {
            params,
        });
        return response.data?.data || { comments: [], pagination: {} };
    },

    /**
     * Add comment to an issuance
     * @param {string} id - Issuance ID
     * @param {string} content - Comment content
     * @param {string} parentCommentId - Optional parent comment for replies
     */
    addComment: async (id, content, parentCommentId = null) => {
        const response = await api.post(ENDPOINTS.ISSUANCES.COMMENTS(id), {
            content,
            parentCommentId,
        });
        return response.data?.data?.comment || null;
    },

    /**
     * Get comment count for an issuance
     * @param {string} id - Issuance ID
     */
    getCommentCount: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.COMMENTS_COUNT(id));
        return response.data?.data?.count || 0;
    },
};

/**
 * Comment Service (standalone operations)
 */
export const commentService = {
    /**
     * Update a comment
     * @param {string} id - Comment ID
     * @param {string} content - New content
     */
    update: async (id, content) => {
        const response = await api.put(ENDPOINTS.COMMENTS.BY_ID(id), {
            content,
        });
        return response.data?.data?.comment || null;
    },

    /**
     * Delete a comment
     * @param {string} id - Comment ID
     */
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.COMMENTS.BY_ID(id));
        return response.data;
    },
};

export default issuanceService;
