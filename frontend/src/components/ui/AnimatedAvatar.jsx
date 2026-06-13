import React from 'react';

const AnimatedAvatar = ({
  src,
  name = '',
  size = 'md', // xs, sm, md, lg, xl
  relationshipScore,
  className = '',
  ...props
}) => {
  const getInitials = () => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getSizePx = () => {
    switch (size) {
      case 'xs': return 28;
      case 'sm': return 36;
      case 'lg': return 64;
      case 'xl': return 96;
      case 'md':
      default: return 48;
    }
  };

  const sizePx = getSizePx();

  // Standard border color based on health, if specified
  const getBorderColor = () => {
    if (relationshipScore === undefined) return 'rgba(157, 78, 221, 0.4)';
    if (relationshipScore >= 85) return 'var(--color-success)';
    if (relationshipScore >= 70) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const borderColor = getBorderColor();

  return (
    <div 
      className={`animated-avatar-container ${className}`} 
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...props.style
      }}
      {...props}
    >
      {/* Dynamic Keyframes injected safely */}
      <style>{`
        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes breathing-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(157, 78, 221, 0.3), 0 0 16px rgba(247, 37, 133, 0.1);
          }
          50% {
            box-shadow: 0 0 16px rgba(157, 78, 221, 0.6), 0 0 32px rgba(247, 37, 133, 0.4);
          }
        }
        .avatar-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, var(--color-primary, #9d4edd) 0%, var(--color-secondary, #f72585) 50%, #00f5d4 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          -webkit-mask-composite: exclude;
          mask-composite: exclude;
          animation: spin-clockwise 4s linear infinite;
          pointer-events: none;
        }
        .avatar-ring-inner {
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          padding: 1.5px;
          background: linear-gradient(315deg, #00f5d4 0%, var(--color-secondary, #f72585) 50%, var(--color-primary, #9d4edd) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          -webkit-mask-composite: exclude;
          mask-composite: exclude;
          animation: spin-counter 3s linear infinite;
          pointer-events: none;
        }
        .avatar-fallback-glow {
          animation: breathing-glow 3s ease-in-out infinite;
        }
      `}</style>

      {src ? (
        // If image source is provided, render image with custom status borders
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            padding: '2px',
            background: `linear-gradient(135deg, ${borderColor} 0%, rgba(255, 255, 255, 0.1) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <img 
            src={src} 
            alt={name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '50%' 
            }} 
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
            }} 
          />
        </div>
      ) : (
        // Fallback CSS-Animated initials avatar
        <div 
          className="avatar-fallback-glow"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'var(--bg-tertiary, #121820)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Dual spinning animated gradient rings */}
          <div className="avatar-ring-outer" />
          <div className="avatar-ring-inner" />

          {/* Central initials container */}
          <span 
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: size === 'xs' ? '0.7rem' : size === 'sm' ? '0.8rem' : size === 'lg' ? '1.4rem' : size === 'xl' ? '1.8rem' : '1.05rem',
              color: 'var(--text-primary)',
              zIndex: 2,
              letterSpacing: '-0.02em',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {getInitials()}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedAvatar;
