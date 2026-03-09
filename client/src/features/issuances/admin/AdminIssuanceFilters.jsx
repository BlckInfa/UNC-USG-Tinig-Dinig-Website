import { useState, useCallback } from "react";
import { LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { Button } from "../../../components";
import "./AdminIssuanceFilters.css";

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PUBLISHED", label: "Published" },
];

const DEPARTMENT_OPTIONS = [
    { value: "", label: "All Departments" },
    { value: "Executive", label: "Executive" },
    { value: "Legislative", label: "Legislative" },
    { value: "Finance Committee", label: "Finance Committee" },
    { value: "COMELEC", label: "COMELEC" },
    { value: "Audit Committee", label: "Audit Committee" },
    { value: "Academic Affairs", label: "Academic Affairs" },
    { value: "Student Services", label: "Student Services" },
    { value: "External Affairs", label: "External Affairs" },
];

const PRIORITY_OPTIONS = [
    { value: "", label: "All Priorities" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "updatedAt:desc", label: "Recently Updated" },
    { value: "priority:desc", label: "Highest Priority" },
    { value: "priority:asc", label: "Lowest Priority" },
    { value: "title:asc", label: "Title (A-Z)" },
];

const INITIAL_FILTERS = {
    search: "",
    status: "",
    department: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt:desc",
};

/**
 * Admin Issuance Filters
 * Full-featured filter bar for the admin issuance list
 */
const AdminIssuanceFilters = ({
    filters: externalFilters,
    onChange,
    className = "",
}) => {
    const [expanded, setExpanded] = useState(false);
    const filters = externalFilters || INITIAL_FILTERS;

    const updateFilter = useCallback(
        (field, value) => {
            onChange?.({ ...filters, [field]: value });
        },
        [filters, onChange],
    );

    const clearAll = useCallback(() => {
        onChange?.({ ...INITIAL_FILTERS });
    }, [onChange]);

    const activeCount = [
        filters.status,
        filters.department,
        filters.priority,
        filters.dateFrom,
        filters.dateTo,
    ].filter(Boolean).length;

    return (
        <div className={`admin-filters ${className}`}>
            {/* Search + Toggle Row */}
            <div className="admin-filters__top">
                <div className="admin-filters__search">
                    <LuSearch
                        size={16}
                        className="admin-filters__search-icon"
                    />
                    <input
                        type="text"
                        className="admin-filters__search-input"
                        placeholder="Search by title or keyword..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                    />
                    {filters.search && (
                        <button
                            className="admin-filters__search-clear"
                            onClick={() => updateFilter("search", "")}>
                            <LuX size={14} />
                        </button>
                    )}
                </div>

                <div className="admin-filters__top-actions">
                    <select
                        className="admin-filters__sort"
                        value={filters.sortBy}
                        onChange={(e) =>
                            updateFilter("sortBy", e.target.value)
                        }>
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        className={`admin-filters__toggle ${expanded ? "admin-filters__toggle--active" : ""}`}
                        onClick={() => setExpanded(!expanded)}>
                        <LuSlidersHorizontal size={16} />
                        Filters
                        {activeCount > 0 && (
                            <span className="admin-filters__count">
                                {activeCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {expanded && (
                <div className="admin-filters__panel">
                    <div className="admin-filters__grid">
                        <div className="admin-filters__field">
                            <label className="admin-filters__label">
                                Status
                            </label>
                            <select
                                className="admin-filters__select"
                                value={filters.status}
                                onChange={(e) =>
                                    updateFilter("status", e.target.value)
                                }>
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-filters__field">
                            <label className="admin-filters__label">
                                Department
                            </label>
                            <select
                                className="admin-filters__select"
                                value={filters.department}
                                onChange={(e) =>
                                    updateFilter("department", e.target.value)
                                }>
                                {DEPARTMENT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-filters__field">
                            <label className="admin-filters__label">
                                Priority
                            </label>
                            <select
                                className="admin-filters__select"
                                value={filters.priority}
                                onChange={(e) =>
                                    updateFilter("priority", e.target.value)
                                }>
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-filters__field">
                            <label className="admin-filters__label">
                                Date Range
                            </label>
                            <div className="admin-filters__date-range">
                                <input
                                    type="date"
                                    className="admin-filters__date"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        updateFilter("dateFrom", e.target.value)
                                    }
                                    placeholder="From"
                                />
                                <span className="admin-filters__date-sep">
                                    —
                                </span>
                                <input
                                    type="date"
                                    className="admin-filters__date"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        updateFilter("dateTo", e.target.value)
                                    }
                                    placeholder="To"
                                />
                            </div>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <div className="admin-filters__footer">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}>
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminIssuanceFilters;
