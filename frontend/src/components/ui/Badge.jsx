import React from 'react';

const Badge = ({
  children,
  variant = 'info', // primary, secondary, premium, success, warning, danger, info
  solid = false,
  className = '',
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return solid ? { background: '#9d4edd', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } : {
          background: 'rgba(157, 78, 221, 0.15)', border: '1px solid rgba(157, 78, 221, 0.3)', color: '#c8b6ff'
        };
      case 'secondary':
        return solid ? { background: '#f72585', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } : {
          background: 'rgba(247, 37, 133, 0.15)', border: '1px solid rgba(247, 37, 133, 0.3)', color: '#ffb5d8'
        };
      case 'premium':
        return solid ? { background: 'linear-gradient(135deg, #9d4edd 0%, #f72585 100%)', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {
          background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.25) 0%, rgba(247, 37, 133, 0.25) 100%)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', boxShadow: '0 0 10px rgba(157, 78, 221, 0.2)'
        };
      case 'success':
        return solid ? { background: '#00c864', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {
          background: 'rgba(0, 245, 212, 0.12)', border: '1px solid rgba(0, 245, 212, 0.3)', color: '#00f5d4'
        };
      case 'warning':
        return solid ? { background: '#f59e0b', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {
          background: 'rgba(254, 228, 64, 0.12)', border: '1px solid rgba(254, 228, 64, 0.3)', color: '#fee440'
        };
      case 'danger':
        return solid ? { background: '#e11d48', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {
          background: 'rgba(255, 0, 127, 0.12)', border: '1px solid rgba(255, 0, 127, 0.3)', color: '#ff007f'
        };
      case 'info':
      default:
        return solid ? { background: '#00bbf9', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } : {
          background: 'rgba(0, 187, 249, 0.12)', border: '1px solid rgba(0, 187, 249, 0.3)', color: '#00bbf9'
        };
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-title)',
    backdropFilter: solid ? 'none' : 'blur(4px)',
    ...getVariantStyle()
  };

  return (
    <span className={className} style={baseStyle} {...props}>
      {children}
    </span>
  );
};

export default Badge;
