const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    MAX_ATTACHMENTS_PER_ISSUANCE,
    ATTACHMENT_TYPES,
} = require("../../shared/constants");

/**
 * File Upload Service - Business Logic Layer
 * Handles file upload processing, validation, and storage abstraction.
 *
 * Storage is abstracted: current implementation uses local disk storage.
 * Can be swapped to cloud storage (S3, Azure Blob, etc.) by replacing
 * the _saveToStorage and _deleteFromStorage methods.
 */
class FileUploadService {
    constructor() {
        // Upload directory (relative to server root)
        this.uploadDir = path.join(__dirname, "..", "uploads");
        this._ensureUploadDir();
    }

    /**
     * Ensure upload directory exists
     */
    _ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Validate a single file before processing
     * @param {Object} file - File object (from multipart or raw metadata)
     * @param {string} file.originalname - Original filename
     * @param {string} file.mimetype - MIME type
     * @param {number} file.size - File size in bytes
     * @returns {{ valid: boolean, error?: string }}
     */
    validateFile(file) {
        if (!file) {
            return { valid: false, error: "No file provided" };
        }

        // Validate MIME type
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            return {
                valid: false,
                error: `File type "${file.mimetype}" is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
            };
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            const maxMB = MAX_FILE_SIZE / (1024 * 1024);
            return {
                valid: false,
                error: `File size exceeds maximum of ${maxMB}MB`,
            };
        }

        return { valid: true };
    }

    /**
     * Validate multiple files and attachment count
     * @param {Array} files - Array of file objects
     * @param {number} currentAttachmentCount - Current number of attachments on the issuance
     * @returns {{ valid: boolean, errors: string[] }}
     */
    validateFiles(files, currentAttachmentCount = 0) {
        const errors = [];

        if (!files || files.length === 0) {
            return { valid: false, errors: ["No files provided"] };
        }

        // Check total attachment count
        const totalCount = currentAttachmentCount + files.length;
        if (totalCount > MAX_ATTACHMENTS_PER_ISSUANCE) {
            errors.push(
                `Total attachments would exceed maximum of ${MAX_ATTACHMENTS_PER_ISSUANCE}. ` +
                    `Current: ${currentAttachmentCount}, Attempting: ${files.length}`,
            );
        }

        // Validate each file
        files.forEach((file, index) => {
            const result = this.validateFile(file);
            if (!result.valid) {
                errors.push(
                    `File ${index + 1} (${file.originalname}): ${result.error}`,
                );
            }
        });

        return { valid: errors.length === 0, errors };
    }

    /**
     * Determine the attachment type category from MIME type
     * @param {string} mimeType - MIME type
     * @returns {string} - Attachment type (document, image, other)
     */
    getFileType(mimeType) {
        if (mimeType.startsWith("image/")) return ATTACHMENT_TYPES.IMAGE;
        if (
            mimeType.startsWith("application/pdf") ||
            mimeType.includes("document") ||
            mimeType.includes("spreadsheet") ||
            mimeType.includes("presentation") ||
            mimeType.startsWith("text/")
        ) {
            return ATTACHMENT_TYPES.DOCUMENT;
        }
        return ATTACHMENT_TYPES.OTHER;
    }

    /**
     * Process and store a file upload
     * @param {Object} file - File object (from multer or similar)
     * @param {string} uploaderId - User ID of the uploader
     * @returns {Object} - Attachment metadata for saving to database
     */
    async processUpload(file, uploaderId) {
        const validation = this.validateFile(file);
        if (!validation.valid) {
            const error = new Error(validation.error);
            error.statusCode = 400;
            throw error;
        }

        // Generate unique filename to prevent conflicts
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

        // Save file to storage
        const storagePath = await this._saveToStorage(file, uniqueName);

        return {
            filename: file.originalname,
            url: storagePath,
            fileType: this.getFileType(file.mimetype),
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: uploaderId,
            uploadedAt: new Date(),
        };
    }

    /**
     * Process multiple file uploads
     * @param {Array} files - Array of file objects
     * @param {string} uploaderId - User ID of the uploader
     * @param {number} currentAttachmentCount - Current attachment count on issuance
     * @returns {Array} - Array of attachment metadata
     */
    async processMultipleUploads(
        files,
        uploaderId,
        currentAttachmentCount = 0,
    ) {
        const validation = this.validateFiles(files, currentAttachmentCount);
        if (!validation.valid) {
            const error = new Error(validation.errors.join("; "));
            error.statusCode = 400;
            throw error;
        }

        const results = [];
        for (const file of files) {
            const attachment = await this.processUpload(file, uploaderId);
            results.push(attachment);
        }

        return results;
    }

    /**
     * Delete a file from storage
     * @param {string} fileUrl - File URL/path
     */
    async deleteFile(fileUrl) {
        await this._deleteFromStorage(fileUrl);
    }

    // ===== Storage Abstraction Layer =====
    // Swap these methods to change storage backends

    /**
     * Save file to local storage
     * @private
     * @param {Object} file - File object with buffer
     * @param {string} uniqueName - Generated unique filename
     * @returns {string} - Storage path/URL
     */
    async _saveToStorage(file, uniqueName) {
        const filePath = path.join(this.uploadDir, uniqueName);

        if (file.buffer) {
            // If file has buffer (e.g., from multer memoryStorage)
            fs.writeFileSync(filePath, file.buffer);
        } else if (file.path) {
            // If file has temp path (e.g., from multer diskStorage), it's already saved
            // Just move/rename if needed
            fs.renameSync(file.path, filePath);
        }

        // Return a URL-friendly path
        return `/uploads/${uniqueName}`;
    }

    /**
     * Delete file from local storage
     * @private
     * @param {string} fileUrl - File URL/path
     */
    async _deleteFromStorage(fileUrl) {
        // Convert URL path to filesystem path
        const filename = path.basename(fileUrl);
        const filePath = path.join(this.uploadDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = new FileUploadService();
