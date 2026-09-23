import gsap from 'gsap';

/**
 * Animates a numeric value from 0 (or its current value) to `target`,
 * calling onUpdate on every tick with the interpolated, rounded value.
 * Used by dashboard/analytics stat cards - the final number always comes
 * from a real backend value passed in as `target`.
 *
 * Returns the GSAP tween so callers can kill it on unmount.
 */
export function animateCounter({ target, duration = 1.4, decimals = 0, onUpdate, ease = 'power3.out' }) {
  const proxy = { value: 0 };
  return gsap.to(proxy, {
    value: Number(target) || 0,
    duration,
    ease,
    onUpdate: () => onUpdate(Number(proxy.value.toFixed(decimals))),
  });
}
