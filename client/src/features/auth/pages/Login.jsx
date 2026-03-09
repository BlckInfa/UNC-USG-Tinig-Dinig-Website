import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Button, Input, Card } from "../../../components";
import "./Login.css";

/**
 * Login Page - Auth Feature
 */
const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await login(formData);
            navigate("/dashboard");
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || "Invalid credentials",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>

                {errors.general && (
                    <div className="error-alert">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="Enter your email"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Enter your password"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="login-btn"
                        loading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create one</Link>
                </p>

                {/* TODO: Remove before production — dev credentials for testing */}
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "var(--color-surface, #f5f5f5)",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "var(--color-text-secondary, #666)",
                        border: "1px dashed var(--color-border, #ccc)",
                    }}>
                    <strong>Dev Credentials:</strong>
                    <div
                        style={{
                            marginTop: "0.25rem",
                            fontFamily: "monospace",
                        }}>
                        admin@unc.edu.ph / password123
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;
