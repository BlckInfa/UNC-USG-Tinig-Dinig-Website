const express = require("express");
const router = express.Router();
const { issuanceController, commentController } = require("../controllers");
const { authenticate } = require("../middlewares/auth.middleware");

/**
 * Issuance Routes
 * /api/issuances
 */

// Public Endpoints

// GET /api/issuances - Get all published issuances
router.get("/", issuanceController.getAll);

// GET /api/issuances/:id - Get a single issuance by ID
router.get("/:id", issuanceController.getById);

// Admin Endpoints (No auth logic required yet)

// GET /api/issuances/admin/all - Get all issuances with filters
router.get("/admin/all", issuanceController.getAllAdmin);

// POST /api/issuances - Create a new issuance
router.post("/", issuanceController.create);

// PUT /api/issuances/:id - Update an existing issuance
router.put("/:id", issuanceController.update);

// DELETE /api/issuances/:id - Delete an issuance
router.delete("/:id", issuanceController.delete);

// Workflow Endpoints

// PATCH /api/issuances/:id/status - Update issuance status
router.patch("/:id/status", issuanceController.updateStatus);

// GET /api/issuances/:id/valid-statuses - Get valid next statuses
router.get("/:id/valid-statuses", issuanceController.getValidStatuses);

// Attachment Endpoints

// POST /api/issuances/:id/attachments - Add attachment
router.post("/:id/attachments", issuanceController.addAttachment);

// DELETE /api/issuances/:id/attachments/:attachmentId - Remove attachment
router.delete(
    "/:id/attachments/:attachmentId",
    issuanceController.removeAttachment,
);

// History Endpoints

// GET /api/issuances/:id/status-history - Get status history
router.get("/:id/status-history", issuanceController.getStatusHistory);

// GET /api/issuances/:id/version-history - Get version history
router.get("/:id/version-history", issuanceController.getVersionHistory);

// Comment Endpoints (nested under issuances)

// GET /api/issuances/:issuanceId/comments - Get comments for issuance
router.get("/:issuanceId/comments", commentController.getByIssuance);

// POST /api/issuances/:issuanceId/comments - Add comment to issuance (requires auth)
router.post("/:issuanceId/comments", authenticate, commentController.create);

// GET /api/issuances/:issuanceId/comments/count - Get comment count
router.get("/:issuanceId/comments/count", commentController.getCount);

module.exports = router;
