import { Modal } from "../../../../components";
import "./IssuanceViewer.css";

/**
 * Issuance Viewer Component
 * Displays the issuance document in an embedded PDF viewer (iframe) or opens in new tab
 */
const IssuanceViewer = ({ issuance, isOpen, onClose }) => {
    if (!issuance) return null;

    const { title, documentUrl } = issuance;

    const handleOpenInNewTab = () => {
        window.open(documentUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="issuance-viewer">
                <div className="issuance-viewer-toolbar">
                    <button
                        type="button"
                        className="issuance-viewer-btn"
                        onClick={handleOpenInNewTab}>
                        Open in New Tab
                    </button>
                </div>
                <div className="issuance-viewer-content">
                    <iframe
                        src={documentUrl}
                        title={title}
                        className="issuance-viewer-iframe"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default IssuanceViewer;
