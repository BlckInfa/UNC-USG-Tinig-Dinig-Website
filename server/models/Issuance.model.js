const mongoose = require("mongoose");

/**
 * Attachment Schema - For file uploads
 */
const attachmentSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        fileType: {
            type: String,
            enum: ["document", "image", "other"],
            default: "document",
        },
        mimeType: {
            type: String,
            trim: true,
        },
        size: {
            type: Number,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true },
);

/**
 * Status History Schema - For tracking workflow transitions
 */
const statusHistorySchema = new mongoose.Schema(
    {
        fromStatus: {
            type: String,
            enum: [
                "DRAFT",
                "PENDING",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
                "PUBLISHED",
                null,
            ],
        },
        toStatus: {
            type: String,
            enum: [
                "DRAFT",
                "PENDING",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
                "PUBLISHED",
            ],
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        reason: {
            type: String,
            trim: true,
        },
    },
    { _id: true },
);

/**
 * Version History Schema - For tracking field changes
 */
const versionHistorySchema = new mongoose.Schema(
    {
        field: {
            type: String,
            required: true,
        },
        oldValue: {
            type: mongoose.Schema.Types.Mixed,
        },
        newValue: {
            type: mongoose.Schema.Types.Mixed,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true },
);

/**
 * Issuance Model - The "M" in MVC
 * Database schema for official USG documents (resolutions, memorandums, reports)
 */
const issuanceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["RESOLUTION", "MEMORANDUM", "REPORT", "CIRCULAR"],
            required: [true, "Document type is required"],
        },
        description: {
            type: String,
            trim: true,
        },
        documentUrl: {
            type: String,
            trim: true,
        },
        issuedBy: {
            type: String,
            trim: true,
        },
        issuedDate: {
            type: Date,
        },
        // Extended fields for workflow
        status: {
            type: String,
            enum: [
                "DRAFT",
                "PENDING",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
                "PUBLISHED",
            ],
            default: "DRAFT",
        },
        category: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["HIGH", "MEDIUM", "LOW"],
            default: "MEDIUM",
        },
        department: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        internalNotes: {
            type: String,
            trim: true,
        },
        // File attachments
        attachments: [attachmentSchema],
        // Workflow tracking
        statusHistory: [statusHistorySchema],
        // Version history for field changes
        versionHistory: [versionHistorySchema],
        // Reference to the user who created the issuance
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Reference to the last user who modified the issuance
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Soft delete fields
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        // Timestamps for approved/rejected actions
        approvedAt: {
            type: Date,
            default: null,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        rejectedAt: {
            type: Date,
            default: null,
        },
        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// Default query filter to exclude soft-deleted documents
issuanceSchema.pre(/^find/, function (next) {
    // Allow querying deleted docs when explicitly requested
    if (this.getQuery().isDeleted === undefined) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// Also filter countDocuments
issuanceSchema.pre("countDocuments", function (next) {
    if (this.getQuery().isDeleted === undefined) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// Index for efficient querying
issuanceSchema.index({ status: 1, type: 1, priority: 1 });
issuanceSchema.index({ department: 1 });
issuanceSchema.index({ category: 1 });
issuanceSchema.index({ issuedDate: -1 });

module.exports = mongoose.model("Issuance", issuanceSchema);
