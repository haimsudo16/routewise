import gsap from 'gsap';

/**
 * Draws an SVG path using the classic stroke-dasharray / stroke-dashoffset
 * technique, then reveals markers along it in sequence. This powers the
 * hero's abstract route visualization and the map showcase section.
 *
 * @param {SVGPathElement} pathEl
 * @param {SVGElement[]} markerEls - rendered in visual order along the path
 */
export function animateRouteDraw(pathEl, markerEls = [], { duration = 2.2, markerStagger = 0.35 } = {}) {
  if (!pathEl) return null;

  const length = pathEl.getTotalLength();
  gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });
  markerEls.forEach((el) => el && gsap.set(el, { opacity: 0, scale: 0.4, transformOrigin: 'center' }));

  const tl = gsap.timeline();

  // First marker (origin) pops in immediately, then the line draws, with
  // each subsequent marker appearing as the line reaches it.
  if (markerEls[0]) {
    tl.to(markerEls[0], { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' });
  }

  tl.to(
    pathEl,
    { strokeDashoffset: 0, duration, ease: 'power2.inOut' },
    '-=0.1'
  );

  for (let i = 1; i < markerEls.length; i++) {
    const position = i / Math.max(markerEls.length - 1, 1);
    tl.to(
      markerEls[i],
      { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
      Math.max(0.2, position * duration - markerStagger)
    );
  }

  return tl;
}

/** Simple sequential fade/slide reveal for a list of DOM nodes (e.g. before/after stop lists). */
export function animateSequence(elements = [], { stagger = 0.08, y = 16, duration = 0.4 } = {}) {
  if (!elements.length) return null;
  return gsap.from(elements, { opacity: 0, y, duration, stagger, ease: 'power2.out' });
}
