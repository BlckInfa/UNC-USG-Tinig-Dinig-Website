import { useState, useEffect, useCallback } from "react";
import { LuHistory, LuClipboardList, LuFileEdit } from "react-icons/lu";
import { Card } from "../../../components";
import StatusBadge from "../components/StatusBadge";
import { issuanceService } from "../services";
import "./AdminIssuanceHistory.css";

/**
 * Admin Issuance History (Read-Only)
 * Shows version history and status transitions
 */
const AdminIssuanceHistory = ({ issuanceId }) => {
    const [activeTab, setActiveTab] = useState("status"); // 'status' | 'changes'
    const [statusHistory, setStatusHistory] = useState([]);
    const [versionHistory, setVersionHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        if (!issuanceId) return;
        setLoading(true);
        setError(null);
        try {
            const [statusRes, versionRes] = await Promise.allSettled([
                issuanceService.getStatusHistory(issuanceId),
                issuanceService.getVersionHistory(issuanceId),
            ]);
            setStatusHistory(
                statusRes.status === "fulfilled" ?
                    statusRes.value?.data || statusRes.value || []
                :   [],
            );
            setVersionHistory(
                versionRes.status === "fulfilled" ?
                    versionRes.value?.data || versionRes.value || []
                :   [],
            );
        } catch (err) {
            setError("Failed to load history data");
        } finally {
            setLoading(false);
        }
    }, [issuanceId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <Card className="admin-history">
                <div className="admin-history__loading">
                    <div className="admin-history__spinner" />
                    <p>Loading history...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="admin-history">
            <div className="admin-history__header">
                <h3 className="admin-history__title">
                    <History size={20} /> History
                </h3>
                <div className="admin-history__tabs">
                    <button
                        className={`admin-history__tab ${activeTab === "status" ? "admin-history__tab--active" : ""}`}
                        onClick={() => setActiveTab("status")}>
                        Status Transitions
                    </button>
                    <button
                        className={`admin-history__tab ${activeTab === "changes" ? "admin-history__tab--active" : ""}`}
                        onClick={() => setActiveTab("changes")}>
                        Field Changes
                    </button>
                </div>
            </div>

            {error && (
                <div className="admin-history__error">
                    <p>{error}</p>
                    <button
                        onClick={fetchHistory}
                        className="admin-history__retry">
                        Retry
                    </button>
                </div>
            )}

            <div className="admin-history__content">
                {activeTab === "status" && (
                    <StatusTimeline
                        entries={statusHistory}
                        formatDate={formatDate}
                    />
                )}
                {activeTab === "changes" && (
                    <ChangesTimeline
                        entries={versionHistory}
                        formatDate={formatDate}
                    />
                )}
            </div>
        </Card>
    );
};

/**
 * Status transition timeline
 */
const StatusTimeline = ({ entries, formatDate }) => {
    if (!entries || entries.length === 0) {
        return (
            <div className="admin-history__empty">
                <ClipboardList
                    size={40}
                    className="admin-history__empty-icon"
                />
                <p>No status transitions recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="admin-history__timeline">
            {entries.map((entry, index) => (
                <div key={entry._id || index} className="admin-history__item">
                    <div className="admin-history__line">
                        <span className="admin-history__dot admin-history__dot--status" />
                        {index < entries.length - 1 && (
                            <span className="admin-history__connector" />
                        )}
                    </div>
                    <div className="admin-history__detail">
                        <div className="admin-history__transition">
                            <StatusBadge
                                status={entry.fromStatus || entry.from}
                            />
                            <span className="admin-history__arrow">→</span>
                            <StatusBadge status={entry.toStatus || entry.to} />
                        </div>
                        {entry.reason && (
                            <p className="admin-history__reason">
                                <strong>Reason:</strong> {entry.reason}
                            </p>
                        )}
                        <div className="admin-history__meta">
                            <span className="admin-history__user">
                                {entry.changedBy?.name ||
                                    entry.editor ||
                                    "System"}
                            </span>
                            <span className="admin-history__time">
                                {formatDate(
                                    entry.changedAt ||
                                        entry.timestamp ||
                                        entry.createdAt,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Field-level change timeline
 */
const ChangesTimeline = ({ entries, formatDate }) => {
    if (!entries || entries.length === 0) {
        return (
            <div className="admin-history__empty">
                <LuFileEdit size={40} className="admin-history__empty-icon" />
                <p>No field changes recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="admin-history__timeline">
            {entries.map((entry, index) => (
                <div key={entry._id || index} className="admin-history__item">
                    <div className="admin-history__line">
                        <span className="admin-history__dot admin-history__dot--change" />
                        {index < entries.length - 1 && (
                            <span className="admin-history__connector" />
                        )}
                    </div>
                    <div className="admin-history__detail">
                        <span className="admin-history__version-label">
                            Version {entry.version || entries.length - index}
                        </span>
                        {entry.changes && entry.changes.length > 0 ?
                            <ul className="admin-history__changes-list">
                                {entry.changes.map((change, ci) => (
                                    <li
                                        key={ci}
                                        className="admin-history__change-item">
                                        <span className="admin-history__field-name">
                                            {change.field}:
                                        </span>
                                        <div className="admin-history__change-values">
                                            <span className="admin-history__old-value">
                                                {String(change.oldValue ?? "—")}
                                            </span>
                                            <span className="admin-history__arrow-sm">
                                                →
                                            </span>
                                            <span className="admin-history__new-value">
                                                {String(change.newValue ?? "—")}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        :   <p className="admin-history__no-changes">
                                Initial version
                            </p>
                        }
                        <div className="admin-history__meta">
                            <span className="admin-history__user">
                                {entry.editedBy?.name ||
                                    entry.editor ||
                                    "System"}
                            </span>
                            <span className="admin-history__time">
                                {formatDate(
                                    entry.editedAt ||
                                        entry.timestamp ||
                                        entry.createdAt,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminIssuanceHistory;
