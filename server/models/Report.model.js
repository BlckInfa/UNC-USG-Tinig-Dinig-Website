const mongoose = require("mongoose");

/**
 * Report Model - The "M" in MVC
 * Database schema for generated reports
 *
 * NOTE: This is a SCAFFOLDED feature (Layer 2)
 * Full implementation is deferred. Only structure is defined.
 */

/**
 * Report filter configuration schema
 */
const reportFilterSchema = new mongoose.Schema(
    {
        field: {
            type: String,
            required: true,
        },
        operator: {
            type: String,
            enum: [
                "equals",
                "contains",
                "gt",
                "gte",
                "lt",
                "lte",
                "between",
                "in",
            ],
            default: "equals",
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    { _id: false },
);

/**
 * Report configuration schema (for custom report builder - future)
 */
const reportConfigSchema = new mongoose.Schema(
    {
        columns: [
            {
                type: String,
            },
        ],
        filters: [reportFilterSchema],
        groupBy: {
            type: String,
        },
        sortBy: {
            type: String,
        },
        sortOrder: {
            type: String,
            enum: ["asc", "desc"],
            default: "desc",
        },
    },
    { _id: false },
);

/**
 * Report schema
 */
const reportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Report name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: [
                "ISSUANCE_SUMMARY",
                "STATUS_BREAKDOWN",
                "DEPARTMENT_ANALYSIS",
                "PRIORITY_DISTRIBUTION",
                "TREND_ANALYSIS",
                "CUSTOM",
            ],
            required: [true, "Report type is required"],
        },
        // Report configuration for custom reports
        config: reportConfigSchema,
        // Generated report data (cached)
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        // Export format preference
        exportFormat: {
            type: String,
            enum: ["pdf", "excel", "csv", "json"],
            default: "json",
        },
        // Schedule configuration (stub for future)
        schedule: {
            enabled: {
                type: Boolean,
                default: false,
            },
            frequency: {
                type: String,
                enum: ["daily", "weekly", "monthly", "quarterly"],
            },
            lastRun: {
                type: Date,
            },
            nextRun: {
                type: Date,
            },
        },
        // Creator reference
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Whether this is a system-generated or user-created report
        isSystemReport: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Index for efficient querying
reportSchema.index({ type: 1, createdBy: 1 });

module.exports = mongoose.model("Report", reportSchema);
