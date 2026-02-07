import { useState } from "react";
import "./IssuanceFilters.css";

const TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "RESOLUTION", label: "Resolution" },
    { value: "MEMORANDUM", label: "Memorandum" },
    { value: "CIRCULAR", label: "Circular" },
    { value: "REPORT", label: "Report" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PUBLISHED", label: "Published" },
];

const PRIORITY_OPTIONS = [
    { value: "", label: "All Priorities" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

const CATEGORY_OPTIONS = [
    { value: "", label: "All Categories" },
    { value: "Academic", label: "Academic" },
    { value: "Administrative", label: "Administrative" },
    { value: "Financial", label: "Financial" },
    { value: "General", label: "General" },
];

/**
 * IssuanceFilters Component
 * Compact inline filters with mobile-friendly collapsible panel
 */
const IssuanceFilters = ({
    filters = {},
    onFilterChange,
    showStatusFilter = false,
    showPriorityFilter = false,
    showDepartmentFilter = false,
    showCategoryFilter = false,
    departments = [],
    loading = false,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleChange = (field, value) => {
        if (onFilterChange) {
            onFilterChange({ ...filters, [field]: value });
        }
    };

    const handleClearAll = () => {
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="issuance-filters">
            {/* Mobile toggle */}
            <button
                type="button"
                className="issuance-filters__toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M1 3h14M4 8h8M6 13h4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                Filters
                {activeCount > 0 && (
                    <span className="issuance-filters__badge">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Filter controls */}
            <div
                className={`issuance-filters__controls ${mobileOpen ? "issuance-filters__controls--open" : ""}`}>
                <select
                    className="issuance-filters__select"
                    value={filters.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    disabled={loading}>
                    {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {showCategoryFilter && (
                    <select
                        className="issuance-filters__select"
                        value={filters.category || ""}
                        onChange={(e) =>
                            handleChange("category", e.target.value)
                        }
                        disabled={loading}>
                        {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {showDepartmentFilter && (
                    <select
                        className="issuance-filters__select"
                        value={filters.department || ""}
                        onChange={(e) =>
                            handleChange("department", e.target.value)
                        }
                        disabled={loading}>
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option
                                key={dept.value || dept}
                                value={dept.value || dept}>
                                {dept.label || dept}
                            </option>
                        ))}
                    </select>
                )}

                {showStatusFilter && (
                    <select
                        className="issuance-filters__select"
                        value={filters.status || ""}
                        onChange={(e) => handleChange("status", e.target.value)}
                        disabled={loading}>
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {showPriorityFilter && (
                    <select
                        className="issuance-filters__select"
                        value={filters.priority || ""}
                        onChange={(e) =>
                            handleChange("priority", e.target.value)
                        }
                        disabled={loading}>
                        {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {activeCount > 0 && (
                    <button
                        type="button"
                        className="issuance-filters__clear"
                        onClick={handleClearAll}
                        disabled={loading}>
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default IssuanceFilters;
