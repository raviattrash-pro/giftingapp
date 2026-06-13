import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, glass, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  // Styles are handled through premium css classes and inline modifiers
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-premium-primary';
      case 'secondary':
        return 'btn-premium-secondary';
      case 'glass':
        return 'btn-premium-glass';
      case 'danger':
        return 'btn-premium-danger';
      case 'ghost':
        return 'btn-premium-ghost';
      default:
        return 'btn-premium-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return 'btn-md';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`btn-premium ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="btn-loading-wrapper">
          <Loader size="xs" color={variant === 'primary' ? 'dark' : 'light'} />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="btn-content">
          {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : 18} />}
          {children}
        </span>
      )}
    </motion.button>
  );
};

export default Button;
