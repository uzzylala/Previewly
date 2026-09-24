"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";

export type FaqEntry = { key: string; question: string; paragraphs: string[] };

/**
 * WAI-ARIA accordion: each question is a real <button> inside a heading, wired to its
 * panel with aria-expanded / aria-controls. Tab moves between questions, Enter or Space
 * toggles, and Up/Down/Home/End move focus between questions. Closed answers stay in
 * the DOM (indexable) but are inert, so they're skipped by focus and screen readers.
 */
export function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const toggle = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = entries.length - 1;
    const target = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <div className="border-b border-rule">
      {entries.map((entry, index) => {
        const isOpen = open.has(entry.key);
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;

        return (
          <div key={entry.key} className="border-t border-rule">
            <h3>
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(entry.key)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex w-full items-baseline justify-between gap-6 py-5 text-start font-display text-xl tracking-tight text-ink transition-colors duration-200 hover:text-proof"
              >
                <span>{entry.question}</span>
                <span
                  aria-hidden
                  className={`relative size-3 shrink-0 self-center text-ink-soft transition-transform duration-300 ease-out-quint group-hover:text-proof motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex max-w-measure flex-col gap-3 pb-6 text-base text-ink-soft">
                {entry.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
