import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { animateCounter } from '../../animations/counterAnimations';
import { fadeUp } from '../../animations/variants';

/**
 * Displays a single dashboard/analytics stat. The number animates from 0 to
 * `value` via GSAP whenever `value` changes - `value` always comes from a
 * real backend response, never fabricated client-side.
 */
export default function StatCard({ icon: Icon, label, value, suffix = '', decimals = 0, delay = 0, accent = false }) {
  const [display, setDisplay] = useState(0);
  const tweenRef = useRef(null);

  useEffect(() => {
    tweenRef.current?.kill();
    tweenRef.current = animateCounter({
      target: value,
      decimals,
      onUpdate: setDisplay,
    });
    return () => tweenRef.current?.kill();
  }, [value, decimals]);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={`glass-panel rounded-2xl border p-5 ${accent ? 'border-accent/25 shadow-glow-sm' : 'border-white/8'}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
        {Icon && <Icon size={16} className={accent ? 'text-accent' : 'text-slate-500'} />}
      </div>
      <p className="mt-3 font-mono-tabular text-3xl font-bold text-white">
        {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        <span className="ml-1 text-lg text-slate-500">{suffix}</span>
      </p>
    </motion.div>
  );
}
