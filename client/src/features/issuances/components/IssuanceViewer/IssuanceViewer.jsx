import { useState, useEffect, useMemo } from "react";
import {
    LuFileText,
    LuSheet,
    LuPresentation,
    LuImage,
    LuPaperclip,
    LuX,
    LuExternalLink,
    LuInfo,
    LuMessageSquare,
    LuHistory,
    LuFile,
    LuMaximize2,
    LuMinimize2,
    LuChevronLeft,
} from "react-icons/lu";
import { formatDate } from "../../../../utils/dateFormatter";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import CommentList from "../CommentList";
import HistoryViewer from "../HistoryViewer";
import "./IssuanceViewer.css";

/* ─────────────── helpers ─────────────── */

const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FILE_ICON_MAP = {
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

const getFileIcon = (fileType, mimeType) => {
    if (mimeType?.startsWith("image/")) return FILE_ICON_MAP.image;
    return FILE_ICON_MAP[fileType?.toLowerCase()] || FILE_ICON_MAP.default;
};

/**
 * Detect whether a URL points to something we can embed inline.
 * Returns "pdf" | "image" | "iframe" | "unsupported"
 */
const detectPreviewType = (url, mimeType) => {
    if (!url) return "unsupported";
    const lower = url.toLowerCase();
    if (
        mimeType?.startsWith("image/") ||
        /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i.test(lower)
    )
        return "image";
    if (mimeType === "application/pdf" || /\.pdf(\?|$)/i.test(lower))
        return "pdf";
    if (lower.includes("drive.google.com") || lower.includes("docs.google.com"))
        return "iframe";
    return "unsupported";
};

/**
 * Convert a raw Google Drive share link into an embeddable preview URL.
 */
const toEmbedUrl = (url) => {
    if (!url) return url;
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch)
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    const docsMatch = url.match(
        /(docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/[^/]+)/,
    );
    if (docsMatch) return `https://${docsMatch[1]}/preview`;
    return url;
};

/* ─────────────── sub-components ─────────────── */

/** Embedded document preview */
const DocumentPreview = ({ url, title, mimeType }) => {
    const [previewError, setPreviewError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const previewType = useMemo(
        () => detectPreviewType(url, mimeType),
        [url, mimeType],
    );
    const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

    // Reset error state when URL changes
    useEffect(() => {
        setPreviewError(false);
    }, [url]);

    if (!url) {
        return (
            <div className="doc-preview doc-preview--empty">
                <LuFile size={48} />
                <p>No document attached</p>
            </div>
        );
    }

    if (previewError || previewType === "unsupported") {
        return (
            <div className="doc-preview doc-preview--fallback">
                <LuFileText size={48} />
                <p>Preview not available for this file type</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-preview__open-btn">
                    <LuExternalLink size={16} />
                    Open Document
                </a>
            </div>
        );
    }

    return (
        <div
            className={`doc-preview ${expanded ? "doc-preview--expanded" : ""}`}>
            <div className="doc-preview__toolbar">
                <span className="doc-preview__toolbar-label">
                    <LuFileText size={14} />
                    Document Preview
                </span>
                <div className="doc-preview__toolbar-actions">
                    <button
                        type="button"
                        className="doc-preview__toolbar-btn"
                        onClick={() => setExpanded(!expanded)}
                        title={expanded ? "Collapse" : "Expand"}>
                        {expanded ?
                            <LuMinimize2 size={16} />
                        :   <LuMaximize2 size={16} />}
                    </button>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-preview__toolbar-btn"
                        title="Open in new tab">
                        <LuExternalLink size={16} />
                    </a>
                </div>
            </div>

            <div className="doc-preview__content">
                {previewType === "image" ?
                    <img
                        src={url}
                        alt={title || "Document preview"}
                        className="doc-preview__image"
                        onError={() => setPreviewError(true)}
                    />
                :   <iframe
                        src={embedUrl}
                        title={title || "Document preview"}
                        className="doc-preview__iframe"
                        onError={() => setPreviewError(true)}
                        allow="autoplay"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                }
            </div>
        </div>
    );
};

/** Single attachment row */
const AttachmentItem = ({ attachment, onPreview }) => {
    const { filename, url, fileType, mimeType, size } = attachment;
    const displayName = filename || "Untitled File";
    const IconComponent = getFileIcon(fileType, mimeType);
    const canPreview = detectPreviewType(url, mimeType) !== "unsupported";

    return (
        <div className="attachment-item">
            <span className="attachment-item__icon">
                <IconComponent size={18} />
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
            <div className="attachment-item__actions">
                {canPreview && (
                    <button
                        type="button"
                        className="attachment-item__btn attachment-item__btn--preview"
                        onClick={() => onPreview?.(attachment)}
                        title="Preview">
                        Preview
                    </button>
                )}
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-item__btn"
                        title="Open in new tab">
                        <LuExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    );
};

/* ─────────────── tabs config ─────────────── */

const TABS = [
    { id: "preview", label: "Preview", icon: LuFile },
    { id: "details", label: "Details", icon: LuInfo },
    { id: "attachments", label: "Files", icon: LuPaperclip },
    { id: "comments", label: "Comments", icon: LuMessageSquare },
    { id: "history", label: "History", icon: LuHistory },
];

/* ─────────────── main component ─────────────── */

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
    const [activeTab, setActiveTab] = useState("preview");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewMime, setPreviewMime] = useState(null);

    // Reset tab & preview when issuance changes
    useEffect(() => {
        if (issuance) {
            setActiveTab("preview");
            setPreviewUrl(issuance.documentUrl || null);
            setPreviewMime(null);
        }
    }, [issuance]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
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
        attachments = [],
    } = issuance;

    // Figure out which tabs to show
    const visibleTabs = TABS.filter((t) => {
        if (
            t.id === "attachments" &&
            (!attachments || attachments.length === 0)
        )
            return false;
        if (t.id === "comments" && !comments?.length && !onAddComment)
            return false;
        if (t.id === "history" && !showWorkflowInfo) return false;
        return true;
    });

    const handleAttachmentPreview = (att) => {
        setPreviewUrl(att.url);
        setPreviewMime(att.mimeType || null);
        setActiveTab("preview");
    };

    const handleResetPreview = () => {
        setPreviewUrl(documentUrl || null);
        setPreviewMime(null);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`viewer-backdrop ${isOpen ? "viewer-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className={`viewer-panel ${isOpen ? "viewer-panel--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="viewer-title">
                {/* ── Header ── */}
                <header className="viewer-header">
                    <div className="viewer-header__top">
                        <button
                            type="button"
                            className="viewer-header__close"
                            onClick={onClose}
                            aria-label="Close viewer">
                            <LuX size={20} />
                        </button>
                    </div>

                    <div className="viewer-header__meta">
                        <span className="viewer-header__type">
                            {type || "Document"}
                        </span>
                        {showWorkflowInfo && status && (
                            <StatusBadge status={status} />
                        )}
                        {showWorkflowInfo && priority && (
                            <PriorityBadge priority={priority} />
                        )}
                    </div>

                    <h2 id="viewer-title" className="viewer-header__title">
                        {title || "Untitled Issuance"}
                    </h2>

                    {description && (
                        <p className="viewer-header__desc">{description}</p>
                    )}

                    {/* Quick meta row */}
                    <div className="viewer-header__quick-meta">
                        {department && <span>{department}</span>}
                        {issuedDate && <span>{formatDate(issuedDate)}</span>}
                        {issuedBy && <span>by {issuedBy}</span>}
                    </div>
                </header>

                {/* ── Tab bar ── */}
                <nav className="viewer-tabs" role="tablist">
                    {visibleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const count =
                            tab.id === "attachments" ? attachments.length
                            : tab.id === "comments" ? comments?.length || 0
                            : tab.id === "history" ?
                                (statusHistory?.length || 0) +
                                (versionHistory?.length || 0)
                            :   null;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={`viewer-tabs__btn ${activeTab === tab.id ? "viewer-tabs__btn--active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}>
                                <Icon size={16} />
                                <span>{tab.label}</span>
                                {count != null && count > 0 && (
                                    <span className="viewer-tabs__count">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Tab content ── */}
                <div className="viewer-body">
                    {/* Preview tab */}
                    {activeTab === "preview" && (
                        <div className="viewer-tab-panel">
                            {previewUrl !== documentUrl && (
                                <button
                                    type="button"
                                    className="viewer-tab-panel__back"
                                    onClick={handleResetPreview}>
                                    <LuChevronLeft size={16} />
                                    Back to main document
                                </button>
                            )}
                            <DocumentPreview
                                url={previewUrl}
                                title={title}
                                mimeType={previewMime}
                            />
                        </div>
                    )}

                    {/* Details tab */}
                    {activeTab === "details" && (
                        <div className="viewer-tab-panel">
                            <div className="detail-grid">
                                <DetailRow label="Type" value={type} />
                                <DetailRow label="Category" value={category} />
                                <DetailRow
                                    label="Department"
                                    value={department}
                                />
                                <DetailRow
                                    label="Date Issued"
                                    value={
                                        issuedDate ?
                                            formatDate(issuedDate)
                                        :   null
                                    }
                                />
                                <DetailRow label="Issued By" value={issuedBy} />
                                {showWorkflowInfo && (
                                    <DetailRow label="Status" value={status} />
                                )}
                                {showWorkflowInfo && (
                                    <DetailRow
                                        label="Priority"
                                        value={priority}
                                    />
                                )}
                            </div>

                            {documentUrl && (
                                <div className="viewer-tab-panel__actions">
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="viewer-action-btn">
                                        <LuExternalLink size={16} />
                                        Open Original Document
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attachments tab */}
                    {activeTab === "attachments" && (
                        <div className="viewer-tab-panel">
                            {attachments.length === 0 ?
                                <p className="viewer-empty">No attachments.</p>
                            :   <div className="attachment-list">
                                    {attachments.map((att, i) => (
                                        <AttachmentItem
                                            key={att._id || att.id || i}
                                            attachment={att}
                                            onPreview={handleAttachmentPreview}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                    )}

                    {/* Comments tab */}
                    {activeTab === "comments" && (
                        <div className="viewer-tab-panel">
                            <CommentList
                                comments={comments}
                                onAddComment={onAddComment}
                                showAddForm={!!onAddComment}
                            />
                        </div>
                    )}

                    {/* History tab */}
                    {activeTab === "history" && (
                        <div className="viewer-tab-panel">
                            <HistoryViewer
                                statusHistory={statusHistory}
                                versionHistory={versionHistory}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

/** Small helper for the details grid */
const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="detail-row">
            <span className="detail-row__label">{label}</span>
            <span className="detail-row__value">{value}</span>
        </div>
    );
};

export default IssuanceViewer;
