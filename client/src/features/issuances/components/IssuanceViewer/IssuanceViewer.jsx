import { useState, useEffect } from "react";
import {
    LuFileText,
    LuSheet,
    LuPresentation,
    LuImage,
    LuPaperclip,
} from "react-icons/lu";
import { formatDate } from "../../../../utils/dateFormatter";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import CommentList from "../CommentList";
import HistoryViewer from "../HistoryViewer";
import "./IssuanceViewer.css";

/**
 * File Attachment Item Component
 * Displays a single attachment with download/open option
 */
const AttachmentItem = ({ attachment }) => {
    const { filename, url, fileType, mimeType, size } = attachment;
    const displayName = filename || "Untitled File";

    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown size";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (type) => {
        const iconMap = {
            pdf: LuFileText,
            doc: LuFileText,
            docx: LuFileText,
            xls: LuSheet,
            xlsx: LuSheet,
            ppt: LuPresentation,
            pptx: LuPresentation,
            image: LuImage,
            default: LuPaperclip,
        };
        if (mimeType?.startsWith("image/")) return iconMap.image;
        return iconMap[type?.toLowerCase()] || iconMap.default;
    };

    const handleOpen = () => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="attachment-item">
            <span className="attachment-item__icon">
                {(() => {
                    const IconComponent = getFileIcon(fileType);
                    return <IconComponent size={18} />;
                })()}
            </span>
            <div className="attachment-item__info">
                <span className="attachment-item__name">{displayName}</span>
                <span className="attachment-item__meta">
                    {fileType && (
                        <span className="attachment-item__type">
                            {fileType}
                        </span>
                    )}
                    {size && (
                        <span className="attachment-item__size">
                            {formatFileSize(size)}
                        </span>
                    )}
                </span>
            </div>
            {url && (
                <button
                    type="button"
                    className="attachment-item__btn"
                    onClick={handleOpen}
                    title="Open in new tab">
                    Open
                </button>
            )}
        </div>
    );
};

/**
 * Attachments Section Component
 * Displays list of file attachments
 */
const AttachmentsSection = ({ attachments = [] }) => {
    if (!attachments || attachments.length === 0) {
        return (
            <div className="attachments-section">
                <h3 className="attachments-section__title">Attachments</h3>
                <p className="attachments-section__empty">
                    No attachments available.
                </p>
            </div>
        );
    }

    return (
        <div className="attachments-section">
            <h3 className="attachments-section__title">
                Attachments ({attachments.length})
            </h3>
            <div className="attachments-section__list">
                {attachments.map((attachment, index) => (
                    <AttachmentItem
                        key={attachment._id || attachment.id || index}
                        attachment={attachment}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Accordion Item Component
 * Expandable section for details
 */
const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="accordion-item">
            <button
                type="button"
                className="accordion-item__header"
                onClick={() => setIsOpen(!isOpen)}>
                <span
                    className={`accordion-item__icon ${isOpen ? "accordion-item__icon--open" : ""}`}>
                    +
                </span>
                <span className="accordion-item__title">{title}</span>
            </button>
            {isOpen && (
                <div className="accordion-item__content">{children}</div>
            )}
        </div>
    );
};

/**
 * Issuance Viewer Component
 * Side panel that displays full issuance details
 * Styled like UNC course details panel
 */
const IssuanceViewer = ({
    issuance,
    isOpen,
    onClose,
    comments = [],
    statusHistory = [],
    versionHistory = [],
    showWorkflowInfo = false,
    onAddComment,
}) => {
    // Lock body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!issuance) return null;

    const {
        title,
        type,
        category,
        department,
        issuedDate,
        issuedBy,
        status,
        priority,
        description,
        documentUrl,
        thumbnailUrl,
        previewImage,
        attachments = [],
    } = issuance;

    const imageUrl = thumbnailUrl || previewImage;

    const handleOpenDocument = () => {
        if (documentUrl) {
            window.open(documentUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`side-panel-backdrop ${isOpen ? "side-panel-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Side Panel */}
            <div
                className={`side-panel ${isOpen ? "side-panel--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="panel-title">
                {/* Close Button */}
                <button
                    type="button"
                    className="side-panel__close"
                    onClick={onClose}
                    aria-label="Close panel">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Panel Content */}
                <div className="side-panel__content">
                    {/* Preview Image */}
                    {imageUrl && (
                        <div className="side-panel__image">
                            <img
                                src={imageUrl}
                                alt={title || "Issuance preview"}
                            />
                        </div>
                    )}

                    {/* Category Label */}
                    <div className="side-panel__category">
                        {type || "Document"}
                    </div>

                    {/* Title */}
                    <h2 id="panel-title" className="side-panel__title">
                        {title || "Untitled Issuance"}
                    </h2>

                    {/* Description */}
                    {description && (
                        <p className="side-panel__description">{description}</p>
                    )}

                    {/* Workflow badges */}
                    {showWorkflowInfo && (status || priority) && (
                        <div className="side-panel__badges">
                            {status && <StatusBadge status={status} />}
                            {priority && <PriorityBadge priority={priority} />}
                        </div>
                    )}

                    {/* Accordion Sections */}
                    <div className="side-panel__sections">
                        {/* Details Section */}
                        <AccordionItem title="Document Details" defaultOpen>
                            <div className="detail-list">
                                {category && (
                                    <div className="detail-item">
                                        <span className="detail-item__label">
                                            Category
                                        </span>
                                        <span className="detail-item__value">
                                            {category}
                                        </span>
                                    </div>
                                )}
                                {department && (
                                    <div className="detail-item">
                                        <span className="detail-item__label">
                                            Department
                                        </span>
                                        <span className="detail-item__value">
                                            {department}
                                        </span>
                                    </div>
                                )}
                                {issuedDate && (
                                    <div className="detail-item">
                                        <span className="detail-item__label">
                                            Date Issued
                                        </span>
                                        <span className="detail-item__value">
                                            {formatDate(issuedDate)}
                                        </span>
                                    </div>
                                )}
                                {issuedBy && (
                                    <div className="detail-item">
                                        <span className="detail-item__label">
                                            Issued By
                                        </span>
                                        <span className="detail-item__value">
                                            {issuedBy}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </AccordionItem>

                        {/* Attachments Section */}
                        {attachments && attachments.length > 0 && (
                            <AccordionItem
                                title={`Attachments (${attachments.length})`}>
                                <AttachmentsSection attachments={attachments} />
                            </AccordionItem>
                        )}

                        {/* Comments Section */}
                        {(comments?.length > 0 || onAddComment) && (
                            <AccordionItem
                                title={`Comments (${comments?.length || 0})`}>
                                <CommentList
                                    comments={comments}
                                    onAddComment={onAddComment}
                                    showAddForm={!!onAddComment}
                                />
                            </AccordionItem>
                        )}

                        {/* History Section */}
                        {showWorkflowInfo &&
                            (statusHistory?.length > 0 ||
                                versionHistory?.length > 0) && (
                                <AccordionItem
                                    title={`History (${(statusHistory?.length || 0) + (versionHistory?.length || 0)})`}>
                                    <HistoryViewer
                                        statusHistory={statusHistory}
                                        versionHistory={versionHistory}
                                    />
                                </AccordionItem>
                            )}
                    </div>

                    {/* Action Button */}
                    {documentUrl && (
                        <button
                            type="button"
                            className="side-panel__action"
                            onClick={handleOpenDocument}>
                            View Document
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default IssuanceViewer;
