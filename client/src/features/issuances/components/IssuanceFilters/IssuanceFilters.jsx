import "./IssuanceFilters.css";

/**
 * Filter options for issuance types
 */
const TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "resolution", label: "Resolution" },
    { value: "memorandum", label: "Memorandum" },
    { value: "ordinance", label: "Ordinance" },
    { value: "report", label: "Report" },
];

/**
 * Filter options for issuance statuses
 */
const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PUBLISHED", label: "Published" },
];

/**
 * Filter options for priority levels
 */
const PRIORITY_OPTIONS = [
    { value: "", label: "All Priorities" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

/**
 * Filter options for categories
 */
const CATEGORY_OPTIONS = [
    { value: "", label: "All Categories" },
    { value: "academic", label: "Academic" },
    { value: "administrative", label: "Administrative" },
    { value: "financial", label: "Financial" },
    { value: "general", label: "General" },
];

/**
 * IssuanceFilters Component
 * Provides filter controls for issuance list
 * Uses UNC design system colors
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

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <div className="issuance-filters">
            <div className="issuance-filters__controls">
                {/* Type Filter */}
                <div className="issuance-filters__group">
                    <label
                        htmlFor="filter-type"
                        className="issuance-filters__label">
                        Type
                    </label>
                    <select
                        id="filter-type"
                        className="issuance-filters__select"
                        value={filters.type || ""}
                        onChange={(e) => handleChange("type", e.target.value)}
                        disabled={loading}>
                        {TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                {showCategoryFilter && (
                    <div className="issuance-filters__group">
                        <label
                            htmlFor="filter-category"
                            className="issuance-filters__label">
                            Category
                        </label>
                        <select
                            id="filter-category"
                            className="issuance-filters__select"
                            value={filters.category || ""}
                            onChange={(e) =>
                                handleChange("category", e.target.value)
                            }
                            disabled={loading}>
                            {CATEGORY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Department Filter */}
                {showDepartmentFilter && (
                    <div className="issuance-filters__group">
                        <label
                            htmlFor="filter-department"
                            className="issuance-filters__label">
                            Department
                        </label>
                        <select
                            id="filter-department"
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
                    </div>
                )}

                {/* Status Filter */}
                {showStatusFilter && (
                    <div className="issuance-filters__group">
                        <label
                            htmlFor="filter-status"
                            className="issuance-filters__label">
                            Status
                        </label>
                        <select
                            id="filter-status"
                            className="issuance-filters__select"
                            value={filters.status || ""}
                            onChange={(e) =>
                                handleChange("status", e.target.value)
                            }
                            disabled={loading}>
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Priority Filter */}
                {showPriorityFilter && (
                    <div className="issuance-filters__group">
                        <label
                            htmlFor="filter-priority"
                            className="issuance-filters__label">
                            Priority
                        </label>
                        <select
                            id="filter-priority"
                            className="issuance-filters__select"
                            value={filters.priority || ""}
                            onChange={(e) =>
                                handleChange("priority", e.target.value)
                            }
                            disabled={loading}>
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
                <button
                    type="button"
                    className="issuance-filters__clear"
                    onClick={handleClearAll}
                    disabled={loading}>
                    Clear All
                </button>
            )}
        </div>
    );
};

export default IssuanceFilters;
