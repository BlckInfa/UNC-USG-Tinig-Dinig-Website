const express = require("express");
const router = express.Router();
const { commentController } = require("../controllers");

/**
 * Comment Routes
 * /api/comments
 *
 * Standalone comment operations (edit, delete)
 * Note: Create and list operations are under /api/issuances/:id/comments
 */

// GET /api/comments/:id - Get a single comment by ID
router.get("/:id", commentController.getById);

// PUT /api/comments/:id - Update a comment
router.put("/:id", commentController.update);

// DELETE /api/comments/:id - Delete a comment
router.delete("/:id", commentController.delete);

module.exports = router;
