import gsap from 'gsap';

/**
 * The hero entrance timeline: logo -> headline -> subheading -> CTAs ->
 * route visualization -> floating metrics. Called from a useLayoutEffect
 * inside Hero.jsx with a gsap.context() scope so it cleans up on unmount.
 */
export function buildHeroTimeline(refs) {
  const { logo, headlineLines, subheading, ctas, routeSvg, metrics } = refs;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (logo) {
    tl.from(logo, { opacity: 0, y: -16, duration: 0.6 });
  }
  if (headlineLines?.length) {
    tl.from(headlineLines, { opacity: 0, y: 32, duration: 0.75, stagger: 0.12 }, '-=0.25');
  }
  if (subheading) {
    tl.from(subheading, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35');
  }
  if (ctas?.length) {
    tl.from(ctas, { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, '-=0.3');
  }
  if (routeSvg) {
    tl.from(routeSvg, { opacity: 0, scale: 0.96, duration: 0.6 }, '-=0.25');
  }
  if (metrics?.length) {
    tl.from(metrics, { opacity: 0, y: 24, scale: 0.94, duration: 0.55, stagger: 0.12 }, '-=0.3');
  }

  return tl;
}

/** Subtle continuous drift for the hero's background grid / atmosphere. */
export function buildAtmosphereLoop(el) {
  if (!el) return null;
  return gsap.to(el, {
    backgroundPosition: '+=44px +=44px',
    duration: 40,
    ease: 'none',
    repeat: -1,
  });
}
