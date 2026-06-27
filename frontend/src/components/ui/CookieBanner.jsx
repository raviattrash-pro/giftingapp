import React, { useState, useEffect } from 'react';
import Button from './Button';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--card-bg)',
      borderTop: '1px solid var(--glass-border)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ flex: 1, marginRight: '24px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
          <a href="/privacy-policy" style={{ marginLeft: '8px', color: 'var(--color-primary)', textDecoration: 'underline' }}>Learn more</a>
        </p>
      </div>
      <div>
        <Button onClick={handleAccept} variant="primary" style={{ padding: '8px 24px' }}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
