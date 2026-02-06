const { Issuance } = require("../models");
const { VALID_STATUS_TRANSITIONS } = require("../../shared/constants");

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
     * Get all published issuances
     * Sorted by issuedDate descending
     */
    async getAllPublished() {
        const issuances = await Issuance.find({ status: "PUBLISHED" })
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

        await issuance.save();
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
     * Delete an issuance (soft delete by changing status or hard delete)
     * @param {string} id - Issuance ID
     */
    async delete(id) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        await issuance.deleteOne();
        return { message: "Issuance deleted successfully" };
    }
}

module.exports = new IssuanceService();
