import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="glass-panel flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 px-8 py-16 text-center"
    >
      {Icon && (
        <div className="rounded-full bg-accent/10 p-4 text-accent">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
