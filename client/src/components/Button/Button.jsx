import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
    className
  ].join(' ').trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.spinner}></span> : children}
    </button>
  );
}
