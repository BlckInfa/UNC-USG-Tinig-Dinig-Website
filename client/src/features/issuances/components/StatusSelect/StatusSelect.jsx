import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./StatusSelect.css";

const STATUS_OPTIONS = [
    {
        value: "DRAFT",
        label: "Draft",
        color: "var(--status-draft)",
        bg: "var(--status-draft-bg)",
    },
    {
        value: "PENDING",
        label: "Pending",
        color: "var(--status-pending)",
        bg: "var(--status-pending-bg)",
    },
    {
        value: "UNDER_REVIEW",
        label: "Under Review",
        color: "var(--status-under-review)",
        bg: "var(--status-under-review-bg)",
    },
    {
        value: "APPROVED",
        label: "Approved",
        color: "var(--status-approved)",
        bg: "var(--status-approved-bg)",
    },
    {
        value: "REJECTED",
        label: "Rejected",
        color: "var(--status-rejected)",
        bg: "var(--status-rejected-bg)",
    },
];

/**
 * Status Select Component
 * Custom dropdown with color-coded status options
 */
const StatusSelect = ({
    value,
    onChange,
    label,
    required = false,
    disabled = false,
    error,
    className = "",
    options = STATUS_OPTIONS,
    placeholder = "Select status...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt.value);
        setIsOpen(false);
    };

    return (
        <div className={`status-select-wrapper ${className}`} ref={ref}>
            {label && (
                <label className="status-select__label">
                    {label}
                    {required && (
                        <span className="status-select__required">*</span>
                    )}
                </label>
            )}
            <button
                type="button"
                className={`status-select__trigger ${error ? "status-select__trigger--error" : ""} ${disabled ? "status-select__trigger--disabled" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}>
                {selected ?
                    <span
                        className="status-select__badge"
                        style={{
                            color: selected.color,
                            backgroundColor: selected.bg,
                        }}>
                        <span
                            className="status-select__dot"
                            style={{ backgroundColor: selected.color }}
                        />
                        {selected.label}
                    </span>
                :   <span className="status-select__placeholder">
                        {placeholder}
                    </span>
                }
                <ChevronDown
                    size={16}
                    className={`status-select__chevron ${isOpen ? "status-select__chevron--open" : ""}`}
                />
            </button>
            {isOpen && (
                <ul className="status-select__dropdown">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className={`status-select__option ${opt.value === value ? "status-select__option--active" : ""}`}
                            onClick={() => handleSelect(opt)}>
                            <span
                                className="status-select__dot"
                                style={{ backgroundColor: opt.color }}
                            />
                            <span style={{ color: opt.color }}>
                                {opt.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {error && <span className="status-select__error">{error}</span>}
        </div>
    );
};

export default StatusSelect;
