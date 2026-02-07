import { useState, useRef } from "react";
import {
    FileText,
    FileSpreadsheet,
    Image,
    Paperclip,
    Upload,
    X,
} from "lucide-react";
import "./FileUploadField.css";

const FILE_ICONS = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    xls: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    png: Image,
    jpg: Image,
    jpeg: Image,
    gif: Image,
    default: Paperclip,
};

const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return FILE_ICONS[ext] || FILE_ICONS.default;
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * File Upload Field Component
 * Supports drag-and-drop and click-to-browse
 */
const FileUploadField = ({
    files = [],
    onChange,
    onRemove,
    label,
    required = false,
    accept = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif",
    multiple = true,
    maxSize = 10 * 1024 * 1024, // 10MB default
    error,
    disabled = false,
    className = "",
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const inputRef = useRef(null);

    const validateFiles = (fileList) => {
        const validated = [];
        for (const file of fileList) {
            if (file.size > maxSize) {
                setUploadError(
                    `"${file.name}" exceeds ${formatFileSize(maxSize)} limit`,
                );
                continue;
            }
            validated.push(file);
        }
        return validated;
    };

    const handleFiles = (fileList) => {
        setUploadError("");
        const newFiles = validateFiles(Array.from(fileList));
        if (newFiles.length > 0 && onChange) {
            onChange([...files, ...newFiles]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            setDragActive(true);
        if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (!disabled && e.dataTransfer.files?.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
            e.target.value = "";
        }
    };

    const handleRemove = (index) => {
        if (onRemove) {
            onRemove(index);
        } else if (onChange) {
            const updated = files.filter((_, i) => i !== index);
            onChange(updated);
        }
    };

    return (
        <div className={`file-upload-wrapper ${className}`}>
            {label && (
                <label className="file-upload__label">
                    {label}
                    {required && (
                        <span className="file-upload__required">*</span>
                    )}
                </label>
            )}

            <div
                className={[
                    "file-upload__zone",
                    dragActive && "file-upload__zone--active",
                    disabled && "file-upload__zone--disabled",
                    error && "file-upload__zone--error",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="file-upload__input"
                    disabled={disabled}
                />
                <div className="file-upload__content">
                    <Upload size={24} className="file-upload__icon" />
                    <p className="file-upload__text">
                        <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="file-upload__hint">
                        Max file size: {formatFileSize(maxSize)}
                    </p>
                </div>
            </div>

            {(error || uploadError) && (
                <span className="file-upload__error">
                    {error || uploadError}
                </span>
            )}

            {files.length > 0 && (
                <ul className="file-upload__list">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name || file.filename}-${index}`}
                            className="file-upload__item">
                            <span className="file-upload__file-icon">
                                {(() => {
                                    const IconComponent = getFileIcon(
                                        file.name || file.filename || "",
                                    );
                                    return <IconComponent size={18} />;
                                })()}
                            </span>
                            <div className="file-upload__file-info">
                                <span className="file-upload__filename">
                                    {file.name || file.filename}
                                </span>
                                {file.size && (
                                    <span className="file-upload__filesize">
                                        {formatFileSize(file.size)}
                                    </span>
                                )}
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="file-upload__remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    title="Remove file">
                                    <X size={14} />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUploadField;
