import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  // 🔹 State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Minimum 2 characters required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('🎉 Account created! Redirecting...');

        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        setApiError(data.message || 'Registration failed');
      }

    } catch (err) {
      console.error(err);
      setApiError('Server not reachable');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 UI
  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join us and start your journey 🚀</p>

        {successMessage && <div style={successStyle}>{successMessage}</div>}
        {apiError && <div style={errorMessageStyle}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={errors.name ? inputErrorStyle : inputStyle}
            />
            {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={errors.email ? inputErrorStyle : inputStyle}
            />
            {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={errors.password ? inputErrorStyle : inputStyle}
            />
            {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={errors.confirmPassword ? inputErrorStyle : inputStyle}
            />
            {errors.confirmPassword && (
              <span style={errorTextStyle}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            style={isLoading ? buttonDisabledStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Register'}
          </button>

        </form>

        <p style={linkTextStyle}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

/*  Styles */
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '0.5rem',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '1.5rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.3rem',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '0.7rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const inputErrorStyle = {
  ...inputStyle,
  border: '1px solid red',
};

const errorTextStyle = {
  color: 'red',
  fontSize: '0.8rem',
};

const buttonStyle = {
  padding: '0.8rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#999',
  cursor: 'not-allowed',
};

const successStyle = {
  backgroundColor: '#d4edda',
  padding: '0.8rem',
  borderRadius: '5px',
  marginBottom: '1rem',
};

const errorMessageStyle = {
  backgroundColor: '#f8d7da',
  padding: '0.8rem',
  borderRadius: '5px',
  marginBottom: '1rem',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1rem',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
};