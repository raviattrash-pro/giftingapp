import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon = null,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`input-field-group ${className}`} style={{ marginBottom: '1.25rem', width: '100%' }}>
      {label && (
        <label 
          htmlFor={inputId} 
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-title)'
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Icon 
            size={18} 
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }} 
          />
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          placeholder={placeholder}
          className={`glass-input ${error ? 'glass-input-error' : ''}`}
          style={{
            paddingLeft: Icon ? '40px' : '16px'
          }}
          {...props}
        />
      </div>
      {error && (
        <span 
          style={{
            display: 'block',
            marginTop: '4px',
            fontSize: '0.75rem',
            color: 'var(--color-danger)'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
