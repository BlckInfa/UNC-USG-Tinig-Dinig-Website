const mongoose = require("mongoose");

/**
 * AuditLog Model
 * Immutable log of all admin actions for accountability and traceability.
 * Every admin operation (create, update, delete, status change, etc.) is recorded here.
 *
 * Audit logs are IMMUTABLE - no update or delete operations should be performed on them.
 */
const auditLogSchema = new mongoose.Schema(
    {
        // The admin who performed the action
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        // Action type (from AUDIT_ACTIONS constants)
        action: {
            type: String,
            required: true,
            enum: [
                "CREATE",
                "UPDATE",
                "DELETE",
                "STATUS_CHANGE",
                "DEPARTMENT_ASSIGN",
                "ATTACHMENT_ADD",
                "ATTACHMENT_REMOVE",
                "COMMENT_CREATE",
                "COMMENT_UPDATE",
                "COMMENT_DELETE",
            ],
            index: true,
        },
        // The entity type being acted upon
        entityType: {
            type: String,
            required: true,
            enum: ["Issuance", "Comment", "Attachment"],
            index: true,
        },
        // The ID of the entity being acted upon
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        // Human-readable description of the action
        description: {
            type: String,
            required: true,
            trim: true,
        },
        // Detailed changes: array of { field, oldValue, newValue }
        changes: [
            {
                field: { type: String, required: true },
                oldValue: { type: mongoose.Schema.Types.Mixed },
                newValue: { type: mongoose.Schema.Types.Mixed },
            },
        ],
        // Additional metadata (IP address, user agent, etc.)
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        // Timestamp of the action (separate from createdAt for explicit control)
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // No updatedAt - logs are immutable
    },
);

// Compound indexes for efficient querying
auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
