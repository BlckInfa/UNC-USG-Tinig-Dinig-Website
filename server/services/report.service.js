const { Report, Issuance } = require("../models");
const auditLogService = require("./auditLog.service");
const { AUDIT_ACTIONS, ISSUANCE_STATUS } = require("../../shared/constants");

/**
 * Report Service - Business Logic Layer
 * Contains all report and analytics business logic for admin dashboards.
 * Fully implemented with metrics, filtering, trends, and aggregations.
 */
class ReportService {
    /**
     * Build a Mongo query from standard report filters
     * @private
     */
    _buildFilterQuery(filters = {}) {
        const query = { isDeleted: { $ne: true } };

        if (filters.status) query.status = filters.status;
        if (filters.priority) query.priority = filters.priority;
        if (filters.department) query.department = filters.department;
        if (filters.category) query.category = filters.category;
        if (filters.type) query.type = filters.type;

        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate)
                query.createdAt.$gte = new Date(filters.startDate);
            if (filters.endDate)
                query.createdAt.$lte = new Date(filters.endDate);
        }

        return query;
    }

    /**
     * Get comprehensive dashboard analytics
     * @param {Object} filters - Optional filters (date range, status, etc.)
     */
    async getDashboardAnalytics(filters = {}) {
        const query = this._buildFilterQuery(filters);

        const [
            totalIssuances,
            statusCounts,
            priorityCounts,
            departmentBreakdown,
            avgResolutionTime,
            recentActivity,
            monthlyTrend,
        ] = await Promise.all([
            Issuance.countDocuments(query),
            this._getStatusCounts(query),
            this._getPriorityCounts(query),
            this._getDepartmentBreakdown(query),
            this._getAverageResolutionTime(query),
            auditLogService.getRecentActivity(5),
            this._getMonthlyTrend(filters),
        ]);

        return {
            summary: {
                total: totalIssuances,
                byStatus: statusCounts,
                byPriority: priorityCounts,
                averageResolutionTimeDays: avgResolutionTime,
            },
            charts: {
                statusBreakdown: statusCounts,
                priorityDistribution: priorityCounts,
                departmentBreakdown,
                monthlyTrend,
            },
            recentActivity,
        };
    }

    /**
     * Get summary statistics with full counts
     * @param {Object} filters - Optional filters
     */
    async getSummaryStatistics(filters = {}) {
        const query = this._buildFilterQuery(filters);

        const stats = await Issuance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    draft: {
                        $sum: { $cond: [{ $eq: ["$status", "DRAFT"] }, 1, 0] },
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
                        },
                    },
                    underReview: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "UNDER_REVIEW"] }, 1, 0],
                        },
                    },
                    approved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
                        },
                    },
                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
                        },
                    },
                    published: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PUBLISHED"] }, 1, 0],
                        },
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ["$priority", "HIGH"] }, 1, 0] },
                    },
                    mediumPriority: {
                        $sum: {
                            $cond: [{ $eq: ["$priority", "MEDIUM"] }, 1, 0],
                        },
                    },
                    lowPriority: {
                        $sum: { $cond: [{ $eq: ["$priority", "LOW"] }, 1, 0] },
                    },
                },
            },
        ]);

        return (
            stats[0] || {
                total: 0,
                draft: 0,
                pending: 0,
                underReview: 0,
                approved: 0,
                rejected: 0,
                published: 0,
                highPriority: 0,
                mediumPriority: 0,
                lowPriority: 0,
            }
        );
    }

    /**
     * Get trend analysis data (monthly or quarterly)
     * @param {string} period - "monthly" or "quarterly"
     * @param {Object} filters - Optional filters
     */
    async getTrendAnalysis(period = "monthly", filters = {}) {
        const query = this._buildFilterQuery(filters);

        // Default to last 12 months if no date range specified
        if (!filters.startDate) {
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            query.createdAt = query.createdAt || {};
            query.createdAt.$gte = twelveMonthsAgo;
        }

        let groupBy;
        if (period === "quarterly") {
            groupBy = {
                year: { $year: "$createdAt" },
                quarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
            };
        } else {
            groupBy = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            };
        }

        const trend = await Issuance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: groupBy,
                    total: { $sum: 1 },
                    approved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
                        },
                    },
                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
                        },
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
                        },
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ["$priority", "HIGH"] }, 1, 0] },
                    },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.quarter": 1 } },
        ]);

        return {
            period,
            data: trend.map((item) => ({
                year: item._id.year,
                ...(period === "quarterly" ?
                    { quarter: item._id.quarter }
                :   { month: item._id.month }),
                total: item.total,
                approved: item.approved,
                rejected: item.rejected,
                pending: item.pending,
                highPriority: item.highPriority,
            })),
        };
    }

    /**
     * Search issuances with full-text search
     */
    async searchIssuances(queryStr, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const searchRegex = new RegExp(queryStr, "i");
        const filter = {
            isDeleted: { $ne: true },
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { department: searchRegex },
                { category: searchRegex },
                { issuedBy: searchRegex },
            ],
        };

        const [results, total] = await Promise.all([
            Issuance.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("createdBy", "name email")
                .lean(),
            Issuance.countDocuments(filter),
        ]);

        return {
            results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get saved reports list
     */
    async getSavedReports(userId = null) {
        const filter =
            userId ? { createdBy: userId } : { isSystemReport: true };
        const reports = await Report.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        return reports;
    }

    /**
     * Create a custom report configuration
     */
    async createReport(reportData, userId = null) {
        const report = await Report.create({
            ...reportData,
            createdBy: userId,
            isSystemReport: false,
        });

        if (userId) {
            await auditLogService.log({
                performedBy: userId,
                action: AUDIT_ACTIONS.REPORT_GENERATE,
                entityType: "Report",
                entityId: report._id,
                description: `Created report configuration: "${report.name}"`,
                changes: [
                    { field: "name", oldValue: null, newValue: report.name },
                    { field: "type", oldValue: null, newValue: report.type },
                ],
            });
        }

        return report;
    }

    /**
     * Generate report data based on saved configuration
     */
    async generateReportData(reportId) {
        const report = await Report.findById(reportId);
        if (!report) {
            const error = new Error("Report not found");
            error.statusCode = 404;
            throw error;
        }

        // Build filter from report config
        const filters = {};
        if (report.config?.filters) {
            report.config.filters.forEach((f) => {
                filters[f.field] = f.value;
            });
        }

        let data;
        switch (report.type) {
            case "ISSUANCE_SUMMARY":
                data = await this.getSummaryStatistics(filters);
                break;
            case "STATUS_BREAKDOWN":
                data = await this._getStatusCounts(
                    this._buildFilterQuery(filters),
                );
                break;
            case "DEPARTMENT_ANALYSIS":
                data = await this._getDepartmentBreakdown(
                    this._buildFilterQuery(filters),
                );
                break;
            case "PRIORITY_DISTRIBUTION":
                data = await this._getPriorityCounts(
                    this._buildFilterQuery(filters),
                );
                break;
            case "TREND_ANALYSIS":
                data = await this.getTrendAnalysis("monthly", filters);
                break;
            default:
                data = await this.getSummaryStatistics(filters);
        }

        // Cache generated data
        report.data = data;
        await report.save();

        return {
            reportId: report._id,
            name: report.name,
            type: report.type,
            generatedAt: new Date(),
            data,
        };
    }

    /**
     * Schedule a report
     */
    async scheduleReport(reportId, scheduleConfig) {
        const report = await Report.findByIdAndUpdate(
            reportId,
            {
                schedule: {
                    enabled: true,
                    frequency: scheduleConfig.frequency,
                    nextRun: this._calculateNextRun(scheduleConfig.frequency),
                },
            },
            { new: true },
        );

        if (!report) {
            const error = new Error("Report not found");
            error.statusCode = 404;
            throw error;
        }

        return { report };
    }

    /**
     * Get department breakdown statistics
     * @param {Object} matchQuery - Optional match query
     */
    async getDepartmentBreakdown(filters = {}) {
        const query = this._buildFilterQuery(filters);
        return this._getDepartmentBreakdown(query);
    }

    /**
     * Get issuances grouped by category
     * @param {Object} filters - Optional filters
     */
    async getCategoryBreakdown(filters = {}) {
        const query = this._buildFilterQuery(filters);

        const breakdown = await Issuance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    approved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
                        },
                    },
                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    category: { $ifNull: ["$_id", "Uncategorized"] },
                    count: 1,
                    approved: 1,
                    rejected: 1,
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        return breakdown;
    }

    // ===== Private Helper Methods =====

    async _getStatusCounts(query = {}) {
        const counts = await Issuance.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        return counts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
    }

    async _getPriorityCounts(query = {}) {
        const counts = await Issuance.aggregate([
            { $match: query },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);
        return counts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
    }

    async _getDepartmentBreakdown(query = {}) {
        const breakdown = await Issuance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 },
                    approved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
                        },
                    },
                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
                        },
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
                        },
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ["$priority", "HIGH"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    department: { $ifNull: ["$_id", "Unassigned"] },
                    count: 1,
                    approved: 1,
                    rejected: 1,
                    pending: 1,
                    highPriority: 1,
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        return breakdown;
    }

    /**
     * Calculate average resolution time in days
     * Based on time between creation and approval
     */
    async _getAverageResolutionTime(query = {}) {
        const result = await Issuance.aggregate([
            {
                $match: {
                    ...query,
                    status: { $in: ["APPROVED", "PUBLISHED"] },
                    approvedAt: { $ne: null },
                },
            },
            {
                $project: {
                    resolutionMs: { $subtract: ["$approvedAt", "$createdAt"] },
                },
            },
            {
                $group: {
                    _id: null,
                    avgMs: { $avg: "$resolutionMs" },
                    count: { $sum: 1 },
                },
            },
        ]);

        if (result.length === 0 || !result[0].avgMs) return null;

        // Convert ms to days and round to 1 decimal
        return Math.round((result[0].avgMs / (1000 * 60 * 60 * 24)) * 10) / 10;
    }

    /**
     * Get monthly trend data for charts
     */
    async _getMonthlyTrend(filters = {}) {
        const query = this._buildFilterQuery(filters);

        // Default: last 6 months
        if (!filters.startDate) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            query.createdAt = query.createdAt || {};
            query.createdAt.$gte = sixMonthsAgo;
        }

        const trend = await Issuance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        return trend.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            count: item.count,
        }));
    }

    _calculateNextRun(frequency) {
        const now = new Date();
        switch (frequency) {
            case "daily":
                return new Date(now.setDate(now.getDate() + 1));
            case "weekly":
                return new Date(now.setDate(now.getDate() + 7));
            case "monthly":
                return new Date(now.setMonth(now.getMonth() + 1));
            case "quarterly":
                return new Date(now.setMonth(now.getMonth() + 3));
            default:
                return null;
        }
    }
}

module.exports = new ReportService();
