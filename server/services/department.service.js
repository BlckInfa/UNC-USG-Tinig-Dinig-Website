const { Department } = require("../models");

/**
 * Department Service - Business Logic Layer
 * Manages department CRUD and validation for issuance assignment.
 */
class DepartmentService {
    /**
     * Get all active departments
     */
    async getAll(includeInactive = false) {
        const query = includeInactive ? {} : { isActive: true };
        const departments = await Department.find(query)
            .populate("head", "name email")
            .sort({ name: 1 })
            .lean();

        return departments;
    }

    /**
     * Get a single department by ID
     */
    async getById(id) {
        const department = await Department.findById(id)
            .populate("head", "name email")
            .lean();

        if (!department) {
            const error = new Error("Department not found");
            error.statusCode = 404;
            throw error;
        }

        return department;
    }

    /**
     * Get a department by name (case-insensitive)
     */
    async getByName(name) {
        const department = await Department.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
        }).lean();

        return department;
    }

    /**
     * Validate that a department exists (by name or ID)
     * @param {string} identifier - Department name or MongoDB ObjectId
     * @returns {Object} department if valid
     * @throws Error if department not found
     */
    async validateDepartment(identifier) {
        let department;

        // Check if it's a MongoDB ObjectId
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            department = await Department.findById(identifier).lean();
        } else {
            department = await this.getByName(identifier);
        }

        if (!department) {
            const error = new Error(
                `Department "${identifier}" not found. Use GET /api/admin/departments to see available departments.`,
            );
            error.statusCode = 400;
            throw error;
        }

        if (!department.isActive) {
            const error = new Error(
                `Department "${department.name}" is inactive`,
            );
            error.statusCode = 400;
            throw error;
        }

        return department;
    }

    /**
     * Create a new department
     */
    async create(data) {
        const department = await Department.create(data);
        return department;
    }

    /**
     * Update a department
     */
    async update(id, data) {
        const department = await Department.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!department) {
            const error = new Error("Department not found");
            error.statusCode = 404;
            throw error;
        }

        return department;
    }

    /**
     * Deactivate a department (soft delete)
     */
    async deactivate(id) {
        const department = await Department.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true },
        );

        if (!department) {
            const error = new Error("Department not found");
            error.statusCode = 404;
            throw error;
        }

        return department;
    }
}

module.exports = new DepartmentService();
