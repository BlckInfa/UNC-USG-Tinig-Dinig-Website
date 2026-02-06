import { useState, useEffect } from "react";
import { Spinner } from "../../../../components";
import { IssuanceCard, IssuanceViewer } from "../../components";
import { issuanceService } from "../../services/issuance.service";
import "./IssuanceListPage.css";

/**
 * Issuance types for filter dropdown
 */
const ISSUANCE_TYPES = [
    { value: "", label: "All Types" },
    { value: "resolution", label: "Resolution" },
    { value: "memorandum", label: "Memorandum" },
    { value: "ordinance", label: "Ordinance" },
    { value: "report", label: "Report" },
];

/**
 * Issuance List Page
 * Displays a filterable list of issuances sorted by newest first
 */
const IssuanceListPage = () => {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typeFilter, setTypeFilter] = useState("");
    const [selectedIssuance, setSelectedIssuance] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);

    useEffect(() => {
        fetchIssuances();
    }, [typeFilter]);

    const fetchIssuances = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = typeFilter ? { type: typeFilter } : {};
            const data = await issuanceService.getAll(params);
            // Sort by newest first
            const sorted = [...data].sort(
                (a, b) => new Date(b.issuedDate) - new Date(a.issuedDate),
            );
            setIssuances(sorted);
        } catch (err) {
            setError("Failed to load issuances. Please try again later.");
            console.error("Error fetching issuances:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setTypeFilter(e.target.value);
    };

    const handleCardClick = async (issuance) => {
        try {
            const fullIssuance = await issuanceService.getById(issuance._id);
            setSelectedIssuance(fullIssuance);
            setViewerOpen(true);
        } catch (err) {
            console.error("Error fetching issuance details:", err);
        }
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setSelectedIssuance(null);
    };

    return (
        <div className="issuance-list-container">
            <div className="issuance-list-header">
                <h2 className="issuance-list-title">
                    Official Issuances & Reports
                </h2>
                <div className="issuance-filter">
                    <label
                        htmlFor="type-filter"
                        className="issuance-filter-label">
                        Filter by Type:
                    </label>
                    <select
                        id="type-filter"
                        className="issuance-filter-select"
                        value={typeFilter}
                        onChange={handleFilterChange}>
                        {ISSUANCE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="issuance-list-loading">
                    <Spinner size="lg" />
                </div>
            )}

            {error && (
                <div className="issuance-list-error">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && issuances.length === 0 && (
                <div className="issuance-list-empty">
                    <p>No issuances found.</p>
                </div>
            )}

            {!loading && !error && issuances.length > 0 && (
                <div className="issuance-list">
                    {issuances.map((issuance) => (
                        <IssuanceCard
                            key={issuance._id}
                            issuance={issuance}
                            onClick={() => handleCardClick(issuance)}
                        />
                    ))}
                </div>
            )}

            <IssuanceViewer
                issuance={selectedIssuance}
                isOpen={viewerOpen}
                onClose={handleCloseViewer}
            />
        </div>
    );
};

export default IssuanceListPage;
