import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error is stored in AuthContext and can be displayed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '60px auto',
      padding: '40px 24px',
      backgroundColor: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-high)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome back</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Please sign in to access your Homedine account.
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

        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <Link to="/forgot-password" style={{
            fontSize: '0.8125rem',
            color: 'var(--color-primary-800)',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          style={{ width: '100%', display: 'flex' }}
        >
          Sign In
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{
          color: 'var(--color-primary-800)',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Register now
        </Link>
      </div>
    </div>
  );
}
