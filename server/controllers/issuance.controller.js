const { issuanceService } = require("../services");

/**
 * Issuance Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 * Business logic is delegated to issuanceService
 */
class IssuanceController {
    /**
     * Get all published issuances
     * GET /api/issuances
     */
    async getAll(req, res, next) {
        try {
            const issuances = await issuanceService.getAllPublished();

            res.json({
                success: true,
                data: { issuances },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single issuance by ID
     * GET /api/issuances/:id
     */
    async getById(req, res, next) {
        try {
            const issuance = await issuanceService.getById(req.params.id);

            res.json({
                success: true,
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new issuance
     * POST /api/issuances
     */
    async create(req, res, next) {
        try {
            const issuance = await issuanceService.create(req.body);

            res.status(201).json({
                success: true,
                message: "Issuance created successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing issuance
     * PUT /api/issuances/:id
     */
    async update(req, res, next) {
        try {
            const issuance = await issuanceService.update(
                req.params.id,
                req.body,
            );

            res.json({
                success: true,
                message: "Issuance updated successfully",
                data: { issuance },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new IssuanceController();
