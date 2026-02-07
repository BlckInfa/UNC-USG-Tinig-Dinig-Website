import { useState, useEffect, useCallback } from "react";
import {
    IssuanceFilters,
    IssuanceList,
    IssuanceViewer,
} from "../../components";
import {
    issuanceService,
    commentService,
} from "../../services/issuance.service";
import { useAuth } from "../../../../hooks/useAuth";
import "./IssuanceListPage.css";

/**
 * Department options for filter
 */
const DEPARTMENTS = [
    { value: "USG Executive Department", label: "Executive Department" },
    { value: "USG Legislative Assembly", label: "Legislative Assembly" },
    { value: "USG Finance Committee", label: "Finance Committee" },
    { value: "USG COMELEC", label: "COMELEC" },
];

/**
 * Mock status history for demo purposes
 */
const generateMockStatusHistory = (issuanceId) => [
    {
        _id: `status-1-${issuanceId}`,
        fromStatus: "Draft",
        toStatus: "Under Review",
        changedBy: { name: "Admin User" },
        changedAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        notes: "Submitted for initial review",
    },
    {
        _id: `status-2-${issuanceId}`,
        fromStatus: "Under Review",
        toStatus: "Published",
        changedBy: { name: "USG President" },
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Approved and published",
    },
];

/**
 * Mock version history for demo purposes
 */
const generateMockVersionHistory = (issuanceId) => [
    {
        _id: `version-1-${issuanceId}`,
        version: "1.0",
        createdAt: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdBy: { name: "Document Author" },
        changes: "Initial draft created",
    },
    {
        _id: `version-2-${issuanceId}`,
        version: "1.1",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { name: "Editor" },
        changes: "Minor formatting corrections and typo fixes",
    },
];

/**
 * Issuance List Page
 * Displays a filterable list of issuances sorted by newest first
 * Uses IssuanceFilters and IssuanceList components
 */
const IssuanceListPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [selectedIssuance, setSelectedIssuance] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [statusHistory, setStatusHistory] = useState([]);
    const [versionHistory, setVersionHistory] = useState([]);

    useEffect(() => {
        fetchIssuances();
    }, [filters]);

    const fetchIssuances = async () => {
        try {
            setLoading(true);
            setError(null);
            // Build params from active filters
            const params = {};
            if (filters.type) params.type = filters.type;
            if (filters.category) params.category = filters.category;
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.department) params.department = filters.department;

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

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    /**
     * Fetch comments for a given issuance from the API
     */
    const fetchComments = useCallback(async (issuanceId) => {
        setCommentsLoading(true);
        try {
            const data = await issuanceService.getComments(issuanceId, {
                sortOrder: "asc",
            });
            setComments(data.comments || []);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    }, []);

    const handleIssuanceClick = async (issuance) => {
        try {
            const fullIssuance = await issuanceService.getById(issuance._id);
            setSelectedIssuance(fullIssuance);

            // Fetch real comments from the API
            fetchComments(issuance._id);

            // Load mock data for history (these can be wired up later)
            setStatusHistory(generateMockStatusHistory(issuance._id));
            setVersionHistory(generateMockVersionHistory(issuance._id));
            setViewerOpen(true);
        } catch (err) {
            console.error("Error fetching issuance details:", err);
        }
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setSelectedIssuance(null);
        setComments([]);
        setStatusHistory([]);
        setVersionHistory([]);
    };

    const handleAddComment = async (commentText) => {
        if (!selectedIssuance) return;
        try {
            const newComment = await issuanceService.addComment(
                selectedIssuance._id,
                commentText,
            );
            if (newComment) {
                setComments((prev) => [...prev, newComment]);
            }
        } catch (err) {
            console.error("Error adding comment:", err);
            throw err;
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        const updated = await commentService.update(commentId, newContent);
        if (updated) {
            setComments((prev) =>
                prev.map((c) => (c._id === commentId ? updated : c)),
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        await commentService.delete(commentId);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
    };

    return (
        <div className="issuance-list-container">
            <div className="issuance-list-header">
                <h2 className="issuance-list-title">
                    Official Issuances & Reports
                </h2>
                <IssuanceFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    showCategoryFilter
                    showDepartmentFilter
                    departments={DEPARTMENTS}
                    loading={loading}
                />
            </div>

            <IssuanceList
                issuances={issuances}
                loading={loading}
                error={error}
                onIssuanceClick={handleIssuanceClick}
                showPreview
                showWorkflowInfo
                gridView
                emptyMessage="No issuances found matching your filters."
            />

            <IssuanceViewer
                issuance={selectedIssuance}
                isOpen={viewerOpen}
                onClose={handleCloseViewer}
                comments={comments}
                commentsLoading={commentsLoading}
                statusHistory={statusHistory}
                versionHistory={versionHistory}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                currentUser={user}
                isAuthenticated={isAuthenticated}
                showWorkflowInfo
            />
        </div>
    );
};

export default IssuanceListPage;
