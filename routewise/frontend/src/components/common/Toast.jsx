import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'text-success border-success/30',
  error: 'text-danger border-danger/30',
  info: 'text-accent border-accent/30',
  warning: 'text-warning border-warning/30',
};

export default function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card min-w-[280px] max-w-sm ${COLORS[toast.type] || COLORS.info}`}
      role="status"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm text-slate-200 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
}
