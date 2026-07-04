import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Silent check session on app startup
  const checkAuthStatus = async () => {
    try {
      // Hit profile endpoint (interceptor will automatically try to refresh token if expired but cookie exists)
      const res = await api.get('/auth/profile');
      setUser(res.data.data.user);
    } catch (err) {
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen to session expiry events triggered by the api interceptor
    const handleSessionExpired = () => {
      setUser(null);
      setAuthToken(null);
      setError('Your session has expired. Please log in again.');
    };

    window.addEventListener('auth-session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth-session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: profile, accessToken } = res.data.data;
      
      setAuthToken(accessToken);
      setUser(profile);
      return profile;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { firstName, lastName, email, password });
      const { user: profile, accessToken } = res.data.data;

      setAuthToken(accessToken);
      setUser(profile);
      return profile;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on server:', err.message);
    } finally {
      setUser(null);
      setAuthToken(null);
      setError(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
