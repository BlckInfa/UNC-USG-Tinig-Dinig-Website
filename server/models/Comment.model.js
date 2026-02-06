const mongoose = require("mongoose");

/**
 * Comment Model - The "M" in MVC
 * Database schema for comments on issuances
 */
const commentSchema = new mongoose.Schema(
    {
        issuance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issuance",
            required: [true, "Issuance reference is required"],
            index: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required"],
        },
        content: {
            type: String,
            required: [true, "Comment content is required"],
            trim: true,
            maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },
        // Optional: parent comment for threaded replies (future enhancement)
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Index for efficient querying
commentSchema.index({ issuance: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
