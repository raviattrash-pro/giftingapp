import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useUiStore();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />;
      case 'error': return <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />;
      case 'warning': return <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />;
      case 'info':
      default: return <Info size={18} style={{ color: 'var(--color-info)' }} />;
    }
  };

  const getToastBorderColor = (type) => {
    switch (type) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      case 'info':
      default: return 'var(--color-info)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const borderColor = getToastBorderColor(toast.type);

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(12, 18, 32, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${borderColor}50`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 10px ${borderColor}20`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                position: 'relative'
              }}
            >
              <div style={{ marginTop: '2px' }}>{getToastIcon(toast.type)}</div>
              <div style={{ flex: 1, paddingRight: '18px' }}>
                <p style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 500 }}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
export { ToastContainer };
