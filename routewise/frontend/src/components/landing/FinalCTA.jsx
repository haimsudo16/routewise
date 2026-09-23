import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button.jsx';
import { revealOnScroll } from '../../animations/scrollAnimations';

export default function FinalCTA() {
  const ref = useRef(null);

  useEffect(() => {
    revealOnScroll(ref.current, { start: 'top 88%' });
  }, []);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div ref={ref} className="glass-panel relative overflow-hidden rounded-3xl border border-accent/20 px-8 py-16 text-center shadow-glow">
          <div className="absolute inset-0 bg-radial-glow" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stop planning routes by hand.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Join teams using RouteWise to cut drive time, fuel cost, and planning effort — every
              single day.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
