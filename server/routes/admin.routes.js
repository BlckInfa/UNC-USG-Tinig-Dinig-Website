const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const {
    issuanceValidation,
    commentValidation,
    departmentValidation,
    auditLogValidation,
    validate,
} = require("../middlewares/validation.middleware");
const {
    issuanceController,
    commentController,
    auditLogController,
    departmentController,
} = require("../controllers");

/**
 * Admin Routes
 * /api/admin
 *
 * ALL routes in this file require:
 * 1. JWT authentication (Bearer token)
 * 2. ADMIN or SUPER_ADMIN role
 *
 * The middleware chain is applied once at the router level.
 */
router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

// ============================================================
// ISSUANCE MANAGEMENT
// ============================================================

/**
 * GET /api/admin/issuances
 * Get all issuances with filters (includes DRAFT, soft-deleted excluded)
 * Query: status, priority, department, category, page, limit, sort, search
 */
router.get("/issuances", issuanceController.getAllAdmin);

/**
 * GET /api/admin/issuances/:id
 * Get a single issuance by ID (full detail including internal data)
 */
router.get("/issuances/:id", issuanceController.getById);

/**
 * POST /api/admin/issuances
 * Create a new issuance
 */
router.post(
    "/issuances",
    issuanceValidation.create,
    validate,
    issuanceController.create,
);

/**
 * PUT /api/admin/issuances/:id
 * Update an existing issuance
 */
router.put(
    "/issuances/:id",
    issuanceValidation.update,
    validate,
    issuanceController.update,
);

/**
 * DELETE /api/admin/issuances/:id
 * Soft-delete an issuance (sets isDeleted flag)
 */
router.delete("/issuances/:id", issuanceController.delete);

// --- Workflow ---

/**
 * PATCH /api/admin/issuances/:id/status
 * Update issuance status (enforces valid transitions)
 * Body: { status, remarks? }
 */
router.patch(
    "/issuances/:id/status",
    issuanceValidation.updateStatus,
    validate,
    issuanceController.updateStatus,
);

/**
 * GET /api/admin/issuances/:id/valid-statuses
 * Get valid next statuses for a given issuance
 */
router.get(
    "/issuances/:id/valid-statuses",
    issuanceController.getValidStatuses,
);

// --- Department Assignment ---

/**
 * PATCH /api/admin/issuances/:id/department
 * Assign or reassign issuance to a department
 * Body: { department, reason? }
 */
router.patch(
    "/issuances/:id/department",
    issuanceValidation.assignDepartment,
    validate,
    issuanceController.assignDepartment,
);

// --- Attachments ---

/**
 * POST /api/admin/issuances/:id/attachments
 * Add attachment metadata (link) to an issuance
 */
router.post("/issuances/:id/attachments", issuanceController.addAttachment);

/**
 * DELETE /api/admin/issuances/:id/attachments/:attachmentId
 * Remove an attachment from an issuance
 */
router.delete(
    "/issuances/:id/attachments/:attachmentId",
    issuanceController.removeAttachment,
);

// --- History ---

/**
 * GET /api/admin/issuances/:id/status-history
 * Get full status change history
 */
router.get(
    "/issuances/:id/status-history",
    issuanceController.getStatusHistory,
);

/**
 * GET /api/admin/issuances/:id/version-history
 * Get full version/edit history
 */
router.get(
    "/issuances/:id/version-history",
    issuanceController.getVersionHistory,
);

// ============================================================
// COMMENTS (under issuances)
// ============================================================

/**
 * GET /api/admin/issuances/:issuanceId/comments
 * Get all comments for an issuance (includes INTERNAL visibility)
 */
router.get("/issuances/:issuanceId/comments", commentController.getByIssuance);

/**
 * POST /api/admin/issuances/:issuanceId/comments
 * Add a comment to an issuance (supports INTERNAL visibility)
 * Body: { content, visibility? }
 */
router.post(
    "/issuances/:issuanceId/comments",
    commentValidation.create,
    validate,
    commentController.create,
);

/**
 * GET /api/admin/issuances/:issuanceId/comments/count
 * Get comment count for an issuance
 */
router.get("/issuances/:issuanceId/comments/count", commentController.getCount);

// --- Standalone Comment Operations ---

/**
 * GET /api/admin/comments/:id
 * Get a single comment by ID
 */
router.get("/comments/:id", commentController.getById);

/**
 * PUT /api/admin/comments/:id
 * Update a comment (admins can edit any comment)
 * Body: { content }
 */
router.put(
    "/comments/:id",
    commentValidation.update,
    validate,
    commentController.update,
);

/**
 * DELETE /api/admin/comments/:id
 * Delete a comment
 */
router.delete("/comments/:id", commentController.delete);

// ============================================================
// AUDIT LOGS (read-only)
// ============================================================

/**
 * GET /api/admin/audit-logs
 * Get audit logs with filtering and pagination
 * Query: entityType, action, performedBy, entityId, startDate, endDate, page, limit
 */
router.get(
    "/audit-logs",
    auditLogValidation.query,
    validate,
    auditLogController.getLogs,
);

/**
 * GET /api/admin/audit-logs/recent
 * Get most recent admin activity
 * Query: limit (default 20)
 */
router.get("/audit-logs/recent", auditLogController.getRecentActivity);

/**
 * GET /api/admin/audit-logs/:entityType/:entityId
 * Get audit logs for a specific entity
 */
router.get(
    "/audit-logs/:entityType/:entityId",
    auditLogController.getLogsForEntity,
);

// ============================================================
// DEPARTMENT MANAGEMENT
// ============================================================

/**
 * GET /api/admin/departments
 * Get all departments
 * Query: includeInactive=true
 */
router.get("/departments", departmentController.getAll);

/**
 * GET /api/admin/departments/:id
 * Get a single department
 */
router.get("/departments/:id", departmentController.getById);

/**
 * POST /api/admin/departments
 * Create a new department
 * Body: { name, code, description?, head? }
 */
router.post(
    "/departments",
    departmentValidation.create,
    validate,
    departmentController.create,
);

/**
 * PUT /api/admin/departments/:id
 * Update a department
 * Body: { name?, code?, description?, head?, isActive? }
 */
router.put(
    "/departments/:id",
    departmentValidation.update,
    validate,
    departmentController.update,
);

/**
 * DELETE /api/admin/departments/:id
 * Deactivate a department (soft delete)
 */
router.delete("/departments/:id", departmentController.deactivate);

module.exports = router;
