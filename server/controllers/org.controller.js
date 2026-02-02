const { orgService } = require('../services');

/**
 * Organization Controller - The "C" in MVC
 * Handles HTTP Request/Response ONLY
 */
class OrgController {
  /**
   * Add organization member
   * POST /api/org/members
   */
  async addMember(req, res, next) {
    try {
      const member = await orgService.addMember(req.body);

      res.status(201).json({
        success: true,
        message: 'Member added successfully',
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all organization members
   * GET /api/org/members
   */
  async getMembers(req, res, next) {
    try {
      const { isActive, department } = req.query;
      const filters = { isActive, department };

      const members = await orgService.getMembers(filters);

      res.json({
        success: true,
        data: { members },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get member by ID
   * GET /api/org/members/:id
   */
  async getMemberById(req, res, next) {
    try {
      const member = await orgService.getMemberById(req.params.id);

      res.json({
        success: true,
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update member
   * PUT /api/org/members/:id
   */
  async updateMember(req, res, next) {
    try {
      const member = await orgService.updateMember(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Member updated successfully',
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove member
   * DELETE /api/org/members/:id
   */
  async removeMember(req, res, next) {
    try {
      await orgService.removeMember(req.params.id);

      res.json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get organization structure
   * GET /api/org/structure
   */
  async getStructure(req, res, next) {
    try {
      const structure = await orgService.getStructure();

      res.json({
        success: true,
        data: { structure },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrgController();
