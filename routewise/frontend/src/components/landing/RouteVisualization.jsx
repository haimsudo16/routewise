import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { animateRouteDraw } from '../../animations/routeAnimations';

const POINTS = [
  { x: 60, y: 300, label: 'START' },
  { x: 190, y: 210, label: 'STOP 01' },
  { x: 300, y: 260, label: 'STOP 02' },
  { x: 420, y: 140, label: 'STOP 03' },
  { x: 540, y: 90, label: 'DESTINATION' },
];

function buildPath(points) {
  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  rest.forEach((p, i) => {
    const prev = points[i];
    const midX = (prev.x + p.x) / 2;
    d += ` Q ${midX} ${prev.y}, ${p.x} ${p.y}`;
  });
  return d;
}

export default function RouteVisualization({ className = '', autoplay = true }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const markerRefs = useRef([]);

  useLayoutEffect(() => {
    if (!autoplay) return undefined;
    const ctx = gsap.context(() => {
      animateRouteDraw(pathRef.current, markerRefs.current);
    }, svgRef);
    return () => ctx.revert();
  }, [autoplay]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 360"
      className={`w-full h-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Animated multi-stop route visualization"
    >
      <defs>
        <linearGradient id="routeLineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3ddcf7" />
          <stop offset="100%" stopColor="#7ef4ff" />
        </linearGradient>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={buildPath(POINTS)}
        stroke="url(#routeLineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#routeGlow)"
      />

      {POINTS.map((point, i) => {
        const isEndpoint = i === 0 || i === POINTS.length - 1;
        return (
          <g
            key={point.label}
            ref={(el) => (markerRefs.current[i] = el)}
            transform={`translate(${point.x}, ${point.y})`}
          >
            <circle r={isEndpoint ? 8 : 6} fill={isEndpoint ? '#3ddcf7' : '#0d1220'} stroke="#3ddcf7" strokeWidth="2" />
            {isEndpoint && <circle r="14" fill="none" stroke="#3ddcf7" strokeOpacity="0.3" strokeWidth="1" />}
            <text
              x="0"
              y={i % 2 === 0 ? 26 : -18}
              textAnchor="middle"
              className="fill-slate-300"
              fontSize="11"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="1"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
