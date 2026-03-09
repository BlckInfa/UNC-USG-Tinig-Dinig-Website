import "./PriorityBadge.css";

/**
 * Priority Badge Component
 * Displays priority level with color-coded indicator
 * Uses UNC design system colors
 */
const PriorityBadge = ({ priority, showIndicator = true }) => {
    const priorityLower = (priority || "MEDIUM").toLowerCase();

    return (
        <span className={`priority-badge priority-badge--${priorityLower}`}>
            {showIndicator && <span className="priority-badge__indicator" />}
            {priority || "MEDIUM"}
        </span>
    );
};

export default PriorityBadge;
