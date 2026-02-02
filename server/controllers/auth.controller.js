const { authService } = require('../services');

/**
 * Auth Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 * Business logic is delegated to authService
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    // For JWT, logout is handled client-side by removing the token
    // This endpoint is for any server-side cleanup if needed
    res.json({
      success: true,
      message: 'Logout successful',
    });
  }
}

module.exports = new AuthController();
