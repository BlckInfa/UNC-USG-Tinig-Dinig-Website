const mongoose = require("mongoose");

/**
 * Issuance Model - The "M" in MVC
 * Database schema for official USG documents (resolutions, memorandums, reports)
 */
const issuanceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["RESOLUTION", "MEMORANDUM", "REPORT", "CIRCULAR"],
            required: [true, "Document type is required"],
        },
        description: {
            type: String,
            trim: true,
        },
        documentUrl: {
            type: String,
            required: [true, "Document URL is required"],
            trim: true,
        },
        issuedBy: {
            type: String,
            trim: true,
        },
        issuedDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED"],
            default: "PUBLISHED",
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Issuance", issuanceSchema);
