const { Comment, Issuance } = require("../models");

/**
 * Comment Service - Business Logic Layer
 * Contains all comment-related business logic for issuances
 */
class CommentService {
    /**
     * Get all comments for an issuance
     * @param {string} issuanceId - Issuance ID
     * @param {Object} options - Pagination options
     */
    async getByIssuance(issuanceId, options = {}) {
        // Verify issuance exists
        const issuanceExists = await Issuance.exists({ _id: issuanceId });
        if (!issuanceExists) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        const {
            page = 1,
            limit = 20,
            sortOrder = 1, // Chronological order (oldest first)
        } = options;

        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ issuance: issuanceId })
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit)
                .populate("author", "name email profileImage")
                .lean(),
            Comment.countDocuments({ issuance: issuanceId }),
        ]);

        return {
            comments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single comment by ID
     * @param {string} id - Comment ID
     */
    async getById(id) {
        const comment = await Comment.findById(id)
            .populate("author", "name email profileImage")
            .lean();

        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404;
            throw error;
        }

        return comment;
    }

    /**
     * Create a new comment
     * @param {string} issuanceId - Issuance ID
     * @param {string} authorId - Author user ID
     * @param {string} content - Comment content
     * @param {string} parentCommentId - Optional parent comment for replies
     */
    async create(issuanceId, authorId, content, parentCommentId = null) {
        // Verify issuance exists
        const issuanceExists = await Issuance.exists({ _id: issuanceId });
        if (!issuanceExists) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        // If parent comment specified, verify it exists
        if (parentCommentId) {
            const parentExists = await Comment.exists({ _id: parentCommentId });
            if (!parentExists) {
                const error = new Error("Parent comment not found");
                error.statusCode = 404;
                throw error;
            }
        }

        const comment = await Comment.create({
            issuance: issuanceId,
            author: authorId,
            content,
            parentComment: parentCommentId,
        });

        // Populate author before returning
        await comment.populate("author", "name email profileImage");

        return comment;
    }

    /**
     * Update an existing comment
     * @param {string} id - Comment ID
     * @param {string} userId - User ID making the update
     * @param {string} content - New content
     */
    async update(id, userId, content) {
        const comment = await Comment.findById(id);

        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is the author
        if (comment.author.toString() !== userId) {
            const error = new Error("Not authorized to edit this comment");
            error.statusCode = 403;
            throw error;
        }

        comment.content = content;
        comment.isEdited = true;
        comment.editedAt = new Date();

        await comment.save();
        await comment.populate("author", "name email profileImage");

        return comment;
    }

    /**
     * Delete a comment
     * @param {string} id - Comment ID
     * @param {string} userId - User ID making the deletion
     * @param {boolean} isAdmin - Whether user is admin
     */
    async delete(id, userId, isAdmin = false) {
        const comment = await Comment.findById(id);

        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is the author or admin
        if (!isAdmin && comment.author.toString() !== userId) {
            const error = new Error("Not authorized to delete this comment");
            error.statusCode = 403;
            throw error;
        }

        await comment.deleteOne();
        return { message: "Comment deleted successfully" };
    }

    /**
     * Get comment count for an issuance
     * @param {string} issuanceId - Issuance ID
     */
    async getCountByIssuance(issuanceId) {
        const count = await Comment.countDocuments({ issuance: issuanceId });
        return count;
    }
}

module.exports = new CommentService();
