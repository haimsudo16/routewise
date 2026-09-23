import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Route, MapPinned, Fuel, BarChart3, History, Waypoints } from 'lucide-react';
import { revealStaggerOnScroll } from '../../animations/scrollAnimations';
import { cardHover } from '../../animations/variants';

const FEATURES = [
  {
    icon: Waypoints,
    title: 'Intelligent Routing',
    description: 'Optimize multiple destinations automatically with a nearest-neighbor routing engine.',
  },
  {
    icon: Route,
    title: 'Multi-Stop Planning',
    description: 'Create routes with unlimited stops, priorities, and notes for every delivery.',
  },
  {
    icon: MapPinned,
    title: 'Interactive Maps',
    description: 'Visualize routes and destinations on a live, dark-themed interactive map.',
  },
  {
    icon: Fuel,
    title: 'Fuel & Cost',
    description: 'Estimate fuel usage and travel cost per route using your own vehicle profile.',
  },
  {
    icon: BarChart3,
    title: 'Route Analytics',
    description: 'Understand route performance with trends across distance, time, and completion.',
  },
  {
    icon: History,
    title: 'History',
    description: 'Keep a complete, searchable record of every route your team has run.',
  },
];

export default function Features() {
  const gridRef = useRef(null);

  useEffect(() => {
    revealStaggerOnScroll(gridRef.current, '[data-feature-card]');
  }, []);

  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">Capabilities</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Built for how logistics teams work</h2>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              data-feature-card
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardHover}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-all duration-500 group-hover:bg-accent/20" />
              <div className="relative">
                <div className="inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                  <feature.icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
