import type { CSSProperties, ReactNode } from "react";

/**
 * The hero's one-off entrance (a fade-up in sequence, words rising one after another),
 * done in CSS rather than in JavaScript.
 *
 * It used to be a Motion animation that server-rendered its start state (opacity 0), so on
 * a phone the hero, which is the largest contentful paint, stayed invisible until the
 * JavaScript arrived and hydrated (over 4 s on a throttled connection), and forever without
 * JavaScript. A CSS animation runs from the first paint with no script. Under
 * prefers-reduced-motion the global rule collapses it to its end state at once.
 */
type Props = { children: ReactNode; className?: string };
type Indexed = Props & { index?: number };

const delay = (index: number, step: number, offset = 50): CSSProperties => ({
  animationDelay: `${index * step + offset}ms`,
});

/** Groups StaggerItem / StaggerWords descendants. Kept as a component so callers read the same. */
export function Stagger({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}

/** `index` is its place in the sequence: each step waits 90 ms after the last. */
export function StaggerItem({ children, className, index = 0 }: Indexed) {
  return (
    <div data-reveal="" className={`rise ${className ?? ""}`} style={delay(index, 90)}>
      {children}
    </div>
  );
}

type WordsProps = {
  /** Text segments; `em` segments get the emphasis styling. */
  segments: { text: string; em?: boolean }[];
  className?: string;
  emClassName?: string;
  index?: number;
};

/**
 * A heading whose words rise into place one after another, like lines set on a proof.
 * The full text stays in the DOM as real words, so it reads normally to assistive tech.
 */
export function StaggerWords({ segments, className, emClassName, index = 0 }: WordsProps) {
  let word = 0;
  return (
    <h1 className={className}>
      {segments.map((segment, s) =>
        segment.text
          .split(/(\s+)/)
          .filter(Boolean)
          .map((token, t) =>
            /^\s+$/.test(token) ? (
              " "
            ) : (
              <span
                key={`${s}-${t}`}
                data-reveal=""
                className={`rise-word ${segment.em ? (emClassName ?? "") : ""}`}
                style={delay(word++, 45, index * 90 + 50)}
              >
                {token}
              </span>
            ),
          ),
      )}
    </h1>
  );
}
