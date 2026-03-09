/**
 * Issuance Service — Static JSON Implementation
 *
 * Serves issuance data from a local JSON file.
 * All methods return Promises to match the API service contract.
 * Used when DATA_SOURCE === "json" (default).
 */
import issuances from "../../../data/issuances.json";

// ---------- sample comments for offline demo ----------
const sampleComments = {
    "iso-001": [
        {
            _id: "cmt-001",
            content: "Great allocation plan for this academic year!",
            author: { _id: "u-001", name: "Juan Dela Cruz" },
            createdAt: "2025-08-16T09:00:00.000Z",
        },
        {
            _id: "cmt-002",
            content: "Will there be additional funding for sports?",
            author: { _id: "u-002", name: "Maria Santos" },
            createdAt: "2025-08-17T11:30:00.000Z",
        },
    ],
    "iso-003": [
        {
            _id: "cmt-003",
            content: "Congratulations to all recognized organizations!",
            author: { _id: "u-003", name: "Jose Rizal" },
            createdAt: "2025-10-06T08:00:00.000Z",
        },
    ],
};

export const issuanceServiceJSON = {
    // ================================================================
    // PUBLIC — read-only
    // ================================================================

    /**
     * Get all published issuances
     */
    getAll: async (_params = {}) => {
        // Simulate filtering by status = PUBLISHED for public view
        return issuances.filter((i) => i.status === "PUBLISHED");
    },

    /**
     * Get a single published issuance by ID
     */
    getPublicById: async (id) => {
        return issuances.find((i) => i._id === id) || null;
    },

    /**
     * Get comments for an issuance
     */
    getComments: async (id, _params = {}) => {
        const comments = sampleComments[id] || [];
        return {
            comments,
            pagination: { total: comments.length, page: 1, pages: 1 },
        };
    },

    /**
     * Add comment to an issuance (no-op in JSON mode)
     */
    addComment: async (_id, content, _parentCommentId = null) => {
        console.warn("[JSON mode] addComment is a no-op — backend required");
        return {
            _id: `cmt-temp-${Date.now()}`,
            content,
            author: { _id: "u-demo", name: "Demo User" },
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get comment count for an issuance
     */
    getCommentCount: async (id) => {
        const entry = issuances.find((i) => i._id === id);
        return entry?.commentCount || 0;
    },

    // ================================================================
    // ADMIN — stubs (no-op in JSON mode)
    // ================================================================

    getAllAdmin: async (_params = {}) => {
        return {
            issuances,
            pagination: { total: issuances.length, page: 1, pages: 1 },
        };
    },

    getById: async (id) => {
        return issuances.find((i) => i._id === id) || null;
    },

    create: async (data) => {
        console.warn("[JSON mode] create is a no-op — backend required");
        return { _id: `iso-temp-${Date.now()}`, ...data, status: "DRAFT" };
    },

    update: async (id, data) => {
        console.warn("[JSON mode] update is a no-op — backend required");
        const existing = issuances.find((i) => i._id === id);
        return existing ? { ...existing, ...data } : null;
    },

    delete: async (_id) => {
        console.warn("[JSON mode] delete is a no-op — backend required");
        return { success: true };
    },

    updateStatus: async (id, status, _reason = "") => {
        console.warn("[JSON mode] updateStatus is a no-op — backend required");
        const existing = issuances.find((i) => i._id === id);
        return existing ? { ...existing, status } : null;
    },

    getValidStatuses: async (_id) => {
        return { currentStatus: "DRAFT", validNextStatuses: ["PENDING"] };
    },

    addAttachment: async (id, _attachment) => {
        console.warn("[JSON mode] addAttachment is a no-op — backend required");
        return issuances.find((i) => i._id === id) || null;
    },

    uploadAttachment: async (id, _file) => {
        console.warn(
            "[JSON mode] uploadAttachment is a no-op — backend required",
        );
        return issuances.find((i) => i._id === id) || null;
    },

    removeAttachment: async (id, _attachmentId) => {
        console.warn(
            "[JSON mode] removeAttachment is a no-op — backend required",
        );
        return issuances.find((i) => i._id === id) || null;
    },

    getStatusHistory: async (_id) => {
        return [];
    },

    getVersionHistory: async (_id) => {
        return [];
    },
};

/**
 * Comment Service — JSON stub
 */
export const commentServiceJSON = {
    update: async (_id, content) => {
        console.warn(
            "[JSON mode] comment.update is a no-op — backend required",
        );
        return { _id, content, updatedAt: new Date().toISOString() };
    },

    delete: async (_id) => {
        console.warn(
            "[JSON mode] comment.delete is a no-op — backend required",
        );
        return { success: true };
    },
};
