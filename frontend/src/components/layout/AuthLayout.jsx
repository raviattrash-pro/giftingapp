import React from 'react';
import { Outlet } from 'react-router-dom';
import { Gift } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Dynamic Background Gradients */}
      <div 
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157, 78, 221, 0.12) 0%, rgba(247, 37, 133, 0.01) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        className="animate-float-slow"
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76, 201, 240, 0.1) 0%, rgba(157, 78, 221, 0.01) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px'
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--color-primary-glow)'
            }}
          >
            <Gift size={22} color="#fff" />
          </div>
          <span 
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '1.6rem',
              letterSpacing: '-0.02em',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Louvion Hampers
          </span>
        </div>

        {/* Content Wrapper */}
        <div style={{ width: '100%' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
