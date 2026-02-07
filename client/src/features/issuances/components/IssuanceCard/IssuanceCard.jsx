import { Card } from "../../../../components";
import { formatDate } from "../../../../utils/dateFormatter";
import PriorityBadge from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import "./IssuanceCard.css";

/**
 * Default placeholder image for issuances without thumbnails
 */
const DEFAULT_THUMBNAIL = null;

/**
 * Issuance Card Component
 * Displays a single issuance item with preview image, title, type, category, date,
 * issuer, department, priority, and status - styled like UNC news cards
 * Gracefully handles missing data with placeholders
 */
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
        thumbnailUrl,
        previewImage,
    } = issuance;

    const imageUrl = thumbnailUrl || previewImage || DEFAULT_THUMBNAIL;

    return (
        <Card className="issuance-card" hoverable onClick={onClick}>
            {/* Preview Image */}
            {showPreview && (
                <div className="issuance-card-preview">
                    {imageUrl ?
                        <img
                            src={imageUrl}
                            alt={title || "Issuance preview"}
                            className="issuance-card-preview__image"
                            loading="lazy"
                        />
                    :   <div className="issuance-card-preview__placeholder">
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
                    }
                </div>
            )}

            <div className="issuance-card-content">
                {/* Title first */}
                <h4 className="issuance-title">
                    {title || "Untitled Issuance"}
                </h4>

                {/* Tags: Type & Category */}
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

                {/* Meta: Department, Date, Issuer */}
                <div className="issuance-meta">
                    <span className="issuance-department">
                        {department || "UNC"}
                    </span>
                    <span className="issuance-separator">•</span>
                    <span className="issuance-date">
                        {issuedDate ? formatDate(issuedDate) : "No date"}
                    </span>
                    {issuedBy && (
                        <>
                            <span className="issuance-separator">•</span>
                            <span className="issuance-issuer">{issuedBy}</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default IssuanceCard;
