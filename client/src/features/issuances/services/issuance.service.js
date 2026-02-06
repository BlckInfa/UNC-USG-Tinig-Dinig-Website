import api from "../../../services/api";
import { ENDPOINTS } from "../../../config";

/**
 * Issuance Service
 * Handles all issuance-related API calls
 */
export const issuanceService = {
    /**
     * Get all issuances
     * @param {Object} params - Query parameters (e.g., type filter)
     */
    getAll: async (params = {}) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BASE, { params });
        return response.data;
    },

    /**
     * Get issuance by ID
     * @param {string} id - Issuance ID
     */
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.ISSUANCES.BY_ID(id));
        return response.data;
    },
};

export default issuanceService;
