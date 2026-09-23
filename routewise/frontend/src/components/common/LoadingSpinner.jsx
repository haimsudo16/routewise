import React from 'react';

export default function LoadingSpinner({ size = 22, className = '' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-white/15 border-t-accent ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
