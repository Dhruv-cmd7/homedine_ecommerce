import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        tempErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(formData.password)) {
        tempErrors.password = 'Password must contain at least one number';
      } else if (!/[@$!%*?&#]/.test(formData.password)) {
        tempErrors.password = 'Password must contain at least one special character';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      navigate('/');
    } catch (err) {
      // Handled by AuthContext state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '40px auto',
      padding: '40px 24px',
      backgroundColor: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-high)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create an account</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Join Homedine to track orders and save organic items.
        </p>
      </div>

      {authError && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fdebeb',
          border: '1px solid #f9c2c2',
          borderRadius: 'var(--radius-md)',
          color: '#c94a4a',
          fontSize: '0.875rem',
          marginBottom: '24px'
        }}>
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '-10px 0 24px 4px', lineHeight: '1.4' }}>
          Password must be at least 8 characters, and contain 1 uppercase letter, 1 number, and 1 special symbol.
        </p>

        <Button
          type="submit"
          loading={loading}
          style={{ width: '100%', display: 'flex' }}
        >
          Create Account
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{
          color: 'var(--color-primary-800)',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
