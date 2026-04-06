import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
  const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  // UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  
  const { login } = useAuth(); // 

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error
    if (apiError) setApiError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        //  Use context instead of localStorage
        login(data.user, data.token);

        setFormData({ email: '', password: '' });

        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setApiError(data.message || 'Login failed. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setApiError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>
          Login to your account
        </p>

        {/* API Error */}
        {apiError && (
          <div style={errorMessageStyle}>{apiError}</div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={errors.email ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.email && (
              <span style={errorTextStyle}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={errors.password ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.password && (
              <span style={errorTextStyle}>{errors.password}</span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            style={isLoading ? buttonDisabledStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Don't have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

// Styles
const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2.5rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '0.5rem',
  color: '#333',
  fontSize: '2rem',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '2rem',
  fontSize: '0.95rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#333',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: '#dc3545',
};

const errorTextStyle = {
  color: '#dc3545',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
};

const buttonStyle = {
  padding: '0.875rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};

const errorMessageStyle = {
  padding: '1rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '5px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1.5rem',
  color: '#666',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '500',
};