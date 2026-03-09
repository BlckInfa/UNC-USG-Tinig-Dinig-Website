import { LuCircle } from "react-icons/lu";
import "./PrioritySelect.css";

const PRIORITY_OPTIONS = [
    {
        value: "HIGH",
        label: "High",
        color: "var(--priority-high)",
        bg: "var(--priority-high-bg)",
    },
    {
        value: "MEDIUM",
        label: "Medium",
        color: "var(--priority-medium)",
        bg: "var(--priority-medium-bg)",
    },
    {
        value: "LOW",
        label: "Low",
        color: "var(--priority-low)",
        bg: "var(--priority-low-bg)",
    },
];

/**
 * Priority Select Component
 * Radio-button style selector for priority levels
 */
const PrioritySelect = ({
    value,
    onChange,
    label,
    required = false,
    disabled = false,
    error,
    className = "",
    options = PRIORITY_OPTIONS,
}) => {
    return (
        <div className={`priority-select-wrapper ${className}`}>
            {label && (
                <label className="priority-select__label">
                    {label}
                    {required && (
                        <span className="priority-select__required">*</span>
                    )}
                </label>
            )}
            <div className="priority-select__options">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`priority-select__btn ${opt.value === value ? "priority-select__btn--active" : ""}`}
                        style={
                            opt.value === value ?
                                {
                                    borderColor: opt.color,
                                    backgroundColor: opt.bg,
                                    color: opt.color,
                                }
                            :   {}
                        }
                        onClick={() => !disabled && onChange(opt.value)}
                        disabled={disabled}>
                        <span className="priority-select__icon">
                            <LuCircle size={14} fill="currentColor" />
                        </span>
                        {opt.label}
                    </button>
                ))}
            </div>
            {error && <span className="priority-select__error">{error}</span>}
        </div>
    );
};

export default PrioritySelect;
