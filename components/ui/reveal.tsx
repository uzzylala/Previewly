"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait after entering the viewport, for gentle sequencing within a block. */
  delay?: number;
  as?: "div" | "li";
};

/**
 * Scroll reveal from the "Proof" direction: a quiet 12px fade-up over 600ms, once.
 * Under prefers-reduced-motion a CSS override in globals.css pins [data-reveal] at its
 * resting state, so there is no animation at all (not merely a shorter one).
 */
export function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
