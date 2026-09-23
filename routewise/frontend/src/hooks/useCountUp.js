import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `value` using requestAnimationFrame with an
 * easeOut curve. Used for dashboard/analytics stat cards - the animation is
 * purely cosmetic, the final number always comes from the backend value
 * passed in, never fabricated.
 */
export function useCountUp(value, { duration = 1200, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    const target = Number(value) || 0;
    startTimeRef.current = null;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setDisplay(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return Number(display.toFixed(decimals));
}
