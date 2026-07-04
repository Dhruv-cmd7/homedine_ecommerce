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

  const isFilled = value !== undefined && value !== null && value.toString() !== '';
  
  const containerClass = [
    styles.inputContainer,
    focused ? styles.focused : '',
    isFilled ? styles.filled : '',
    error ? styles.hasError : '',
    className
  ].join(' ').trim();

  return (
    <div className={containerClass}>
      <div className={styles.inputWrapper}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={styles.inputField}
          id={`input-${name}`}
          {...props}
        />
        {label && (
          <label htmlFor={`input-${name}`} className={styles.floatingLabel}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
