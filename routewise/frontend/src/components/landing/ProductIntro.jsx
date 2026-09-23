import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { revealStaggerOnScroll, revealOnScroll } from '../../animations/scrollAnimations';

const BEFORE = ['Warehouse', 'Stop 4', 'Stop 1', 'Stop 5', 'Stop 2', 'Stop 3'];
const AFTER = ['Warehouse', 'Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5'];

function StopList({ items, tone }) {
  return (
    <ol className="space-y-2.5" data-stop-item-list>
      {items.map((item, i) => (
        <li
          key={`${tone}-${item}-${i}`}
          data-stop-item
          className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] ${
              tone === 'after' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-slate-400'
            }`}
          >
            {i === 0 ? '•' : i}
          </span>
          <span className="text-sm text-slate-200">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ProductIntro() {
  const sectionRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  useEffect(() => {
    revealOnScroll(sectionRef.current?.querySelector('h2'));
    revealStaggerOnScroll(beforeRef.current, '[data-stop-item]', { start: 'top 85%' });
    revealStaggerOnScroll(afterRef.current, '[data-stop-item]', { start: 'top 85%', stagger: 0.1 });
  }, []);

  return (
    <section id="product" ref={sectionRef} className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <p className="text-xs uppercase tracking-widest text-accent">The Problem</p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Routing shouldn't feel complicated.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">
          Traditional route planning wastes time through manual planning and inefficient stop
          ordering. RouteWise turns multiple destinations into a single optimized route in seconds.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 px-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-8">
        <div ref={beforeRef} className="glass-panel rounded-2xl border border-white/8 p-6">
          <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">Before</p>
          <StopList items={BEFORE} tone="before" />
        </div>

        <div className="flex items-center justify-center py-4 lg:py-0">
          <div className="rounded-full bg-accent/10 p-3 text-accent">
            <ArrowRight size={20} />
          </div>
        </div>

        <div ref={afterRef} className="glass-panel rounded-2xl border border-accent/25 p-6 shadow-glow-sm">
          <p className="mb-4 text-xs uppercase tracking-widest text-accent">After</p>
          <StopList items={AFTER} tone="after" />
        </div>
      </div>
    </section>
  );
}
