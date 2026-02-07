const mongoose = require("mongoose");

/**
 * ScheduledReport Model
 * Stores configurations for scheduled report generation.
 * Used by cron jobs to determine when and how to generate/email reports.
 */
const scheduledReportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Schedule name is required"],
            trim: true,
        },
        // Reference to the report configuration (Report model)
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            required: true,
        },
        // Cron expression for scheduling (e.g., "0 9 * * 1" for every Monday 9AM)
        cronExpression: {
            type: String,
            required: true,
            trim: true,
        },
        // Human-readable frequency
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "quarterly"],
            required: true,
        },
        // Export format for the scheduled report
        exportFormat: {
            type: String,
            enum: ["pdf", "csv", "excel", "json"],
            default: "pdf",
        },
        // Email recipients for the report
        recipients: [
            {
                email: {
                    type: String,
                    required: true,
                    trim: true,
                    lowercase: true,
                },
                name: {
                    type: String,
                    trim: true,
                },
            },
        ],
        // Whether the schedule is active
        isActive: {
            type: Boolean,
            default: true,
        },
        // Execution tracking
        lastRun: {
            type: Date,
            default: null,
        },
        nextRun: {
            type: Date,
            default: null,
        },
        lastRunStatus: {
            type: String,
            enum: ["success", "failed", "pending", null],
            default: null,
        },
        lastRunError: {
            type: String,
            default: null,
        },
        // Created by admin
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

scheduledReportSchema.index({ isActive: 1, nextRun: 1 });
scheduledReportSchema.index({ createdBy: 1 });

module.exports = mongoose.model("ScheduledReport", scheduledReportSchema);
