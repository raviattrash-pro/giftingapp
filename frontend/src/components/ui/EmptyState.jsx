import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const EmptyState = ({
  icon: Icon = HelpCircle,
  title = 'No results found',
  description = 'Try adjusting your filters or add a new record to get started.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <Card 
      hoverable={false}
      className={`flex-center ${className}`}
      style={{
        flexDirection: 'column',
        padding: '48px 32px',
        textAlign: 'center',
        background: 'rgba(12, 18, 32, 0.25)',
        border: '1px dashed var(--glass-border)',
        minHeight: '280px'
      }}
    >
      <div 
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--glass-bg-accent)',
          border: '1px solid rgba(157, 78, 221, 0.2)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-glow-purple)'
        }}
      >
        <Icon size={24} />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff', fontFamily: 'var(--font-title)' }}>
        {title}
      </h4>
      <p style={{ maxWidth: '380px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="glass">
          {actionText}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
