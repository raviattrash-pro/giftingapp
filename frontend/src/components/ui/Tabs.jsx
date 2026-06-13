import React from 'react';
import { motion } from 'framer-motion';

const Tabs = ({
  tabs = [], // [{ id, label, icon: Icon }]
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{
        padding: '6px',
        display: 'inline-flex',
        gap: '4px',
        background: 'rgba(12, 18, 32, 0.4)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)'
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none',
              transition: 'color 0.2s ease'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.2) 0%, rgba(247, 37, 133, 0.2) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  zIndex: 0
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {Icon && <Icon size={16} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
