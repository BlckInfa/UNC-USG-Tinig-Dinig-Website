import { useState, useEffect, useCallback } from "react";
import {
    LuPlus,
    LuClipboardList,
    LuPencil,
    LuTrash2,
    LuChevronLeft,
    LuChevronRight,
} from "react-icons/lu";
import { Button, Card, Spinner } from "../../../components";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import AdminIssuanceFilters from "./AdminIssuanceFilters";
import AdminIssuanceForm from "./AdminIssuanceForm";
import AdminIssuanceEditor from "./AdminIssuanceEditor";
import { issuanceService } from "../services";
import "./AdminIssuanceList.css";

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
 * Admin Issuance List Page
 * Main admin interface for managing issuances
 * Handles list, create, and edit views
 */
const AdminIssuanceList = () => {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const PAGE_SIZE = 10;

    const fetchIssuances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [sortField, sortOrder] = (
                filters.sortBy || "createdAt:desc"
            ).split(":");
            const params = {
                page,
                limit: PAGE_SIZE,
                sortBy: sortField,
                sortOrder: sortOrder,
            };

            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.department) params.department = filters.department;
            if (filters.priority) params.priority = filters.priority;
            if (filters.dateFrom) params.dateFrom = filters.dateFrom;
            if (filters.dateTo) params.dateTo = filters.dateTo;

            const response = await issuanceService.getAllAdmin(params);

            if (Array.isArray(response)) {
                setIssuances(response);
                setTotalCount(response.length);
                setTotalPages(1);
            } else {
                setIssuances(response?.issuances || []);
                setTotalCount(response?.pagination?.total || 0);
                setTotalPages(
                    response?.pagination?.totalPages ||
                        Math.ceil(
                            (response?.pagination?.total || 0) / PAGE_SIZE,
                        ) ||
                        1,
                );
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load issuances");
            setIssuances([]);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        if (view === "list") {
            fetchIssuances();
        }
    }, [fetchIssuances, view]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    const handleCreate = async (formData) => {
        try {
            await issuanceService.create(formData);
            setView("list");
        } catch (err) {
            throw err; // Let form handle the error
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setView("edit");
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this issuance? This action cannot be undone.",
            )
        ) {
            return;
        }
        try {
            await issuanceService.delete(id);
            fetchIssuances();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete issuance",
            );
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Create View
    if (view === "create") {
        return (
            <div className="admin-list-page">
                <AdminIssuanceForm
                    onSubmit={handleCreate}
                    onCancel={() => setView("list")}
                />
            </div>
        );
    }

    // Edit View
    if (view === "edit" && editingId) {
        return (
            <div className="admin-list-page">
                <AdminIssuanceEditor
                    issuanceId={editingId}
                    onBack={() => {
                        setEditingId(null);
                        setView("list");
                    }}
                    onSaved={fetchIssuances}
                />
            </div>
        );
    }

    // List View
    return (
        <div className="admin-list-page">
            {/* Header */}
            <div className="admin-list-page__header">
                <div>
                    <h1 className="admin-list-page__title">
                        Issuances Management
                    </h1>
                    <p className="admin-list-page__subtitle">
                        {totalCount} total issuance{totalCount !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button variant="primary" onClick={() => setView("create")}>
                    <LuPlus size={16} /> New Issuance
                </Button>
            </div>

            {/* Filters */}
            <AdminIssuanceFilters
                filters={filters}
                onChange={setFilters}
                className="admin-list-page__filters"
            />

            {/* Error */}
            {error && (
                <div className="admin-list-page__error">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Table */}
            <Card className="admin-list-page__table-card">
                {loading ?
                    <div className="admin-list-page__loading">
                        <Spinner size="md" />
                        <p>Loading issuances...</p>
                    </div>
                : issuances.length === 0 ?
                    <div className="admin-list-page__empty">
                        <LuClipboardList
                            size={48}
                            className="admin-list-page__empty-icon"
                        />
                        <h3>No issuances found</h3>
                        <p>
                            {(
                                filters.search ||
                                filters.status ||
                                filters.department ||
                                filters.priority
                            ) ?
                                "Try adjusting your filters."
                            :   "Create your first issuance to get started."}
                        </p>
                        {!filters.search && !filters.status && (
                            <Button
                                variant="primary"
                                onClick={() => setView("create")}>
                                Create Issuance
                            </Button>
                        )}
                    </div>
                :   <>
                        <div className="admin-list-page__table-wrapper">
                            <table className="admin-list-page__table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issuances.map((issuance) => (
                                        <tr
                                            key={issuance._id}
                                            className="admin-list-page__row">
                                            <td className="admin-list-page__cell-title">
                                                <button
                                                    className="admin-list-page__title-link"
                                                    onClick={() =>
                                                        handleEdit(issuance._id)
                                                    }>
                                                    {issuance.title ||
                                                        "Untitled"}
                                                </button>
                                                {issuance.tags?.length > 0 && (
                                                    <div className="admin-list-page__tags">
                                                        {issuance.tags
                                                            .slice(0, 3)
                                                            .map((tag, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="admin-list-page__tag">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        {issuance.tags.length >
                                                            3 && (
                                                            <span className="admin-list-page__tag-more">
                                                                +
                                                                {issuance.tags
                                                                    .length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="admin-list-page__category">
                                                    {issuance.category ||
                                                        issuance.type ||
                                                        "—"}
                                                </span>
                                            </td>
                                            <td className="admin-list-page__cell-dept">
                                                {issuance.department || "—"}
                                            </td>
                                            <td>
                                                <StatusBadge
                                                    status={issuance.status}
                                                />
                                            </td>
                                            <td>
                                                <PriorityBadge
                                                    priority={issuance.priority}
                                                />
                                            </td>
                                            <td className="admin-list-page__cell-date">
                                                {formatDate(issuance.createdAt)}
                                            </td>
                                            <td>
                                                <div className="admin-list-page__actions">
                                                    <button
                                                        className="admin-list-page__action-btn admin-list-page__action-btn--edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                issuance._id,
                                                            )
                                                        }
                                                        title="Edit">
                                                        <LuPencil size={16} />
                                                    </button>
                                                    <button
                                                        className="admin-list-page__action-btn admin-list-page__action-btn--delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                issuance._id,
                                                            )
                                                        }
                                                        title="Delete">
                                                        <LuTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="admin-list-page__pagination">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }>
                                    <LuChevronLeft size={16} /> Previous
                                </Button>
                                <span className="admin-list-page__page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }>
                                    Next <LuChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </>
                }
            </Card>
        </div>
    );
};

export default AdminIssuanceList;
