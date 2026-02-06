const { Issuance } = require("../models");

/**
 * Issuance Service - Business Logic Layer
 * Contains all issuance-related business logic
 */
class IssuanceService {
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
     * Get a single issuance by ID
     */
    async getById(id) {
        const issuance = await Issuance.findById(id).lean();

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        return issuance;
    }

    /**
     * Create a new issuance
     */
    async create(issuanceData) {
        const issuance = await Issuance.create(issuanceData);
        return issuance;
    }

    /**
     * Update an existing issuance
     */
    async update(id, updateData) {
        const issuance = await Issuance.findById(id);

        if (!issuance) {
            const error = new Error("Issuance not found");
            error.statusCode = 404;
            throw error;
        }

        // Update only allowed fields
        const allowedFields = [
            "title",
            "type",
            "description",
            "documentUrl",
            "issuedBy",
            "issuedDate",
            "status",
        ];

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                issuance[field] = updateData[field];
            }
        });

        await issuance.save();
        return issuance;
    }
}

module.exports = new IssuanceService();
