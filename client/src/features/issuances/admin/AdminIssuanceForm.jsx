import { useState, useCallback } from "react";
import { Input, Button, Card } from "../../../components";
import StatusSelect from "../components/StatusSelect";
import PrioritySelect from "../components/PrioritySelect";
import DepartmentSelect from "../components/DepartmentSelect";
import "./AdminIssuanceForm.css";

const CATEGORY_OPTIONS = [
    { value: "RESOLUTION", label: "Resolution" },
    { value: "MEMORANDUM", label: "Memorandum" },
    { value: "REPORT", label: "Report" },
    { value: "CIRCULAR", label: "Circular" },
];

const INITIAL_STATUS_OPTIONS = [
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
];

const EMPTY_FORM = {
    title: "",
    description: "",
    category: "",
    department: "",
    priority: "MEDIUM",
    status: "DRAFT",
    effectiveDate: "",
    tags: "",
    documentUrl: "",
    internalNotes: "",
};

/**
 * Admin Issuance Creation / Edit Form
 * Captures all required data fields for issuance creation
 */
const AdminIssuanceForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
    mode = "create", // 'create' | 'edit'
}) => {
    const [form, setForm] = useState(() => {
        if (initialData) {
            return {
                ...EMPTY_FORM,
                ...initialData,
                // Map model field "type" back to form field "category"
                category: initialData.category || initialData.type || "",
                tags:
                    Array.isArray(initialData.tags) ?
                        initialData.tags.join(", ")
                    :   initialData.tags || "",
                // Map model field "issuedDate" back to form field "effectiveDate"
                effectiveDate:
                    initialData.effectiveDate || initialData.issuedDate ?
                        new Date(
                            initialData.effectiveDate || initialData.issuedDate,
                        )
                            .toISOString()
                            .split("T")[0]
                    :   "",
            };
        }
        return { ...EMPTY_FORM };
    });

    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    const updateField = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
        // Clear field error on change
        setErrors((prev) => {
            if (prev[field]) {
                const next = { ...prev };
                delete next[field];
                return next;
            }
            return prev;
        });
    }, []);

    const validate = useCallback(() => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.description.trim())
            newErrors.description = "Description is required";
        if (!form.category) newErrors.category = "Category is required";
        if (!form.department) newErrors.department = "Department is required";
        if (!form.priority) newErrors.priority = "Priority is required";
        if (!form.status) newErrors.status = "Status is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...form,
            // Map form field "category" to model field "type"
            type: form.category,
            // Map form field "effectiveDate" to model field "issuedDate"
            issuedDate: form.effectiveDate || null,
            tags:
                form.tags ?
                    form.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                :   [],
        };

        onSubmit?.(payload);
    };

    const handleReset = () => {
        if (initialData) {
            setForm({
                ...EMPTY_FORM,
                ...initialData,
                category: initialData.category || initialData.type || "",
                tags:
                    Array.isArray(initialData.tags) ?
                        initialData.tags.join(", ")
                    :   initialData.tags || "",
                effectiveDate:
                    initialData.effectiveDate || initialData.issuedDate ?
                        new Date(
                            initialData.effectiveDate || initialData.issuedDate,
                        )
                            .toISOString()
                            .split("T")[0]
                    :   "",
            });
        } else {
            setForm({ ...EMPTY_FORM });
        }
        setErrors({});
        setIsDirty(false);
    };

    const isEdit = mode === "edit";

    return (
        <form
            className="admin-issuance-form"
            onSubmit={handleSubmit}
            noValidate>
            <Card className="admin-issuance-form__card">
                <div className="admin-issuance-form__header">
                    <h2 className="admin-issuance-form__title">
                        {isEdit ? "Edit Issuance" : "Create New Issuance"}
                    </h2>
                    {isDirty && (
                        <span className="admin-issuance-form__dirty-badge">
                            Unsaved changes
                        </span>
                    )}
                </div>

                {/* Title */}
                <div className="admin-issuance-form__section">
                    <h3 className="admin-issuance-form__section-title">
                        Basic Information
                    </h3>
                    <div className="admin-issuance-form__row">
                        <Input
                            label="Title"
                            required
                            value={form.title}
                            onChange={(e) =>
                                updateField("title", e.target.value)
                            }
                            error={errors.title}
                            placeholder="Enter issuance title..."
                            disabled={loading}
                            className="admin-issuance-form__field--full"
                        />
                    </div>

                    <div className="admin-issuance-form__row">
                        <div className="admin-issuance-form__field--full">
                            <label className="admin-issuance-form__label">
                                Description{" "}
                                <span className="admin-issuance-form__required">
                                    *
                                </span>
                            </label>
                            <textarea
                                className={`admin-issuance-form__textarea ${errors.description ? "admin-issuance-form__textarea--error" : ""}`}
                                value={form.description}
                                onChange={(e) =>
                                    updateField("description", e.target.value)
                                }
                                placeholder="Provide a detailed description..."
                                rows={5}
                                disabled={loading}
                            />
                            {errors.description && (
                                <span className="admin-issuance-form__error">
                                    {errors.description}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category, Department, Priority, Status */}
                <div className="admin-issuance-form__section">
                    <h3 className="admin-issuance-form__section-title">
                        Classification
                    </h3>
                    <div className="admin-issuance-form__grid">
                        <div className="admin-issuance-form__field">
                            <label className="admin-issuance-form__label">
                                Category{" "}
                                <span className="admin-issuance-form__required">
                                    *
                                </span>
                            </label>
                            <select
                                className={`admin-issuance-form__select ${errors.category ? "admin-issuance-form__select--error" : ""}`}
                                value={form.category}
                                onChange={(e) =>
                                    updateField("category", e.target.value)
                                }
                                disabled={loading}>
                                <option value="">Select category...</option>
                                {CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className="admin-issuance-form__error">
                                    {errors.category}
                                </span>
                            )}
                        </div>

                        <DepartmentSelect
                            label="Department / Office"
                            required
                            value={form.department}
                            onChange={(val) => updateField("department", val)}
                            error={errors.department}
                            disabled={loading}
                        />

                        <PrioritySelect
                            label="Priority Level"
                            required
                            value={form.priority}
                            onChange={(val) => updateField("priority", val)}
                            error={errors.priority}
                            disabled={loading}
                        />

                        <StatusSelect
                            label="Initial Status"
                            required
                            value={form.status}
                            onChange={(val) => updateField("status", val)}
                            error={errors.status}
                            disabled={loading}
                            options={
                                isEdit ? undefined : INITIAL_STATUS_OPTIONS
                            }
                        />
                    </div>
                </div>

                {/* Effective Date & Tags */}
                <div className="admin-issuance-form__section">
                    <h3 className="admin-issuance-form__section-title">
                        Additional Details
                    </h3>
                    <div className="admin-issuance-form__grid admin-issuance-form__grid--2col">
                        <Input
                            label="Effective Date"
                            type="date"
                            value={form.effectiveDate}
                            onChange={(e) =>
                                updateField("effectiveDate", e.target.value)
                            }
                            disabled={loading}
                        />
                        <Input
                            label="Tags / Keywords"
                            value={form.tags}
                            onChange={(e) =>
                                updateField("tags", e.target.value)
                            }
                            placeholder="Separate with commas..."
                            helperText="e.g. budget, academic, policy"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Document Link */}
                <div className="admin-issuance-form__section">
                    <h3 className="admin-issuance-form__section-title">
                        Document Link
                    </h3>
                    <Input
                        label="Document URL"
                        type="url"
                        value={form.documentUrl}
                        onChange={(e) =>
                            updateField("documentUrl", e.target.value)
                        }
                        placeholder="https://drive.google.com/file/d/..."
                        helperText="Paste a Google Drive, OneDrive, or any public link to the document"
                        error={errors.documentUrl}
                        disabled={loading}
                    />
                </div>

                {/* Internal Notes (Admin only) */}
                <div className="admin-issuance-form__section">
                    <h3 className="admin-issuance-form__section-title">
                        Internal Notes
                        <span className="admin-issuance-form__badge">
                            Admin Only
                        </span>
                    </h3>
                    <textarea
                        className="admin-issuance-form__textarea"
                        value={form.internalNotes}
                        onChange={(e) =>
                            updateField("internalNotes", e.target.value)
                        }
                        placeholder="Add internal notes visible only to admins..."
                        rows={3}
                        disabled={loading}
                    />
                </div>

                {/* Actions */}
                <div className="admin-issuance-form__actions">
                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        disabled={loading}>
                        Reset
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        loading={loading}
                        disabled={loading}>
                        {isEdit ? "Update Issuance" : "Create Issuance"}
                    </Button>
                </div>
            </Card>
        </form>
    );
};

export default AdminIssuanceForm;
