import { Card } from "../../../../components";
import { formatDate } from "../../../../utils/dateFormatter";
import "./IssuanceCard.css";

/**
 * Issuance Card Component
 * Displays a single issuance item with title, type, date, and issuer
 */
const IssuanceCard = ({ issuance, onClick }) => {
    const { title, type, issuedDate, issuedBy } = issuance;

    return (
        <Card className="issuance-card" hoverable onClick={onClick}>
            <div className="issuance-card-content">
                <span className="issuance-type-badge">{type}</span>
                <h4 className="issuance-title">{title}</h4>
                <div className="issuance-meta">
                    <span className="issuance-date">
                        {formatDate(issuedDate)}
                    </span>
                    <span className="issuance-separator">•</span>
                    <span className="issuance-issuer">{issuedBy}</span>
                </div>
            </div>
        </Card>
    );
};

export default IssuanceCard;
