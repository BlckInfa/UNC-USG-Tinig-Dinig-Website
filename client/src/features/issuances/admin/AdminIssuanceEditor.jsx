import { useState, useEffect, useCallback } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    Pencil,
    History,
    ArrowRight,
} from "lucide-react";
import { Button, Card, Modal } from "../../../components";
import AdminIssuanceForm from "./AdminIssuanceForm";
import AdminIssuanceHistory from "./AdminIssuanceHistory";
import StatusSelect from "../components/StatusSelect";
import { issuanceService } from "../services";
import "./AdminIssuanceEditor.css";

const STATUS_CONFIRM_MESSAGES = {
    DRAFT: "This will revert the issuance to draft status. It will be editable but not visible to reviewers.",
    PENDING:
        "This will submit the issuance for review. Reviewers will be notified.",
    UNDER_REVIEW: "The issuance will be placed under formal review.",
    APPROVED:
        "This will approve the issuance. Once published, it cannot be easily reverted.",
    REJECTED:
        "This will reject the issuance. The author will be notified of the rejection.",
};

/**
 * Admin Issuance Editor
 * Full editing interface with status management, form editing,
 * and version history for a single issuance
 */
const AdminIssuanceEditor = ({ issuanceId, onBack, onSaved }) => {
    const [issuance, setIssuance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'history'

    // Status change modal state
    const [statusModal, setStatusModal] = useState({
        open: false,
        newStatus: null,
    });
    const [statusChanging, setStatusChanging] = useState(false);

    // Unsaved changes warning
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [confirmLeaveModal, setConfirmLeaveModal] = useState(false);

    const fetchIssuance = useCallback(async () => {
        if (!issuanceId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await issuanceService.getById(issuanceId);
            setIssuance(data.data || data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load issuance");
        } finally {
            setLoading(false);
        }
    }, [issuanceId]);

    useEffect(() => {
        fetchIssuance();
    }, [fetchIssuance]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        try {
            await issuanceService.update(issuanceId, formData);
            setHasUnsaved(false);
            await fetchIssuance();
            onSaved?.();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = (newStatus) => {
        setStatusModal({ open: true, newStatus });
    };

    const confirmStatusChange = async () => {
        setStatusChanging(true);
        try {
            await issuanceService.updateStatus(
                issuanceId,
                statusModal.newStatus,
            );
            setStatusModal({ open: false, newStatus: null });
            await fetchIssuance();
            onSaved?.();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update status");
        } finally {
            setStatusChanging(false);
        }
    };

    const handleBack = () => {
        if (hasUnsaved) {
            setConfirmLeaveModal(true);
        } else {
            onBack?.();
        }
    };

    if (loading) {
        return (
            <div className="admin-editor__loading">
                <div className="admin-editor__spinner" />
                <p>Loading issuance...</p>
            </div>
        );
    }

    if (error && !issuance) {
        return (
            <div className="admin-editor__error-state">
                <Card>
                    <div className="admin-editor__error-content">
                        <span className="admin-editor__error-icon">
                            <AlertTriangle size={40} />
                        </span>
                        <h3>Error Loading Issuance</h3>
                        <p>{error}</p>
                        <div className="admin-editor__error-actions">
                            <Button variant="outline" onClick={onBack}>
                                Go Back
                            </Button>
                            <Button variant="primary" onClick={fetchIssuance}>
                                Retry
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!issuance) return null;

    return (
        <div className="admin-editor">
            {/* Header */}
            <div className="admin-editor__header">
                <div className="admin-editor__header-left">
                    <button
                        className="admin-editor__back-btn"
                        onClick={handleBack}>
                        <ArrowLeft size={16} /> Back to List
                    </button>
                    <h2 className="admin-editor__title">
                        {issuance.title || "Untitled Issuance"}
                    </h2>
                    <span className="admin-editor__id">ID: {issuance._id}</span>
                </div>
            </div>

            {error && (
                <div className="admin-editor__alert admin-editor__alert--error">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="admin-editor__alert-close">
                        ×
                    </button>
                </div>
            )}

            {/* Status Bar */}
            <Card className="admin-editor__status-bar">
                <div className="admin-editor__status-row">
                    <div className="admin-editor__status-current">
                        <span className="admin-editor__status-label">
                            Current Status:
                        </span>
                        <StatusSelect
                            value={issuance.status}
                            onChange={handleStatusChange}
                        />
                    </div>
                    <div className="admin-editor__status-meta">
                        <span>
                            Created:{" "}
                            {issuance.createdAt ?
                                new Date(
                                    issuance.createdAt,
                                ).toLocaleDateString()
                            :   "—"}
                        </span>
                        <span>
                            Updated:{" "}
                            {issuance.updatedAt ?
                                new Date(
                                    issuance.updatedAt,
                                ).toLocaleDateString()
                            :   "—"}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="admin-editor__tabs">
                <button
                    className={`admin-editor__tab ${activeTab === "edit" ? "admin-editor__tab--active" : ""}`}
                    onClick={() => setActiveTab("edit")}>
                    <Pencil size={16} /> Edit Details
                </button>
                <button
                    className={`admin-editor__tab ${activeTab === "history" ? "admin-editor__tab--active" : ""}`}
                    onClick={() => setActiveTab("history")}>
                    <History size={16} /> Version History
                </button>
            </div>

            {/* Tab Content */}
            <div className="admin-editor__content">
                {activeTab === "edit" && (
                    <AdminIssuanceForm
                        initialData={issuance}
                        onSubmit={handleSubmit}
                        onCancel={handleBack}
                        loading={saving}
                        mode="edit"
                    />
                )}
                {activeTab === "history" && (
                    <AdminIssuanceHistory issuanceId={issuanceId} />
                )}
            </div>

            {/* Status Change Confirmation Modal */}
            <Modal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ open: false, newStatus: null })}
                title="Confirm Status Change"
                size="sm">
                <div className="admin-editor__status-modal">
                    <div className="admin-editor__status-change-info">
                        <span className="admin-editor__status-from">
                            {issuance.status}
                        </span>
                        <span className="admin-editor__status-arrow">
                            <ArrowRight size={16} />
                        </span>
                        <span className="admin-editor__status-to">
                            {statusModal.newStatus}
                        </span>
                    </div>
                    <p className="admin-editor__status-warning">
                        {STATUS_CONFIRM_MESSAGES[statusModal.newStatus] ||
                            "Are you sure you want to change the status?"}
                    </p>
                    <div className="admin-editor__modal-actions">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setStatusModal({ open: false, newStatus: null })
                            }
                            disabled={statusChanging}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={confirmStatusChange}
                            loading={statusChanging}>
                            Confirm Change
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Unsaved Changes Warning Modal */}
            <Modal
                isOpen={confirmLeaveModal}
                onClose={() => setConfirmLeaveModal(false)}
                title="Unsaved Changes"
                size="sm">
                <div className="admin-editor__leave-modal">
                    <p>
                        You have unsaved changes. Are you sure you want to
                        leave?
                    </p>
                    <div className="admin-editor__modal-actions">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmLeaveModal(false)}>
                            Stay
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setConfirmLeaveModal(false);
                                onBack?.();
                            }}>
                            Leave Without Saving
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminIssuanceEditor;
