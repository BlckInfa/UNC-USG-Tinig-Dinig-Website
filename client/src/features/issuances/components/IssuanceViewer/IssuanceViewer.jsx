import { useState, useEffect, useMemo, useCallback } from "react";
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
    LuCalendar,
    LuUser,
    LuBuilding2,
    LuTag,
    LuDownload,
    LuEye,
    LuFolderOpen,
} from "react-icons/lu";
import { formatDate } from "../../../../utils/dateFormatter";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import CommentList from "../CommentList";
import HistoryViewer from "../HistoryViewer";
import "./IssuanceViewer.css";

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

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

/** Returns "pdf" | "image" | "iframe" | "unsupported" */
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

/** Convert raw Google Drive share links into embeddable preview URLs */
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

/* ═══════════════════════════════════════════════
   Skeleton Loaders — shimmer placeholders for
   perceived performance while data loads
   ═══════════════════════════════════════════════ */

const SkeletonLine = ({ width = "100%", height = "14px" }) => (
    <div
        className="skeleton-line"
        style={{ width, height }}
        aria-hidden="true"
    />
);

const SkeletonBlock = ({ lines = 3 }) => (
    <div className="skeleton-block" aria-label="Loading content">
        {Array.from({ length: lines }, (_, i) => (
            <SkeletonLine
                key={i}
                width={i === lines - 1 ? "60%" : "100%"}
                height="12px"
            />
        ))}
    </div>
);

const DetailSkeleton = () => (
    <div className="detail-grid" aria-label="Loading details">
        {Array.from({ length: 5 }, (_, i) => (
            <div className="detail-row" key={i}>
                <SkeletonLine width="80px" height="12px" />
                <SkeletonLine width="120px" height="12px" />
            </div>
        ))}
    </div>
);

/* ═══════════════════════════════════════════════
   Empty State — friendly illustration placeholder
   used when no data is available
   ═══════════════════════════════════════════════ */

const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="viewer-empty-state">
        <div className="viewer-empty-state__icon">
            <Icon size={32} />
        </div>
        <p className="viewer-empty-state__title">{title}</p>
        {subtitle && <p className="viewer-empty-state__subtitle">{subtitle}</p>}
    </div>
);

/* ═══════════════════════════════════════════════
   DocumentPreview — embedded document viewer with
   expand/collapse and graceful error fallback
   ═══════════════════════════════════════════════ */

const DocumentPreview = ({ url, title, mimeType }) => {
    const [previewError, setPreviewError] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    const previewType = useMemo(
        () => detectPreviewType(url, mimeType),
        [url, mimeType],
    );
    const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

    useEffect(() => {
        setPreviewError(false);
        setLoading(true);
    }, [url]);

    if (!url) {
        return (
            <EmptyState
                icon={LuFile}
                title="No document attached"
                subtitle="This issuance doesn't have a linked document yet."
            />
        );
    }

    if (previewError || previewType === "unsupported") {
        return (
            <div className="doc-preview doc-preview--fallback">
                <div className="doc-preview--fallback__icon-wrap">
                    <LuFileText size={36} />
                </div>
                <p className="doc-preview--fallback__heading">
                    Preview not available
                </p>
                <p className="doc-preview--fallback__sub">
                    This file type can't be previewed inline.
                </p>
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
            {/* Toolbar with expand & external-link controls */}
            <div className="doc-preview__toolbar">
                <span className="doc-preview__toolbar-label">
                    <LuEye size={14} />
                    Document Preview
                </span>
                <div className="doc-preview__toolbar-actions">
                    <button
                        type="button"
                        className="doc-preview__toolbar-btn"
                        onClick={() => setExpanded(!expanded)}
                        aria-label={
                            expanded ? "Collapse preview" : "Expand preview"
                        }
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
                        aria-label="Open in new tab"
                        title="Open in new tab">
                        <LuExternalLink size={16} />
                    </a>
                </div>
            </div>

            <div className="doc-preview__content">
                {/* Inline shimmer while iframe / image loads */}
                {loading && (
                    <div
                        className="doc-preview__loading"
                        aria-label="Loading preview">
                        <div className="doc-preview__loading-spinner" />
                        <span>Loading preview…</span>
                    </div>
                )}
                {previewType === "image" ?
                    <img
                        src={url}
                        alt={title || "Document preview"}
                        className="doc-preview__image"
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setPreviewError(true);
                            setLoading(false);
                        }}
                    />
                :   <iframe
                        src={embedUrl}
                        title={title || "Document preview"}
                        className="doc-preview__iframe"
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setPreviewError(true);
                            setLoading(false);
                        }}
                        allow="autoplay"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                }
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   AttachmentItem — single file row with icon,
   metadata, and preview / download actions
   ═══════════════════════════════════════════════ */

const AttachmentItem = ({ attachment, onPreview }) => {
    const { filename, url, fileType, mimeType, size } = attachment;
    const displayName = filename || "Untitled File";
    const IconComponent = getFileIcon(fileType, mimeType);
    const canPreview = detectPreviewType(url, mimeType) !== "unsupported";

    return (
        <div className="attachment-item" tabIndex={0}>
            <span className="attachment-item__icon">
                <IconComponent size={20} />
            </span>
            <div className="attachment-item__info">
                <span className="attachment-item__name">{displayName}</span>
                <span className="attachment-item__meta">
                    {fileType && (
                        <span className="attachment-item__type">
                            {fileType.toUpperCase()}
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
                        aria-label={`Preview ${displayName}`}
                        title="Preview file">
                        <LuEye size={14} />
                        <span>Preview</span>
                    </button>
                )}
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-item__btn"
                        aria-label={`Open ${displayName} in new tab`}
                        title="Open in new tab">
                        <LuDownload size={14} />
                    </a>
                )}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   MetadataCard — labelled key/value row in the
   Details tab with an optional leading icon
   ═══════════════════════════════════════════════ */

const MetadataCard = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="detail-row">
            {Icon && (
                <span className="detail-row__icon">
                    <Icon size={15} />
                </span>
            )}
            <span className="detail-row__label">{label}</span>
            <span className="detail-row__value">{value}</span>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   Tabs configuration
   ═══════════════════════════════════════════════ */

const TABS = [
    { id: "preview", label: "Preview", icon: LuFile },
    { id: "details", label: "Details", icon: LuInfo },
    { id: "attachments", label: "Files", icon: LuPaperclip },
    { id: "comments", label: "Comments", icon: LuMessageSquare },
    { id: "history", label: "History", icon: LuHistory },
];

/* ═══════════════════════════════════════════════
   IssuanceViewer — main slide-over panel
   ═══════════════════════════════════════════════ */

const IssuanceViewer = ({
    issuance,
    isOpen,
    onClose,
    comments = [],
    commentsLoading = false,
    statusHistory = [],
    versionHistory = [],
    showWorkflowInfo = false,
    onAddComment,
    onEditComment,
    onDeleteComment,
    currentUser,
    isAuthenticated = false,
}) => {
    const [activeTab, setActiveTab] = useState("preview");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewMime, setPreviewMime] = useState(null);

    // Reset tab & preview whenever the issuance changes
    useEffect(() => {
        if (issuance) {
            setActiveTab("preview");
            setPreviewUrl(issuance.documentUrl || null);
            setPreviewMime(null);
        }
    }, [issuance]);

    // Lock body scroll while the panel is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleAttachmentPreview = useCallback((att) => {
        setPreviewUrl(att.url);
        setPreviewMime(att.mimeType || null);
        setActiveTab("preview");
    }, []);

    const handleResetPreview = useCallback(() => {
        setPreviewUrl(issuance?.documentUrl || null);
        setPreviewMime(null);
    }, [issuance?.documentUrl]);

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

    /* Determine which tabs are visible based on available data */
    const visibleTabs = TABS.filter((t) => {
        if (
            t.id === "attachments" &&
            (!attachments || attachments.length === 0)
        )
            return false;
        if (t.id === "history" && !showWorkflowInfo) return false;
        return true;
    });

    return (
        <>
            {/* ── Backdrop overlay ── */}
            <div
                className={`viewer-backdrop ${isOpen ? "viewer-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* ── Slide-over panel ── */}
            <div
                className={`viewer-panel ${isOpen ? "viewer-panel--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="viewer-title">
                {/* ═══════ HEADER ═══════
                    Strong visual hierarchy — type badge, status/priority,
                    large title, and compact meta row for quick scanning. */}
                <header className="viewer-header">
                    <div className="viewer-header__top-row">
                        {/* Type pill — always visible, left-aligned */}
                        <span className="viewer-header__type-badge">
                            {type || "Document"}
                        </span>
                        <button
                            type="button"
                            className="viewer-header__close"
                            onClick={onClose}
                            aria-label="Close viewer">
                            <LuX size={18} />
                        </button>
                    </div>

                    <h2 id="viewer-title" className="viewer-header__title">
                        {title || "Untitled Issuance"}
                    </h2>

                    {description && (
                        <p className="viewer-header__desc">{description}</p>
                    )}

                    {/* Compact meta chips — department · date · author */}
                    <div className="viewer-header__meta-row">
                        {department && (
                            <span className="viewer-header__meta-chip">
                                <LuBuilding2 size={13} />
                                {department}
                            </span>
                        )}
                        {issuedDate && (
                            <span className="viewer-header__meta-chip">
                                <LuCalendar size={13} />
                                {formatDate(issuedDate)}
                            </span>
                        )}
                        {issuedBy && (
                            <span className="viewer-header__meta-chip">
                                <LuUser size={13} />
                                {issuedBy}
                            </span>
                        )}
                    </div>
                </header>

                {/* ═══════ TAB BAR ═══════ */}
                <nav
                    className="viewer-tabs"
                    role="tablist"
                    aria-label="Issuance sections">
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
                                aria-controls={`panel-${tab.id}`}
                                className={`viewer-tabs__btn ${activeTab === tab.id ? "viewer-tabs__btn--active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}>
                                <Icon size={16} />
                                <span className="viewer-tabs__label">
                                    {tab.label}
                                </span>
                                {count != null && count > 0 && (
                                    <span className="viewer-tabs__count">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ═══════ TAB CONTENT ═══════ */}
                <div className="viewer-body">
                    {/* ── Preview tab ── */}
                    {activeTab === "preview" && (
                        <div
                            className="viewer-tab-panel"
                            id="panel-preview"
                            role="tabpanel">
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

                    {/* ── Details tab ── */}
                    {activeTab === "details" && (
                        <div
                            className="viewer-tab-panel"
                            id="panel-details"
                            role="tabpanel">
                            <h3 className="viewer-section-title">
                                Issuance Details
                            </h3>
                            <div className="detail-grid">
                                <MetadataCard
                                    icon={LuTag}
                                    label="Type"
                                    value={type}
                                />
                                <MetadataCard
                                    icon={LuFolderOpen}
                                    label="Category"
                                    value={category}
                                />
                                <MetadataCard
                                    icon={LuBuilding2}
                                    label="Department"
                                    value={department}
                                />
                                <MetadataCard
                                    icon={LuCalendar}
                                    label="Date Issued"
                                    value={
                                        issuedDate ?
                                            formatDate(issuedDate)
                                        :   null
                                    }
                                />
                                <MetadataCard
                                    icon={LuUser}
                                    label="Issued By"
                                    value={issuedBy}
                                />
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

                    {/* ── Attachments tab ── */}
                    {activeTab === "attachments" && (
                        <div
                            className="viewer-tab-panel"
                            id="panel-attachments"
                            role="tabpanel">
                            <h3 className="viewer-section-title">
                                Attached Files
                                <span className="viewer-section-title__count">
                                    {attachments.length}
                                </span>
                            </h3>
                            {attachments.length === 0 ?
                                <EmptyState
                                    icon={LuPaperclip}
                                    title="No attachments uploaded"
                                    subtitle="Files attached to this issuance will appear here."
                                />
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

                    {/* ── Comments tab ── */}
                    {activeTab === "comments" && (
                        <div
                            className="viewer-tab-panel"
                            id="panel-comments"
                            role="tabpanel">
                            <CommentList
                                comments={comments}
                                loading={commentsLoading}
                                onAddComment={onAddComment}
                                onEditComment={onEditComment}
                                onDeleteComment={onDeleteComment}
                                currentUser={currentUser}
                                isAuthenticated={isAuthenticated}
                            />
                        </div>
                    )}

                    {/* ── History tab ── */}
                    {activeTab === "history" && (
                        <div
                            className="viewer-tab-panel"
                            id="panel-history"
                            role="tabpanel">
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

export default IssuanceViewer;
