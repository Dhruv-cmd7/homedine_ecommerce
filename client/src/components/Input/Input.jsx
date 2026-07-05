import React, { useState } from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFilled = value !== undefined && value !== null && value.toString() !== '';
  
  const containerClass = [
    styles.inputContainer,
    focused ? styles.focused : '',
    isFilled ? styles.filled : '',
    error ? styles.hasError : '',
    className
  ].join(' ').trim();

  const isPassword = type === 'password';

  return (
    <div className={containerClass}>
      <div className={styles.inputWrapper}>
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={`${styles.inputField} ${isPassword ? styles.passwordField : ''}`}
          id={`input-${name}`}
          {...props}
        />
        {label && (
          <label htmlFor={`input-${name}`} className={styles.floatingLabel}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eyeIcon}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eyeIcon}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
