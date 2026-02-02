const { userService } = require('../services');

/**
 * User Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 */
class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  async getUsers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await userService.getUsers({ page, limit });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role
   * PATCH /api/users/:id/role
   */
  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const user = await userService.updateUserRole(req.params.id, role);

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate user
   * PATCH /api/users/:id/deactivate
   */
  async deactivateUser(req, res, next) {
    try {
      const user = await userService.deactivateUser(req.params.id);

      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
