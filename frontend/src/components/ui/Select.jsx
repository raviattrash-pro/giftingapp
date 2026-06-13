import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  options = [], // [{ value, label }]
  value,
  onChange,
  error,
  placeholder = 'Select option',
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`select-field-group ${className}`} style={{ marginBottom: '1.25rem', width: '100%' }}>
      {label && (
        <label 
          htmlFor={selectId} 
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
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`glass-input ${error ? 'glass-input-error' : ''}`}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: '40px',
            cursor: 'pointer'
          }}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={18} 
          style={{
            position: 'absolute',
            right: '14px',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }}
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
};

export default Select;
