const { departmentService } = require("../services");

/**
 * Department Controller
 * Admin-only CRUD operations for departments.
 * Departments are used for issuance routing and assignment validation.
 */
class DepartmentController {
    /**
     * Get all departments
     * GET /api/admin/departments
     * Query: includeInactive=true to include deactivated departments
     */
    async getAll(req, res, next) {
        try {
            const includeInactive = req.query.includeInactive === "true";
            const departments = await departmentService.getAll(includeInactive);

            res.json({
                success: true,
                data: { departments },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single department by ID
     * GET /api/admin/departments/:id
     */
    async getById(req, res, next) {
        try {
            const department = await departmentService.getById(req.params.id);

            res.json({
                success: true,
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new department
     * POST /api/admin/departments
     */
    async create(req, res, next) {
        try {
            const department = await departmentService.create(req.body);

            res.status(201).json({
                success: true,
                message: "Department created successfully",
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a department
     * PUT /api/admin/departments/:id
     */
    async update(req, res, next) {
        try {
            const department = await departmentService.update(
                req.params.id,
                req.body,
            );

            res.json({
                success: true,
                message: "Department updated successfully",
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deactivate a department (soft delete)
     * DELETE /api/admin/departments/:id
     */
    async deactivate(req, res, next) {
        try {
            const department = await departmentService.deactivate(
                req.params.id,
            );

            res.json({
                success: true,
                message: "Department deactivated successfully",
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DepartmentController();
