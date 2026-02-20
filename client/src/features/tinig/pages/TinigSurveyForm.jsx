import { useState } from "react";
import { Button } from "../../../components";
import api from "../../../services/api";
import "./TinigSurveyForm.css";

const COLLEGE_DEPARTMENTS = [
    "School of Computer Information Sciences",
    "School of Business and Accountancy",
    "School of Social and Natural Sciences",
    "School of Teacher Education",
    "School of Natural and Allied Health Sciences",
    "College of Criminal Justice Education",
    "College of Engineering and Architecture",
];

const YEAR_LEVELS = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year (if applicable)",
];

const LATIN_HONORS_OPTIONS = [
    "Yes",
    "No",
    "I'm okay with I will aim when I graduate",
];

const UNDERSTANDING_LEVELS = ["Very Well", "Somewhat", "Slightly", "Not at all"];

const FAMILIAR_ASPECTS = [
    "New GWA ranges for Summa, Magna, Cum Laude",
    "New Undergraduate Honors range for First Honors and Second Honors",
    "No failing grades requirement",
    "Minimum unit load per semester",
    "Residency requirements",
    "Limit on withdrawals/dropped subjects",
    "Discipline qualifications",
];

const LIKERT_STATEMENTS = [
    {
        key: "gwaRangesFair",
        label: "The new GWA ranges are fair and attainable.",
    },
    {
        key: "noFailingGradeEncourages",
        label: "The no-failing-grade requirement encourages academic discipline.",
    },
    {
        key: "minimumUnitLoadReasonable",
        label: "The minimum unit load requirement is reasonable for all students.",
    },
    {
        key: "irrCausesStress",
        label: "The new IRR might cause unnecessary stress for students.",
    },
];

const CRITERIA_DIFFICULTY_OPTIONS = [
    "Easier",
    "Harder",
    "About the same",
    "Not Sure",
];

const LIKERT_AGREE_OPTIONS = [
    "Strongly Agree",
    "Agree",
    "Neutral / No Opinion",
    "Disagree",
    "Strongly Disagree",
];

const MORE_CATEGORIES_OPTIONS = [
    "Yes, definitely",
    "Yes, but only for specific achievements (e.g., research, leadership, community service)",
    "Neutral / No Opinion",
    "No, the current system is sufficient",
    "No, I prefer a stricter recognition system",
];

const INITIAL_FORM_DATA = {
    dataPrivacyConsent: "",
    name: "",
    studentNumber: "",
    collegeDepartment: "",
    yearLevel: "",
    aimingForLatinHonors: "",
    awareOfNewIRR: "",
    understandingLevel: "",
    familiarAspects: [],
    gwaRangesFair: "",
    noFailingGradeEncourages: "",
    minimumUnitLoadReasonable: "",
    irrCausesStress: "",
    newCriteriaDifficulty: "",
    favorRetainingPreviousGWA: "",
    favorAcademicDistinction: "",
    preferMoreCategories: "",
    criteriaReflectExcellence: "",
    gradingVsTeaching: "",
    strengths: "",
    concerns: "",
    suggestions: "",
    importanceOfPrestige: "",
    mainFactor: "",
    shareYourVoice: "",
};

const TinigSurveyForm = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const consentGiven = formData.dataPrivacyConsent === "yes";
    const consentDenied = formData.dataPrivacyConsent === "no";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            familiarAspects: checked
                ? [...prev.familiarAspects, value]
                : prev.familiarAspects.filter((item) => item !== value),
        }));
        if (errors.familiarAspects) {
            setErrors((prev) => ({ ...prev, familiarAspects: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.dataPrivacyConsent) {
            newErrors.dataPrivacyConsent = "Please select a consent option";
        }
        if (consentDenied) {
            newErrors.dataPrivacyConsent =
                "You must give consent to submit this survey";
        }

        if (consentGiven) {
            if (!formData.studentNumber.trim())
                newErrors.studentNumber = "Student Number is required";
            if (!formData.collegeDepartment)
                newErrors.collegeDepartment = "College Department is required";
            if (!formData.yearLevel)
                newErrors.yearLevel = "Year Level is required";
            if (!formData.aimingForLatinHonors)
                newErrors.aimingForLatinHonors = "This field is required";
            if (!formData.awareOfNewIRR)
                newErrors.awareOfNewIRR = "This field is required";
            if (!formData.understandingLevel)
                newErrors.understandingLevel = "This field is required";
            if (formData.familiarAspects.length === 0)
                newErrors.familiarAspects = "Select at least one aspect";

            LIKERT_STATEMENTS.forEach(({ key }) => {
                if (!formData[key]) newErrors[key] = "This field is required";
            });

            if (!formData.newCriteriaDifficulty)
                newErrors.newCriteriaDifficulty = "This field is required";
            if (!formData.favorRetainingPreviousGWA)
                newErrors.favorRetainingPreviousGWA = "This field is required";
            if (!formData.favorAcademicDistinction)
                newErrors.favorAcademicDistinction = "This field is required";
            if (!formData.preferMoreCategories)
                newErrors.preferMoreCategories = "This field is required";
            if (!formData.criteriaReflectExcellence)
                newErrors.criteriaReflectExcellence = "This field is required";
            if (!formData.gradingVsTeaching)
                newErrors.gradingVsTeaching = "This field is required";

            if (!formData.strengths.trim())
                newErrors.strengths = "This field is required";
            if (!formData.concerns.trim())
                newErrors.concerns = "This field is required";
            if (!formData.suggestions.trim())
                newErrors.suggestions = "This field is required";
            if (!formData.importanceOfPrestige.trim())
                newErrors.importanceOfPrestige = "This field is required";
            if (!formData.mainFactor.trim())
                newErrors.mainFactor = "This field is required";
            if (!formData.shareYourVoice.trim())
                newErrors.shareYourVoice = "This field is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/survey", formData);
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            setErrors({
                general:
                    error.response?.data?.message ||
                    "Failed to submit survey. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="survey-page">
                <div className="survey-success">
                    <div className="survey-success__icon">&#10003;</div>
                    <h2>Thank you for your response!</h2>
                    <p>
                        Your survey has been submitted successfully. Your voice
                        matters to us.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setFormData(INITIAL_FORM_DATA);
                            setIsSubmitted(false);
                            setErrors({});
                        }}>
                        Submit Another Response
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="survey-page">
            <div className="survey-header">
                <h2>Tinig Dinig Survey</h2>
                <p>
                    Help us understand your views on the new IRR for Latin
                    Honors
                </p>
            </div>

            {errors.general && (
                <div className="survey-error-alert">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                {/* SECTION 1: DATA PRIVACY CONSENT */}
                <div
                    className={`survey-section ${errors.dataPrivacyConsent ? "survey-section--error" : ""}`}>
                    <div className="survey-section__header">
                        DATA PRIVACY CONSENT
                    </div>
                    <div className="survey-section__body">
                        <p className="survey-consent-text">
                            The organizing body and its extensions recognize
                            their responsibilities under the{" "}
                            <strong>Republic Act No. 10173</strong>, otherwise
                            known as the{" "}
                            <em>&quot;Data Privacy Act of 2012&quot;</em>, with
                            respect to the data they collect, record, recognize,
                            update, use, consolidate or destruct from
                            registering participants. The data obtained from this
                            online form is entered and stored within the
                            authorized information and communications system of
                            the team and will only be accessed by authorized
                            entities. We assure to institute appropriate
                            organizational, technical, and physical security
                            measures to ensure the protection of the
                            participant&apos;s personal information apart for the
                            cause of the event without their consent; for
                            storage, the body shall retain the information for
                            one year only.
                        </p>

                        <div className="survey-radio-group">
                            <label className="survey-radio">
                                <input
                                    type="radio"
                                    name="dataPrivacyConsent"
                                    value="yes"
                                    checked={
                                        formData.dataPrivacyConsent === "yes"
                                    }
                                    onChange={handleChange}
                                />
                                <span>I understand and give my consent</span>
                            </label>
                            <label className="survey-radio">
                                <input
                                    type="radio"
                                    name="dataPrivacyConsent"
                                    value="no"
                                    checked={
                                        formData.dataPrivacyConsent === "no"
                                    }
                                    onChange={handleChange}
                                />
                                <span>I do not give my consent</span>
                            </label>
                        </div>
                        {errors.dataPrivacyConsent && (
                            <span className="survey-field-error">
                                {errors.dataPrivacyConsent}
                            </span>
                        )}
                    </div>
                </div>

                {consentDenied && (
                    <div className="survey-section">
                        <div className="survey-section__body">
                            <p className="survey-consent-denied">
                                You must give your consent to participate in this
                                survey. If you change your mind, please select
                                &quot;I understand and give my consent&quot;
                                above.
                            </p>
                        </div>
                    </div>
                )}

                {consentGiven && (
                    <>
                        {/* SECTION 2: RESPONDENTS PROFILE */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                RESPONDENTS PROFILE
                            </div>
                            <div className="survey-section__body">
                                {/* Name */}
                                <div className="survey-field">
                                    <label className="survey-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="survey-input"
                                        placeholder="Your answer"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Student Number */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Student Number{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="studentNumber"
                                        className={`survey-input ${errors.studentNumber ? "survey-input--error" : ""}`}
                                        placeholder="Your answer"
                                        value={formData.studentNumber}
                                        onChange={handleChange}
                                    />
                                    {errors.studentNumber && (
                                        <span className="survey-field-error">
                                            {errors.studentNumber}
                                        </span>
                                    )}
                                </div>

                                {/* College Department */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        College Department{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {COLLEGE_DEPARTMENTS.map((dept) => (
                                            <label
                                                key={dept}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="collegeDepartment"
                                                    value={dept}
                                                    checked={
                                                        formData.collegeDepartment ===
                                                        dept
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{dept}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.collegeDepartment && (
                                        <span className="survey-field-error">
                                            {errors.collegeDepartment}
                                        </span>
                                    )}
                                </div>

                                {/* Year Level */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Year Level{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {YEAR_LEVELS.map((level) => (
                                            <label
                                                key={level}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="yearLevel"
                                                    value={level}
                                                    checked={
                                                        formData.yearLevel ===
                                                        level
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.yearLevel && (
                                        <span className="survey-field-error">
                                            {errors.yearLevel}
                                        </span>
                                    )}
                                </div>

                                {/* Aiming for Latin Honors */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Are you aiming for Latin Honors?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {LATIN_HONORS_OPTIONS.map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="aimingForLatinHonors"
                                                    value={option}
                                                    checked={
                                                        formData.aimingForLatinHonors ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.aimingForLatinHonors && (
                                        <span className="survey-field-error">
                                            {errors.aimingForLatinHonors}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: AWARENESS AND UNDERSTANDING */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                AWARENESS AND UNDERSTANDING
                            </div>
                            <div className="survey-section__body">
                                {/* Aware of new IRR */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Before this survey, were you aware of
                                        the new IRR for Latin honors?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {["Yes", "No"].map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="awareOfNewIRR"
                                                    value={option}
                                                    checked={
                                                        formData.awareOfNewIRR ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.awareOfNewIRR && (
                                        <span className="survey-field-error">
                                            {errors.awareOfNewIRR}
                                        </span>
                                    )}
                                </div>

                                {/* Understanding level */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        How well do you understand the changes
                                        made in the new IRR?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {UNDERSTANDING_LEVELS.map((level) => (
                                            <label
                                                key={level}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="understandingLevel"
                                                    value={level}
                                                    checked={
                                                        formData.understandingLevel ===
                                                        level
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.understandingLevel && (
                                        <span className="survey-field-error">
                                            {errors.understandingLevel}
                                        </span>
                                    )}
                                </div>

                                {/* Familiar aspects */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Which aspects of the new IRR are you
                                        most familiar with? (Check all that
                                        apply){" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-checkbox-group">
                                        {FAMILIAR_ASPECTS.map((aspect) => (
                                            <label
                                                key={aspect}
                                                className="survey-checkbox">
                                                <input
                                                    type="checkbox"
                                                    value={aspect}
                                                    checked={formData.familiarAspects.includes(
                                                        aspect,
                                                    )}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <span>{aspect}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.familiarAspects && (
                                        <span className="survey-field-error">
                                            {errors.familiarAspects}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: VIEWPOINTS SCALE */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                VIEWPOINTS SCALE
                            </div>
                            <div className="survey-section__body">
                                <p className="survey-instruction">
                                    On a scale of 1 (Strongly Disagree) to 5
                                    (Strongly Agree), rate the following
                                    statements:
                                </p>
                                {LIKERT_STATEMENTS.map(({ key, label }) => (
                                    <div key={key} className="survey-field">
                                        <label className="survey-label">
                                            {label}{" "}
                                            <span className="survey-required">
                                                *
                                            </span>
                                        </label>
                                        <div className="survey-likert">
                                            <span className="survey-likert__label">
                                                Strongly Disagree
                                            </span>
                                            <div className="survey-likert__options">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <label
                                                        key={num}
                                                        className="survey-likert__option">
                                                        <span className="survey-likert__number">
                                                            {num}
                                                        </span>
                                                        <input
                                                            type="radio"
                                                            name={key}
                                                            value={String(num)}
                                                            checked={
                                                                formData[
                                                                    key
                                                                ] ===
                                                                String(num)
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                            <span className="survey-likert__label">
                                                Strongly Agree
                                            </span>
                                        </div>
                                        {errors[key] && (
                                            <span className="survey-field-error">
                                                {errors[key]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 5: SENTIMENTS AND OPINIONS */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                SENTIMENTS AND OPINIONS
                            </div>
                            <div className="survey-section__body">
                                {/* New criteria difficulty */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Do you think the new criteria make it
                                        easier, harder, or about the same to
                                        qualify for Latin honors?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {CRITERIA_DIFFICULTY_OPTIONS.map(
                                            (option) => (
                                                <label
                                                    key={option}
                                                    className="survey-radio">
                                                    <input
                                                        type="radio"
                                                        name="newCriteriaDifficulty"
                                                        value={option}
                                                        checked={
                                                            formData.newCriteriaDifficulty ===
                                                            option
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    {errors.newCriteriaDifficulty && (
                                        <span className="survey-field-error">
                                            {errors.newCriteriaDifficulty}
                                        </span>
                                    )}
                                </div>

                                {/* Favor retaining previous GWA */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Are you in favor of retaining the
                                        previous general weighted average for
                                        Latin honors (1.0-1.40) with a limit on
                                        the number of resident scholars in your
                                        department based on the percentage of the
                                        total population?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {LIKERT_AGREE_OPTIONS.map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="favorRetainingPreviousGWA"
                                                    value={option}
                                                    checked={
                                                        formData.favorRetainingPreviousGWA ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.favorRetainingPreviousGWA && (
                                        <span className="survey-field-error">
                                            {errors.favorRetainingPreviousGWA}
                                        </span>
                                    )}
                                </div>

                                {/* Favor academic distinction */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        In page 37, in the Academic Distinction
                                        Section of the new College Student
                                        Handbook of the University of Nueva
                                        Caceres. Are you in favor if no one
                                        qualifies for the new Latin Honors
                                        criteria (1.00 - 1.30), an Academic
                                        Distinction shall be awarded to the
                                        Student with the highest General
                                        Weighted Average, as long as the GWA is
                                        not below 1.50?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {LIKERT_AGREE_OPTIONS.map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="favorAcademicDistinction"
                                                    value={option}
                                                    checked={
                                                        formData.favorAcademicDistinction ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.favorAcademicDistinction && (
                                        <span className="survey-field-error">
                                            {errors.favorAcademicDistinction}
                                        </span>
                                    )}
                                </div>

                                {/* Prefer more categories */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Would you prefer the University to
                                        introduce more categories of academic
                                        distinction (beyond Latin honors) to
                                        recognize a broader range of academic
                                        achievements?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {MORE_CATEGORIES_OPTIONS.map(
                                            (option) => (
                                                <label
                                                    key={option}
                                                    className="survey-radio">
                                                    <input
                                                        type="radio"
                                                        name="preferMoreCategories"
                                                        value={option}
                                                        checked={
                                                            formData.preferMoreCategories ===
                                                            option
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    {errors.preferMoreCategories && (
                                        <span className="survey-field-error">
                                            {errors.preferMoreCategories}
                                        </span>
                                    )}
                                </div>

                                {/* Criteria reflect excellence */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Do you believe the current Latin honors
                                        criteria accurately reflect academic
                                        excellence in your department?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {LIKERT_AGREE_OPTIONS.map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="criteriaReflectExcellence"
                                                    value={option}
                                                    checked={
                                                        formData.criteriaReflectExcellence ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.criteriaReflectExcellence && (
                                        <span className="survey-field-error">
                                            {errors.criteriaReflectExcellence}
                                        </span>
                                    )}
                                </div>

                                {/* Grading vs teaching */}
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Do you think the University&apos;s
                                        grading system has a greater impact on
                                        academic outcomes compared to the
                                        professors&apos; teaching methods?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <div className="survey-radio-group">
                                        {LIKERT_AGREE_OPTIONS.map((option) => (
                                            <label
                                                key={option}
                                                className="survey-radio">
                                                <input
                                                    type="radio"
                                                    name="gradingVsTeaching"
                                                    value={option}
                                                    checked={
                                                        formData.gradingVsTeaching ===
                                                        option
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.gradingVsTeaching && (
                                        <span className="survey-field-error">
                                            {errors.gradingVsTeaching}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 6: OPEN FEEDBACK */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                OPEN FEEDBACK
                            </div>
                            <div className="survey-section__body">
                                <div className="survey-field">
                                    <label className="survey-label">
                                        What do you think are the strengths of
                                        the new Latin honors criteria?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="strengths"
                                        className={`survey-textarea ${errors.strengths ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.strengths}
                                        onChange={handleChange}
                                    />
                                    {errors.strengths && (
                                        <span className="survey-field-error">
                                            {errors.strengths}
                                        </span>
                                    )}
                                </div>

                                <div className="survey-field">
                                    <label className="survey-label">
                                        What concerns or challenges do you
                                        foresee with the implementation of the
                                        new IRR?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="concerns"
                                        className={`survey-textarea ${errors.concerns ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.concerns}
                                        onChange={handleChange}
                                    />
                                    {errors.concerns && (
                                        <span className="survey-field-error">
                                            {errors.concerns}
                                        </span>
                                    )}
                                </div>

                                <div className="survey-field">
                                    <label className="survey-label">
                                        What suggestions do you have to improve
                                        the Latin honors qualification process?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="suggestions"
                                        className={`survey-textarea ${errors.suggestions ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.suggestions}
                                        onChange={handleChange}
                                    />
                                    {errors.suggestions && (
                                        <span className="survey-field-error">
                                            {errors.suggestions}
                                        </span>
                                    )}
                                </div>

                                <div className="survey-field">
                                    <label className="survey-label">
                                        How important is it to you that Latin
                                        honors are perceived as prestigious and
                                        exclusive within the University?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="importanceOfPrestige"
                                        className={`survey-textarea ${errors.importanceOfPrestige ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.importanceOfPrestige}
                                        onChange={handleChange}
                                    />
                                    {errors.importanceOfPrestige && (
                                        <span className="survey-field-error">
                                            {errors.importanceOfPrestige}
                                        </span>
                                    )}
                                </div>

                                <div className="survey-field">
                                    <label className="survey-label">
                                        What do you think is the main factor
                                        influencing the University&apos;s
                                        academic culture?{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="mainFactor"
                                        className={`survey-textarea ${errors.mainFactor ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.mainFactor}
                                        onChange={handleChange}
                                    />
                                    {errors.mainFactor && (
                                        <span className="survey-field-error">
                                            {errors.mainFactor}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 7: SHARE YOUR VOICE */}
                        <div className="survey-section">
                            <div className="survey-section__header">
                                SHARE YOUR VOICE
                            </div>
                            <div className="survey-section__body">
                                <div className="survey-field">
                                    <label className="survey-label">
                                        Share to us other matters that requires
                                        attention (other concerns):{" "}
                                        <span className="survey-required">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        name="shareYourVoice"
                                        className={`survey-textarea ${errors.shareYourVoice ? "survey-textarea--error" : ""}`}
                                        placeholder="Your answer"
                                        rows={3}
                                        value={formData.shareYourVoice}
                                        onChange={handleChange}
                                    />
                                    {errors.shareYourVoice && (
                                        <span className="survey-field-error">
                                            {errors.shareYourVoice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="survey-submit">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading}>
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default TinigSurveyForm;
