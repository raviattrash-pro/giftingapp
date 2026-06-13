import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', color = 'purple' }) => {
  const getSizePx = () => {
    switch (size) {
      case 'xs': return 16;
      case 'sm': return 24;
      case 'lg': return 64;
      case 'md':
      default: return 40;
    }
  };

  const getColorHex = () => {
    switch (color) {
      case 'pink': return 'var(--color-secondary)';
      case 'cyan': return 'var(--color-accent)';
      case 'light': return '#ffffff';
      case 'dark': return '#070b13';
      case 'purple':
      default: return 'var(--color-primary)';
    }
  };

  const sizePx = getSizePx();

  return (
    <div className="flex-center" style={{ display: 'inline-flex', padding: '4px' }}>
      <motion.svg
        width={sizePx}
        height={sizePx}
        viewBox="0 0 50 50"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={getColorHex()}
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="30"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${getColorHex()})`
          }}
        />
      </motion.svg>
    </div>
  );
};

export default Loader;
