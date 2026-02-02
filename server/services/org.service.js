const { OrgMember } = require('../models');

/**
 * Organization Service - Business Logic Layer
 * Contains all organization-related business logic
 */
class OrgService {
  /**
   * Add organization member
   */
  async addMember(memberData) {
    const member = await OrgMember.create(memberData);
    return member.populate('user', 'name email profileImage');
  }

  /**
   * Get all organization members
   */
  async getMembers(filters = {}) {
    const { isActive = true, department } = filters;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive;
    if (department) query.department = department;

    const members = await OrgMember.find(query)
      .populate('user', 'name email profileImage')
      .sort({ position: 1 });

    return members;
  }

  /**
   * Get member by ID
   */
  async getMemberById(memberId) {
    const member = await OrgMember.findById(memberId).populate(
      'user',
      'name email profileImage'
    );

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  }

  /**
   * Update member
   */
  async updateMember(memberId, updateData) {
    const member = await OrgMember.findByIdAndUpdate(memberId, updateData, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email profileImage');

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  }

  /**
   * Remove member
   */
  async removeMember(memberId) {
    const member = await OrgMember.findByIdAndDelete(memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  }

  /**
   * Get organization structure (hierarchical)
   */
  async getStructure() {
    const members = await OrgMember.find({ isActive: true })
      .populate('user', 'name email profileImage')
      .sort({ position: 1 });

    // Group by position hierarchy
    const structure = {
      executives: [],
      officers: [],
      members: [],
    };

    const executivePositions = ['President', 'Vice President'];
    const officerPositions = ['Secretary', 'Treasurer', 'Auditor', 'PRO'];

    members.forEach((member) => {
      if (executivePositions.includes(member.position)) {
        structure.executives.push(member);
      } else if (officerPositions.includes(member.position)) {
        structure.officers.push(member);
      } else {
        structure.members.push(member);
      }
    });

    return structure;
  }
}

module.exports = new OrgService();
