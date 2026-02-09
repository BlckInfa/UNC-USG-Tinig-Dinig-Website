const { issuanceService } = require("../services");

/**
 * Issuance Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 * Business logic is delegated to issuanceService
 *
 * Admin-only endpoints require authenticate + authorize('ADMIN', 'SUPER_ADMIN') middleware on routes.
 */
class IssuanceController {
    /**
     * Get all published issuances (public endpoint)
     * GET /api/issuances
     * Supports query filters: type, category, priority, department
     * Status is always forced to PUBLISHED for the public endpoint
     */
    async getAll(req, res, next) {
        try {
            const { type, category, priority, department } = req.query;

            const query = { status: "PUBLISHED" };
            if (type) query.type = type;
            if (category) query.category = category;
            if (priority) query.priority = priority;
            if (department) query.department = department;

            const issuances = await issuanceService.getAllPublished(query);

            res.json({
                success: true,
                data: { issuances },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all issuances with filters (admin endpoint)
     * GET /api/issuances/admin
     */
    async getAllAdmin(req, res, next) {
        try {
            const {
                status,
                type,
                priority,
                department,
                category,
                page,
                limit,
                sortBy,
                sortOrder,
            } = req.query;

            const filters = {};
            if (status) filters.status = status;
            if (type) filters.type = type;
            if (priority) filters.priority = priority;
            if (department) filters.department = department;
            if (category) filters.category = category;

            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || "issuedDate",
                sortOrder: sortOrder === "asc" ? 1 : -1,
            };

            const result = await issuanceService.getAll(filters, options);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single issuance by ID (admin — any status)
     * GET /api/admin/issuances/:id
     */
    async getById(req, res, next) {
        try {
            const issuance = await issuanceService.getById(req.params.id);

            res.json({
                success: true,
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single PUBLISHED issuance by ID (public endpoint)
     * GET /api/issuances/:id
     * Only returns issuances with status PUBLISHED.
     */
    async getByIdPublic(req, res, next) {
        try {
            const issuance = await issuanceService.getPublishedById(
                req.params.id,
            );

            res.json({
                success: true,
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new issuance
     * POST /api/issuances
     */
    async create(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const issuance = await issuanceService.create(req.body, userId);

            res.status(201).json({
                success: true,
                message: "Issuance created successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing issuance
     * PUT /api/issuances/:id
     */
    async update(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const issuance = await issuanceService.update(
                req.params.id,
                req.body,
                userId,
            );

            res.json({
                success: true,
                message: "Issuance updated successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update issuance status (workflow transition)
     * PATCH /api/issuances/:id/status
     */
    async updateStatus(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const { status, reason } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required",
                });
            }

            const issuance = await issuanceService.updateStatus(
                req.params.id,
                status,
                userId,
                reason,
            );

            res.json({
                success: true,
                message: `Status updated to ${status}`,
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get valid next statuses for an issuance
     * GET /api/issuances/:id/valid-statuses
     */
    async getValidStatuses(req, res, next) {
        try {
            const issuance = await issuanceService.getById(req.params.id);
            const validStatuses = issuanceService.getValidNextStatuses(
                issuance.status,
            );

            res.json({
                success: true,
                data: {
                    currentStatus: issuance.status,
                    validNextStatuses: validStatuses,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add attachment to an issuance
     * POST /api/issuances/:id/attachments
     */
    async addAttachment(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const issuance = await issuanceService.addAttachment(
                req.params.id,
                req.body,
                userId,
            );

            res.status(201).json({
                success: true,
                message: "Attachment added successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove attachment from an issuance
     * DELETE /api/issuances/:id/attachments/:attachmentId
     */
    async removeAttachment(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const issuance = await issuanceService.removeAttachment(
                req.params.id,
                req.params.attachmentId,
                userId,
            );

            res.json({
                success: true,
                message: "Attachment removed successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get status history for an issuance
     * GET /api/issuances/:id/status-history
     */
    async getStatusHistory(req, res, next) {
        try {
            const history = await issuanceService.getStatusHistory(
                req.params.id,
            );

            res.json({
                success: true,
                data: { history },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get version history for an issuance
     * GET /api/issuances/:id/version-history
     */
    async getVersionHistory(req, res, next) {
        try {
            const history = await issuanceService.getVersionHistory(
                req.params.id,
            );

            res.json({
                success: true,
                data: { history },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Soft-delete an issuance (admin only)
     * DELETE /api/issuances/:id
     */
    async delete(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const result = await issuanceService.delete(req.params.id, userId);

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Assign or reassign department to an issuance (admin only)
     * PATCH /api/issuances/:id/department
     */
    async assignDepartment(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const { department, reason } = req.body;

            if (!department) {
                return res.status(400).json({
                    success: false,
                    message: "Department is required",
                });
            }

            const issuance = await issuanceService.assignDepartment(
                req.params.id,
                department,
                userId,
                reason,
            );

            res.json({
                success: true,
                message: `Department assigned to "${department}"`,
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new IssuanceController();
