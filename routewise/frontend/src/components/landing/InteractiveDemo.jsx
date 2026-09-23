import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import Button from '../common/Button.jsx';

const INITIAL_STOPS = [
  { id: '01', name: 'Clifton' },
  { id: '02', name: 'DHA' },
  { id: '03', name: 'Gulshan' },
  { id: '04', name: 'PECHS' },
  { id: '05', name: 'Nazimabad' },
];

const OPTIMIZED_ORDER = ['01', '03', '05', '04', '02'];

const STAGES = ['OPTIMIZE ROUTE', 'ANALYZING...', 'CALCULATING...', 'OPTIMIZING...', 'ROUTE OPTIMIZED'];

const BEFORE_STATS = { distance: '56.4 KM', duration: '1H 48M' };
const AFTER_STATS = { distance: '42.8 KM', duration: '1H 21M' };

export default function InteractiveDemo() {
  const [stageIndex, setStageIndex] = useState(0);
  const [optimized, setOptimized] = useState(false);
  const [running, setRunning] = useState(false);

  const stops = optimized
    ? OPTIMIZED_ORDER.map((id) => INITIAL_STOPS.find((s) => s.id === id))
    : INITIAL_STOPS;

  const handleOptimize = () => {
    if (running) return;
    setRunning(true);
    setOptimized(false);
    let i = 1;
    setStageIndex(1);
    const interval = setInterval(() => {
      i += 1;
      setStageIndex(i);
      if (i === 3) {
        setOptimized(true);
      }
      if (i >= STAGES.length - 1) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 650);
  };

  const reset = () => {
    setOptimized(false);
    setStageIndex(0);
  };

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">See it in Action</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Try the optimizer</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            A live preview of what happens when RouteWise reorders your stops. (Illustrative demo
            data — the real app runs this against your live backend.)
          </p>
        </div>

        <div className="glass-panel mt-14 grid gap-8 rounded-2xl border border-white/10 p-6 shadow-card lg:grid-cols-[320px_1fr] lg:p-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">Stops</p>
            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {stops.map((stop) => (
                  <motion.li
                    layout
                    key={stop.id}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 font-mono text-[11px] text-accent">
                      {stop.id}
                    </span>
                    <span className="text-sm text-slate-200">{stop.name}</span>
                    <MapPin size={13} className="ml-auto text-slate-600" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <Button
              onClick={optimized && !running ? reset : handleOptimize}
              loading={running}
              icon={Sparkles}
              className="mt-6 w-full"
            >
              {STAGES[stageIndex]}
            </Button>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="grid grid-cols-2 gap-4">
              <StatBlock label="Before" distance={BEFORE_STATS.distance} duration={BEFORE_STATS.duration} dim />
              <StatBlock
                label="After"
                distance={optimized ? AFTER_STATS.distance : '—'}
                duration={optimized ? AFTER_STATS.duration : '—'}
                highlight={optimized}
              />
            </div>

            <AnimatePresence>
              {optimized && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-wrap gap-6 rounded-xl border border-success/25 bg-success/5 px-6 py-4"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-success">Saved</p>
                    <p className="font-mono-tabular text-2xl font-bold text-white">13.6 KM</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-success">Time</p>
                    <p className="font-mono-tabular text-2xl font-bold text-white">27 MIN</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBlock({ label, distance, duration, dim, highlight }) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        highlight ? 'border-accent/30 bg-accent/5' : 'border-white/8 bg-white/[0.02]'
      }`}
    >
      <p className={`text-[10px] uppercase tracking-widest ${dim ? 'text-slate-500' : 'text-accent'}`}>{label}</p>
      <p className="mt-2 font-mono-tabular text-xl font-bold text-white">{distance}</p>
      <p className="font-mono-tabular text-sm text-slate-400">{duration}</p>
    </div>
  );
}
