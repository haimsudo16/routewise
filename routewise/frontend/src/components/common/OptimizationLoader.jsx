import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const STAGES = ['ANALYZING STOPS', 'CALCULATING DISTANCES', 'FINDING BEST SEQUENCE', 'FINALIZING ROUTE'];

/**
 * Cinematic multi-stage loading indicator shown while POST /routes/{id}/optimize
 * is in flight. Purely presentational - the actual optimization result only
 * ever comes from the backend response.
 */
export default function OptimizationLoader({ active, stageDurationMs = 550 }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setStageIndex(0);
      return undefined;
    }
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, stageDurationMs);
    return () => clearInterval(interval);
  }, [active, stageDurationMs]);

  if (!active) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Loader2 className="animate-spin text-accent" size={30} />
      <AnimatePresence mode="wait">
        <motion.p
          key={stageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
        >
          {STAGES[stageIndex]}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-1.5">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`h-1 w-8 rounded-full transition-colors duration-300 ${
              i <= stageIndex ? 'bg-accent' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
