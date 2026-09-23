import React from 'react';

export default function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
      <div className="animate-pulse divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-5 py-4">
            {Array.from({ length: cols }).map((__, c) => (
              <div key={c} className="h-3 rounded bg-white/10" style={{ width: `${80 + (c % 3) * 30}px` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
