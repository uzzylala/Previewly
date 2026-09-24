"use client";

import { motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const; // --ease-out-quint

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.45em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

type Props = { children: React.ReactNode; className?: string };

/** Orchestrates a one-off entrance for its StaggerItem / StaggerWords descendants. */
export function Stagger({ children, className }: Props) {
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: Props) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

type WordsProps = {
  /** Text segments; `em` segments get the emphasis styling. */
  segments: { text: string; em?: boolean }[];
  className?: string;
  emClassName?: string;
};

/**
 * A heading whose words rise into place one after another, like lines set on a proof.
 * The full text stays in the DOM as real words, so it reads normally to assistive tech.
 */
export function StaggerWords({ segments, className, emClassName }: WordsProps) {
  return (
    <motion.h1
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
    >
      {segments.map((segment, s) =>
        segment.text
          .split(/(\s+)/)
          .filter(Boolean)
          .map((token, t) =>
            /^\s+$/.test(token) ? (
              " "
            ) : (
              <motion.span
                key={`${s}-${t}`}
                variants={word}
                className={`inline-block ${segment.em ? (emClassName ?? "") : ""}`}
              >
                {token}
              </motion.span>
            ),
          ),
      )}
    </motion.h1>
  );
}
