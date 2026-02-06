import "./StatusBadge.css";

/**
 * Status Badge Component
 * Displays workflow status with color-coded styling
 * Uses UNC design system colors
 */
const STATUS_LABELS = {
    DRAFT: "Draft",
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PUBLISHED: "Published",
};

const StatusBadge = ({ status }) => {
    const statusKey = (status || "DRAFT").toUpperCase().replace("-", "_");
    const statusClass = statusKey.toLowerCase().replace("_", "-");
    const label = STATUS_LABELS[statusKey] || status;

    return (
        <span className={`status-badge status-badge--${statusClass}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
