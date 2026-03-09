const mongoose = require("mongoose");

/**
 * Department Model
 * Represents organizational departments that issuances can be assigned to.
 * Used for department validation and routing.
 */
const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: [true, "Department code is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        head: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

departmentSchema.index({ isActive: 1 });

module.exports = mongoose.model("Department", departmentSchema);
