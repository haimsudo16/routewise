import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { PlayCircle, ArrowRight } from 'lucide-react';
import Button from '../common/Button.jsx';
import RouteVisualization from './RouteVisualization.jsx';
import { buildHeroTimeline } from '../../animations/heroAnimations';
import { heroScrollExit } from '../../animations/scrollAnimations';

const METRICS = [
  { value: '24%', label: 'Distance Reduction', position: 'top-6 left-0 lg:-left-6' },
  { value: '27 min', label: 'Time Saved', position: 'bottom-10 right-0 lg:-right-8' },
  { value: '8', label: 'Stops Optimized', position: 'top-1/2 -right-2 lg:-right-10' },
];

export default function Hero() {
  const heroRef = useRef(null);
  const logoAnchorRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const cta1Ref = useRef(null);
  const cta2Ref = useRef(null);
  const routeWrapRef = useRef(null);
  const metricRefs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      buildHeroTimeline({
        logo: logoAnchorRef.current,
        headlineLines: [line1Ref.current, line2Ref.current],
        subheading: subRef.current,
        ctas: [cta1Ref.current, cta2Ref.current],
        routeSvg: routeWrapRef.current,
        metrics: metricRefs.current,
      });
      heroScrollExit(heroRef.current, routeWrapRef.current);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="noise-layer" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <div ref={logoAnchorRef} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
            Route Intelligence, Reimagined
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span ref={line1Ref} className="block">
              Plan Smarter.
            </span>
            <span ref={line2Ref} className="block text-gradient">
              Drive Less.
            </span>
          </h1>

          <p ref={subRef} className="mt-6 max-w-lg text-lg text-slate-400">
            RouteWise intelligently organizes multi-stop routes so your team spends less time
            planning and more time moving.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div ref={cta1Ref}>
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Start Planning
                </Button>
              </Link>
            </div>
            <div ref={cta2Ref}>
              <a href="#product" data-cursor-hover>
                <Button size="lg" variant="secondary" icon={PlayCircle}>
                  Watch Demo
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="relative">
          <div ref={routeWrapRef} className="relative aspect-[5/3] w-full">
            <RouteVisualization />

            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                ref={(el) => (metricRefs.current[i] = el)}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                className={`glass-panel absolute ${metric.position} rounded-xl border border-white/10 px-4 py-3 shadow-glow-sm`}
              >
                <p className="font-mono-tabular text-xl font-bold text-white">{metric.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
