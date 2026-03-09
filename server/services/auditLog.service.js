const { AuditLog } = require("../models");

/**
 * Audit Log Service - Business Logic Layer
 * Provides immutable audit trail for all admin actions.
 *
 * IMPORTANT: Audit logs are immutable. No update or delete methods exist.
 * Every admin action on issuances, comments, reports, and attachments
 * must be recorded here for accountability.
 */
class AuditLogService {
    /**
     * Record an audit log entry
     * @param {Object} logData - Audit log data
     * @param {string} logData.performedBy - Admin user ID
     * @param {string} logData.action - Action type (from AUDIT_ACTIONS)
     * @param {string} logData.entityType - Entity type (Issuance, Comment, Report, Attachment)
     * @param {string} logData.entityId - Entity ID
     * @param {string} logData.description - Human-readable description
     * @param {Array} logData.changes - Array of { field, oldValue, newValue }
     * @param {Object} logData.metadata - Optional metadata (IP, user agent, etc.)
     */
    async log(logData) {
        const entry = await AuditLog.create({
            performedBy: logData.performedBy,
            action: logData.action,
            entityType: logData.entityType,
            entityId: logData.entityId,
            description: logData.description,
            changes: logData.changes || [],
            metadata: logData.metadata || {},
            timestamp: new Date(),
        });

        return entry;
    }

    /**
     * Get audit logs with filters and pagination
     * @param {Object} filters - Query filters
     * @param {Object} options - Pagination and sorting options
     */
    async getLogs(filters = {}, options = {}) {
        const query = {};

        if (filters.performedBy) query.performedBy = filters.performedBy;
        if (filters.action) query.action = filters.action;
        if (filters.entityType) query.entityType = filters.entityType;
        if (filters.entityId) query.entityId = filters.entityId;

        // Date range filter
        if (filters.startDate || filters.endDate) {
            query.timestamp = {};
            if (filters.startDate) {
                query.timestamp.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.timestamp.$lte = new Date(filters.endDate);
            }
        }

        const {
            page = 1,
            limit = 20,
            sortBy = "timestamp",
            sortOrder = -1,
        } = options;

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .populate("performedBy", "name email role")
                .lean(),
            AuditLog.countDocuments(query),
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get audit logs for a specific entity
     * @param {string} entityType - Entity type
     * @param {string} entityId - Entity ID
     * @param {Object} options - Pagination options
     */
    async getLogsForEntity(entityType, entityId, options = {}) {
        return this.getLogs({ entityType, entityId }, options);
    }

    /**
     * Get audit logs for a specific admin user
     * @param {string} userId - Admin user ID
     * @param {Object} options - Pagination options
     */
    async getLogsByAdmin(userId, options = {}) {
        return this.getLogs({ performedBy: userId }, options);
    }

    /**
     * Get recent activity summary (for dashboard)
     * @param {number} limit - Number of recent entries
     */
    async getRecentActivity(limit = 10) {
        const logs = await AuditLog.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate("performedBy", "name email")
            .lean();

        return logs;
    }
}

module.exports = new AuditLogService();
