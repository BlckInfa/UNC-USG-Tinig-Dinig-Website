import { Spinner } from "../../../../components";
import IssuanceCard from "../IssuanceCard";
import "./IssuanceList.css";

/**
 * IssuanceList Component
 * Reusable list component for displaying issuances
 * Handles loading, empty, and error states gracefully
 */
const IssuanceList = ({
    issuances = [],
    loading = false,
    error = null,
    onIssuanceClick,
    showWorkflowInfo = false,
    showPreview = true,
    emptyMessage = "No issuances found.",
    gridView = true,
}) => {
    // Loading state
    if (loading) {
        return (
            <div className="issuance-list__loading">
                <Spinner size="lg" />
                <span className="issuance-list__loading-text">
                    Loading issuances...
                </span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="issuance-list__error">
                <div className="issuance-list__error-icon">!</div>
                <p className="issuance-list__error-message">{error}</p>
            </div>
        );
    }

    // Empty state
    if (!issuances || issuances.length === 0) {
        return (
            <div className="issuance-list__empty">
                <div className="issuance-list__empty-icon">
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
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                </div>
                <p className="issuance-list__empty-message">{emptyMessage}</p>
            </div>
        );
    }

    // List view
    return (
        <div
            className={`issuance-list ${gridView ? "issuance-list--grid" : ""}`}>
            {issuances.map((issuance) => (
                <IssuanceCard
                    key={issuance._id || issuance.id}
                    issuance={issuance}
                    onClick={() => onIssuanceClick?.(issuance)}
                    showWorkflowInfo={showWorkflowInfo}
                    showPreview={showPreview}
                />
            ))}
        </div>
    );
};

export default IssuanceList;
