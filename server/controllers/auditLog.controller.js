const { auditLogService } = require("../services");

/**
 * Audit Log Controller
 * Admin-only read access to immutable audit trail.
 * No create/update/delete endpoints — logs are created internally by services.
 */
class AuditLogController {
    /**
     * Get audit logs with filters and pagination
     * GET /api/admin/audit-logs
     * Query: entityType, action, performedBy, startDate, endDate, page, limit
     */
    async getLogs(req, res, next) {
        try {
            const {
                entityType,
                action,
                performedBy,
                entityId,
                startDate,
                endDate,
                page,
                limit,
                sortOrder,
            } = req.query;

            const filters = {};
            if (entityType) filters.entityType = entityType;
            if (action) filters.action = action;
            if (performedBy) filters.performedBy = performedBy;
            if (entityId) filters.entityId = entityId;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                sortOrder: sortOrder === "asc" ? 1 : -1,
            };

            const result = await auditLogService.getLogs(filters, options);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get audit logs for a specific entity
     * GET /api/admin/audit-logs/entity/:entityType/:entityId
     */
    async getLogsForEntity(req, res, next) {
        try {
            const { entityType, entityId } = req.params;
            const { page, limit } = req.query;

            const result = await auditLogService.getLogsForEntity(
                entityType,
                entityId,
                {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20,
                },
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
     * Get recent activity for dashboard
     * GET /api/admin/audit-logs/recent
     */
    async getRecentActivity(req, res, next) {
        try {
            const { limit } = req.query;
            const logs = await auditLogService.getRecentActivity(
                parseInt(limit) || 10,
            );

            res.json({
                success: true,
                data: { logs },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuditLogController();
