import React, { useEffect, useRef } from 'react';
import RouteVisualization from './RouteVisualization.jsx';
import { revealOnScroll } from '../../animations/scrollAnimations';

export default function MapShowcase() {
  const sectionRef = useRef(null);

  useEffect(() => {
    revealOnScroll(sectionRef.current);
  }, []);

  return (
    <section id="analytics" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">Live View</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">See every route at a glance.</h2>
        </div>

        <div
          ref={sectionRef}
          className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-base-900 shadow-card"
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <RouteVisualization className="p-8" />

          <div className="glass-panel absolute bottom-6 left-6 flex gap-6 rounded-xl border border-white/10 px-5 py-4">
            <Metric value="42.8 KM" label="Distance" />
            <Metric value="1H 21M" label="Duration" />
            <Metric value="8" label="Stops" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <p className="font-mono-tabular text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}
