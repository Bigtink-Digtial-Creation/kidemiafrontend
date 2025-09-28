import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

type CounterProps = {
  from?: number;
  to: number;
  duration?: number;
  format?: "k+" | "b+" | "+" | ""; // optional suffix format
};

export const Counter = ({
  from = 0,
  to,
  duration = 2,
  format = "",
}: CounterProps) => {
  const count = useMotionValue(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const transformed = useTransform(count, (latest) => {
    const value = Math.floor(latest);

    switch (format) {
      case "k+":
        return `${Math.floor(value / 1000)}k+`;
      case "b+":
        return `₦${(value / 1_000_000_000).toFixed(1)}b+`;
      case "+":
        return `${value.toLocaleString()}+`;
      default:
        return value.toLocaleString();
    }
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [count, to, duration, inView]);

  return (
    <span ref={ref}>
      <motion.span>{transformed}</motion.span>
    </span>
  );
};
