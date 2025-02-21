
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export function Counter({ value, direction = "up" }: { value: string; direction?: "up" | "down" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      motionValue.set(direction === "down" ? numericValue : 0);
      springValue.set(direction === "down" ? 0 : numericValue);
    }
  }, [isInView, value, motionValue, springValue, direction]);

  useEffect(() => {
    if (!ref.current) return;
    
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${value.includes('+') ? '+' : ''}`;
      }
    });
  }, [springValue, value]);

  return <span ref={ref} />;
}
