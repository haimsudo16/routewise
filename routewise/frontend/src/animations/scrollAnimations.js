import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Generic fade/rise-in-on-scroll for a section, used across landing sections. */
export function revealOnScroll(el, { y = 40, duration = 0.7, start = 'top 82%' } = {}) {
  if (!el) return null;
  return gsap.from(el, {
    opacity: 0,
    y,
    duration,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
  });
}

/** Staggered reveal for a group of sibling elements (feature cards, steps, etc). */
export function revealStaggerOnScroll(container, childSelector, { stagger = 0.12, y = 30, start = 'top 80%' } = {}) {
  if (!container) return null;
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return null;
  return gsap.from(children, {
    opacity: 0,
    y,
    duration: 0.6,
    stagger,
    ease: 'power3.out',
    scrollTrigger: { trigger: container, start, toggleActions: 'play none none reverse' },
  });
}

/**
 * Hero scroll-out effect: as the user scrolls past the hero, the route
 * visualization scales down slightly, drifts up, and fades - continuing its
 * visual journey into the next section without becoming disorienting.
 */
export function heroScrollExit(heroEl, targetEl) {
  if (!heroEl || !targetEl) return null;
  return gsap.to(targetEl, {
    scale: 0.92,
    y: -60,
    rotate: -1.5,
    opacity: 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
