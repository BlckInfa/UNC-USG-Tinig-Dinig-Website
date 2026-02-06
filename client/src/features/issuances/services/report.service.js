import api from "../../../services/api";
import { ENDPOINTS } from "../../../config";

/**
 * Report Service (Frontend)
 * Handles all report-related API calls
 *
 * NOTE: This is a SCAFFOLDED feature (Layer 2)
 * Backend returns mock/placeholder data for most endpoints.
 *
 * @stub - Full implementation deferred
 */
export const reportService = {
    /**
     * Get dashboard analytics
     * @stub Returns partial implementation
     */
    getDashboard: async () => {
        const response = await api.get(ENDPOINTS.REPORTS.DASHBOARD);
        return response.data?.data || {};
    },

    /**
     * Get summary statistics
     */
    getSummary: async () => {
        const response = await api.get(ENDPOINTS.REPORTS.SUMMARY);
        return response.data?.data?.statistics || {};
    },

    /**
     * Get trend analysis
     * @stub Not implemented
     * @param {string} period - Time period (daily, weekly, monthly)
     */
    getTrends: async (period = "monthly") => {
        const response = await api.get(ENDPOINTS.REPORTS.TRENDS, {
            params: { period },
        });
        return response.data?.data || {};
    },

    /**
     * Get department breakdown
     */
    getDepartments: async () => {
        const response = await api.get(ENDPOINTS.REPORTS.DEPARTMENTS);
        return response.data?.data?.departments || [];
    },

    /**
     * Search issuances
     * @param {string} query - Search query
     * @param {Object} params - Pagination params
     */
    search: async (query, params = {}) => {
        const response = await api.get(ENDPOINTS.REPORTS.SEARCH, {
            params: { q: query, ...params },
        });
        return response.data?.data || { results: [], pagination: {} };
    },

    /**
     * Get saved reports
     */
    getAll: async () => {
        const response = await api.get(ENDPOINTS.REPORTS.BASE);
        return response.data?.data?.reports || [];
    },

    /**
     * Create a custom report
     * @stub Basic implementation
     * @param {Object} data - Report configuration
     */
    create: async (data) => {
        const response = await api.post(ENDPOINTS.REPORTS.BASE, data);
        return response.data?.data?.report || null;
    },

    /**
     * Generate report data
     * @stub Not fully implemented
     * @param {string} id - Report ID
     */
    generate: async (id) => {
        const response = await api.post(ENDPOINTS.REPORTS.GENERATE(id));
        return response.data?.data || {};
    },

    /**
     * Export report
     * @stub Not implemented
     * @param {string} id - Report ID
     * @param {string} format - Export format (pdf, excel, csv, json)
     */
    export: async (id, format = "json") => {
        const response = await api.get(ENDPOINTS.REPORTS.EXPORT(id), {
            params: { format },
        });
        return response.data?.data || {};
    },

    /**
     * Schedule a report
     * @stub Not implemented
     * @param {string} id - Report ID
     * @param {Object} schedule - Schedule configuration
     */
    schedule: async (id, schedule) => {
        const response = await api.post(
            ENDPOINTS.REPORTS.SCHEDULE(id),
            schedule,
        );
        return response.data?.data || {};
    },
};

export default reportService;
