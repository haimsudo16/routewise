import React, { useEffect, useRef } from 'react';
import { ListPlus, Wand2, Navigation } from 'lucide-react';
import { revealStaggerOnScroll } from '../../animations/scrollAnimations';

const STEPS = [
  {
    number: '01',
    icon: ListPlus,
    title: 'Add Your Stops',
    description: 'Add addresses and destinations with priority levels and notes.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'Optimize',
    description: 'RouteWise calculates an efficient sequence in a fraction of a second.',
  },
  {
    number: '03',
    icon: Navigation,
    title: 'Move',
    description: 'Follow your optimized route and track progress stop by stop.',
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);

  useEffect(() => {
    revealStaggerOnScroll(containerRef.current, '[data-step]', { stagger: 0.18 });
  }, []);

  return (
    <section id="how-it-works" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">Workflow</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">How RouteWise works</h2>
        </div>

        <div ref={containerRef} className="mt-16 grid gap-10 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} data-step className="relative text-center lg:text-left">
              <span className="font-mono text-6xl font-bold text-white/5">{step.number}</span>
              <div className="mt-[-2.2rem] inline-flex rounded-2xl bg-accent/10 p-4 text-accent lg:ml-1">
                <step.icon size={26} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
