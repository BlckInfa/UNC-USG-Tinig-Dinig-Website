import { Card } from "../../../../components";
import { formatDate } from "../../../../utils/dateFormatter";
import PriorityBadge from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import "./IssuanceCard.css";

/**
 * Issuance Card Component
 * Displays a single issuance item with title, type, date, issuer, priority, and status
 */
const IssuanceCard = ({ issuance, onClick, showWorkflowInfo = false }) => {
    const { title, type, issuedDate, issuedBy, priority, status, department } = issuance;

    return (
        <Card className="issuance-card" hoverable onClick={onClick}>
            <div className="issuance-card-content">
                <div className="issuance-card-badges">
                    <span className="issuance-type-badge">{type}</span>
                    {showWorkflowInfo && status && <StatusBadge status={status} />}
                    {showWorkflowInfo && priority && <PriorityBadge priority={priority} />}
                </div>
                <h4 className="issuance-title">{title}</h4>
                <div className="issuance-meta">
                    <span className="issuance-date">
                        {formatDate(issuedDate)}
                    </span>
                    {issuedBy && (
                        <>
                            <span className="issuance-separator">•</span>
                            <span className="issuance-issuer">{issuedBy}</span>
                        </>
                    )}
                    {showWorkflowInfo && department && (
                        <>
                            <span className="issuance-separator">•</span>
                            <span className="issuance-department">{department}</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default IssuanceCard;
