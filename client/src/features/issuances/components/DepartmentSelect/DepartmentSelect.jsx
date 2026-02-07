import "./DepartmentSelect.css";

const DEPARTMENT_OPTIONS = [
    { value: "Executive", label: "Executive" },
    { value: "Legislative", label: "Legislative" },
    { value: "Finance Committee", label: "Finance Committee" },
    { value: "COMELEC", label: "COMELEC" },
    { value: "Audit Committee", label: "Audit Committee" },
    { value: "Academic Affairs", label: "Academic Affairs" },
    { value: "Student Services", label: "Student Services" },
    { value: "External Affairs", label: "External Affairs" },
];

/**
 * Department / Office Select Component
 */
const DepartmentSelect = ({
    value,
    onChange,
    label,
    required = false,
    disabled = false,
    error,
    className = "",
    options = DEPARTMENT_OPTIONS,
    placeholder = "Select department...",
}) => {
    return (
        <div className={`department-select-wrapper ${className}`}>
            {label && (
                <label className="department-select__label">
                    {label}
                    {required && (
                        <span className="department-select__required">*</span>
                    )}
                </label>
            )}
            <select
                className={`department-select ${error ? "department-select--error" : ""}`}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}>
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="department-select__error">{error}</span>}
        </div>
    );
};

export default DepartmentSelect;
