import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner.jsx';

const VARIANTS = {
  primary:
    'bg-accent text-base-950 hover:bg-accent-glow shadow-glow-sm font-semibold',
  secondary:
    'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm tracking-wide',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      disabled={disabled || loading}
      data-cursor-hover
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <LoadingSpinner size={16} /> : Icon ? <Icon size={16} /> : null}
      {children}
    </motion.button>
  );
}
