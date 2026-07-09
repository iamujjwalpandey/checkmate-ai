"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

/** Apple-style fade-up reveal on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Counts up to a target number when scrolled into view (SpaceX mission-control vibe). */
export function CountUp({
  to,
  suffix = "",
  decimals = 0,
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });

  React.useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return () => unsub();
  }, [spring, decimals]);

  return (
    <span ref={ref} className="tabular">
      {display}
      {suffix}
    </span>
  );
}
