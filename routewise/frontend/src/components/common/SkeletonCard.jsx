import React from 'react';

export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-panel rounded-2xl p-5 border border-white/5 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="h-6 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}
