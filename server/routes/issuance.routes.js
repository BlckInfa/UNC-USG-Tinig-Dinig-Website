const express = require("express");
const router = express.Router();
const { issuanceController, commentController } = require("../controllers");
const { authenticate } = require("../middlewares/auth.middleware");
const {
    commentValidation,
    validate,
} = require("../middlewares/validation.middleware");

/**
 * Public Issuance Routes
 * /api/issuances
 *
 * READ-ONLY access to published issuances.
 * All mutations (create, update, delete, status changes, attachments)
 * are handled exclusively via /api/admin/issuances/* which requires
 * ADMIN or SUPER_ADMIN role.
 *
 * The only write operation allowed here is posting comments,
 * which requires JWT authentication.
 */

// ============================================================
// PUBLIC READ-ONLY ENDPOINTS (no auth required)
// ============================================================

// GET /api/issuances - Get all published issuances
router.get("/", issuanceController.getAll);

// GET /api/issuances/:id - Get a single published issuance by ID
router.get("/:id", issuanceController.getByIdPublic);

// ============================================================
// PUBLIC COMMENT ENDPOINTS
// ============================================================

// GET /api/issuances/:issuanceId/comments - Get public comments for issuance
router.get("/:issuanceId/comments", commentController.getByIssuance);

// GET /api/issuances/:issuanceId/comments/count - Get comment count
router.get("/:issuanceId/comments/count", commentController.getCount);

// POST /api/issuances/:issuanceId/comments - Add comment (requires auth)
router.post(
    "/:issuanceId/comments",
    authenticate,
    commentValidation.create,
    validate,
    commentController.create,
);

// ============================================================
// DENY ALL OTHER MUTATIONS ON PUBLIC ROUTES
// Returns 403 for any POST, PUT, PATCH, DELETE attempts that
// are not explicitly defined above.
// ============================================================
router.all("/", denyMutation);
router.all("/:id", denyMutation);
router.all("/:id/*", denyMutation);

/**
 * Middleware to reject non-GET requests with 403.
 * GET requests pass through to Express's default 404 handler.
 */
function denyMutation(req, res, next) {
    if (req.method !== "GET") {
        return res.status(403).json({
            success: false,
            message:
                "Forbidden. Mutations are only allowed through /api/admin/issuances.",
        });
    }
    next();
}

module.exports = router;
