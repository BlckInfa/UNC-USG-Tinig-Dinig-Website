const { validationResult, body, param, query } = require("express-validator");
const {
    ISSUANCE_STATUS,
    ISSUANCE_PRIORITY,
    ISSUANCE_TYPES,
    COMMENT_VISIBILITY,
} = require("../../shared/constants");

/**
 * Validation Result Handler
 * Checks for validation errors and returns them
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

/**
 * Auth Validation Rules
 */
const authValidation = {
    register: [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 2, max: 100 })
            .withMessage("Name must be between 2 and 100 characters"),
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format")
            .normalizeEmail(),
        body("studentId")
            .trim()
            .notEmpty()
            .withMessage("Student ID is required"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters"),
        validate,
    ],
    login: [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
        validate,
    ],
};

/**
 * Ticket Validation Rules
 */
const ticketValidation = {
    create: [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ max: 200 })
            .withMessage("Title cannot exceed 200 characters"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("category")
            .notEmpty()
            .withMessage("Category is required")
            .isIn(["COMPLAINT", "SUGGESTION", "INQUIRY", "FEEDBACK", "REQUEST"])
            .withMessage("Invalid category"),
        body("priority")
            .optional()
            .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
            .withMessage("Invalid priority"),
        validate,
    ],
    update: [
        body("status")
            .optional()
            .isIn([
                "PENDING",
                "IN_PROGRESS",
                "APPROVED",
                "REJECTED",
                "COMPLETED",
                "CANCELLED",
            ])
            .withMessage("Invalid status"),
        validate,
    ],
};

/**
 * Finance Validation Rules
 */
const financeValidation = {
    create: [
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("amount")
            .notEmpty()
            .withMessage("Amount is required")
            .isNumeric()
            .withMessage("Amount must be a number"),
        body("type")
            .notEmpty()
            .withMessage("Type is required")
            .isIn(["INCOME", "EXPENSE", "TRANSFER"])
            .withMessage("Invalid transaction type"),
        body("category").trim().notEmpty().withMessage("Category is required"),
        validate,
    ],
};

/**
 * MongoDB ID Validation
 */
const validateMongoId = [
    param("id").isMongoId().withMessage("Invalid ID format"),
    validate,
];

/**
 * Admin Issuance Validation Rules
 * Enforces required fields, enum values, and file constraints for admin operations
 */
const issuanceValidation = {
    create: [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ max: 300 })
            .withMessage("Title cannot exceed 300 characters"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("type")
            .notEmpty()
            .withMessage("Document type is required")
            .isIn(Object.values(ISSUANCE_TYPES))
            .withMessage(
                `Invalid type. Must be one of: ${Object.values(ISSUANCE_TYPES).join(", ")}`,
            ),
        body("category").trim().notEmpty().withMessage("Category is required"),
        body("priority")
            .optional()
            .isIn(Object.values(ISSUANCE_PRIORITY))
            .withMessage(
                `Invalid priority. Must be one of: ${Object.values(ISSUANCE_PRIORITY).join(", ")}`,
            ),
        body("status")
            .optional()
            .isIn(Object.values(ISSUANCE_STATUS))
            .withMessage(
                `Invalid status. Must be one of: ${Object.values(ISSUANCE_STATUS).join(", ")}`,
            ),
        body("department")
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage("Department name cannot exceed 100 characters"),
        validate,
    ],
    update: [
        body("title")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Title cannot be empty")
            .isLength({ max: 300 })
            .withMessage("Title cannot exceed 300 characters"),
        body("description")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Description cannot be empty"),
        body("type")
            .optional()
            .isIn(Object.values(ISSUANCE_TYPES))
            .withMessage(
                `Invalid type. Must be one of: ${Object.values(ISSUANCE_TYPES).join(", ")}`,
            ),
        body("category")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Category cannot be empty"),
        body("priority")
            .optional()
            .isIn(Object.values(ISSUANCE_PRIORITY))
            .withMessage(
                `Invalid priority. Must be one of: ${Object.values(ISSUANCE_PRIORITY).join(", ")}`,
            ),
        body("department")
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage("Department name cannot exceed 100 characters"),
        validate,
    ],
    updateStatus: [
        body("status")
            .notEmpty()
            .withMessage("Status is required")
            .isIn(Object.values(ISSUANCE_STATUS))
            .withMessage(
                `Invalid status. Must be one of: ${Object.values(ISSUANCE_STATUS).join(", ")}`,
            ),
        body("reason")
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Reason cannot exceed 500 characters"),
        validate,
    ],
    assignDepartment: [
        body("department")
            .trim()
            .notEmpty()
            .withMessage("Department is required"),
        body("reason")
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Reason cannot exceed 500 characters"),
        validate,
    ],
};

/**
 * Admin Comment Validation Rules
 */
const commentValidation = {
    create: [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Comment content is required")
            .isLength({ max: 2000 })
            .withMessage("Comment cannot exceed 2000 characters"),
        body("visibility")
            .optional()
            .isIn(Object.values(COMMENT_VISIBILITY))
            .withMessage(
                `Invalid visibility. Must be one of: ${Object.values(COMMENT_VISIBILITY).join(", ")}`,
            ),
        body("parentCommentId")
            .optional()
            .isMongoId()
            .withMessage("Invalid parent comment ID format"),
        validate,
    ],
    update: [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Comment content is required")
            .isLength({ max: 2000 })
            .withMessage("Comment cannot exceed 2000 characters"),
        validate,
    ],
};

/**
 * Department Validation Rules
 */
const departmentValidation = {
    create: [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Department name is required")
            .isLength({ max: 100 })
            .withMessage("Name cannot exceed 100 characters"),
        body("code")
            .trim()
            .notEmpty()
            .withMessage("Department code is required")
            .isLength({ max: 20 })
            .withMessage("Code cannot exceed 20 characters")
            .isAlphanumeric()
            .withMessage("Code must be alphanumeric"),
        body("description")
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Description cannot exceed 500 characters"),
        validate,
    ],
    update: [
        body("name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Name cannot be empty")
            .isLength({ max: 100 })
            .withMessage("Name cannot exceed 100 characters"),
        body("code")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Code cannot be empty")
            .isLength({ max: 20 })
            .withMessage("Code cannot exceed 20 characters"),
        body("description")
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Description cannot exceed 500 characters"),
        validate,
    ],
};

/**
 * Audit Log Query Validation
 */
const auditLogValidation = {
    query: [
        query("entityType")
            .optional()
            .isIn(["Issuance", "Comment", "Attachment"])
            .withMessage("Invalid entity type"),
        query("action")
            .optional()
            .isString()
            .withMessage("Action must be a string"),
        query("startDate")
            .optional()
            .isISO8601()
            .withMessage("startDate must be a valid ISO date"),
        query("endDate")
            .optional()
            .isISO8601()
            .withMessage("endDate must be a valid ISO date"),
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive integer"),
        query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be between 1 and 100"),
        validate,
    ],
};

module.exports = {
    validate,
    authValidation,
    ticketValidation,
    financeValidation,
    issuanceValidation,
    commentValidation,
    departmentValidation,
    auditLogValidation,
    validateMongoId,
};
