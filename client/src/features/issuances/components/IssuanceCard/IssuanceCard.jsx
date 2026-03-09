import { useState, useEffect, useMemo } from "react";
import {
    LuFileText,
    LuSheet,
    LuPresentation,
    LuImage,
    LuFile,
} from "react-icons/lu";
import { Card } from "../../../../components";
import { formatDate } from "../../../../utils/dateFormatter";
import PriorityBadge from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import "./IssuanceCard.css";

/* ── Preview helpers ── */

/**
 * Detect preview type from a URL.
 * Returns "pdf" | "image" | "gdrive" | "none"
 */
const detectPreviewType = (url) => {
    if (!url) return "none";
    const lower = url.toLowerCase();
    if (/\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i.test(lower)) return "image";
    if (/\.pdf(\?|$)/i.test(lower)) return "pdf";
    if (lower.includes("drive.google.com") || lower.includes("docs.google.com"))
        return "gdrive";
    return "none";
};

/**
 * Convert a Google Drive / Docs URL to an embeddable thumbnail or preview URL.
 */
const toGDriveThumbnail = (url) => {
    if (!url) return null;
    // Google Drive file → thumbnail
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch)
        return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w400`;
    // Google Docs/Sheets/Slides → export as PNG thumbnail
    const docsMatch = url.match(
        /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([^/]+)/,
    );
    if (docsMatch) {
        const [, docType, docId] = docsMatch;
        return `https://docs.google.com/${docType}/d/${docId}/export?format=png`;
    }
    return null;
};

/** Icon for a document type */
const TYPE_ICONS = {
    RESOLUTION: LuFileText,
    MEMORANDUM: LuFileText,
    REPORT: LuSheet,
    CIRCULAR: LuPresentation,
};

/**
 * Card preview area – renders a live document preview like Google Drive:
 * - Images: shown directly
 * - Google Drive links: fetched as a thumbnail image
 * - PDFs: rendered in a scaled-down iframe
 * - Fallback: styled placeholder with document type icon
 */
const CardPreview = ({ url, title, type }) => {
    const [imgError, setImgError] = useState(false);
    const [urlValid, setUrlValid] = useState(true);
    const previewType = useMemo(() => detectPreviewType(url), [url]);
    const gdriveThumbnail = useMemo(() => toGDriveThumbnail(url), [url]);

    const IconComponent = TYPE_ICONS[type] || LuFile;

    // Validate URL before rendering iframe previews (skip images & gdrive — they use onError)
    useEffect(() => {
        if (!url || previewType !== "pdf") return;
        setUrlValid(true);
        setImgError(false);
        const controller = new AbortController();
        fetch(url, {
            method: "HEAD",
            mode: "no-cors",
            signal: controller.signal,
        })
            .then((res) => {
                // no-cors returns opaque response (status 0) — if fetch itself succeeds the URL exists
                // For same-origin, we can check res.ok
                if (res.type !== "opaque" && !res.ok) setUrlValid(false);
            })
            .catch(() => setUrlValid(false));
        return () => controller.abort();
    }, [url, previewType]);

    // No URL → show fallback immediately
    if (!url || previewType === "none") {
        return (
            <div className="issuance-card-preview issuance-card-preview--placeholder">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                <span>{type || "Document"}</span>
            </div>
        );
    }

    // Image URL
    if (previewType === "image" && !imgError) {
        return (
            <div className="issuance-card-preview issuance-card-preview--live">
                <img
                    src={url}
                    alt={title || "Document preview"}
                    className="issuance-card-preview__image"
                    loading="lazy"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    // Google Drive thumbnail (falls back via imgError on the <img>)
    if (previewType === "gdrive" && gdriveThumbnail && !imgError) {
        return (
            <div className="issuance-card-preview issuance-card-preview--live">
                <img
                    src={gdriveThumbnail}
                    alt={title || "Document preview"}
                    className="issuance-card-preview__image"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    // PDF – render a scaled-down iframe preview (only if URL was validated)
    if (previewType === "pdf" && urlValid) {
        return (
            <div className="issuance-card-preview issuance-card-preview--pdf">
                <div className="issuance-card-preview__pdf-wrap">
                    <iframe
                        src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={title || "PDF preview"}
                        className="issuance-card-preview__pdf-iframe"
                        loading="lazy"
                        tabIndex={-1}
                    />
                </div>
                {/* Click-through blocker so the card click works */}
                <div className="issuance-card-preview__click-shield" />
            </div>
        );
    }

    // Fallback placeholder
    return (
        <div className="issuance-card-preview issuance-card-preview--placeholder">
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span>{type || "Document"}</span>
        </div>
    );
};

/* ── Main component ── */

const IssuanceCard = ({
    issuance = {},
    onClick,
    showWorkflowInfo = false,
    showPreview = true,
}) => {
    const {
        title,
        type,
        category,
        issuedDate,
        issuedBy,
        priority,
        status,
        department,
        documentUrl,
        thumbnailUrl,
        previewImage,
    } = issuance;

    // Prefer an explicit thumbnail, then fall back to the documentUrl for live preview
    const previewSrc = thumbnailUrl || previewImage || documentUrl;

    return (
        <Card className="issuance-card" hoverable onClick={onClick}>
            {/* Document preview */}
            {showPreview &&
                (thumbnailUrl || previewImage ?
                    <div className="issuance-card-preview issuance-card-preview--live">
                        <img
                            src={thumbnailUrl || previewImage}
                            alt={title || "Issuance preview"}
                            className="issuance-card-preview__image"
                            loading="lazy"
                        />
                    </div>
                :   <CardPreview
                        url={documentUrl}
                        title={title}
                        type={type}
                    />)}

            <div className="issuance-card-content">
                <h4 className="issuance-title">
                    {title || "Untitled Issuance"}
                </h4>

                <div className="issuance-card-badges">
                    {type && (
                        <span className="issuance-type-badge">{type}</span>
                    )}
                    {category && (
                        <span className="issuance-category-badge">
                            {category}
                        </span>
                    )}
                </div>

                <div className="issuance-meta">
                    <span className="issuance-department">
                        {department || "UNC"}
                    </span>
                    <span className="issuance-separator">·</span>
                    <span className="issuance-date">
                        {issuedDate ? formatDate(issuedDate) : "No date"}
                    </span>
                    {issuedBy && (
                        <>
                            <span className="issuance-separator">·</span>
                            <span className="issuance-issuer">{issuedBy}</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default IssuanceCard;
