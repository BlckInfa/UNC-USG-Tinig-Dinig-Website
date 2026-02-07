import { useState, useEffect, useCallback } from "react";
import {
    LuBarChart3,
    LuFileText,
    LuSheet,
    LuAlertTriangle,
} from "react-icons/lu";
import { Button, Card, Spinner } from "../../../components";
import { reportService } from "../services";
import "./AdminReports.css";

const REPORT_TYPES = [
    {
        value: "summary",
        label: "Summary Report",
        description: "Overview of all issuances with counts and statuses",
    },
    {
        value: "department",
        label: "Department Report",
        description: "Issuances breakdown by department",
    },
    {
        value: "trends",
        label: "Trends Report",
        description: "Issuance trends over time",
    },
    {
        value: "status",
        label: "Status Report",
        description: "Issuances grouped by current status",
    },
];

const EXPORT_FORMATS = [
    { value: "csv", label: "CSV", icon: LuBarChart3 },
    { value: "pdf", label: "PDF", icon: LuFileText },
    { value: "xlsx", label: "Excel", icon: LuSheet },
];

/**
 * Admin Reports View
 * Select report type, apply filters, preview data, trigger exports
 */
const AdminReports = () => {
    const [reportType, setReportType] = useState("summary");
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        department: "",
        status: "",
    });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);

    const updateFilter = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const generateReport = useCallback(async () => {
        setLoading(true);
        setError(null);
        setReportData(null);
        try {
            let data;
            const params = { ...filters };

            switch (reportType) {
                case "summary":
                    data = await reportService.getSummary(params);
                    break;
                case "department":
                    data = await reportService.getDepartments(params);
                    break;
                case "trends":
                    data = await reportService.getTrends(params);
                    break;
                default:
                    data = await reportService.getSummary(params);
            }
            setReportData(data?.data || data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to generate report",
            );
        } finally {
            setLoading(false);
        }
    }, [reportType, filters]);

    const handleExport = async (format) => {
        setExporting(true);
        try {
            // UI-only: triggers export action for backend to handle
            await reportService.export(reportType, { format, ...filters });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    `Failed to export as ${format.toUpperCase()}`,
            );
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="admin-reports">
            <div className="admin-reports__header">
                <h1 className="admin-reports__title">Reports</h1>
                <p className="admin-reports__subtitle">
                    Generate and export issuance reports
                </p>
            </div>

            <div className="admin-reports__layout">
                {/* Sidebar: Report Type + Filters */}
                <aside className="admin-reports__sidebar">
                    <Card className="admin-reports__config-card">
                        <h3 className="admin-reports__section-title">
                            Report Type
                        </h3>
                        <div className="admin-reports__type-list">
                            {REPORT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    className={`admin-reports__type-btn ${reportType === type.value ? "admin-reports__type-btn--active" : ""}`}
                                    onClick={() => setReportType(type.value)}>
                                    <span className="admin-reports__type-label">
                                        {type.label}
                                    </span>
                                    <span className="admin-reports__type-desc">
                                        {type.description}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <h3 className="admin-reports__section-title">
                            Filters
                        </h3>
                        <div className="admin-reports__filter-fields">
                            <div className="admin-reports__field">
                                <label className="admin-reports__label">
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    className="admin-reports__input"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        updateFilter("dateFrom", e.target.value)
                                    }
                                />
                            </div>
                            <div className="admin-reports__field">
                                <label className="admin-reports__label">
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    className="admin-reports__input"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        updateFilter("dateTo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="admin-reports__field">
                                <label className="admin-reports__label">
                                    Department
                                </label>
                                <select
                                    className="admin-reports__input"
                                    value={filters.department}
                                    onChange={(e) =>
                                        updateFilter(
                                            "department",
                                            e.target.value,
                                        )
                                    }>
                                    <option value="">All</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Legislative">
                                        Legislative
                                    </option>
                                    <option value="Finance Committee">
                                        Finance Committee
                                    </option>
                                    <option value="COMELEC">COMELEC</option>
                                    <option value="Audit Committee">
                                        Audit Committee
                                    </option>
                                    <option value="Academic Affairs">
                                        Academic Affairs
                                    </option>
                                    <option value="Student Services">
                                        Student Services
                                    </option>
                                    <option value="External Affairs">
                                        External Affairs
                                    </option>
                                </select>
                            </div>
                            <div className="admin-reports__field">
                                <label className="admin-reports__label">
                                    Status
                                </label>
                                <select
                                    className="admin-reports__input"
                                    value={filters.status}
                                    onChange={(e) =>
                                        updateFilter("status", e.target.value)
                                    }>
                                    <option value="">All</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="UNDER_REVIEW">
                                        Under Review
                                    </option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            onClick={generateReport}
                            loading={loading}
                            className="admin-reports__generate-btn">
                            Generate Report
                        </Button>
                    </Card>
                </aside>

                {/* Main: Report Preview */}
                <div className="admin-reports__main">
                    {/* Export Bar */}
                    {reportData && (
                        <div className="admin-reports__export-bar">
                            <span className="admin-reports__export-label">
                                Export as:
                            </span>
                            <div className="admin-reports__export-buttons">
                                {EXPORT_FORMATS.map((fmt) => (
                                    <Button
                                        key={fmt.value}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport(fmt.value)}
                                        disabled={exporting}>
                                        <fmt.icon size={16} /> {fmt.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Report Content */}
                    <Card className="admin-reports__preview-card">
                        {loading ?
                            <div className="admin-reports__loading">
                                <Spinner size="md" />
                                <p>Generating report...</p>
                            </div>
                        : error ?
                            <div className="admin-reports__error">
                                <LuAlertTriangle
                                    size={40}
                                    className="admin-reports__error-icon"
                                />
                                <p>{error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setError(null)}>
                                    Dismiss
                                </Button>
                            </div>
                        : !reportData ?
                            <div className="admin-reports__placeholder">
                                <LuBarChart3
                                    size={48}
                                    className="admin-reports__placeholder-icon"
                                />
                                <h3>Select a report type and generate</h3>
                                <p>
                                    Choose a report type from the sidebar, set
                                    your filters, and click "Generate Report" to
                                    preview the data.
                                </p>
                            </div>
                        :   <ReportPreview
                                data={reportData}
                                type={reportType}
                            />
                        }
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * Report Preview — renders report data as a table
 * Adapts columns based on report type
 */
const ReportPreview = ({ data, type }) => {
    // Normalize data to array format
    const items =
        Array.isArray(data) ? data : (
            data?.items || data?.rows || data?.results || []
        );

    if (items.length === 0) {
        return (
            <div className="admin-reports__no-data">
                <p>No data available for the selected filters.</p>
            </div>
        );
    }

    // Derive columns from first item
    const columns = Object.keys(items[0]).filter(
        (key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key),
    );

    const formatCell = (value) => {
        if (value === null || value === undefined) return "—";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="admin-reports__table-wrapper">
            <div className="admin-reports__table-header">
                <h3 className="admin-reports__table-title">
                    {REPORT_TYPES.find((t) => t.value === type)?.label ||
                        "Report"}{" "}
                    Preview
                </h3>
                <span className="admin-reports__table-count">
                    {items.length} record{items.length !== 1 ? "s" : ""}
                </span>
            </div>
            <div className="admin-reports__table-scroll">
                <table className="admin-reports__table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>
                                    {col
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (c) => c.toUpperCase())}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                {columns.map((col) => (
                                    <td key={col}>{formatCell(item[col])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReports;
