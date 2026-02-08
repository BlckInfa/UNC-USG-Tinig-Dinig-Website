const { Issuance } = require("../models");
const { VALID_STATUS_TRANSITIONS } = require("../../shared/constants");
const auditLogService = require("./auditLog.service");
const { AUDIT_ACTIONS } = require("../../shared/constants");

/**
 * Issuance Service - Business Logic Layer
 * Contains all issuance-related business logic including workflow management
 */
class IssuanceService {
    /**
     * Valid status transitions map
     */
    static VALID_TRANSITIONS = VALID_STATUS_TRANSITIONS;

    /**
     * Get all published issuances with optional filters
     * @param {Object} query - MongoDB query object (defaults to published only)
     * Sorted by issuedDate descending
     */
    async getAllPublished(query = { status: "PUBLISHED" }) {
        const issuances = await Issuance.find(query)
            .sort({ issuedDate: -1 })
            .lean();

        return issuances;
    }

    /**
     * Get all issuances with optional filters
     * @param {Object} filters - Query filters (status, type, priority, department, category)
     * @param {Object} options - Pagination and sorting options
     */
    async getAll(filters = {}, options = {}) {
        const query = {};

        // Apply filters
        if (filters.status) query.status = filters.status;
        if (filters.type) query.type = filters.type;
        if (filters.priority) query.priority = filters.priority;
        if (filters.department) query.department = filters.department;
        if (filters.category) query.category = filters.category;

        const {
            page = 1,
            limit = 10,
            sortBy = "issuedDate",
            sortOrder = -1,
        } = options;

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder };

        const [issuances, total] = await Promise.all([
            Issuance.find(query).sort(sort).skip(skip).limit(limit).lean(),
            Issuance.countDocuments(query),
        ]);

        return {
            issuances,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single issuance by ID
     */
    async getById(id) {
        const issuance = await Issuance.findById(id)
            .populate("createdBy", "name email")
            .populate("lastModifiedBy", "name email")
            .populate("statusHistory.changedBy", "name email")
            .populate("versionHistory.changedBy", "name email")
            .lean();

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        return issuance;
    }

    /**
     * Create a new issuance
     * @param {Object} issuanceData - Issuance data
     * @param {string} userId - ID of the user creating the issuance
     */
    async create(issuanceData, userId = null) {
        const data = {
            ...issuanceData,
            status: issuanceData.status || "DRAFT",
            createdBy: userId,
            lastModifiedBy: userId,
            statusHistory: [
                {
                    fromStatus: null,
                    toStatus: issuanceData.status || "DRAFT",
                    changedBy: userId,
                    changedAt: new Date(),
                    reason: "Initial creation",
                },
            ],
        };

        const issuance = await Issuance.create(data);

        // Audit log: record creation
        if (userId) {
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.CREATE,
                entityType: "Issuance",
                entityId: issuance._id,
                description: `Created issuance: "${issuance.title}"`,
                changes: [
                    {
                        field: "title",
                        oldValue: null,
                        newValue: issuance.title,
                    },
                    {
                        field: "status",
                        oldValue: null,
                        newValue: issuance.status,
                    },
                    { field: "type", oldValue: null, newValue: issuance.type },
                    {
                        field: "priority",
                        oldValue: null,
                        newValue: issuance.priority,
                    },
                ],
            });
        }

        return issuance;
    }

    /**
     * Update an existing issuance with version tracking
     * @param {string} id - Issuance ID
     * @param {Object} updateData - Data to update
     * @param {string} userId - ID of the user making the update
     */
    async update(id, updateData, userId = null) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        // Track field changes for version history
        const versionChanges = [];
        const allowedFields = [
            "title",
            "type",
            "description",
            "documentUrl",
            "issuedBy",
            "issuedDate",
            "category",
            "priority",
            "department",
            "tags",
            "internalNotes",
        ];

        allowedFields.forEach((field) => {
            if (
                updateData[field] !== undefined &&
                JSON.stringify(issuance[field]) !==
                    JSON.stringify(updateData[field])
            ) {
                versionChanges.push({
                    field,
                    oldValue: issuance[field],
                    newValue: updateData[field],
                    changedBy: userId,
                    changedAt: new Date(),
                });
                issuance[field] = updateData[field];
            }
        });

        // Handle attachments separately (append, don't replace)
        if (updateData.attachments && Array.isArray(updateData.attachments)) {
            const newAttachments = updateData.attachments.filter(
                (att) =>
                    !issuance.attachments.some(
                        (existing) => existing.url === att.url,
                    ),
            );
            if (newAttachments.length > 0) {
                issuance.attachments.push(...newAttachments);
                versionChanges.push({
                    field: "attachments",
                    oldValue: `${issuance.attachments.length - newAttachments.length} attachments`,
                    newValue: `${issuance.attachments.length} attachments`,
                    changedBy: userId,
                    changedAt: new Date(),
                });
            }
        }

        // Add version changes to history
        if (versionChanges.length > 0) {
            issuance.versionHistory.push(...versionChanges);
            issuance.lastModifiedBy = userId;

            // Audit log: record update
            if (userId) {
                await auditLogService.log({
                    performedBy: userId,
                    action: AUDIT_ACTIONS.UPDATE,
                    entityType: "Issuance",
                    entityId: issuance._id,
                    description: `Updated issuance: "${issuance.title}" (fields: ${versionChanges.map((c) => c.field).join(", ")})`,
                    changes: versionChanges.map((c) => ({
                        field: c.field,
                        oldValue: c.oldValue,
                        newValue: c.newValue,
                    })),
                });
            }
        }

        await issuance.save();
        return issuance;
    }

    /**
     * Update issuance status with workflow validation
     * @param {string} id - Issuance ID
     * @param {string} newStatus - New status to transition to
     * @param {string} userId - ID of the user making the change
     * @param {string} reason - Reason for status change
     */
    async updateStatus(id, newStatus, userId = null, reason = "") {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        const currentStatus = issuance.status;

        // Validate transition
        if (!this.isValidTransition(currentStatus, newStatus)) {
            const error = new Error(
                `Invalid status transition from ${currentStatus} to ${newStatus}`,
            );
            error.statusCode = 400;
            throw error;
        }

        // Record status change in history
        issuance.statusHistory.push({
            fromStatus: currentStatus,
            toStatus: newStatus,
            changedBy: userId,
            changedAt: new Date(),
            reason,
        });

        // Also track in version history
        issuance.versionHistory.push({
            field: "status",
            oldValue: currentStatus,
            newValue: newStatus,
            changedBy: userId,
            changedAt: new Date(),
        });

        issuance.status = newStatus;
        issuance.lastModifiedBy = userId;

        // Record timestamps for approved/rejected statuses
        if (newStatus === "APPROVED") {
            issuance.approvedAt = new Date();
            issuance.approvedBy = userId;
        } else if (newStatus === "REJECTED") {
            issuance.rejectedAt = new Date();
            issuance.rejectedBy = userId;
        }

        await issuance.save();

        // Audit log: record status change
        if (userId) {
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.STATUS_CHANGE,
                entityType: "Issuance",
                entityId: issuance._id,
                description: `Changed status of "${issuance.title}" from ${currentStatus} to ${newStatus}`,
                changes: [
                    {
                        field: "status",
                        oldValue: currentStatus,
                        newValue: newStatus,
                    },
                ],
            });
        }

        return issuance;
    }

    /**
     * Validate if a status transition is allowed
     * @param {string} fromStatus - Current status
     * @param {string} toStatus - Target status
     * @returns {boolean}
     */
    isValidTransition(fromStatus, toStatus) {
        const validTargets = IssuanceService.VALID_TRANSITIONS[fromStatus];
        if (!validTargets) return false;
        return validTargets.includes(toStatus);
    }

    /**
     * Get valid next statuses for a given current status
     * @param {string} currentStatus - Current status
     * @returns {string[]}
     */
    getValidNextStatuses(currentStatus) {
        return IssuanceService.VALID_TRANSITIONS[currentStatus] || [];
    }

    /**
     * Add attachment to an issuance
     * @param {string} id - Issuance ID
     * @param {Object} attachment - Attachment data
     * @param {string} userId - ID of the user adding the attachment
     */
    async addAttachment(id, attachment, userId = null) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        issuance.attachments.push({
            ...attachment,
            uploadedAt: new Date(),
        });

        issuance.versionHistory.push({
            field: "attachments",
            oldValue: `${issuance.attachments.length - 1} attachments`,
            newValue: `${issuance.attachments.length} attachments`,
            changedBy: userId,
            changedAt: new Date(),
        });

        issuance.lastModifiedBy = userId;
        await issuance.save();
        return issuance;
    }

    /**
     * Remove attachment from an issuance
     * @param {string} id - Issuance ID
     * @param {string} attachmentId - Attachment ID to remove
     * @param {string} userId - ID of the user removing the attachment
     */
    async removeAttachment(id, attachmentId, userId = null) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        const attachmentIndex = issuance.attachments.findIndex(
            (att) => att._id.toString() === attachmentId,
        );

        if (attachmentIndex === -1) {
            const error = new Error("Attachment not found");
            error.statusCode = 404;
            throw error;
        }

        const removedAttachment = issuance.attachments[attachmentIndex];
        issuance.attachments.splice(attachmentIndex, 1);

        issuance.versionHistory.push({
            field: "attachments",
            oldValue: `Removed: ${removedAttachment.filename}`,
            newValue: `${issuance.attachments.length} attachments remaining`,
            changedBy: userId,
            changedAt: new Date(),
        });

        issuance.lastModifiedBy = userId;
        await issuance.save();

        // Audit log: record attachment removal
        if (userId) {
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.ATTACHMENT_REMOVE,
                entityType: "Issuance",
                entityId: issuance._id,
                description: `Removed attachment "${removedAttachment.filename}" from issuance "${issuance.title}"`,
                changes: [
                    {
                        field: "attachments",
                        oldValue: removedAttachment.filename,
                        newValue: null,
                    },
                ],
            });
        }

        return issuance;
    }

    /**
     * Get status history for an issuance
     * @param {string} id - Issuance ID
     */
    async getStatusHistory(id) {
        const issuance = await Issuance.findById(id)
            .select("statusHistory")
            .populate("statusHistory.changedBy", "name email")
            .lean();

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        return issuance.statusHistory;
    }

    /**
     * Get version history for an issuance
     * @param {string} id - Issuance ID
     */
    async getVersionHistory(id) {
        const issuance = await Issuance.findById(id)
            .select("versionHistory")
            .populate("versionHistory.changedBy", "name email")
            .lean();

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        return issuance.versionHistory;
    }

    /**
     * Soft delete an issuance
     * Preserves the record, its history, comments, and files.
     * @param {string} id - Issuance ID
     * @param {string} userId - ID of the admin performing the deletion
     */
    async delete(id, userId = null) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        // Soft delete: mark as deleted, preserve all data
        issuance.isDeleted = true;
        issuance.deletedAt = new Date();
        issuance.deletedBy = userId;
        issuance.lastModifiedBy = userId;

        // Record in version history
        issuance.versionHistory.push({
            field: "isDeleted",
            oldValue: false,
            newValue: true,
            changedBy: userId,
            changedAt: new Date(),
        });

        await issuance.save();

        // Audit log: record deletion
        if (userId) {
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.DELETE,
                entityType: "Issuance",
                entityId: issuance._id,
                description: `Soft-deleted issuance: "${issuance.title}"`,
                changes: [
                    { field: "isDeleted", oldValue: false, newValue: true },
                ],
            });
        }

        return { message: "Issuance soft-deleted successfully" };
    }

    /**
     * Assign or reassign a department to an issuance
     * @param {string} id - Issuance ID
     * @param {string} department - Department name
     * @param {string} userId - ID of the admin making the assignment
     * @param {string} reason - Reason for assignment/reassignment
     */
    async assignDepartment(id, department, userId = null, reason = "") {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        const oldDepartment = issuance.department;

        // Track the change in version history
        issuance.versionHistory.push({
            field: "department",
            oldValue: oldDepartment || null,
            newValue: department,
            changedBy: userId,
            changedAt: new Date(),
        });

        issuance.department = department;
        issuance.lastModifiedBy = userId;

        await issuance.save();

        // Audit log: record department assignment
        if (userId) {
            const action = oldDepartment ? "Reassigned" : "Assigned";
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.DEPARTMENT_ASSIGN,
                entityType: "Issuance",
                entityId: issuance._id,
                description: `${action} issuance "${issuance.title}" ${oldDepartment ? `from "${oldDepartment}" ` : ""}to department "${department}"${reason ? ` — ${reason}` : ""}`,
                changes: [
                    {
                        field: "department",
                        oldValue: oldDepartment || null,
                        newValue: department,
                    },
                ],
            });
        }

        return issuance;
    }
}

module.exports = new IssuanceService();
