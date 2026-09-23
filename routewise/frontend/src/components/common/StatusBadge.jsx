import React from 'react';

const CONFIG = {
  DRAFT: { label: 'Draft', classes: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
  OPTIMIZED: { label: 'Optimized', classes: 'bg-accent/10 text-accent border-accent/30' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-warning/10 text-warning border-warning/30' },
  COMPLETED: { label: 'Completed', classes: 'bg-success/10 text-success border-success/30' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-danger/10 text-danger border-danger/30' },
  PENDING: { label: 'Pending', classes: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
  SKIPPED: { label: 'Skipped', classes: 'bg-warning/10 text-warning border-warning/30' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = CONFIG[status] || CONFIG.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.classes} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
