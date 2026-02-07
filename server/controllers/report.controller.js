const {
    reportService,
    exportService,
    auditLogService,
} = require("../services");
const { AUDIT_ACTIONS } = require("../../shared/constants");

/**
 * Report Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 * Business logic is delegated to reportService and exportService.
 *
 * All report endpoints are admin-only. Auth middleware is enforced on routes.
 */
class ReportController {
    /**
     * Get dashboard analytics with optional filters
     * GET /api/admin/reports/dashboard
     * Filters: startDate, endDate, status, priority, department, category
     */
    async getDashboard(req, res, next) {
        try {
            const filters = this._extractFilters(req.query);
            const analytics =
                await reportService.getDashboardAnalytics(filters);

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get summary statistics with optional filters
     * GET /api/admin/reports/summary
     */
    async getSummary(req, res, next) {
        try {
            const filters = this._extractFilters(req.query);
            const stats = await reportService.getSummaryStatistics(filters);

            res.json({
                success: true,
                data: { statistics: stats },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get trend analysis data
     * GET /api/admin/reports/trends
     * Query: period (monthly|quarterly), startDate, endDate, etc.
     */
    async getTrends(req, res, next) {
        try {
            const { period = "monthly" } = req.query;
            const filters = this._extractFilters(req.query);
            const trends = await reportService.getTrendAnalysis(
                period,
                filters,
            );

            res.json({
                success: true,
                data: trends,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Search issuances
     * GET /api/admin/reports/search
     */
    async search(req, res, next) {
        try {
            const { q, page, limit } = req.query;

            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: "Search query (q) is required",
                });
            }

            const results = await reportService.searchIssuances(q, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
            });

            res.json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all saved report configurations
     * GET /api/admin/reports
     */
    async getAll(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const reports = await reportService.getSavedReports(userId);

            res.json({
                success: true,
                data: { reports },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a custom report configuration
     * POST /api/admin/reports
     */
    async create(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const report = await reportService.createReport(req.body, userId);

            res.status(201).json({
                success: true,
                message: "Report configuration saved",
                data: { report },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate report data from a saved configuration
     * POST /api/admin/reports/:id/generate
     */
    async generate(req, res, next) {
        try {
            const result = await reportService.generateReportData(
                req.params.id,
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
     * Export issuances data to file (CSV, Excel, PDF, JSON)
     * GET /api/admin/reports/export
     * Query: format (csv|excel|pdf|json), plus all standard filters
     */
    async exportData(req, res, next) {
        try {
            const { format = "json" } = req.query;
            const filters = this._extractFilters(req.query);
            const userId = req.user?.id || null;

            // Generate the data
            const data = await exportService.generateReportData(filters);

            // Export to the requested format
            const exported = await exportService.exportToFormat(data, format, {
                title: "Issuances Report",
            });

            // Audit log
            if (userId) {
                await auditLogService.log({
                    performedBy: userId,
                    action: AUDIT_ACTIONS.REPORT_EXPORT,
                    entityType: "Report",
                    entityId: userId, // No specific report entity for ad-hoc exports
                    description: `Exported issuances data as ${format.toUpperCase()} (${data.length} records)`,
                    changes: [
                        { field: "format", oldValue: null, newValue: format },
                        {
                            field: "records",
                            oldValue: null,
                            newValue: data.length,
                        },
                    ],
                });
            }

            // If JSON, return as JSON response
            if (format === "json") {
                return res.json({
                    success: true,
                    data: JSON.parse(exported.content),
                });
            }

            // For file downloads, set appropriate headers
            res.setHeader("Content-Type", exported.contentType);
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${exported.filename}"`,
            );

            if (Buffer.isBuffer(exported.content)) {
                res.send(exported.content);
            } else {
                res.send(exported.content);
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Export a specific saved report
     * GET /api/admin/reports/:id/export
     */
    async exportReport(req, res, next) {
        try {
            const { format = "json" } = req.query;
            const userId = req.user?.id || null;

            // Generate report data first
            const reportData = await reportService.generateReportData(
                req.params.id,
            );

            // For saved reports, export the generated data
            const exported = await exportService.exportToFormat(
                Array.isArray(reportData.data) ?
                    reportData.data
                :   [reportData.data],
                format,
                { title: reportData.name },
            );

            if (userId) {
                await auditLogService.log({
                    performedBy: userId,
                    action: AUDIT_ACTIONS.REPORT_EXPORT,
                    entityType: "Report",
                    entityId: req.params.id,
                    description: `Exported report "${reportData.name}" as ${format.toUpperCase()}`,
                    changes: [],
                });
            }

            if (format === "json") {
                return res.json({
                    success: true,
                    data: reportData,
                });
            }

            res.setHeader("Content-Type", exported.contentType);
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${exported.filename}"`,
            );
            res.send(exported.content);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Schedule a report
     * POST /api/admin/reports/:id/schedule
     */
    async schedule(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const result = await reportService.scheduleReport(
                req.params.id,
                req.body,
            );

            if (userId) {
                await auditLogService.log({
                    performedBy: userId,
                    action: AUDIT_ACTIONS.REPORT_SCHEDULE,
                    entityType: "Report",
                    entityId: req.params.id,
                    description: `Scheduled report "${result.report.name}" (${req.body.frequency})`,
                    changes: [
                        {
                            field: "schedule.frequency",
                            oldValue: null,
                            newValue: req.body.frequency,
                        },
                    ],
                });
            }

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get department breakdown
     * GET /api/admin/reports/departments
     */
    async getDepartments(req, res, next) {
        try {
            const filters = this._extractFilters(req.query);
            const breakdown =
                await reportService.getDepartmentBreakdown(filters);

            res.json({
                success: true,
                data: { departments: breakdown },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get category breakdown
     * GET /api/admin/reports/categories
     */
    async getCategories(req, res, next) {
        try {
            const filters = this._extractFilters(req.query);
            const breakdown = await reportService.getCategoryBreakdown(filters);

            res.json({
                success: true,
                data: { categories: breakdown },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Extract standard filters from query params
     * @private
     */
    _extractFilters(query) {
        const filters = {};
        if (query.startDate) filters.startDate = query.startDate;
        if (query.endDate) filters.endDate = query.endDate;
        if (query.status) filters.status = query.status;
        if (query.priority) filters.priority = query.priority;
        if (query.department) filters.department = query.department;
        if (query.category) filters.category = query.category;
        if (query.type) filters.type = query.type;
        return filters;
    }
}

module.exports = new ReportController();
