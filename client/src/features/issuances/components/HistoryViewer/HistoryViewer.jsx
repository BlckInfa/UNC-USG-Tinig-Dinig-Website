import { useState } from "react";
import { formatDate } from "../../../../utils/dateFormatter";
import "./HistoryViewer.css";

/**
 * History Item Component
 * Displays a single history entry
 */
const HistoryItem = ({ item, type }) => {
    const isStatusChange = type === "status";
    const timestamp = item.changedAt || item.createdAt;
    const user = item.changedBy?.name || "System";

    if (isStatusChange) {
        return (
            <div className="history-item history-item--status">
                <div className="history-item__header">
                    <span className="history-item__field">Status Change</span>
                    <span className="history-item__timestamp">
                        {formatDate(timestamp)}
                    </span>
                </div>
                <div className="history-item__change">
                    {item.fromStatus && (
                        <>
                            <span className="history-item__old-value">
                                {item.fromStatus}
                            </span>
                            <span className="history-item__arrow">→</span>
                        </>
                    )}
                    <span className="history-item__new-value">
                        {item.toStatus}
                    </span>
                </div>
                {item.reason && (
                    <p className="history-item__reason">
                        Reason: {item.reason}
                    </p>
                )}
                <p className="history-item__user">by {user}</p>
            </div>
        );
    }

    // Version history item
    return (
        <div className="history-item">
            <div className="history-item__header">
                <span className="history-item__field">{item.field}</span>
                <span className="history-item__timestamp">
                    {formatDate(timestamp)}
                </span>
            </div>
            <div className="history-item__change">
                <span className="history-item__old-value">
                    {String(item.oldValue || "—")}
                </span>
                <span className="history-item__arrow">→</span>
                <span className="history-item__new-value">
                    {String(item.newValue || "—")}
                </span>
            </div>
            <p className="history-item__user">by {user}</p>
        </div>
    );
};

/**
 * History Viewer Component
 * Displays version and status history with tabs
 */
const HistoryViewer = ({
    statusHistory = [],
    versionHistory = [],
    loading = false,
}) => {
    const [activeTab, setActiveTab] = useState("status");

    const currentHistory =
        activeTab === "status" ? statusHistory : versionHistory;
    const sortedHistory = [...currentHistory].sort(
        (a, b) => new Date(b.changedAt || 0) - new Date(a.changedAt || 0),
    );

    return (
        <div className="history-viewer">
            <div className="history-viewer__header">
                <h3 className="history-viewer__title">History</h3>
                <div className="history-viewer__tabs">
                    <button
                        type="button"
                        className={`history-viewer__tab ${
                            activeTab === "status" ?
                                "history-viewer__tab--active"
                            :   ""
                        }`}
                        onClick={() => setActiveTab("status")}>
                        Status ({statusHistory.length})
                    </button>
                    <button
                        type="button"
                        className={`history-viewer__tab ${
                            activeTab === "version" ?
                                "history-viewer__tab--active"
                            :   ""
                        }`}
                        onClick={() => setActiveTab("version")}>
                        Changes ({versionHistory.length})
                    </button>
                </div>
            </div>

            {sortedHistory.length === 0 ?
                <p className="history-viewer__empty">
                    No {activeTab} history available.
                </p>
            :   <div className="history-timeline">
                    {sortedHistory.map((item, index) => (
                        <HistoryItem
                            key={item._id || index}
                            item={item}
                            type={activeTab}
                        />
                    ))}
                </div>
            }
        </div>
    );
};

export default HistoryViewer;
