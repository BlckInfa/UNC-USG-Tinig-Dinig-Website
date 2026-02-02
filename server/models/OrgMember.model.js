const mongoose = require('mongoose');

/**
 * Organization Member Model - The "M" in MVC
 * Database schema for organization members
 */
const orgMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    term: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    responsibilities: [String],
    contactInfo: {
      phone: String,
      officeHours: String,
      location: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
orgMemberSchema.index({ position: 1, isActive: 1 });

module.exports = mongoose.model('OrgMember', orgMemberSchema);
