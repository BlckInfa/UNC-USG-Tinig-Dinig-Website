import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input, Card } from '../../../components';
import './Register.css';

/**
 * Register Page - Auth Feature
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Registration failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the USG Tinig Dinig community</p>

        {errors.general && (
          <div className="error-alert">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your full name"
            required
          />

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
            label="Student ID"
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            error={errors.studentId}
            placeholder="Enter your student ID"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Create a password"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="register-btn"
            loading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
