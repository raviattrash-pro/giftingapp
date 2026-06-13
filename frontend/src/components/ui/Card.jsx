import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  onClick,
  hoverable = true,
  glowColor = 'purple', // purple, pink, cyan, none
  className = '',
  ...props
}) => {
  const getGlowClass = () => {
    if (!hoverable) return '';
    switch (glowColor) {
      case 'pink': return 'glass-card-accent-pink';
      case 'cyan': return 'glass-card-accent-cyan';
      case 'none': return '';
      case 'purple':
      default: return 'glass-card-hover';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className={`glass-card ${getGlowClass()} ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
