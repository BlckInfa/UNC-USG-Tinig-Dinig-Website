const { commentService } = require("../services");

/**
 * Comment Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 * Business logic is delegated to commentService
 */
class CommentController {
    /**
     * Get all comments for an issuance
     * GET /api/issuances/:issuanceId/comments
     */
    async getByIssuance(req, res, next) {
        try {
            const { page, limit, sortOrder } = req.query;

            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                sortOrder: sortOrder === "desc" ? -1 : 1,
            };

            const result = await commentService.getByIssuance(
                req.params.issuanceId,
                options,
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single comment by ID
     * GET /api/comments/:id
     */
    async getById(req, res, next) {
        try {
            const comment = await commentService.getById(req.params.id);

            res.json({
                success: true,
                data: { comment },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new comment
     * POST /api/issuances/:issuanceId/comments
     */
    async create(req, res, next) {
        try {
            const authorId = req.user?.id || null;
            const { content, parentCommentId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required",
                });
            }

            if (!authorId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required to post comments",
                });
            }

            const comment = await commentService.create(
                req.params.issuanceId,
                authorId,
                content,
                parentCommentId,
            );

            res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: { comment },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing comment
     * PUT /api/comments/:id
     */
    async update(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required",
                });
            }

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const comment = await commentService.update(
                req.params.id,
                userId,
                content,
            );

            res.json({
                success: true,
                message: "Comment updated successfully",
                data: { comment },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a comment
     * DELETE /api/comments/:id
     */
    async delete(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const isAdmin =
                req.user?.role === "ADMIN" || req.user?.role === "SUPER_ADMIN";

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const result = await commentService.delete(
                req.params.id,
                userId,
                isAdmin,
            );

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get comment count for an issuance
     * GET /api/issuances/:issuanceId/comments/count
     */
    async getCount(req, res, next) {
        try {
            const count = await commentService.getCountByIssuance(
                req.params.issuanceId,
            );

            res.json({
                success: true,
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController();
